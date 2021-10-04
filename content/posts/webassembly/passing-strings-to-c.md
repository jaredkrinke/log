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

## Pass in via linear memory
Here's one idea:

1. Passing a string from JavaScript to C
  1. Add a null character onto the end of the string
  1. Use the browser's TextEncoder API to convert a string to a byte sequence
  1. Write the buffer into linear memory
  1. Pass the address of the null-terminated string to C code
  1. C code can read the string as a null-terminated UTF-8 string

I gave this approach a try, but there were several problems with it.

The [LLVM WebAssembly documentation](https://lld.llvm.org/WebAssembly.html) hints at it, but inspecting the output of a trivial C program compiled to WebAssembly shows that LLVM's WebAssembly linker uses linear memory for both the stack and the heap. This makes sense, of course--memory has to come from somewhere. I couldn't find LLVM documentation to definitely confirm this, but [I've read that the WebAssembly stack grows downward and has a default size of only 64 KB](https://surma.dev/things/c-to-webassembly/) (customizable with the `-z stacksize=<value>` option). The heap follows the stack by default.

This means that you don't really have a place to stuff in your encoded string. I also didn't see a way to use a separate memory for passing in data to functions.

Another annoyance is that the LLVM linker adds a minimum size constraint to linear memory, so even if you got this working, there'd be a dependency between the minimum memory size and what your JavaScript code supplies.

Anyway, this approach ended up being ugly enough that I'm going to look for a better solution.

## Pass in via table


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
