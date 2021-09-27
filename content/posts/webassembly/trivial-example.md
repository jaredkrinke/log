---
title: A trivial WebAssembly example
description: This is a complete example of building and running a trivial WebAssembly module
keywords: [webassembly,wabt,llvm]
date: 2021-09-27
---
In the last post, I provided an [overview of WebAssembly](overview.md). In this post, I'm going to build and run a complete (but trivial) WebAssembly module in C using [LLVM](https://llvm.org/) and [Clang](https://clang.llvm.org/).

All of the code is here: [webassembly-trivial-example](https://github.com/jaredkrinke/webassembly-trivial-example).

# Aside
It looks like someone else was frustrated with Emscripten in the past, so they wrote a post about [WebAssembly without Emscripten](http://schellcode.github.io/webassembly-without-emscripten). Their guide was helpful, but I'm not sure if it's up to date. I also found their Makefiles to be excessively complex.

# Setup
First, download and install LLVM (I used [LLVM 12.0.1](https://github.com/llvm/llvm-project/releases/tag/llvmorg-12.0.1)) from the LLVM GitHub releases page (note: 180 MB download that expands to *1.8 GB* installed). The programs I'm actually planning to use are `clang` and `wasm-ld`.

I also wanted to inspect the output WebAssembly, so I needed the [WebAssembly Binary Toolkit](https://github.com/WebAssembly/wabt), which was a much more reasonable ~2 MB download (note: the Windows version is a gzipped tarball instead of a zip file). I'm going to use `wasm2wat` for disassembly.

## Some notes on C
C compilation is usually done as follows:

1. Run the preprocessor (`cpp`) to expand macros and includes (often on many source files)
1. Compile the preprocessed code into object files
1. Link everything into a final binary

A decent overview of the most common command line arguments for a *different* compiler is [here](https://www.thegeekstuff.com/2012/10/gcc-compiler-options/). Many of the options are identical for most C compilers.

# Implementing a trivial function
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

MDN has a great [explanation of the Web Assembly text format](https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format) (".wat" files). The syntax is based on [S-expressions](https://en.wikipedia.org/wiki/S-expression) (similar to [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language))). Note that inline comments are delimited by semicolons (e.g. `; comment goes here ;`), as noted in [this more detailed look at Web Assembly text format syntax.](https://github.com/WebAssembly/spec/blob/master/interpreter/README.md#s-expression-syntax).

Breaking down the first two lines:

* `module` is the root and encloses the entire module
* `type` denotes a type that can be later referenced
  * `(;0;)` is an empty list (`;0;` is just a comment) for the name of the type
  * `func` denotes a function type
    * `param` denotes a list of function arguments
    * `i32` is a [two's complement](https://en.wikipedia.org/wiki/Two%27s_complement) 32-bit integer
      * Note: there is no corresponding "unsigned" type--instructions themselves indicate the expected sign of operands, as needed (e.g. for division)
    *  `result` is a list of result values ([support for multiple result values](https://github.com/WebAssembly/multi-value) was added in April of 2020)

So far, we have a module and an unnamed type (which can be referenced by index 0) for a function taking two 32-bit integers and returning one 32-bit integer. Moving on:

* `import` is used to indicate data that is passed into the module from the host
  * `"env" "__linear_memory"` indicates the import is from the "env" module and the item being imported is "__linear_memory" (these are arbitrary strings that must match the instantiation code in the host)
  * `(memory (;0;) 0)` specifies an unnamed memory, which must have an initial size of at least zero 64 KB pages
    * I believe this could have been omitted from the output in this trivial example

The host code would need to pass in a (zero-sized) memory buffer named `env.__linear_memory`. On to the actual code:

* `func` defines a function
  * `$add` is the name of the function (names are prefixed with `$`)
  * `(type 0)` refers to the type zero, defined previously: (i32, i32) => (i32)
  * The function type/signature/prototype is then specified -- I'm not sure why the type needs to be duplicated here
  * The function body follows as a series of instructions (here's the [full list of WebAssembly instructions](https://webassembly.github.io/spec/core/syntax/instructions.html))

Looking at the function body, note that local values are referenced by a zero-based index that starts with the function arguments and then continues on to any local variables:

* `local.get 1` gets the second argument and pushes it onto the stack
* `local.get 0` gets the first argument and pushes it onto the stack
* `i32.add` pops the two arguments off and pushes their sum onto the stack
  * The return value is just the last argument left on the stack, so no additional instructions are required

It looks like the C code compiled correctly and the output WAT seems reasonable. So far, so good.

## Linking
Note that my original Clang command specified `-c`, so it only compiled the code and never ran the linker. Let's go all the way this time:

```
clang -target wasm32 -Os -nostdlib -Wl,--no-entry add.c -o add.wasm
```

I removed `-c` and added some new arguments:

* `-nostdlib` indicates that the C standard library should not be used (it's not needed in this case, and I don't have it available anyway)
* `-Wl,--no-entry` tells the linker that there is no entry point (i.e. no `main()` or `_start()` function)
* `-o add.wasm` tells the linker to write the output to "add.wasm" (instead of the default "a.out" file)

Disassembling "add.wasm" yields the following:

```
(module
  (memory (;0;) 2)
  (global $__stack_pointer (mut i32) (i32.const 66560))
  (export "memory" (memory 0)))
```

My code disappeared! Of course, this isn't surprising because my code has no entry point and doesn't export anything.

### Memory and a stack
Interestingly, this most recent disassembly shows some other changes:

* A block of linear memory that starts at 2 pages long is declared
* There is a stack pointer that is initialized to 1 KB into the second page of memory
* This memory is exported from the module
* The seemingly unnecessary memory *import* (`env.__linear_memory`) is no longer present

I have some questions about this arrangement:

* Why is the memory exported? Can the host code read or even modify the stack? (Spoiler: yes)
* Does this stack solely exist to support C semantics (e.g. taking the address of a variable on the stack)? (Probably)
  * Note that [this WebAssembly note](https://github.com/WebAssembly/design/blob/main/Nondeterminism.md) indicates the VM's stack can't be accessed by a program ("Note that this stack isn't located in the program-accessible linear memory")

### Aside: a WebAssembly critique
As an aside: while trying to find answers to some of my questions, I ran across an [incredibly insightful series of posts](http://troubles.md/wasm-is-not-a-stack-machine/) that retrospectively critiques some of WebAssembly's design decisions.

### Exports
Back to my trivial experiment.

How do I tell Clang/LLVM that I want to export a function? Consulting the [linker documentation](https://lld.llvm.org/WebAssembly.html), it looks like I can export everything (not my preferred approach) or specify exports either on the command line or with attributes in the code. In code, the two options appear to be:

* Mark exports with `__attribute__((export_name("nameOfExport")))`
* Specify `-Wl,--export-dynamic` on the Clang command line and mark exports with `__attribute__ ((visibility ("default")))`

I kind of wish there was an "always export this symbol by name" option that didn't require duplicating the name. C preprocessor to the rescue!

```
#define WASM_EXPORT_AS(name) __attribute__((export_name(name)))
#define WASM_EXPORT(symbol) WASM_EXPORT_AS(#symbol) symbol

int WASM_EXPORT(add)(int a, int b) {
    return a + b;
}
```

Output:

```
(module
  (type (;0;) (func (param i32 i32) (result i32)))
  (func $add (type 0) (param i32 i32) (result i32)
    local.get 1
    local.get 0
    i32.add)
  (memory (;0;) 2)
  (global $__stack_pointer (mut i32) (i32.const 66560))
  (export "memory" (memory 0))
  (export "add" (func $add)))
```

This looks like what I want. I've got my function and it's being exported (along with a memory region that I'm not actually using in my code).

## Using the module
Now that I've got my finished module (`add.wasm`), I need to host it somewhere.

### Using the module in Node
Here's an example of loading the module and calling `add` in Node:

```
const fs = require('fs');
(async () => {
    const module = await WebAssembly.instantiate(await fs.promises.readFile("./add.wasm"));
    const add = module.instance.exports.add;
    console.log(add(2, 2));
})();
```

* `await fs.promises.readFile("./add.wasm")` initiates a file read and resumes upon completion
* `const module = await WebAssembly.instantiate(...);` starts instantiating the module and resumes upon completion
* `module.instance.exports` contains the named exports
* `add(2, 2)` returns 4, as expected

### Using the module in a web page
Here's a web page for my trivial example:

```
<html>
    <body>
        <p>The value of 2 + 2 is <span id="result">?</span></p>

        <script>
            (async () => {
                const module = await WebAssembly.instantiateStreaming(fetch("./add.wasm"));
                const add = module.instance.exports.add;
                document.getElementById("result").innerText = add(2, 2);
            })();
        </script>
    </body>
</html>
```

Note that using `fetch` isn't supported from the file system, so I used [a trivial HTTP server](https://github.com/http-party/http-server) for local testing.

* `fetch("./add.wasm")` initiates a request to load the module by relative path
* `const module = await WebAssembly.instantiateStreaming(...);` starts instantiating the module and resumes upon completion
* `module.instance.exports` contains the named exports
* `document.getElementById("result").innerText = add(2, 2);` updates the "result" span with the result of the call to `add`

To my surprise, everything worked on the first try.

I was also able to confirm that the module's memory was exported (`module.instance.exports.memory`) and could be read from within my browser's dev tools window. I'm still not clear on why LLVM decided to export the memory by default.

# That's it!
The end result of all this was actually pretty simple. Here are some links for reference:

* [GitHub repository with all the code and build commands](https://github.com/jaredkrinke/webassembly-trivial-example)
* [Live demo of the module hosted in a web page](https://jaredkrinke.github.io/webassembly-trivial-example/) (using `WebAssembly.instantiate()` instead of `instantiateStreaming()` for compatibility with older browsers)

Remembering how to use a C compiler on the command line, and deciphering LLVM's export semantics took a bit more time than I would have liked, but I learned a lot about WebAssembly in the process.

Next up, I'll see if I can get the C standard library working.