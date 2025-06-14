---
title: WebAssembly and the C standard library
description: In the interest of compiling C code to WebAssembly, here's an example of using the C standard library.
date: 2021-09-28
---
In the [last post](trivial-example.md), I compiled a trivial C function to WebAssembly. This was a good learning exercise, but I didn't use the C standard library, so compiling the code was trivial. Let's look into how to use the C standard library when compiling C to WebAssembly with Clang/LLVM. All the code is in this repository: [webassembly-libc-example](https://github.com/jaredkrinke/webassembly-libc-example).

# Is this even a good idea?
WebAssembly is simple, which is nice for getting started. It's also extremely limited (at least, in the browser). In order to compile typical C code to WebAssembly, you need a C standard library.

Obviously, the browser doesn't supply a C run time to WebAssembly modules (any language could be compiled to WebAssembly), so that means that the module itself has to include all the functionality it uses from the C library within itself (or get it from another module). In other words, it's statically linked.

How much overhead is including the C library in every module going to add? That's a good question, that I'm hoping to answer eventually.

# Which C library to use?
Here are a few promising leads on a WebAssembly-friendly C library (either already compiled to WebAssembly or simple enough that there's hope I could compile to WebAssembly myself):

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

# A slightly less trivial example
## Source code
Here's the C source for my test module that uses the WASI C library (`sine.c`):

```c
#include <math.h>

#define WASM_EXPORT_AS(name) __attribute__((export_name(name)))
#define WASM_EXPORT(symbol) WASM_EXPORT_AS(#symbol) symbol

double WASM_EXPORT(sine)(double theta) {
    return sin(theta);
}
```

All I'm doing is exposing `sin` from `math.h` as an export named `sine`.

## Compiling
The build command is a bit more complicated than [last time](trivial-example.md#compiling-the-code):

* `-nostdlib` is gone since we're using the C standard library this time
* `-nostartfiles` is present because we don't need to link in any bootstrapping entry point to call `main()` (we don't have a `main()`)
* `-target wasm32-wasi` could be updated to specify the "operating system" (used loosely here) as WASI
* `--sysroot wasi-sdk-12.0/share/wasi-sysroot` to point to the cross-compiler system root that came from the WASI SDK

Note that in this example, I extracted the WASI SDK into a subfolder of my project (the [SDK's README has an example as well](https://github.com/WebAssembly/wasi-sdk)).

Here's the build command (note: I omitted the `-target` option because I'm using the WASI SDK's Clang, which defaults to targeting `wasm32-wasi`):

```bash
wasi-sdk-12.0\bin\clang.exe -Os --sysroot wasi-sdk-12.0/share/wasi-sysroot -nostartfiles -Wl,--no-entry sine.c -o sine.wasm
```

## Calling from Node
Almost identical to last time:

```javascript
const fs = require('fs');
(async () => {
    const module = await WebAssembly.instantiate(await fs.promises.readFile("./sine.wasm"));
    const sine = module.instance.exports.sine;
    console.log(sine(1.57));
})();
```

Output: 0.9999996829318346 (looks reasonable, since 1.57 is approximately pi/2 and so sine of that angle should be roughly 1).

## Calling from a browser
Again, almost identical:

```html
<html>
    <body>
        <p>The value of sin(1.57) is <span id="result">?</span></p>

        <script>
            (async () => {
                const module = await WebAssembly.instantiateStreaming(fetch("./sine.wasm"));
                const sine = module.instance.exports.sine;
                document.getElementById("result").innerText = sine(1.57);
            })();
        </script>
    </body>
</html>
```

Result:

```
The value of sin(1.57) is 0.9999996829318346
```

Looks like the WASI libc works in the browser, at least in a case like this where no system calls are needed.

# Overhead
Earlier, I was wondering how much overhead there is in linking against a C standard library for WebAssembly. My understanding is that linking for C is done per-function, so you're only pulling in what you need. Here are some measurements I took (and yes, I linked in `malloc` but not `free`):

| Dependencies | Module size (in bytes) |
| :--- | ---: |
| (none) | 207 |
| `sin` | 7851 |
| `sin`, `cos` | 8116 |
| `malloc` | 7350 |
| `sin`, `malloc` | 14995 |

Not great, but also not terrible. My hope is that WebAssembly written in C *and using the C standard library* is uncommon, and generally only used for hosting programs with large C code bases that would be prohibitively time-consuming to rewrite.

# Conclusion
Overall, that could have gone a lot worse.

I'm still not thrilled with the overhead of statically linking *everything*, and the thought of each module essentially having its own allocator is a bit alarming, but I need to remind myself that the alternatives are often worse. For example, if rewriting a C program in JavaScript isn't in the cards, the previous best options were either transpiling the C code to something like asm.js or, even worse, emulating an x86 CPU in the browser (using JavaScript) and running existing binaries.

I will state, however, that I'm not quite as thrilled with the idea of compiling C programs to WebAssembly to support "run anywhere" scenarios as I was before I started this exercise.

# Links
* Code: [webassembly-libc-example](https://github.com/jaredkrinke/webassembly-libc-example)
* [Live demo](https://jaredkrinke.github.io/webassembly-libc-example/)