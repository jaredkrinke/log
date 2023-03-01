---
title: Future-proof programming languages, part 3
description: TODO.
date: 2023-03-01
draft: true
---

# C
* Mostly full-featured, doing real work and less than 500 MB for *everything* (including the OS, web browser, etc.)

# Zig
* 200 MB
* No build for armv6l, but old build for armv6kz
* Crashes on C compile--also very slow
* Hello world didn't work--also kind of slow
* Might try bootstrapping from my desktop, but probably too immature at the moment

# C#
* Involves running a script -- will it pollute my system? Can I fully remove it?
* Docker images are provided -- would that be the safest way to try it out?
* Not seeing a Dockerfile on GitHub for ARMv6...
* What about Mono? Didn't see any packages starting with "mono"...

# Rust
* Try with Alpine package first, since it's convenient, and easy to remove

# Lisp (SBCL)
* Native package

# Lua
* Contrast with QuickJS, e.g. size, convenience
* Has tons of native packages... but is it portable to Windows?

# JS/TS
* Probaby will need Node at some point

# Python

# Go

# Tcl

