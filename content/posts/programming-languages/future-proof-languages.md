---
title: Future-proof programming languages
description: My projects are currently on hold while I suffer from programming language analysis paralysis.
date: 2022-02-11
keywords: [lisp,python]
---
After some rapid progress on projects such as [md2blog](../releases/md2blog-1.1.1.md), everything has come to a screeching halt while I struggle with making future-proof technology choices. This post is specifically about programming languages.

# Why future-proof?
I want code that I write to continue being useful to me in the future. Specifically, I want to be able to:

* Run my code
* Recompile my code (in case I end up on a new platform)
* Reuse my code in other projects
* Do all of the above with a minimum of hassle (and no multi-gigabyte downloads!)

And this is why I'm stuck on trying to find a comfortable, future-proof programming language.

# Indicators
Here are some ideas on what indicates that a programming language will persist well into the future:

* Availability of *open source* compilers and tooling (ideally multiple implementations that are mutually compatible)
* Support for many platforms
* Broad usage (both in open source projects and industry)
* Actively maintained standard library
* No breaking changes (ideally)

Of course, I'd also like the programming language to be convenient and comfortable, so I'll add to my wishlist:

* No multi-gigabyte downloads just to get started
* Not tied to a single platform/environment/tool set
* Small and simple (in case I want to build my own tools)
* Easily cross-compiled
* Simple and transparent build process
* Readily available libraries (either with source available or from reputable contributors)
* Ergonomic editing

# Observations
According to [Stack Overflow](https://insights.stackoverflow.com/survey/2021#technology-most-popular-technologies), the most popular programming languages are:

1. JavaScript
1. Python
1. Java
1. TypeScript
1. C#
1. C++
1. PHP
1. C
1. Go
1. Kotlin
1. Rust
1. Ruby
1. Dart
1. Swift
1. Objective C
1. Scala
1. Perl
1. Haskell
1. Clojure
1. Elixir
1. Lisp
1. Zig (not actually on the list)
1. Lua (also not on the list)

Now it's time to ruthlessly eliminate popular programming languages.

Some languages are mostly tied to a particular platform, so they get cut:

* PHP
* Kotlin
* Dart
* Swift
* Objective C
* Scala
* Elixir

Java and Perl I have experience with, and frankly, they're too cumbersome, so I won't investigate them further.

# Second round
After some initial pruning, here is the list with my initial thoughts:

* **JavaScript/TypeScript**: lots of implementations and modern JavaScript is nice, but comes with a ton of baggage; TypeScript brings some sanity to the language
* **Python**: setting up a Python environment is a recurring nightmare of mine, but it's so popular that I probably need to give it another shot
* **C#**: a great language and standard library, but how much of it is open source? Is it portable? Can I run .NET on a Raspberry Pi?
* **C++**: terribly complex, but modern C++ is surprisingly convenient; the build systems are generally awful, though
* **C**: probably the most portable and future-proof language ever created, but not very ergonomic
* **Go**: "goroutines" seem great and I've heard the tooling is nice, but a garbage-collected language with C-like verbosity sounds like the worst of both worlds to me
* **Rust**: new and popular, with an appealing memory model, but there's really only one implementation and [my first experience setting Rust up on Windows was terrible](rust-first-experience.md)
* **Ruby**: just as annoying to setup as Python, but less popular
* **Haskell**: it's been a while since I used a purely functional programming language
* **Lisp/Clojure**: I love the simplicity of Lisp (namely Scheme), but I have doubts about it being convenient and portable
* **Zig**: probably too new and with too many breaking changes, but I like the idea of a more sane alternative to C, and the Zig compiler is very convenient
* **Lua**: I used to love Lua, but TypeScript just seems so much more popular and productive these days (also: I hate 1-based arrays)

Given that this list is already too long, I'm going to eliminate a few options without proper due diligence (either based on prior experience or based on the belief that similar but superior options exist elsewhere on this list). Apologies to the following languages that have been cut:

* Ruby
* Haskell
* Lua

# Third round
For the next round, I'll do more research and hopefully play around with the languages I'm unfamiliar with.

Some initial thoughts on the languages I'm familiar with:

* TypeScript: comfortable and convenient, but memory usage and (lack of) parallelism are concerns
* C#: can this run on a Raspberry Pi? How much of the standard library is closed source?
* C++: is there C++ environment that is quick and easy to setup?
* C: a frontrunner, despite its numerous problems

And here are the languages I need to investigate further:

* Python
* Go
* Rust
* Lisp/Clojure
* Zig

# That's all for now
That's as far as I've gotten. My next steps are to see if C# is viable, determine if there's a convenient C++ environment, give Python yet another try, and then play around with Go, Rust, Clojure (or other Lisps), and Zig.
