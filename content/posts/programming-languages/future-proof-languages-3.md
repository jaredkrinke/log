---
title: Future-proof programming languages, part 3
description: Finally! I've landed on my set of future-proof languages.
date: 2023-03-03
keywords: [lisp,lua,python,rust,zig]
---
In [part 1](future-proof-languages.md), I narrowed down a list of popular programming languages to the ones I liked and that I  thought would still be useful in the future. In [part 2](future-proof-languages-2.md), I recorded some initial impressions, and added a few more languages to the mix.

In this update, I'm recording my experiences with a trivial program in each language, with an eye towards possibly incorporating one or more of these languages into my [minimal development environment](minimal-dev-env-2.md).

# Scenarios and metrics
**This post is not an attempt to definitively benchmark or objectively compare programming languages in depth!** Instead, I'm playing around with each language and environment to see which ones are even worth my consideration. Specifically, I'm looking at:

* SDK size (measured on x86_64 Alpine Linux), as a proxy for **simplicity**
* "Hello, world!" program size, as a proxy for **overhead**
* Stand-alone executable size, as a proxy for **ease of deployment**
* Cross-compiling for a Raspberry Pi B, as a proxy for **portability** and **developer experience**

# Results
For reference, my Alpine Linux baseline image was around 150 MB. Here are the results, ordered by descending SDK size:

| Language | SDK size | Program size | Stand-alone size | Build on Pi? | Cross-compile for Pi? |
|---|---|---|---|---|---|
| Rust | 650 MB | 300 KB | ? | Probably | Mostly easy |
| Go | 550 MB | 1.2 MB | 1.2 MB | Yes | Easy |
| C# | 510 MB | 75 KB | 67 MB | No | Failed |
| Zig | 335 MB | 800 KB | 800 KB | No | Mostly easy |
| C++ | 230 MB | 14 KB | 940 KB | Yes | Tedious |
| C | 144 MB | 14 KB | 13 KB | Yes | Tedious |
| Python | 75 MB | 1 KB | 7 MB | Yes | Unnecessary |
| JavaScript (Node) | 60 MB | 1KB | 80 MB | Yes | Unnecessary |
| Lisp (SBCL) | 45 MB | 1KB | 40 MB | Probably | No |
| Tcl | 8 MB | 1 KB | ? | Yes | Unnecessary |
| Lua | 1 MB | 1 KB | 1 MB | Yes | Unnecessary |

## SDK size
Obviously, it's not fair to compare the compile-to-native languages to scripting languages, but comparisons within each category seem appropriate. Rust is big (especially if using Microsoft's linker, etc.). Go is the second largest, but it comes with some impressive features: the ability to trivially cross-compile and [a large standard library](https://pkg.go.dev/std). Go's offering seems on par with C#, but with a better "compile to native code" story (and, obviously, larger differences in the programming languages themselves).

Zig is larger than I expected for a simple language, but it can cross-compile for different architectures (similar to Go), and [Zig can even compile C/C++ code](https://zig.news/kristoff/compile-a-c-c-project-with-zig-368j), so it's arguably worth the footprint (and the download is actually quite small).

Looking at interpreted languages, the results are pretty similar except for Tcl and Lua (both of which don't come with much of a standard library).

## "Hello, world!" program size
The Go binary shows one of Go's weaknesses -- it's compiled to native, but it has to include the runtime in each binary. This isn't a deal-breaker for me, so I'm not too concerned.

I *am* curious why the Zig binary is so large, but I haven't investigated any further yet. Given that Zig supports "freestanding" binaries, I'm sure it's possible to create minimal binaries with Zig.

The C++ binary using "iostream" was unacceptably big, but using "stdio.h" gets it back in line with C, in the low double-digit kilobytes.

## Stand-alone executable size
Deployment is probably my least favorite part of software. Obviously, there are exceptions, but in most cases, a "program that does X" would be most convenient as a single executable (or at least a single zip file) that just does X. Here, I'm looking at fully statically-linked or bundled binaries.

Native languages generally compile to a single binary. I didn't try to get a fully static binary from Rust, but I've read that it's possible. C certainly is good at producing small executables (in the past, this was a prerequisite!).

The other languages show some interesting results: JavaScript and C# appear to be the most bloated, closely followed by SBCL (a Common Lisp implementation). But for JavaScript there are multiple runtimes--80 MB is for Deno, but QuickJS is under 1 MB--so JavaScript supports indirectly optimizing for either size or speed. Lisp has a similar story, although I didn't investigate it in depth. Python was impressively slim (definitely a surprise for me!).

That leaves C# which, sadly, just appears to be bloated (**update**: I've read it is possible to produce much smaller self-contained C# builds these days, but I haven't tried it yet). For the record, I couldn't get a Tcl bundle working, but I suspect it would be < 10 MB.

## Developing *on* a Raspberry Pi
Note: this section is about developing/compiling *on* a Raspberry Pi B.

The only languages that appeared to not be trivial to compile on a Raspberry Pi B with Alpine Linux were C# (this appears to be an unsupported platform) and Zig (theoretically, you might be able to bootstrap an environment, but I haven't attempted that yet).

## Cross-compiling for a Raspberry Pi
Although I'm interested in developing directly on a Pi (as part of [my minimal development environment](minimal-dev-env.md)), it's likely I'll end up doing some development on a (faster) desktop, and then want to run the output on a Pi. Results here are easily categorized:

* Cross-compiling not needed
  * JavaScript (QuickJS, Node, but *not* Deno)
  * Lua
  * Python
  * Tcl
* Trivial to cross-compile
  * Go
  * Rust (note: requires [editing Cargo's config file](https://github.com/KodrAus/rust-cross-compile#cross-compiling-to-linux))
  * Zig ([except for C/C++ code](https://github.com/ziglang/zig/issues/4875))
* Tedious, but possible to cross-compile
  * C
  * C++
* Cross-compile failed/didn't work/not possible
  * C# (executable failed to run)
  * SBCL (not necessary with runtime, but not possible *without* a runtime)

Scripting languages sort of get a free pass here, but there are almost certainly large differences in ease of deployment.

Go and Zig have excellent tooling for cross-compiling. And if Zig can eventually support cross-compiling C/C++ code without requiring a separate toolchain, that would be huge! **Update**: Cross-compilation for Rust worked well, once I found out [how to tell Rust to use its bundled linker](https://github.com/KodrAus/rust-cross-compile#cross-compiling-to-linux).

C/C++ support cross-compiling through a painful process of setting up an entire compilation environment for the target. It's tedious and annoying, and I hope I never have to do it again.

As for C#, I suspect there's some way to get it to successfully cross-compile for a Pi, but after a few errors I gave up. I put SBCL in the last category because it seems to require running on the target in order to produce a bundle.

# Analysis
Subjectively, I was least impressed with the following languages, so they've been cut:

* C#: big and didn't work out of the box -- it's a shame because I really like C# and the .NET standard library
* Lisp: unimpressive bundle size/cross-compiling story -- but honestly, it's too esoteric for me, and the community is highly fragmented (**update**: I actually [ended up using Common Lisp for a while, to test out REPL-driven development](learning-lisp-in-2023.md))
* Tcl: inconvenient tooling and, sadly, not popular enough to ensure it doesn't fade away

I'll tackle the remaining languages in two categories: native/compiled/statically typed vs. interpreted/dynamically typed.

## Native languages
Here are the remaining native languages, along with my favorite and least favorite qualities:

* C: simple and portable, but requires textual macros for many abstractions (and has an error-prone standard library)
* C++: powerful abstractions, but an inconsistent standard library
* Go: excellent tooling, but I still don't like the overhead of a garbage collector for native code
* Rust: memory safety without a garbage collector, but the SDK is is big (and compilation is famously slow)
* Zig: efficient tooling, but not yet mature

### C++ and Rust
If I need powerful abstractions, C++ and Rust are the candidates. At the moment, I'm leaning towards giving Rust a try (despite the large SDK). I'm familiar with C++, and it's certainly capable, but Rust's memory safety guarantees are worth exploring in depth. Hopefully that doesn't end up being a mistake...

### C, Go, Zig
If I'm just looking for a simple and fast language, that would leave C, Go, and Zig. Honestly, they all look like good choices.

Overall, Rust's unique combination of safety and speed is compelling, and I'm sure I'll end up using it eventually. I'll probably also need to use C where it's already entrenched.

## Interpreted languages
Here are the remaining interpreted/dynamic languages:

* Python: ubiquitous, with a large standard library
* JavaScript/TypeScript: the only option for the web, with a convenient type system in TypeScript, but without a standard library and runtime (and the module story is *still* fragmented!)
* Lua: minimalist, but no standard library

These languages are almost a battery inclusion continuum from "included" to "sold separately".

### Python
Python is everywhere! Now that Python is convenient on Windows, Python is almost a defacto portable shell scripting language (with a lot more). For example, the [Zig bootstrap process](https://github.com/ziglang/zig-bootstrap) requires Python! If it had required Node, people would have lost their minds. I think it's high time I give in and just embrace Python.

### JavaScript
JavaScript has somehow leap-frogged Python to become a convenient language, and TypeScript makes it even better for large projects. But I will admit that Node's API is irritating, and the NPM ecosystem continually has to grapple with the lack of a standard library. Deno's tooling is excellent, but Deno also breaks compatibility left and right. JavaScript is definitely future-proof, but the non-browser runtimes I'm less sure about.

### Lua
Lua is a great language for embedding, but I'm not sure it can compete with the popularity of Python and JavaScript for general software tasks.

### All of the above
Realistically, I'm probably going to use all three of these scripting languages, just for different purposes:

* Python for tools and scripts
* JavaScript on the web
* Lua for embedding

# That's all!
When I started this investigation, I thought Rust was a shoo-in. It's still at the top of my "native" list, mostly due to its unique combination of memory safety and systems-level design.

Prior to digging in a bit more, I wanted to continue avoiding Python in favor of JavaScript/TypeScript (running under Deno where possible, and Node otherwise). I've finally given in, and I think I'll be writing a lot more Python in the future. I'd also written off Lua, but its minimalist design dovetails nicely with my minimal development environment aspirations, so I might give Lua another shot. I'll happily continue using JavaScript (really TypeScript) for the web, of course.

## Addendum/notes
The next section is just a collection of notes I made while testing out languages. It's likely riddled with factual errors.

### C#
* Install involves running a script -- will it pollute my system? Can I fully remove it?
* Docker images are provided -- would that be the safest way to try it out?
* Not seeing a Dockerfile on GitHub for ARMv6...
* What about Mono? Didn't see any packages starting with "mono" on Alpine Linux...
* Cross-compile for Pi didn't work -- sadly, I didn't investigate--I promise to try again someday!

### Go
* Set `GOOS` and `GOARCH` to set OS and architecture for cross-compilation

### Lisp (SBCL)
* Native package
* Arrow keys didn't work in interpreter (use `rlwrap`)
* It seems like producing a self-contained, native executable for a different platform is frequently not supported by Lisps

### Lua
* Has tons of native packages... but is it portable to Windows?
* Language server: https://github.com/LuaLS/lua-language-server -- note that it's complicated to build...

### JS/TS
* Probably will need Node at some point, but that runs on Raspberry Pi

### Python
* Zig bootstrap requires Python 3, ha!

### Rust
* Try with Alpine package first, since it's convenient, and easy to remove
* Raspberry Pi B Alpine Linux triple: arm-unknown-linux-musleabihf
* Attempt to cross-compile failed with "linker \`cc\` not found"
* Finally found [the trick](https://github.com/KodrAus/rust-cross-compile#cross-compiling-to-linux) for linking during cross-compilation: point Cargo to "rust-lld" (which is installed with the toolchain)

### Tcl
* Couldn't figure out how to make a TclKit...

### Zig
* No build for armv6l, but old build for armv6kz (unfortunately, this crashed and was slow)
* Might try bootstrapping from my desktop
* Cross compile to Raspberry Pi B with Alpine Linux: `zig build -Dtarget=arm-linux-musleabihf -Dcpu=arm1176jzf_s`
* Cross-compiling C code [doesn't appear to be possible at the moment](https://github.com/ziglang/zig/issues/4875)
