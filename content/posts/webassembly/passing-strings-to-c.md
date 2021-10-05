---
title: Passing strings to and from WebAssembly using C
description: Here's an example of passing strings to and from a WebAssembly module that is written in C and compiled with Clang and LLVM.
keywords: [webassembly,clang]
date: 2021-10-05
---
As a follow-up to a [trivial WebAssembly example in C](trivial-example.md) and [an example of using the C standard library in WebAssembly](c-standard-library-example.md), I'm now investigating passing strings back and forth between the JavaScript host and a WebAssembly module written in C (and compiled with Clang/LLVM).

Links to the code and a live demo are at [the end of the post](#links).

# Passing a string from JavaScript to C
Recall that WebAssembly [doesn't have a string type](https://webassembly.github.io/spec/core/syntax/types.html). How can a C function receive a string when compiled to WebAssembly?

## Pass in by directly populating linear memory
Also known as: failed attempt #1.

1. Add a null character onto the end of the string
1. Use the browser's TextEncoder API to convert a string to a byte sequence
1. Write the buffer into linear memory
1. Pass the address of the null-terminated string to C code
1. C code can read the string as a null-terminated UTF-8 string

Obviously, this limits strings to fit in linear memory (where I assume the maximum size is 2^32-1), and requiring a null terminator means embedded nulls aren't supported. I don't think these will be a problem for me personally.

I gave this approach a try, but there were several problems with it.

The [LLVM WebAssembly documentation](https://lld.llvm.org/WebAssembly.html) hints at it, but inspecting the output of a trivial C program compiled to WebAssembly shows that LLVM's WebAssembly linker uses linear memory for both the stack and the heap. This makes sense, of course--memory has to come from somewhere. I couldn't find LLVM documentation to definitively confirm this, but [I've read that the WebAssembly stack grows downward and has a default size of only 64 KB](https://surma.dev/things/c-to-webassembly/) (customizable with the `-z stacksize=<value>` option). The heap follows the stack by default.

This means that you don't really have a place to stuff in your encoded string. I also didn't see a way to use a separate memory for passing in data to C functions.

The fundamental problem with this approach is that the C-based WebAssembly module needs complete control over its memory, and there doesn't appear to be a way to access a different memory from C code, as compiled with Clang and LLVM's WebAssembly linker. There are likely libraries (probably with hand-written WebAssembly) to enable this, but I'd like a simple solution.

## Pass on the stack
Also known as: very limited approach #2.

Probably not a good idea because you're limited based on the maximum stack size (mentioned above), but theoretically you could pass in a string on the stack by having your JavaScript code implement whatever calling convention is used by Clang/LLVM for WebAssembly (modifying the stack pointer as a [mutable global](https://github.com/WebAssembly/mutable-global)). This seems tedious and not worth the effort unless you have strings that you know will be much smaller than the maximum stack size (or you tell LLVM's WebAssembly linker to grow the stack upwards (although then you're limiting your heap size, which is probably even more unexpected to most non-embedded C code that's laying around).

I won't dwell on this idea any more since I want to use the default memory layout.

## Pass in via the heap
Also known as: successful attempt #3.

Here's a new idea: let the C code control its entire address space, but expose functions to let JavaScript allocate some memory.

1. Expose `allocate` and `deallocate` functions to let JavaScript allocate and free memory in the heap
1. Add a null character onto the end of the string
1. Use the browser's TextEncoder API to convert a string to a byte sequence
1. Allocate a buffer (in C address space) for the string (using the exported function `allocate`)
1. Write the encoded string into the heap allocation
1. Call C code to read the string as a null-terminated UTF-8 string
1. Deallocate/free the string (using the exported function `deallocate`)

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
The build command is unchanged [from the last post](c-standard-library-example.md#compiling):

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
        // Always free the allocation when done (or on error)
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

### Improving memory management
Having to manually manage memory in JavaScript is error-prone, so I'm going to borrow the idea of a [`using` statement from C#](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/using-statement):

```javascript
const textEncoder = new TextEncoder();

// Pass in a factory for an object with a "dispose" property and this will
// ensure "dispose" is called on the object after the provided lambda returns
// or throws
export const use = (create, run) => {
    const o = create();
    try {
        run(o);
    } finally {
        o.dispose();
    }
};

// Manage the lifetime of an allocation
export const useInstanceAllocation = (module, create, run) => {
    use(() => {
        // Create the disposable object first
        const objectWithDispose = {
            address: 0,
            dispose: function() { module.instance.exports.deallocate(this.address); },
        };

        // Then allocate
        objectWithDispose.address = create();
        return objectWithDispose;
    }, run);
};

// Manage the lifetime of a *new* allocation (with the given size)
export const useNewInstanceAllocation = (module, size, run) => {
    return useInstanceAllocation(module, () => module.instance.exports.allocate(size), run);
};

// Encode a *new* string and manage its lifetime
export const useNewInstanceString = (module, str, run) => {
    // Encode the string (with null terminator) to get the required size
    const nullTerminatedString = str + "\0";
    const encodedString = textEncoder.encode(nullTerminatedString);

    // Allocate space in linear memory for the encoded string
    useNewInstanceAllocation(module, encodedString.length, (address) => {
        // Copy the string into the buffer
        const destination = new Uint8Array(module.instance.exports.memory.buffer, address);
        textEncoder.encodeInto(nullTerminatedString, destination);

        run(address);
    });
};
```

Note: it would probably be helpful to extend these helpers to support multiple strings/allocations, but I'm not trying to completely reinvent wrapping/binding libraries like Emscripten right now.

Now, the final string passing code is simple:

```javascript
(async () => {
    const module = await WebAssembly.instantiate(await fs.promises.readFile("./string-example.wasm"));

    // String used for testing (from command line or hard-coded)
    const testString = process.argv[2] ?? "How many letter a's are there in this string? Three!";
    useNewInstanceString(module, testString, (stringAddress) => {
        const result = module.instance.exports.count_as(stringAddress);
        console.log(result);
    });
})();
```

# Returning a string from C to JavaScript
Here was my initial thinking for returning a dynamic string from C to JavaScript (recorded before I completed the example above):

1. (Assuming a null-terminated UTF-8 string)
1. Write the string directly into linear memory
1. Return the address as an ("unsigned") integer ("unsigned" in quotes because WebAssembly doesn't have a separate unsigned int type)
1. JavaScript can decode the string using `TextDecoder.decode()`
1. (Also make sure to export a function to free generated strings)

Given that I'm already exposing allocations to JavaScript, I thought this would work, but there's one problem: `TextDecoder.decode()` doesn't have built-in support for null-terminated strings (nor should it, in my opinion). This means we need to return both the string address *and* the string's length (or, worse: export another function to measure the returned string).

Note that I'm assuming returned strings will be dynamically allocated, because constant strings should really just be provided directly using JavaScript. If the string *must* come from C code, all you'd need to do is skip the allocation management steps (and hope that the JavaScript code doesn't decide to mutate the string!).

## C implementation
If you're familiar with C and building on many platforms, brace yourself.

Given that WebAssembly is a known, uniform target, I'm going to simply return a variable size struct. I'm not worrying about [endianness](https://en.wikipedia.org/wiki/Endianness) in the C code because [WebAssembly is always little endian](https://github.com/WebAssembly/design/blob/main/Portability.md#assumptions-for-efficient-execution). Please never do this outside of a WebAssembly context like this.

Here's the struct and some simple code that creates a string with the letter "b" repeated a caller-supplied number of times:

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

Just what C needs! Another string type.

## JavaScript implementation
Here's the corresponding JavaScript on the other side:

```javascript
import fs from "fs";

(async () => {
    const module = await WebAssembly.instantiate(await fs.promises.readFile("./string-example.wasm"));

    // String used for testing (from command line or hard-coded)
    const count = parseInt(process.argv[2] ?? "3");
    const textDecoder = new TextDecoder();

    // Call the "create" function and get back the address of a struct: [size (32-bit unsigned int), byte1, byte2, ...]
    const address = module.instance.exports.write_bs(count);
    try {
        const buffer = module.instance.exports.memory.buffer;
        const encodedStringLength = (new DataView(buffer, address, 4)).getUint32(0, true); // WebAssembly is little endian
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
Similar to above, I'm going to build on the memory management helpers written previously:

```javascript
// Decode a string and manage its lifetime
export const useInstanceString = (module, create, run) => {
    // Call the "create" function and get the struct's address: [size (32-bit unsigned int), byte1, byte2, ...]
    useInstanceAllocation(module, create, ({ address }) => {
        const buffer = module.instance.exports.memory.buffer;
        const encodedStringLength = (new DataView(buffer, address, 4)).getUint32(0, true); // WebAssembly is little endian
        const encodedStringBuffer = new Uint8Array(buffer, address + 4, encodedStringLength); // Skip the 4 byte size
        const str = textDecoder.decode(encodedStringBuffer);
        run(str);
    })
};
```

This simplifies the calling code significantly:

```javascript
(async () => {
    const module = await WebAssembly.instantiate(await fs.promises.readFile("./string-example.wasm"));

    // String used for testing (from command line or hard-coded)
    const count = parseInt(process.argv[2] ?? "3");
    useInstanceString(module, () => module.instance.exports.write_bs(count), str => {
        console.log(str);
    })
})();
```

# Strings: ✔
Perhaps that wasn't the most enjoyable experiment, but it does give one a new appreciation for binding generators that do all this work for you.

Armed with a way to pass strings between JavaScript and C, I'm now ready to leverage old C code (that I don't want to rewrite) by recompiling for WebAssembly and adding appropriate JavaScript glue. Theoretically the final WebAssembly module artifact will be useful for a long time ("compile once, run forever"?). I have one project in mind, but I'm not going to discuss it or commit to anything just yet.

Have fun manually managing memory with JavaScript!

# Links:

* [Repository with all the example code](https://github.com/jaredkrinke/webassembly-c-string-example)
* [Live demo](https://jaredkrinke.github.io/webassembly-c-string-example/)
