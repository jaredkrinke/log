---
title: Future-proof programming languages, part 2
description: More research on future-proof programming languages.
date: 2023-02-17
keywords: [lisp,lua,python]
---
Almost exactly 1 year ago, in [part 1](future-proof-languages.md), I enumerated a bunch of popular programming languages and tried to quickly determine which ones seemed like they'd still be useful in another decade. In the intervening time, I've completed some nontrivial projects in both TypeScript (using both Node and Deno) and Python. I've also spent time contemplating a [minimal development environment](minimal-dev-env.md).

In this post, I'm going to add a few more items to my programming language wishlist, add a few more programming languages to my candidate list, and then briefly describe my initial experiences with a few of those languages.

# Disclaimer
I don't have a lot of experience with most of these programming languages. I've written a lot of code in various languages (mostly C, C++, C#, TypeScript, and Lua), but I am by no means an expert at assessing programming languages. Feel free to send corrections to log@schemescape.com.

# There can be more than one
Note: I've come to terms with the fact that I'll probably end up needing to use several of these languages for different purposes, namely I'll want to have one fast, ahead-of-time compiled language for performance-critical projects, and something simpler and more dynamic (while still low-overhead) for most everything else.

# Wishlist
In part 1, I [listed](future-proof-languages.md#indicators) some indicators of a future-proof programming language, along with a wishlist of conveniences/ergonomics. Here are some additions (in **bold**) to my "programming language wishlist":

* No multi-gigabyte downloads just to get started
* Not tied to a single platform/environment/tool set
* **Fully usable for development on many platforms**
* Small and simple (in case I want to build my own tools)
* Easily cross-compiled
* **Trivial to deploy**
* Simple and transparent build process
* Readily available libraries (either with source available or from reputable contributors)
* Ergonomic editing
* **Not subject to the whims of a single company**
* **~~Easy~~ Possible to bootstrap**

Most these additions are in response to what I've seen while investigating a few languages. Specifically:

* Python and Clojure don't appear to be trivial deploy (especially for Python with dependencies)
* C# and Go are tied to for-profit companies, both of which are known for canning unprofitable projects (one notoriously so)
* Small languages written in C, like Lua, would be easy to bootstrap in the future, should the need arise (e.g. if I want to move to a new or old platform that isn't already supported)

# Additional candidates
My original (pruned) list of candidate languages included:

* JavaScript/TypeScript
* Python
* C#
* C++
* C
* Go
* Rust
* Lisp/Clojure
* Zig

I'm going to add a few more languages:

* **Tcl**: I've only briefly used Tcl in the past, but it seems great for command line "glue", and the language itself (at least what I've experienced) is beautifully simple
* **Lua**: I originally discarded Lua because in the past I found its quirks to be too annoying, but that experience was mostly 10+ years ago, and there have been multiple major updates since then

Aside: I'm intrigued by [The Vale Programming Language](https://vale.dev/), but it's not even close to done yet.

# Some early observations
Eventually, I'll probably compile a big table of these languages, along with an assessment with respect to each of my criteria, but for now I've just got a few initial notes.

## Compiler/runtime installation

### JavaScript/TypeScript
[Deno](https://deno.land/) makes running TypeScript trivially easy, but its list of supported platforms is short (notably, it does not include 32-bit Windows!). [Node](https://nodejs.org/en/) supports 32-bit Windows, but is much less convenient.

### Python
Anyway, the [Python installation docs](https://wiki.python.org/moin/BeginnersGuide/Download) recommend seeing if you already have Python installed by typing `python` into a command window. To my surprise, I don't immediately see an "unrecognized command" error. Incredibly, it launches to a Python page in the Microsoft Store (compliments of `%LocalAppData%\Microsoft\WindowsApps\python.exe` -- seriously!?). I'll give it a try since it's a surprisingly reasonable ~100 MB download. It appears to install a Python runtime and the IDLE editor.

Honestly, I'm not thrilled that Microsoft decided to [insert this Python shim into Windows itself](https://devblogs.microsoft.com/python/python-in-the-windows-10-may-2019-update/) just to make it easier for people to find Python, but I guess I'll try it out. Note that I'll almost certainly be using VS Code and the official Python extension for editing and debugging.

### C#
To my surprise, the [C# compiler](https://github.com/dotnet/roslyn) and [.NET runtime](https://github.com/dotnet/runtime) are both now open source (MIT license). Even more surprising, you can now apparently [deploy self-contained .NET executables to a Raspberry Pi](https://docs.microsoft.com/en-us/dotnet/iot/deployment).

C# is a great language and the .NET standard library is probably the most thoughtfully crafted standard library I've ever used. So is my search over? Is C# the answer?

First, I need to setup a C# development environment. I'm developing on Windows (.NET's home platform), so this might give me an unrealistically positive impression of C#'s convenience.

After selecting the .NET runtime and SDK in the Visual Studio installer, I am appalled to see that it requires *5 GB* of disk space! There's probably a bunch of extraneous junk I don't need, but for comparison: Visual Studio Code is ~300 MB and Deno's TypeScript runtime is ~60 MB.

Since I was curious, I checked out the [.NET SDK for Linux (Debian)](https://learn.microsoft.com/en-us/dotnet/core/install/linux-debian), and it was closer to 500 MB. To my surprise, it was very full-featured, and I was even able to cross-compile for Windows from Linux.

As much as I like C#, the unreasonable disk footprint of its tooling has sent C# to the bottom of my pile.

### C++
C++ sort of gets a free pass because Linux distributions generally provide the GNU C++ compiler and I already had to install a C++ environment in order to use Rust on Windows. Clang is < 1 GB to install and there are numerous free and/or open source C++ IDEs that are less than 1 GB. Visual Studio for C++ was around 3 GB, which is much too big, but not an immediate disqualifier in light of available alternatives. At least there's a free version now.

### C
C is similar to C++, with the notable property that it is trivially bootstrap-able on some popular architectures using the [Tiny C Compiler](https://bellard.org/tcc/).

### Go
Go for Windows is a reasonable ~125 MB download, and VS Code has an official Go extension. I've heard that Go's tooling is excellent and what I've seen thus far (e.g. `go fmt`) is similar to what I liked about [Deno](../web-development/one-month-with-deno.md). It only took a couple of minutes (for me, a complete Go newbie) to get a "hello world" program up and running (with debugging, no less).

### Rust
Setting up a Rust environment on Windows [is not pleasant](rust-first-experience.md) because it requires first installing Visual C++ (a multi-gigabyte download). On Linux, installation is a breeze, but I'm using Windows at the moment.

### Lisp/Clojure
Honestly, I haven't investigated this option yet.

Clojure requires a Java runtime and, at the moment, I don't really want to install one. I used Java a lot in the past (back when it would pop up messages saying a new version of Java was available, with a possibly ironic exclamation mark), but I don't want to deal with deploying Java whenever I want to run something.

Some other Lisp options include [Racket](https://racket-lang.org/) (which I've briefly used in the past) and [SBCL](http://www.sbcl.org/) (which I have no experience with, but seems more popular).

### Zig
Zig is a smallish download, with a developer-friendly command line interface that appears to be on par with Go and Deno.

### Tcl
Tcl is a trivially small download. I'll need to see how adding libraries (namely [Tcllib](https://www.tcl.tk/software/tcllib/)) works.

### Lua
While Lua binaries are available, Lua is more of a library that's meant to be embedded in an application. I thought there was a simple command line wrapper for Windows, but the main one I've found for Windows ([Lua for windows](https://github.com/rjpcomputing/luaforwindows)) appears to be unmaintained. It's possible [LuaRocks](https://luarocks.org/) might be what I'm looking for, but I'm not sure yet.

The good news is that I could easily bootstrap my own Lua shell (similar to what [Blub describes in a blog post](https://blubsblog.bearblog.dev/writing-software-that-will-still-build-and-run-in-20-years/)).

# Closing thoughts
Based on intuition and my experiences thus far, a few languages are at the bottom of the pack:

* **C++**: A complicated language, with an inscrutable standard library, still without a good module or build system -- but I have a lot of experience with it, and it's definitely not going anywhere
* **Zig**: The most promising "better C", with great tooling, but still immature

A few languages are lingering in the middle:

* **C#**: A great language, with probably the best standard library, but the toolchain is enormous
* **C**: Arguably the most portable language, just with a mostly awful standard library
* **Rust**: Supposedly even more complicated than C++, but at least it provides memory safety and a build system
* **Lisp**: An interesting and versatile language, but is it *used* as much as it's *discussed*?
* **Lua**: Almost as portable as C, but I'm not sure I want to bring my own everything

And then there are a few languages near the top of my list:

* **JavaScript/TypeScript**: A convenient language, made better by Deno's tooling and standard library, but still fairly volatile and without an official ecosystem-wide standard library
* **Python**: An ugly pile of hacks that is adored by many and is ubiquitous -- do I just need to get over my aversion to Python? Has deployment been solved yet?
* **Go**: Great tooling, a simple language, memory safety, and an allegedly great standard library -- I'd never considered Go before, but it has a lot of attractive qualities
* **Tcl**: A beautifully simple language with a tiny footprint and great for gluing things together -- but will it be forgotten in another decade or two?
