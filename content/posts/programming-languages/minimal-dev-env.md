---
title: In search of a minimal development environment
description: What would a minimal development environment look like? How small could it be?
date: 2023-02-11
keywords: [minimalism]
---
Feel free to [skip over the obligatory whining about today's bloat](#the-plan).

# Back in my day...
I think the first computer I ever used was a [Commodore 64](https://en.wikipedia.org/wiki/Commodore_64). Wikipedia tells me that it had a 1 MHz processor and 64 KB of RAM, all packed into an "obese keyboard" form factor. Despite being 100,000+ times slower (with a similar fraction of memory) compared to a modern computer, it could run a word processor, play games, and print documents.

Later on, I remember installing Linux on a 1.44 MB floppy disk to turn an aging 486 computer into a network router. Even back then, that was impressive!

A few years later, I remember working on a simple arcade game which used OpenGL for graphics... developed partly on a computer that was command line-only! I have fond memories of using [GNU Screen](https://www.gnu.org/software/screen/) and [Vim](https://www.vim.org/), along with [man pages](https://en.wikipedia.org/wiki/Man_page), to write the code. Aside: I remember using [CVS](https://en.wikipedia.org/wiki/Concurrent_Versions_System), but *not* fondly.

# Contrast with today
Fast-forward to 2023, and I've been contemplating porting my [single-instruction programming game](../game-development/sic-1.md) to [Electron](https://www.electronjs.org/) (possibly the heaviest popular app framework of all time), to support Linux (and ideally macOS) builds on Steam.

For the record, SIC-1 started out as a trim 25 KB zip file (although it has ballooned to 10 MB, mostly due to [PCM](https://en.wikipedia.org/wiki/Pulse-code_modulation) music). Browsers provide a deceptive environment. With a few kilobytes of HTML, CSS, and JavaScript, you can build surprisingly complex (and fast) apps. Of course, the browser itself is hundreds of megabytes, so it's actually a pretty hefty runtime. How hefty? Ask me after I use Electron.

Is it any surprise I'm craving a bit of simplicity?

# The plan
So what am I going to do about bloat?

This is probably a terrible idea, but I'd like to set up a minimal development environment. And I really do mean "minimal", i.e.:

* Command line only
* Runs acceptably on a slow computer (possibly a [Raspberry Pi](https://en.wikipedia.org/wiki/Raspberry_Pi) 1)
* Minimal disk footprint
* As full-featured as possible, given the previous constraints

Of course, "minimal disk footprint" and "as full-featured as possible" are opposing goals, so this plan isn't well-defined--I'm content to just see where it leads me.

# The software
I suspect the following software will play a part:

* [Alpine Linux](https://www.alpinelinux.org/) or a minimal [Debian](https://www.debian.org/) installation (or [FreeBSD](https://www.freebsd.org/)? [MINIX 3](https://minix3.org/)? I'm open to suggestions)
* Vim (or [NeoVim](https://neovim.io/)?)
* GNU Screen (or [tmux](https://github.com/tmux/tmux)?)
* A terminal mode web browser ([Lynx](https://lynx.browser.org/)?)
* Maybe a terminal mode [RSS](https://en.wikipedia.org/wiki/RSS) reader or [Mastodon](https://mastodon.social/) client, just for fun

# The programming language
You may note that I didn't specify any compilers or build tools. That's because I'd like to use this minimal environment to test out some of my [future-proof programming language candidates](../programming-languages/future-proof-languages.md).

I'll admit that it's unreasonable to expect modern programming languages to support development on a Raspberry Pi, but that also means that I'll be *unreasonably impressed* if a programming language is useful in a ridiculously constrained environment like this.

# Wrapping up
Feel free to let me know if you have any suggestions or if you've attempted anything similar (or want to!). You can email me at any address at the ".com" address in the address bar.

Wish me luck!
