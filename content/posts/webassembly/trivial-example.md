---
draft: true
title: A trivial WebAssembly example
description: This is a complete example of building and running a trivial WebAssembly module
keywords: [webassembly,wabt,llvm]
date: 2021-09-26
---
In the last post, I provided an [overview of WebAssembly](overview.md). In this post, I'm going to build and run a complete (but trivial) WebAssembly module in C using [LLVM](https://llvm.org/) and [Clang](https://clang.llvm.org/).

# Side note
It looks like someone else was frustrated with Emscripten in the past, so they wrote a post about [WebAssembly without Emscripten](http://schellcode.github.io/webassembly-without-emscripten). Their guide was helpful, but I'm not sure if it's up to date. I also found their Makefiles to be excessively complex.

# Setup
First, download and install [LLVM 12.0.1](https://github.com/llvm/llvm-project/releases/tag/llvmorg-12.0.1) from the LLVM GitHub releases page (note: 180 MB download that expands to *1.8 GB* installed). The programs I'm actually planning to use are `clang` and `wasm-ld`.

I also wanted to inspect the output WebAssembly, so I needed the [WebAssembly Binary Toolkit](https://github.com/WebAssembly/wabt), which was a much more reasonable ~2 MB download (although they compressed the Windows version into a gzipped tarball instead of a zip file--fortunately, I already had `tar.exe` on my system). I'm going to use `wasm2wat` for disassembly.

## Some notes on C
Note that C compilation is usually done as follows:

1. Run the preprocessor (`cpp`) to expand macros and includes (often on many source files)
1. Compile the preprocessed code into (often multiple) object files
1. Link everything into a final binary

A decent overview of the most common command line arguments for a *different* compiler is [here](https://www.thegeekstuff.com/2012/10/gcc-compiler-options/). Many of the options are similar for most C compilers.

# A trivial function
I'm going to start with a very simple example (just to reduce the number of things that could go wrong).

## Source code
File name: "add.c":

```
int add(int a, int b) {
    return a + b;
}
```

## Compiling the code
First, I'm just going to compile (but not link) the code, to see what happens.

```
clang -target wasm32 -Os -c add.c
```

* `-target wasm32` tells Clang to tell LLVM to produce 32-bit WebAssembly output (note: as of today, [64-bit memory support is in progress](https://github.com/WebAssembly/proposals))
* `-Os` tells Clang to optimize for size (I did this in hopes of getting simpler, more readable code)
* `-c` tells Clang to compile, but not link
* `add.c` is the source file

Since I'm compiling and not linking, this command generates an object file named "add.o".

## Disassembling the object file
Run the disassembler:

```
wasm2wat add.o
```

And it produces the following surprisingly readable output:

```
(module
  (type (;0;) (func (param i32 i32) (result i32)))
  (import "env" "__linear_memory" (memory (;0;) 0))
  (func $add (type 0) (param i32 i32) (result i32)
    local.get 1
    local.get 0
    i32.add))
```


