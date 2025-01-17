---
title: My first experience with Rust
description: Rust is popular and I'm interested in its memory safety features and build system. Here's my first experience with Rust.
date: 2022-01-06
keywords: [rust]
---
[Rust](https://www.rust-lang.org/) is so popular these days that "written in Rust" is undoubtedly going to become a meme (if it hasn't already). It's time I give it a try!

# The appeal of Rust
I can understand the appeal of Rust. It's a modern language (meaning it doesn't have a ton of legacy cruft), it has a unique memory model that prevents certain classes of bugs, yet it still has manual memory management. This is an enticing combination!

Theoretically, this should allow Rust to be used all the way from memory-constrained embedded systems to high level apps.

# What about C++?
Now, I'm not willing to jump to a new language and ecosystem just because it's shiny and new. Rust's memory model seems like an improvement over C++, but modern C++ has (in my experience) fewer memory bugs anyway, thanks to smart pointers and the [RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization) pattern.

But here are some other enticing features of Rust:

* Rust has its own package manager, [Cargo](https://doc.rust-lang.org/stable/cargo/)
* Rust has its own build system, which is also Cargo
* Rust's compiler is built on LLVM, so it can trivially target WebAssembly

If I had to pick the worst part of C++ development, I'd say it's setting up a build system and dealing with dependencies. Cargo might tip the scales toward Rust, for me!

# Installing Rust
It might be unreasonable, but I'd like my programming language of choice to have a development environment that is compact and simple to setup. Aside: this is one of the reasons I enjoy [Deno](../web-development/one-month-with-deno.md): it ships as a single (fairly small) binary.

Following Rust's [getting started instructions](https://www.rust-lang.org/learn/get-started), I'm immediately discouraged:

> It looks like you’re running Windows. To start using Rust, download the installer, then run the program and follow the onscreen instructions. You may need to install the Visual Studio C++ Build tools when prompted to do so.

I have to install a full C++ development environment just to use Rust? Ok, well I click the link and download ~35 MB. Not too bad until it becomes apparent that the download is *just the installer itself*. I'm then presented with a huge list of options for things to install.

The Rust installer indicates that I should install the Windows 10 SDK, so I select that and am horrified to see that it is 2.8 GB.

# Recap
Based on the documentation I've seen so far, it looks like you have to install nearly 3 GB of C++ tools just to get a working Rust development environment on Windows.

At this point, I'm speechless. I was willing to tolerate a ~500 MB download for a new programming language, but I'm already up to about six times that size without even getting to the Rust part. A quick web search indicates that this requirement is just to provide things like a linker, but I'm certain these tools are much less than 3 GB in size.

Of course, this is really Microsoft's fault, so it's unfair for me to blame Rust. **I will restart my Rust adventure on Linux**.
