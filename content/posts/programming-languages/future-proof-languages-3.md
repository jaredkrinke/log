---
title: Future-proof programming languages, part 3
description: TODO.
date: 2023-03-03
draft: true
---

# Stuff to check:
* Install size on Alpine
* Install size on Windows
* Compile "hello world"
* Note size
* Build and run time for "hello world" on a Pi
* Cross compile from Windows or Linux to Pi
* Cross-compile from Pi to Windows or Linux
* Package as a single binary and note size
* Try and debug on Windows via VS Code
* See if I can build the tool itself?

# Metrics
* Dev environment install size on Alpine Linux x86_64
* Non-debug "hello world" on same
* Single-executable build size for "hello world"
* Build time on a Pi B
* Cross-compile ease
* Debugging ease

Baseline: 125 MB

| Language | SDK size | Program size | Bundle size | Build on Pi? | Cross-compile for Pi? |
|---|---|---|---|---|---|
| Rust | 990 MB | 300 KB | ? | ? | Failed |
| Go | 550 MB | 1.2 MB | 1.2 MB | Yes | Easy |
| C# | 510 MB | 75 KB | 67 MB | No | Failed |
| Zig | 335 MB | 800 KB | 800 KB | No | Mostly easy |
| C++ | 230 MB | 14 KB | 940 KB | Yes | Tedious |
| C | 144 MB | 14 KB | 13 KB | Yes | Tedious |
| Python | 75 MB | 1 KB | 7 MB | Yes | Unnecessary |
| Node.js | 60 MB | 1KB | 80 MB | Yes | Unnecessary |
| SBCL | 45 MB | 1KB | 40 MB | Probably | No |
| Lua | 1 MB | 1 KB | 1 MB | Yes | Unnecessary |
| Tcl | 8 MB | 1 KB | ? | Yes | Unnecessary |


| Language: |
|---|
| SDK size |
| Hello World size |
| Self-contained executable size |


# C
* Mostly full-featured, doing real work and less than 500 MB for *everything* (including the OS, web browser, etc.)

# Zig
* 200 MB
* No build for armv6l, but old build for armv6kz
* Crashes on C compile--also very slow
* Hello world didn't work--also kind of slow
* Might try bootstrapping from my desktop, but probably too immature at the moment
* Cross compile to Raspberry Pi B with Alpine Linux: `zig build -Dtarget=arm-linux-musleabihf -Dcpu=arm1176jzf_s`
* Cross-compiling C code [doesn't appear to be possible at the moment](https://github.com/ziglang/zig/issues/4875)

# C#
* Involves running a script -- will it pollute my system? Can I fully remove it?
* Docker images are provided -- would that be the safest way to try it out?
* Not seeing a Dockerfile on GitHub for ARMv6...
* What about Mono? Didn't see any packages starting with "mono"...
* Cross-compiled for Pi didn't work

# Rust
* Try with Alpine package first, since it's convenient, and easy to remove
* Raspberry Pi B Alpine Linux triple: arm-unknown-linux-musleabihf
* Attempt to cross-compile failed with "linker \`cc\` not found" (and suggestions from the web didn't help)


# Lisp (SBCL)
* Native package
* Arrow keys didn't work in interpreter
* It seems like producing a self-contained, native executable for a different platform is frequently not supported by Lisps

# Lua
* Contrast with QuickJS, e.g. size, convenience
* Has tons of native packages... but is it portable to Windows?

# JS/TS
* Probaby will need Node at some point

# Python

# Go

# Tcl

