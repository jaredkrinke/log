---
title: "Minimal dev environment, part 3: introducing \"leano\", a tiny Deno-compatible runtime"
description: I developed an actual piece of software using my minimal development environment. Here's how it went.
date: 2023-02-28
keywords: [minimalism,linux,deno]
---
In [part 2](minimal-dev-env-2.md), I laid out my initial minimal development environment (Raspberry Pi B, Alpine Linux, console only). Today, I'm sharing my initial experience using this setup.

# The task at hand
In order to document my experience, I needed to be able to build and update my dev blog using my [Deno](https://deno.land/)-based static site generator ([md2blog](https://jaredkrinke.github.io/md2blog/)), along with Git (and GitHub Pages). Problem: Deno [doesn't support Raspberry Pi](https://github.com/denoland/deno/issues/2295) (32-bit or 64-bit).

Fortunately, my static site generator only uses a tiny fraction of Deno's API surface (at least to build the site), so it's straight-forward to port the tool to a Pi-friendly runtime. One option would be to compile my TypeScript code to JavaScript, bundle it, and then use [Node](https://nodejs.org/en/) with a Node-to-Deno compatibility layer (written in JavaScript).

But a more *interesting* option would be to create my own (minimal, of course) Deno-compatible runtime, and use *that* to run md2blog.

## Dependencies
For this project, I decided to get back to my roots and use plain, boring old C. I would have like to try out Zig, but they don't appear to build SDK binaries for the Raspberry Pi. Why C (or Zig)? Mostly because I was planning to leverage [QuickJS](https://bellard.org/quickjs/) (an implementation of ES2020 in C), and I knew that integrating the library would be simple if I stuck to C. If I'd used a new (to me) programming language, I'd immediately be thrown into the treacherous waters of foreign function interfaces/bindings (and past experience told me that's usually the least fun part of learning a new programming language).

Between QuickJS and the C standard library, I was hopeful I could get md2blog up and running on my Raspberry Pi.

# Code editing
In the past, I used Vim extensively, but lately I've mostly used VS Code (and Visual Studio, if necessary). This project was a good opportunity to reacquaint myself with Vim. Specifically, I wanted to see if I could carry some of my favorite features from VS Code back to Vim:

* (Smart) Auto-complete
* Go to definition
* Spellcheck

## Auto-complete for C code in Vim
I used to think auto-complete was often used as a crutch for not being familiar with code. Nowadays, I'll take any crutch I can get, because there's so much code, and it's honestly not worth my time to understand it all in depth--most of the time, at least.

Although I was aware of it, I'd never taken the time to setup [Ctags](https://en.wikipedia.org/wiki/Ctags) in Vim. Ctags isn't as nice as a real language server (it doesn't automatically regenerate and can't find all references, for example), but I'm not sure my Raspberry Pi could run a real language server anyway. Fortunately, setting up Ctags was as easy as running `ctags -R *` in my project. Then it just all magically worked in insert mode with **Ctrl+N**. Nice!

## Go to definition
With Ctags set up, I was just a `:help tags` away from learning how to go to the definition of a symbol:

* **Ctrl+]** jumps to the definition of the currently highlighted symbol
* **Ctrl+W Ctrl+]** opens the definition in a new pane
* **Ctrl+T** jumps back to where you were

It's pretty handy, although I started to remember how annoying it is to have to memorize a million key bindings to be productive in Vim.

## Spellcheck
For blog entries, it's nice to have a spellchecker running, to catch typos. I did a bit of research and couldn't figure out why **Ctrl+X s** didn't work for spellcheck, but `:set spell` worked like magic, and highlights any suspicious words.

## Navigating new code in Vim
Armed with some new Vim knowledge, I got started. The first task was to navigate around the QuickJS code to understand things like how to evaluate JavaScript code and how to expose native functions to JavaScript. Being able to search around the code and jump to definitions was great, but I did start to wish I was in VS Code. In Vim, I'm used to splitting panes horizontally and vertically, but I'm not sure what to do when I need to have so many things open at once that the panes are too small to be readable. In VS Code, I can keep files open without losing context. I'm sure this is possible in Vim, but I haven't figure it out yet (and I'm not sure I'd remember all the keyboard shortcuts to make it happen).

Has someone made a command palette for Vim yet?

# Web browser woes
In addition to reading the QuickJS code, I also needed to refer to the HTML manual (although it's fairly light on details, so no substitute for just reading the code). Once again, the console web browser experience was painful. It's not the fault of the browsers themselves, it's just that most web pages don't seem to be designed with console browsers in mind. The QuickJS manual worked well, but trying to drill into search results, navigate GitHub issues, and read StackOverflow threads was a chore.

At least DuckDuckGo and [MDN](https://developer.mozilla.org/en-US) provide decent experiences in console mode.

# So... *slow*...
The preceding issues were tolerable. Performance was another story.

I'm not sure what I was expecting from a 10 year old computer that cost $50 to begin with. I thought I'd heard that you could play Quake 3 on a Raspberry Pi (although I'm not sure which model). Having used a Raspberry Pi model B with 512 MB of RAM and a 700 MHz ARM CPU for a few days, I'm skeptical.

Installing packages and opening web pages in w3m was pretty snappy, but compiling QuickJS was a rude awakening. I typed `make` and then left to do something else when it became apparent that it might be a while. Later, I came back, and it was *still* compiling! With link-time optimization, it took almost half an hour to build QuickJS.

I hoped that the GCC compiler was just being slow (and link-time optimization is probably pretty CPU-intensive in general), but over the course of the day it became apparent that *everything* was slow. Navigating large C files in Vim was slow (frequently, I could see the screen re-drawing individual lines of text). Syntax highlighting (which I think isn't even parsing the full C grammar) was slow enough that it kept automatically turning itself off.

# Success! And **leano**
But I persisted and eventually was able to create a minimal Deno-compatible JavaScript runtime, built on QuickJS. I call the result **leano**, and [the toy-level prototype code is up on GitHub](https://github.com/jaredkrinke/leano). The whole thing weighs in at roughly 800 KB. But, of course, it doesn't do very much--leano only implements the Deno functions/properties that md2blog uses.

For the record: this blog post was written (and built) using leano on my Raspberry Pi.

The implementation is fairly simple:

* Sets up a QuickJS runtime and context
* Exposes a couple of native functions (for performance reasons)
* Injects JavaScript code to implement Deno and web APIs (e.g. `Deno.args`, `Deno.writeTextFile`, and `TextEncoder`)
* Runs the requested module

I'll admit that md2blog hasn't been optimized. It always regenerates the entire site, and it's written in JavaScript. On my desktop computer, I can build my site in maybe 1 second. On the Raspberry Pi (admittedly using a much simpler JavaScript runtime), it took *over 6 minutes*! Even after moving UTF-8 encode/decode to native code, it still took 4 minutes to rebuild this site.

# Lessons learned
That was just a depiction of my experience using this minimal dev environment. But what have I *learned*?

* A ten year-old, cheap computer is capable, but *slow*
* Regardless, it *is* possible to develop software in C, with most of the bells and whistles, *while using under 500 MB of disk space* (this is probably the biggest surprise of this whole experiment)
* Vim with Ctags is great, but remembering all the key bindings is annoying, and I still feel less productive than in VS Code
* Not mentioned above, but I haven't found a good debugging setup, even for C
* JavaScript is pretty portable, thanks to QuickJS (though I worry what will happen as the language continues to evolve beyond QuickJS's implementation)
* Browsing most of the web on the console is tedious

# Next steps
First of all, it's clear to me that I'd like a faster computer. Would a newer Raspberry Pi hit the sweet spot between performance and cheapness? What about an old laptop?

Additionally, I'm still on the fence about wanting to stick to console mode. Ultimately, it's an arbitrary goal, and I don't think I'm aiming for it for any other reason than to see if it's possible. It's likely at some point I will break down and install a GUI environment. Maybe economizing a GUI is superior to maximizing the console?

Regardless, I still plan to play around with a few more code editors and programming languages.

