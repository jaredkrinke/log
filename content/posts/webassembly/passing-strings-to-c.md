---
draft: true
title: Passing strings to and from WebAssembly using C
description: Here's an example of passing strings to and from a WebAssembly module that is written in C and compiled with Clang and LLVM.
keywords: [webassembly,clang]
date: 2021-10-04
---
As a follow-up to a [trivial WebAssembly example in C](trivial-example.md) and [an example of using the C standard library in WebAssembly](c-standard-library-example.md), I'm now investigating passing strings back and forth between the JavaScript host and a WebAssembly module written in C (and compiled with Clang/LLVM).

# Passing a string from JavaScript to C
Recall that WebAssembly [doesn't have a string type](https://webassembly.github.io/spec/core/syntax/types.html). How can a C function receive a string when compiled to WebAssembly?

## Pass in by directly populating linear memory
Also known as: failed attempt #1.

Here's one idea:

1. Passing a string from JavaScript to C (attempt #1)
  1. Add a null character onto the end of the string
  1. Use the browser's TextEncoder API to convert a string to a byte sequence
  1. Write the buffer into linear memory
  1. Pass the address of the null-terminated string to C code
  1. C code can read the string as a null-terminated UTF-8 string

Obviously, this limits strings to fit in linear memory (where I assume the maximum size is 2^32-1), and requiring a null terminator means embedded nulls aren't supported. I don't think these will be a problem for me personally.

I gave this approach a try, but there were several problems with it.

The [LLVM WebAssembly documentation](https://lld.llvm.org/WebAssembly.html) hints at it, but inspecting the output of a trivial C program compiled to WebAssembly shows that LLVM's WebAssembly linker uses linear memory for both the stack and the heap. This makes sense, of course--memory has to come from somewhere. I couldn't find LLVM documentation to definitely confirm this, but [I've read that the WebAssembly stack grows downward and has a default size of only 64 KB](https://surma.dev/things/c-to-webassembly/) (customizable with the `-z stacksize=<value>` option). The heap follows the stack by default.

This means that you don't really have a place to stuff in your encoded string. I also didn't see a way to use a separate memory for passing in data to functions.

Another annoyance is that the LLVM linker adds a minimum size constraint to linear memory, so even if you got this working, there'd be a dependency between the minimum memory size and what your JavaScript code supplies.

The fundamental problem with this approach is that the C-based WebAssembly module needs complete control over its memory, and there doesn't appear to be a way to access a different memory from C code, as compiled with Clang and LLVM's WebAssembly linker. There are likely libraries (probably with hand-written WebAssembly) to enable this, but I'd like a simple solution.

## Pass on the stack
Probably not a good idea because you're limited based on the maximum stack size (mentioned above), but theoretically you could pass in a string on the stack by having your JavaScript code implement whatever calling convention is used by Clang/LLVM for WebAssembly (modifying the stack pointer as a [mutable global](https://github.com/WebAssembly/mutable-global)). This seems tedious and not worth the effort unless you have strings that you know will be much smaller than the maximum stack size (or you tell LLVM's WebAssembly linker to grow the stack upwards (although then you're limiting your heap size, which is probably even more unexpected to most non-embedded C code that's laying around).

I won't dwell on this idea any more since I want to use the default memory layout.

## Pass in via the heap
Here's a new idea: let the C code control its entire address space, but expose functions to let JavaScript allocate some memory.

1. Passing a string from JavaScript to C (attempt #2)
  1. Expose `allocate` and `deallocate` functions to let JavaScript allocate and free chunks of the heap
  1. Add a null character onto the end of the string
  1. Use the browser's TextEncoder API to convert a string to a byte sequence
  1. Allocate a buffer (in C address space) for the string (using the exported function `allocate`)
  1. Write the encoded string into the heap allocation
  1. Call C code to read the string as a null-terminated UTF-8 string
  1. Deallocate/free the string (using the exported function `deallocate`)
  1. C code can read the string as a null-terminated UTF-8 string

This approach adds overhead in the form of allocating for every string passed in, but if the ratio of calls to time spent in each call is low enough, this could be tolerable (and you could always optimize the approach to reuse allocations when possible, if needed). Overall, this seems straight forward and robust, so I'm going to try this out.

### C implementation
As an example, I've created a function that counts the number of occurrences of the (lower case) letter "a" in a string. Note that I have to export an allocator and a deallocator.

```c
#include <malloc.h>

#define WASM_EXPORT_AS(name) __attribute__((export_name(name)))
#define WASM_EXPORT(symbol) WASM_EXPORT_AS(#symbol) symbol

unsigned char* WASM_EXPORT(allocate)(unsigned int size) {
    return (unsigned char*)malloc(size);
}

void WASM_EXPORT(deallocate)(unsigned char* allocation) {
    free(allocation);
}

unsigned int WASM_EXPORT(countAs)(const char* string) {
    unsigned int numberOfAs = 0;
    while (*string != '\0') {
        if (*string == 'a') {
            ++numberOfAs;
        }
        string++;
    }
    return numberOfAs;
}
```

### Compiling
The build command is unchanged [from the last post](c-standard-library-example#compiling):

```sh
wasi-sdk/bin/clang -Os --sysroot wasi-sdk/share/wasi-sysroot -nostartfiles -Wl,--no-entry string-example.c -o string-example.wasm
```

### JavaScript caller
The JavaScript wrapper is more involved than I'd like, but it does work:

```javascript
const fs = require("fs");

(async () => {
    const module = await WebAssembly.instantiate(await fs.promises.readFile("./string-example.wasm"));

    // String used for testing (from command line or hard-coded)
    const testString = process.argv[2] ?? "How many letter a's are there in this string? Three!";

    // Encode the string (with null terminator) to get the required size
    const nullTerminatedString = testString + "\0";
    const textEncoder = new TextEncoder();
    const encodedString = textEncoder.encode(nullTerminatedString);

    // Allocate space in linear memory for the encoded string
    const address = module.instance.exports.allocate(encodedString.length);
    try {
        // Copy the string into the buffer
        const destination = new Uint8Array(module.instance.exports.memory.buffer, address);
        textEncoder.encodeInto(nullTerminatedString, destination);

        // Call the function
        const result = module.instance.exports.countAs(address);
        console.log(result);
    } finally {
        // Always free the allocation when done
        module.instance.exports.deallocate(address);
    }
})();
```

### Result
Behold the result:

```sh
$ node main.js "a string that has lots of the letter 'a' in it" 
4
```

Looks good!

### Improvements
Having to manually manage memory in JavaScript is error-prone, so I'm going to borrow the idea of a [`using` statement from C#](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/using-statement):

```javascript
// Pass in a factory for an object with a "dispose" property and this will
// ensure "dispose" is called on the object after the provided lambda returns
// or throws
const use = (create, run) => {
    const o = create();
    try {
        run(o);
    } finally {
        o.dispose();
    }
};
```

Adding back in the allocation/deallocation and encoding/copying:

```javascript
const useInstanceAllocation = (module, size, run) => {
    use(() => {
        const address = module.instance.exports.allocate(size);
        return {
            address,
            dispose: () => module.instance.exports.deallocate(address),
        };
    }, run);
};

const withStringInInstanceMemory = (module, str, run) => {
    // Encode the string (with null terminator) to get the required size
    const nullTerminatedString = str + "\0";
    const textEncoder = new TextEncoder();
    const encodedString = textEncoder.encode(nullTerminatedString);

    // Allocate space in linear memory for the encoded string
    useInstanceAllocation(module, encodedString.length, (address) => {
        // Copy the string into the buffer
        const destination = new Uint8Array(module.instance.exports.memory.buffer, address);
        textEncoder.encodeInto(nullTerminatedString, destination);

        run(address);
    });
};
```

Note: it would probably be helpful to extend these helpers to support multiple strings/allocations.

Now, the final string passing code is simple:

```javascript
(async () => {
    const module = await WebAssembly.instantiate(await fs.promises.readFile("./string-example.wasm"));

    // String used for testing (from command line or hard-coded)
    const testString = process.argv[2] ?? "How many letter a's are there in this string? Three!";
    withStringInInstanceMemory(module, testString, (stringAddress) => {
        const result = module.instance.exports.countAs(stringAddress);
        console.log(result);
    });
})();
```

# Returning a string from C to JavaScript
Here was my initial thinking (recorded before I completed the example above):

1. Returning a string from C to JavaScript
  1. (Assuming a null-terminated UTF-8 string)
  1. Write the string directly into linear memory
  1. Return the address as an ("unsigned") integer ("unsigned" in quotes because WebAssembly doesn't have a separate unsigned int type)
  1. (Also make sure to export a function to free generated strings)

Given that I'm already exposing allocations to JavaScript, I thought this would work, but there's one problem: `TextDecoder.decode()` doesn't have built-in support for null-terminated string (nor should it, in my opinion). This means we need to return both the string address *and* the string's length (or, worse: export another function to measure the returned string).

## C implementation
If you're familiar with C and building on many platforms, brace yourself. Given that WebAssembly is a known, uniform target, I'm going to simply return a variable size struct. I'm not worrying about [endianness](https://en.wikipedia.org/wiki/Endianness) because [WebAssembly is always little endian](https://github.com/WebAssembly/design/blob/main/Portability.md#assumptions-for-efficient-execution).

Here's the struct and some simple code that creates a string of the letter "b" of a caller-provided length:

```c
#include <malloc.h>

#define WASM_EXPORT_AS(name) __attribute__((export_name(name)))
#define WASM_EXPORT(symbol) WASM_EXPORT_AS(#symbol) symbol

typedef struct {
    unsigned int length;
    char buffer[];
} wasm_string;

wasm_string* WASM_EXPORT(write_bs)(unsigned int count) {
    // Allocate space for the string length and content (note: no null terminator)
    wasm_string* str = (wasm_string*)malloc(sizeof(unsigned int) + count);
    str->length = count;

    // Fill in the string
    char* c = &str->buffer[0];
    for (unsigned int i = 0; i < count; i++) {
        *c = 'b';
        ++c;
    }
    return str;
}
```

## JavaScript implementation
Here's the corresponding JavaScript on the other side:

```javascript
import fs from "fs";

(async () => {
    const module = await WebAssembly.instantiate(await fs.promises.readFile("./string-example.wasm"));

    // String used for testing (from command line or hard-coded)
    const count = parseInt(process.argv[2] ?? "3");
    const textDecoder = new TextDecoder();

    // Call the function and get back a buffer: [size (32-bit unsigned int), byte1, byte2, ...]
    const address = module.instance.exports.write_bs(count);
    try {
        const buffer = module.instance.exports.memory.buffer;
        const encodedStringLength = (new Uint32Array(buffer, address, 1))[0];
        const encodedStringBuffer = new Uint8Array(buffer, address + 4, encodedStringLength); // Skip the 4 byte size
        const str = textDecoder.decode(encodedStringBuffer);
        console.log(str);
    } finally {
        module.instance.exports.deallocate(address);
    }
})();
```

Output:

```sh
$ node return-string.js 5
bbbbb
```

Looks good!

## Memory management helpers
Similar to above, I'm going to use helpers to simplify memory management and the caller code on the JavaScript side:

```javascript
```

Note that I'm assuming these strings will be dynamically allocated, because constant strings should really just be provided directly using JavaScript. If the string *must* come from C code, all you'd need to do is skip the allocation management steps (and hope that the JavaScript code doesn't decide to mutate the string!).

## Returning a string via the heap
Here's the C code I came up with:

```c
```

## Other approaches
Note that there are probably other ways to accomplish this--perhaps passing a string in by reference using a table, or using a binding generator to do the work for you. I'm going to test the approach above just because I'm fairly certain it should work with minimal effort.

# Passing a string to C
As an example, I'm going to write a C function that counts occurrences of the letter "a" in a string that's passed in:

```c

```

# Returning a string
Let's try returning a string from a C WebAssembly module function to the JavaScript host. Here's my first attempt:

```c
TODO
```
