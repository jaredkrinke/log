---
title: In search of a minimal development environment, part 2
description: Some practical research into a minimal development environment.
date: 2023-02-26
keywords: [minimalism,linux,deno]
---
In [part 1](minimal-dev-env.md), I was yearning for simpler times, when entire operating systems could fit on a single digit number of 1.44 MB floppy disks.

What did my initial "minimal development environment" research uncover?

# Platforms
Although it's probably possible to run some useful software on a tiny or old platforms (e.g. a microcontroller or Game Boy), the smallest platform I seriously considered was a [Raspberry Pi](https://www.raspberrypi.com/) (for the simple reason that I inherited one and hadn't been using it). My Raspberry Pi is a model B with 512 MB of RAM, apparently from 2012.

# Operating systems
While investigating operating systems, I immediately had to confront the fact that I'm not looking for a *truly* minimal operating system. The following OSes intrigued me, but they're a little too restrictive/esoteric for my current goals:

* [Collapse OS](http://collapseos.org/) runs on Z80-based hardware with 64 KB or less of RAM
* [Dusk OS](https://sr.ht/~vdupras/duskos/) runs on x86 hardware, and can bootstrap itself into a [Forth](https://en.wikipedia.org/wiki/Forth_(programming_language))-based shell with an "Almost C" compiler in just a few thousand lines of code
* [Fiwix](https://www.fiwix.org/) uses a (relatively) small kernel (50k lines of code), but strives to be Linux-compatible
* [MINIX](https://minix3.org/) uses an educational kernel that has apparently made its way into Intel products, but the project is [no longer maintained](https://github.com/o-oconnell/minixfromscratch)

In the end, I decided to focus on more popular platforms: Linux, FreeBSD, OpenBSD, and NetBSD. (Although I'd really like to explore Dusk OS in the future.)

To my surprise, it looked like the smallest full-featured option (in terms of disk footprint, and ignoring "nano" installs that lack functionality) was probably [Alpine Linux](https://www.alpinelinux.org/). A command-line only development environment on Debian weighed in at over 1.5 GB (!), but I was able to set up a somewhat comfortable C development environment on Alpine Linux in under 300 MB! (Although [installing Alpine Linux on a Raspberry Pi](https://wiki.alpinelinux.org/wiki/Raspberry_Pi) is tedious.)

I'm a little nervous to adopt Alpine Linux without haven't a good grasp of how updates (especially kernel updates) work, but so far it just feels like exactly what I was looking for.

# Software
With a minimal Alpine Linux install on a Raspberry Pi model B, I investigated various console applications.

## Web browser
There are a lot of console web browser options today. I tried: [Lynx](https://lynx.browser.org/), [ELinks](http://elinks.or.cz/), [w3m](https://w3m.sourceforge.net/), and a few that I don't remember. In the past, I used ELinks because it seemed to have the most functionality, but as of today, my favorite is w3m. I liked its rendering the best, and it's comfortable to use from the keyboard, thanks to vi-inspired key bindings. I will say that w3m has a steep learning curve (there aren't any user-friendly menus, at least that I found), so it might not be a great choice for everyone.

For the record: Lynx was oddly slow and ELinks's menus seemed a little glitchy.

Unfortunately, using the modern web from the console is not a pleasant experience. I ran into sites with huge navigation lists that I'd have to page through, sites that require JavaScript to render anything, etc. 

## Terminal multiplexer
I realize that [tmux](https://github.com/tmux/tmux/wiki) has a lot of momentum, but I've been using [GNU Screen](https://www.gnu.org/software/screen/) because I'm already familiar with it. tmux *does* seem to have some nice features (e.g. retaining panes across detach/reattach), so it's probably what I'd use today if I was starting from scratch.

There's also [Zellij](https://zellij.dev/), which has some interesting ideas (namely floating windows), wrapped up in what appears to be a user-friendly interface. I haven't tried it yet, however.

## RSS reader
One motivation for setting up a simpler development environment is to slow down and reduce distractions. With some freed up "focus" time, I'd like to get back to using RSS feeds to keep up to date on blogs I enjoy. [Newsboat](https://newsboat.org/) is an excellent console RSS reader.

## IRC
And why stop at RSS? Let's go all the way back to 1988 and use [IRC](https://en.wikipedia.org/wiki/Internet_Relay_Chat)! I don't like how [Discord](https://discord.com/) has monopolized chat-based communities, but IRC is fairly tedious to set up, and the command-based interface is unfriendly (the last thing I want to do is embarrass myself by mistyping a command and having everyone see it as a chat message!).

I have [irssi](https://irssi.org/) installed, but I haven't really used it enough to say whether this is a good choice for IRC (or if IRC is even a good choice at all).

## Code editor
I haven't investigated editor options in depth yet. The main features I'm looking for are:

* Runs in console mode
* Comfortable editing
* Helpful syntax highlighting
* Language-specific features (from most important to least):
  * Auto-complete/lookup
  * Go to definition
  * Find all references
  * Rename/refactor

Right now, I'm using [Vim](https://www.vim.org/), with nothing but default syntax highlighting and "Ctrl+N" as a minimal auto-complete. This was great in the 90s, but I'm more productive with advanced language features.

Here are a few options I'm planning to investigate:

* Vim with [Ctags](https://en.wikipedia.org/wiki/Ctags) (ideally automated)
* Vim/[NeoVim](https://neovim.io/) with an actual [language server](https://microsoft.github.io/language-server-protocol/)
* [Helix](https://helix-editor.com/)
* [Kakoune](https://kakoune.org/)
* and maybe even [Emacs](https://www.gnu.org/software/emacs/)

# But... am I making a mistake?
After a couple of days using this setup, I'm already starting to question my decision to use the console.

## Console web experience isn't great
The biggest issue is that the web is really hard to use from a terminal. It's difficult to quickly scan headings and identify distinct content areas using only text (specifically: text that wasn't designed to be used from the console). I guess I didn't realize how helpful subtle font size/color changes are for quickly scanning content.

## Sometimes the mouse is handy
Then there's mouse support. I use the keyboard extensively, but the mouse is sometimes faster for selecting text and interacting with UI elements that aren't in a simple order/hierarchy. [GPM](https://man.archlinux.org/man/gpm.8.en.html) helps, but it's kind of clunky, and doesn't help when I need to scroll text while using the mouse.

## Lack of consistency
Finally, there is very little user interface consistency between most console tools. Many include vi-like key bindings (either by default or with customizations), but that's often where the consistency ends. I guess I didn't realize how much I'd come to rely on standard GUI elements like menus, tooltips, and buttons. I *do* think that a searchable "command palette" would go a long way toward making console tools easier to use, but I'm not planning on implementing those myself. Using Emacs for everything might help with consistency, but I'm skeptical of the performance and robustness of huge pile of Emacs extensions.

# To be continued...
Next up, I'm planning to document my misadventures in getting [md2blog](https://jaredkrinke.github.io/md2blog/) (my [Deno](https://deno.land/)-based static site generator) running on a Raspberry Pi B (a platform that Deno doesn't support).
