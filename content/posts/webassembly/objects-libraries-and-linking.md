---
title: WebAssembly objects, libraries, and linking (for C code)
description: In order to reuse C libraries in WebAssembly, here is how object files, libraries, and linking work with Clang and LLVM.
keywords: [webassembly,clang]
date: 2021-10-06
---
In the interest of reusing [some C string handling code I wrote for use in WebAssembly](passing-strings-to-c.md), I'm researching how object files, libraries, and linking work in WebAssembly.

# Background
For native C code, the following file types and concepts are used:

* Header files (.h) define the interfaces used between source files
* Source files (.c) implement functionality
* Object files (.o) each represent the compiled (using "-c") output of a single source file
* Archive files (.a) contain many object files and are used for build-time linking (static libraries)
* Shared objects (.so) or dynamic-link libraries (.dll) support linking at run-time (shared libraries)

How does the Clang/LLVM toolchain map these concepts to WebAssembly?

# WebAssembly object files
To my surprise, WebAssembly actually publishes [conventions for creating and linking object files](https://github.com/WebAssembly/tool-conventions/blob/main/Linking.md).

I certainly didn't read that entire document, but I did note that object files are just WebAssembly modules, with custom sections (note: custom sections are only supported in binary ".wasm" format, and not text ".wat" format).

## Example
My WebAssembly string library is very simple:

* It defines `wasm_c_string` which represents a string on the heap that will be return to the JavaScript host
* It exports 2 functions:
  * `allocate_wasm_c_string` to allocate a wasm_c_string of a given length
  * `create_wasm_c_string` to allocate a wasm_c_string that is a copy of any old C string

Note that this example requires consumers of the library providing `malloc()` and `free()` to the JavaScript host. I don't export these from my library because I want consumers to be able to supply their own allocator.

### C source code
Here's the header file ("wasm-c-string.h"):

```c
typedef struct {
    unsigned int length;
    char buffer[];
} wasm_c_string;

// Allocates an empty wasm_c_string. When done, use "free" to release.
extern wasm_c_string* allocate_wasm_c_string(unsigned int length);

// Creates a new wasm_c_string from an existing C string. When done, use "free" to release.
extern wasm_c_string* create_wasm_c_string(const char* source);
```

And the source file ("wasm-c-string.c"):

```c
#include <malloc.h>
#include <string.h>
#include "wasm-c-string.h"

#define WASM_EXPORT_AS(name) __attribute__((export_name(name)))
#define WASM_EXPORT(symbol) WASM_EXPORT_AS(#symbol) symbol

wasm_c_string* WASM_EXPORT(allocate_wasm_c_string)(unsigned int length) {
    wasm_c_string* str = (wasm_c_string*)malloc(sizeof(unsigned int) + length);
    str->length = (unsigned int)length;
    return str;
}

wasm_c_string* WASM_EXPORT(create_wasm_c_string)(const char* source) {
    const size_t sourceLength = strlen(source);
    wasm_c_string* str = allocate_wasm_c_string((unsigned int)sourceLength);
    memcpy(&str->buffer[0], source, sourceLength);
    return str;
}
```

### Compiling
Let's compile this to an object file (using the [WASI SDK](https://github.com/WebAssembly/wasi-sdk)--note the "-c" argument that tells Clang to only output an object file and not invoke the linker):

```sh
wasi-sdk\\bin\\clang -Os --sysroot wasi-sdk/share/wasi-sysroot -c wasm-c-string.c
```

### Text format
The output file defaults to "wasm-c-string.o" and here's the (abbreviated) corresponding text format (compliments of the [WebAssembly Binary Toolkit](https://github.com/WebAssembly/wabt)'s `wasm2wat` tool):

```wasm
(module
  (type (;0;) (func (param i32) (result i32)))
  (type (;1;) (func (param i32 i32 i32) (result i32)))
  (import "env" "__linear_memory" (memory (;0;) 0))
  (import "env" "__indirect_function_table" (table (;0;) 0 funcref))
  (import "env" "malloc" (func (;0;) (type 0)))
  (import "env" "strlen" (func (;1;) (type 0)))
  (import "env" "memcpy" (func (;2;) (type 1)))
  (func $allocate_wasm_c_string (type 0) (param i32) (result i32)
...
  (func $create_wasm_c_string (type 0) (param i32) (result i32)
...
  (export "allocate_wasm_c_string" (func $allocate_wasm_c_string))
  (export "create_wasm_c_string" (func $create_wasm_c_string)))

```

You can see that it's importing memory, a function table, and C standard library functions, and that it's exporting my 2 functions.

### Custom sections
But wait, the object file conventions document indicates that there are custom sections that can't be represented in the text format. So let's use `wasm-objdump` (also from WABT):

```
$ wasm-objdump -s wasm-c-string.o

wasm-c-string.o:	file format wasm 0x1

...

Contents of section Custom:
0000119: 076c 696e 6b69 6e67 0208 be80 8080 0005  .linking........
0000129: 00a4 0103 1661 6c6c 6f63 6174 655f 7761  .....allocate_wa
0000139: 736d 5f63 5f73 7472 696e 6700 1000 00a4  sm_c_string.....
0000149: 0104 1463 7265 6174 655f 7761 736d 5f63  ...create_wasm_c
0000159: 5f73 7472 696e 6700 1001 0010 02         _string......

Contents of section Custom:
000016c: 0a72 656c 6f63 2e43 4f44 4504 0400 0b01  .reloc.CODE.....
000017c: 0021 0300 2c01 0042 04                   .!..,..B.

Contents of section Custom:
000018b: 0970 726f 6475 6365 7273 010c 7072 6f63  .producers..proc
000019b: 6573 7365 642d 6279 0105 636c 616e 6756  essed-by..clangV
00001ab: 3131 2e30 2e30 2028 6874 7470 733a 2f2f  11.0.0 (https://
00001bb: 6769 7468 7562 2e63 6f6d 2f6c 6c76 6d2f  github.com/llvm/
00001cb: 6c6c 766d 2d70 726f 6a65 6374 2031 3736  llvm-project 176
00001db: 3234 3962 6436 3733 3261 3830 3434 6434  249bd6732a8044d4
00001eb: 3537 3039 3265 6439 3332 3736 3837 3234  57092ed932768724
00001fb: 6136 6630 3629                           a6f06)

```

Sure enough, there are custom sections related to linking, relocation, and even a curious "producers" section (that apparently exists to [allow analysis of toolchain usage in the wild](https://github.com/WebAssembly/tool-conventions/blob/main/ProducersSection.md)).

# WebAssembly libraries
For something as simple as my 20 line C library, I could probably just distribute the C header and the compiled WebAssembly object file (which is actually a WebAssembly module with custom sections) and be done. What if I have a larger library?

## Dynamic libraries
Once again, to my surprise, WebAssembly publishes [conventions for dynamically loading libraries](https://github.com/WebAssembly/tool-conventions/blob/main/DynamicLinking.md), but the document notes there is no stable ABI. That's ok, I didn't really need dynamic libraries right now anyway.

## Static libraries
Static libraries for native C code are often just archives (using the [`ar`](https://en.wikipedia.org/wiki/Ar_%28Unix%29) archiver tool), perhaps with some additional information to describe the library.

Can I just do the same thing for WebAssembly? It certainly appears so.

If I inspect the WASI SDK, in the WebAssembly sysroot, I actually see both bare objects and archives for the C standard library and friends:

```sh
$ ls wasi-sdk/share/wasi-sysroot/lib/wasm32-wasi
crt1-command.o  libc++abi.a                         libdl.a       libutil.a
crt1.o          libc.imports                        libm.a        libwasi-emulated-mman.a
crt1-reactor.o  libc-printscan-long-double.a        libpthread.a  libwasi-emulated-signal.a
libc++.a        libc-printscan-no-floating-point.a  libresolv.a   libxnet.a
libc.a          libcrypt.a                          librt.a
```

What's in one of these archives? `ar -t libc.a` shows a bunch of object files. If I extract an object named "ccos.o" with `ar -x libc.a ccos.o`, I can use `wasm-objdump` or `wasm2wat` to see that it's just a regular WebAssembly object file.

I'm impressed that the people working on WebAssembly resisted the urge to create entirely new tools, and instead just decided to leverage existing UNIX tools that have been around for a long time.

# Linking
The [documentation for wasm-ld](https://lld.llvm.org/WebAssembly.html) is brief, but it does have most of the information you need.

The main tricks are:

* Pass `--no-entry` on the command line to indicate there is no `_start` entry point
* By default, only symbols marked with the `export-name` attribute are exported (see `WASM_EXPORT` in the C example earlier for a handy macro to add this)

# Summary
It turns out that the toolchain for WebAssembly libraries in C is similar to what one would use for native compilation:

* Publish header files (.h) to define the library's interface
* Compile source files (.c) to object files (.o) using `clang`
* If needed, consolidate multiple object files into an archive (.a) using `ar`
* Publish either a single object file or (more likely) an archive for users to consume
* For an object file, users just add it to the list on their `wasm-ld` command line
* For an archive, consumers add `-l<name of archive without extension>` to their `wasm-ld` command line
