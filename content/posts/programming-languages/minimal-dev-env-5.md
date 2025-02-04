---
title: Minimal dev environment, part 5
description: I almost found the perfect minimal development environment.
date: 2024-03-05
keywords: [minimalism,lisp]
---
In [part 4 of my quest to find a minimal (but comfortable) development environment](minimal-dev-env-4.md), I upgraded from a Raspberry Pi B to an old netbook. But now I'm back to tinkering with the Pi.

# Why?
**Why am I back to using an ancient single-board computer** (with a 700 MHz, 32-bit ARM CPU and 512 MB of RAM)? Because I think I can do better this time.

On my previous attempt, I was writing code in C and TypeScript because, frankly, those were the languages I was most familiar (and content) with. Sadly, parsing and analyzing those languages is nontrivial, and I noticed that syntax highlighting and (especially) static analysis were so computationally expensive, that Vim would start to crawl. I could literally watch lines of text appearing like a typewriter.

So, have I found a magical new language server that runs snappily on an original Pi? No. But kind of.

# A faster integrated development environment
Of course, to get faster syntax highlighting and whatnot, I had to change a few things--namely *everything*.

**Out goes Vim, in comes Emacs.** I know that sounds like a bad trade-off for performance, but bear with me.

**Out go C and TypeScript, and in comes Common Lisp.**

Emacs is not known for speed, but, when working with Lisp, it gets to cheat a bit. Lisp's syntax is trivial, so parsing and highlighting are very fast. Additionally, auto-complete is essentially baked into the ["read, evaluate, and print" loop of Lisp development](../programming-languages/learning-lisp-in-2023.md), and Emacs+SLIME adds formatting too.

It does take a while to startup, but once it's running, Emacs with SLIME and SBCL is surprisingly usable on my cute little hardware relic. I played around with some Lisp code and started making plans to write the finale to this series. I'd done it! I'd found a minimal, yet productive, development environment that could run on an endangered architecture!

# Or not
Unfortunately, when I went to try compiling [Lem](https://lem-project.github.io/) (a Common Lisp-based editor), I encountered a strange error message from [Bordeaux Threads](https://sionescu.github.io/bordeaux-threads/) (the de facto threading library for Common Lisp). The error breadcrumbs eventually led me to an inconvenient truth: [SBCL doesn't support multithreading on 32-bit ARM](http://www.sbcl.org/manual/index.html#Threading). Cue sad face emoji.

I tried installing CLISP, but the Debian build of CLISP also didn't appear to support threads. Same for ECL. I could maybe recompile one or both of those, but I haven't gone down that road because I suspect they will eventually be too slow (CLISP during execution and ECL during compilation).

# Or not?
Of course, I don't really *need* multithreading for some of my projects, so I didn't give up at this point. I happily solved a few [Project Euler](https://projecteuler.net/) problems using Common Lisp, in Emacs. I'll admit that the editor was a bit slow when running in X.org (with the [Ratpoison](https://www.nongnu.org/ratpoison/) window manager). Without X.org, editor performance was great, although that breaks some key combinations, has limited mouse support, and the font is frankly a bit too small on my monitor.

But I eventually ran into an insurmountable annoyance...

# So we meet again, modern web
**The modern web is just the worst**, and the most recent brick wall I slammed into is: captchas (specifically Project Euler's captcha, which requires JavaScript).

On my Pi, I generally try to stick to a terminal-mode browser like [w3m](https://w3m.sourceforge.net/) because it's fast and uses very little memory. If I need graphics, I move to [Dillo](https://dillo.org/) or [NetSurf](https://www.netsurf-browser.org/). If I need JavaScript, I use [Midori](https://astian.org/midori-browser/), but it is *painfully* slow on my Pi. And don't even ask about Firefox--it couldn't even load its own landing page on my Pi!

**Having to use a JavaScript-enabled browser on a woefully underpowered device just absolutely killed my enthusiasm for minimalist development**. Too many sites require JavaScript, and being effectively locked out of a large chunk of the web is too annoying for me at the moment.

Oh well, at least I tried.
