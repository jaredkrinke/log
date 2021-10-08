---
draft: true
title: The Miraculous Allocator
description: This is my attempt at debugging a miraculous allocator.
keywords: [webassembly,malloc]
date: 2021-10-07
---
While implementing tests for a small library that supports passing strings between a WebAssembly module written in C and a JavaScript host, I encountered some curious behavior. Let's see if I can figure out what's happening...

# "m" for "memory"?
In this case, I'm starting to wonder if the "m" [WASI C SDK](https://github.com/WebAssembly/wasi-sdk)'s [musl libc](https://musl.libc.org/) implementation of `malloc()` stands for "miraculous".

# The setup
The code I'm testing is simple -- it's basically a JavaScript implementation of `strdup` on top of `malloc` using a Web Assembly module instance's memory buffer. Pseudo code:

1. Encode a null-terminated JavaScript string into UTF-8, and note the size
1. Allocate a block of memory within a WebAssembly module instance's memory of the same size (by indirectly calling `malloc` from JavaScript)
1. Copy the encoded string data into the heap allocation
1. Access that string from a C function
1. Free the heap allocation once it's no longer needed (calling `free` from JavaScript)

To ensure that I'm correctly freeing the allocation, I came up with the following naive test:

1. Note the original size of a Web Assembly module instance's memory
1. Create a string that is 128K ASCII characters long (with a null terminator, this should require three 64KB pages)
1. Copy that into my module instance's memory (following the process above)
1. Note the new size of the module instance's memory (I'm expecting it to grow by 2 pages -- but this isn't something I actually check in the test)
1. Free the allocation
1. Repeat a bunch of times (and hope that the allocator reuses the freed blocks)
1. Finally, check the memory size one last time -- I'm expecting it to not have increased anymore, since the same memory region could easily be reused (for each new string of identical size)

Obviously, depending on the implementation of the allocator, there might be a reason for it to allocate additional pages for subsequent allocations, but my hope is that it will eventually reuse heap blocks that have been freed, rather than growing endlessly growing (like a [bump allocator](http://dmitrysoshnikov.com/compilers/writing-a-memory-allocator/)).

# The surprise
The test I wrote passed on the first try! Great, right?

But the logging output was suspicious--it claimed that zero additional pages were allocated during the entire test. In fact, it said that the memory size had been 128 KB the whole time. This should be impossible because I'm asking it to allocate space for a string that is 1 byte larger than 128 KB.

# The investigation
## Incorrect reporting?
My test was inspecting the module's `instance.exports.memory.buffer.byteLength` property, which ([according to MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)) is "The read-only size, in bytes, of the ArrayBuffer. This is established when the array is constructed and cannot be changed." The "cannot be changed" part was a bit confusing since the underlying Memory object has a `grow()` method, but my assumption was that the buffer was just replaced with a new one under the hood.

No matter, I can just call `grow(0)` to get the previous memory size, in 64 KB pages. Interesting. That also shows there's only 2 pages the whole time. Maybe the JavaScript host has a bug or otherwise can't see the changing memory size?

Let's export a C function that uses Clang's `__builtin_wasm_memory_size(0)` to report the number of memory pages, as seen by the C code (in the same environment, using the same WebAssembly instruction, where the allocator is implemented). Same result!

Ok, let's make sure that builtin actually does what I expect. Here's the corresponding WebAssembly text (from `wasm2wat`):

```wasm
  (func $get_memory_size (type 2) (result i32)
    memory.size)
```

Well, I can't argue with that. That is literally the [WebAssembly instruction for getting the current size of a memory](https://webassembly.github.io/spec/core/syntax/instructions.html#syntax-instr-memory).

Either the memory isn't actually growing, it's growing and shrinking, or `memory.size` just doesn't work.