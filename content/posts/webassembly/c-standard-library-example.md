---
draft: true
title: WebAssembly and C libraries
description: In the interest of compiling C code to WebAssembly, I'm investigating how C libraries work with WebAssembly.
keywords: [webassembly]
date: 2021-09-28
---
In the [last post](trivial-example.md), I compiled a trivial C function to WebAssembly. This was a good learning exercise, but I didn't use the C standard library, so compiling the code was trivial. Let's look into how to use the C standard library when compiling C to WebAssembly with Clang/LLVM.

# Is this even a good idea?
WebAssembly is simple, which is nice for getting started. It's also extremely limited (at least, in the browser). In order to compile typical C code to WebAssembly, you need a C standard library.

Obviously, the browser doesn't supply a C run time to WebAssembly modules (any language could be compiled to WebAssembly), so that means that the module itself has to include all the functionality it uses from the C library within itself (or get it from another module). In other words, it's statically linked.

How much overhead is including the C library in every module going to add? That's a good question, that I'm hoping to answer eventually.

# Which C library to use?
In hopes of avoiding writing my own C library, I looked around for existing C libraries (either already compiled to WebAssembly or simple enough that there's hope I could compile to WebAssembly myself). Here's what I found (and I'm sure there are many other options I haven't run across yet):

* [Emscripten](https://github.com/emscripten-core/emscripten): Modified version of [musl libc](https://musl.libc.org/) that can run in a browser
* [WASI libc](https://github.com/WebAssembly/wasi-libc): Also built on musl (I think), but designed to run on top of [WASI](https://wasi.dev/)--I didn't think this would run in the browser, but [this blog post indicates otherwise](https://depth-first.com/articles/2019/10/16/compiling-c-to-webassembly-and-running-it-without-emscripten/)
* [Embedded Artistry libc](https://github.com/embeddedartistry/libc): Designed for embedded applications; I'm hoping this would be easy to bring up on a new platform like WebAssembly
* **Build your own!** If you only need a handful of functions, maybe you can implement them yourself (here's [one great example with a trivial allocator](https://dassur.ma/things/c-to-webassembly/))

I'm going to continue avoiding Emscripten because a) it wants me to install Python first and b) I'd like to keep things as simple as possible. I didn't think WASI's C library would work for me in the browser, but I'm going to try it anyway.

# Setup for WASI libc
In order to compile against a C library, you need header files and compiled objects (in an archive) or a shared library (a concept that I don't think exists for WebAssembly since they use modules for that purpose). Note that we're basically cross-compiling for a different architecture.

Fortunately, [WASI provides an SDK for exactly this purpose](https://github.com/WebAssembly/wasi-sdk). I downloaded the latest release (~140 MB) and took a peek at the contents:

* `bin/`: Oh, look, Clang and LLVM -- I guess I should have just started here!
* `lib/clang/11.0.0/lib/wasi/libclang_rt.builtins-wasm32.a`: This archive contains WebAssembly implementations of so-called "builtins" that [Clang implicitly requires](https://releases.llvm.org/11.0.0/tools/clang/docs/Toolchain.html)
* `share/wasi-sysroot`: System root for the cross compiler, containing all the headers and libraries (all raw objects or archives)

Note that the version of LLVM that I installed in my last post didn't come from the WASI SDK and it didn't contain the "builtins" archive noted above. In order to use that installation of Clang/LLVM, I needed to copy `libclang_rt.builtins-wasm32.a` into my installation (fortunately the eventual error message you see provides the exact destination path).