---
draft: true
title: Passing strings to and from WebAssembly using C
description: Here's an example of passing strings to and from a WebAssembly module that is written in C and compiled with Clang and LLVM.
keywords: [webassembly,clang]
date: 2021-10-04
---
As a follow-up to a [trivial WebAssembly example in C](trivial-example.md) and [an example of using the C standard library in WebAssembly](c-standard-library-example.md), I'm now investigating passing strings back and forth between the JavaScript host and a WebAssembly module written in C (and compiled with Clang/LLVM).

# One approach for strings in WebAssembly
Recall that WebAssembly [doesn't have a string type](https://webassembly.github.io/spec/core/syntax/types.html). How can a C function receive or return a string when compiled to WebAssembly?

## Pass in by directly populating linear memory
Also known as: failed attempt #1.

Here's one idea:

1. Passing a string from JavaScript to C (attempt #1)
  1. Add a null character onto the end of the string
  1. Use the browser's TextEncoder API to convert a string to a byte sequence
  1. Write the buffer into linear memory
  1. Pass the address of the null-terminated string to C code
  1. C code can read the string as a null-terminated UTF-8 string

I gave this approach a try, but there were several problems with it.

The [LLVM WebAssembly documentation](https://lld.llvm.org/WebAssembly.html) hints at it, but inspecting the output of a trivial C program compiled to WebAssembly shows that LLVM's WebAssembly linker uses linear memory for both the stack and the heap. This makes sense, of course--memory has to come from somewhere. I couldn't find LLVM documentation to definitely confirm this, but [I've read that the WebAssembly stack grows downward and has a default size of only 64 KB](https://surma.dev/things/c-to-webassembly/) (customizable with the `-z stacksize=<value>` option). The heap follows the stack by default.

This means that you don't really have a place to stuff in your encoded string. I also didn't see a way to use a separate memory for passing in data to functions.

Another annoyance is that the LLVM linker adds a minimum size constraint to linear memory, so even if you got this working, there'd be a dependency between the minimum memory size and what your JavaScript code supplies.

The fundamental problem with this approach is that the C-based WebAssembly module needs complete control over its memory, and there doesn't appear to be a way to access a different memory from C code, as compiled with Clang and LLVM's WebAssembly linker. There are likely libraries (probably with hand-written WebAssembly) to enable this, but I'd like a simple solution.

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

### C implementation
As an example, I've created a function that counts the number of occurrences of the letter "a" in a string. Note that I have to export an allocator and a deallocator.

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
The build command is unchanged from before:

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

# TODO

1. Returning a string from C to JavaScript
  1. (Assuming a null-terminated UTF-8 string)
  1. Write the string directly into linear memory
  1. Return the address as an ("unsigned") integer ("unsigned" in quotes because WebAssembly doesn't have a separate unsigned int type)
  1. (Also make sure to export a function to free generated strings)

Obviously, this limits strings to fit in linear memory (where I assume the maximum size is 2^32-1), and requiring a null terminator means embedded nulls aren't supported. I don't think these will be a problem for me personally.

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
