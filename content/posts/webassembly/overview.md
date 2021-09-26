---
title: WebAssembly overview
description: WebAssembly makes web browsers a compilation target for languages like C. Here's a brief overview of WebAssembly.
keywords: [webassembly,emscripten,wabt]
date: 2021-09-25
---
# Background
# Emscripten
I first heard of [Emscripten](https://emscripten.org/) in the mid-2010s. At the time, you could compile C code to an optimizability-focused subset of JavaScript known as [asm.js](http://asmjs.org/). This meant that, given the source code to a native app and appropriate implementations of system APIs, you could run *formerly* native-only programs in the browser--convenient, if you don't want to install anything.

## Enter WebAssembly
In the intervening years, [WebAssembly](https://webassembly.org/) appeared. WebAssembly is a binary format for programs that run on a portable virtual machine. This VM can be hosted in your browser, but non-browser runtimes have also sprung up (e.g. [wasmtime](https://wasmtime.dev/)).

WebAssembly, to me, seems like the [Holy Grail](https://en.wikipedia.org/wiki/Holy_Grail) of compilation targets. I wouldn't be surprised if, thanks to browser support, WebAssembly is *the* most broadly supported binary program format. What other binary format works on my desktop, phone, [Raspberry Pi](https://www.raspberrypi.org/)?

Note that WebAssembly runtimes seem to be standardizing on an in-development system interface named [WASI](https://wasi.dev/). You probably can't write a GUI app solely with WebAssembly and WASI today, but I'm sure that day is coming (in the distant future).

## One note on Emscripten
If you just want to port native programs to the browser, Emscripten is an environment for doing that. It even converts [OpenGL](https://en.wikipedia.org/wiki/OpenGL) to [WebGL](https://www.khronos.org/webgl/) and handles the [SDL](https://www.libsdl.org/) API. Unfortunately, just *installing* Emscripten requires Python. For now, I refuse to setup bloated software just to *install* the software I actually want, so I'm skipping Emscripten.

# WebAssembly concepts
Mozilla's documentation has a [great overview of WebAssembly concepts](https://developer.mozilla.org/en-US/docs/WebAssembly/Concepts). There's also an [approachable series of WebAssembly articles](https://hacks.mozilla.org/2017/07/creating-a-webassembly-module-instance-with-javascript/) on Mozilla Hacks. I'll try to summarize:

* **Module**: a compiled WebAssembly binary (declaring imports and exports)
* **Instance**: a module along with its state (memory, table, imports)
* **Memory**: a read/write, resizable buffer provided to the instance
* **Table**: array of references that aren't directly stored in WebAssembly-accessible memory (for security reasons)
  * The example I've seen for this is to be able to pass function pointers into C/C++ code

# WebAssembly formats

WebAssembly defines two formats:

* **.wasm**: Binary format
* **.wat**: Text format (assembly)

The [WebAssembly Binary Toolkit](https://github.com/WebAssembly/wabt) contains tools for converting between these formats. Specifically, `wat2wasm` is analogous to a very simple assembler, and `wasm2wat` to a disassembler.

# WebAssembly browser interface
Within the browser, WebAssembly [currently needs to be loaded using JavaScript](https://developer.mozilla.org/en-US/docs/WebAssembly/Loading_and_running) (it sounds like there are plans to support loading using script tags and import statements in the future). Sadly, as of today, the recommended way to load WebAssembly ([WebAssembly.instantiateStreaming()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiateStreaming)) is [only supported by 75% of browsers](https://caniuse.com/?search=instantiateStreaming). The more broadly supported [WebAssembly.instantiate()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiate) seems cumbersome. I'm hopeful that WebAssembly's ergonomics will improve, but I suppose this is just the price you pay when using new technology.

# Next steps
Armed with the above information, I think I'm ready to dive in and test out WebAssembly with a trivial example. I'll report my findings in a subsequent update.
