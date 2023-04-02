---
title: Minimal dev environment, part 4
description: TODO
date: 2023-04-02
keywords: [minimalism]
draft: true
---
In [part 3](minimal-dev-env-3.md), I tried out a minimal development environment (based on Alpine Linux) on a Raspberry Pi 1 B. This update is essentially the conclusion of my Raspberry Pi experiment.

# Recap
Here's a summary of what I'd learned so far:

1. I love Alpine Linux--it honestly feels like the only sane way to manage a Linux distribution--because it's fast, light, and (mostly) only contains the tools you ask for
1. The Raspberry Pi 1 B is *very* slow--I was willing to accept that my JavaScript/Deno-based static site generator might be slow (I never really optimized it), but paging through code in Vim (in the terminal) is something I *need* to be fast, and my Pi-based setup failed at this
1. Browsing the modern web in a terminal is unpleasant

# Enter the GUI
To address the last point, I decided to see if I could get a lightweight GUI environment running on the Pi. I hadn't run a Linux desktop in over a decade, but I previously used [Fluxbox](http://fluxbox.org/) and later [GNOME](https://www.gnome.org/), so I'm not completely lost. The latter is a full desktop environment, and fairly heavy, so I decided to give Fluxbox a shot first (after reading up on how to run rootless X.org).

Getting X.org up and running with Fluxbox wasn't too difficult, and then I was able to use the [Dillo browser](https://www.dillo.org/) to improve my web browsing experience. Unfortunately, everything GUI-related was slow, especially moving windows around. Just in case I was missing some sort of hardware acceleration or something, I tested out the official Raspberry Pi OS. It was unbearably slow as well (and the build of Chromium appeared to be for ARMv7, which my Pi doesn't support).

# Goodbye, Pi
To be honest, it's impressive how much you can do with a 10+ year-old, less than $50 (originally) single-board computer (running at 3.5 Watts). I could run Linux, edit and compile C code, browse the web in a terminal, read RSS feeds, and even run Node/NPM. It seems perfect for running a low-traffic server at home (something I [don't need to do at the moment](../services/cheap-hosting.md)).

But the bottom line is that I want something faster.

There are newer Raspberry Pi models that should be *much* faster than my almost-original--and I'd like to try one out someday--but for now I'm proceeding with hardware that I already own. 

# Hello, netbook
Specifically, I'm upgrading to a 12 year-old Dell netbook (Inspiron Mini 1018) with a 1.66 GHz Intel Atom (N455) processor and 1 GB of RAM.

## Linux on a laptop... is pretty great!
As an aside, I'm compelled to comment on how much the laptop experience on Linux has improved since I last gave up (in the mid-00s). The sub-200 MB Alpine Linux installer *just worked*, even for Wi-Fi! Additionally, I discovered that, even though the netbook shipped with 32-bit Windows, its processor is actually 64-bit, so now I'm running an architecture that is *still relevant*. This is intriguing to me because Deno only supports 64-bit processors, and I assumed that the old hardware I had laying around couldn't run Deno.

Having said that, at one point I decided to see if Debian would work better than Alpine. The Debian installer worked great (it automatically supported wireless networking on my netbook), but after installation wireless stopped working. After a few hours of researching and trying to fix the problem, I reverted back to Alpine.

# Performance
Here's a quick performance comparison of building this site using [md2blog](https://jaredkrinke.github.io/md2blog/), on various JavaScript runtimes, between my Raspberry Pi 1 B and my Dell Inspiron Mini 1018:

| Build time by device | [leano](https://github.com/jaredkrinke/leano) | Node | Deno |
| --- | --- | --- | --- |
| Raspberry Pi | 4 minutes | 2 minutes | not possible |
| Netbook | 1 minute | 20 seconds | 12 seconds |

Note that I had to resort to using [Nix](https://github.com/NixOS/nix) to get Deno running because Deno depends on [glibc](https://www.gnu.org/software/libc/) and doesn't support [musl](https://musl.libc.org/) (the C standard library implementation that Alpine Linux uses).

Overall, this is a 4 - 6x performance improvement (on a machine that coincidentally cost 4 - 6 times as much as the Pi 1 B, originally).

# Battery life
My old setup chained me to my desk, but now I can take my laptop wherever. I don't really remember what the battery life was like originally (or on Windows), but I'm able to get 4 - 6 hours of intensive use. That is plenty for me at the moment, although it certainly doesn't seem like "good" battery life. I've also noticed that the (rotational) hard drive seems to spin up and down consistently ever 5 seconds, even when I'm not doing anything. I'm not sure if it's a hardware, driver, or Linux problem, but I'm just trying to ignore it for now. 

# Power consumption
One area where the Raspberry Pi B excelled was power consumption. At max capacity, I measured it at around 3.5 Watts.

TODO:
* Power consumption

