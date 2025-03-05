---
title: Farewell to a netbook
description: Remembering a forgotten device class that actually aligned with my needs.
date: 2025-03-04
keywords: [netbooks]
---
Today, I bid farewell to my [Dell Inspiron Mini 1018](https://en.wikipedia.org/wiki/Dell_Inspiron_Mini_Series#Dell_Inspiron_Mini_(1018)).

# Netbooks
[Netbooks enjoyed a meteoric rise and fall](https://hackaday.com/2020/06/04/netbooks-the-form-factor-time-forgot/) in the late 2000s and early 2010s. Basically, they were minimally viable laptops that were maximally affordable. For anyone who wanted a cheapo laptop, they were great! Sure, they were slow, and cramped, and slow. But they were cheap!

Actually, that's not fair. Netbooks were slower than their contemporaries, but anything clocked over 1 GHz isn't "slow". That still should be enough for most reasonable workloads, if not for bloat. But I digress.

# Personal history
I don't specifically recall when I picked up my netbook, but it was probably in 2010 or 2011. It came with a 1.66 GHz Intel Atom N455 processor, 1 GB of DDR3 RAM, and a spinning hard drive.

It came preloaded with Windows 7 Starter, which ran... adequately. I used the netbook on the couch and it was pleasant. Just imagine a clunky tablet with a keyboard and no touchscreen.

Then at some point, I realized that I didn't really need a laptop, so I loaned it to someone else for work.

## End of life
Later, I recovered the device and I updated the operating system to Windows 10. Big mistake. Windows 10 performance on this device was abysmal. It took nearly one full minute to open a web browser. It turns out that a 1 GB of RAM is woefully insufficient for Windows 10. Instead of being pleasant, the device became frustrating. Oh well, I still didn't *really* need a laptop, so I stuck it in a closet and forgot about it.

That could have been the end.

## Rebirth
Eventually, 2023 rolled around, and [I was pining for simpler times](../programming-languages/minimal-dev-env.md). Why do we keep buying faster computers that mostly perform the same functions as their ancestors? (This was before Windows 11's TPM 2.0 requirement.) After experimenting with an original Raspberry Pi B (now *those* are slow!) I pulled the netbook back out of my closet and [set it up as a minimal development environment](../programming-languages/minimal-dev-env-4.md).

Unlike Windows 10, Linux scales down fairly nicely to moderately old hardware. Using Alpine Linux, I was able to setup a comfortable terminal-only development environment for C. Using the w3m browser, I was able to read [Practical Common Lisp](https://gigamonkeys.com/book/) so that I could [test out REPL-driven programming in Lisp](../programming-languages/learning-lisp-in-2023.md). Almost all Common Lisp code I've ever written was authored in Emacs on this junky old netbook--and it never felt slow!

## The Net
Unfortunately, 1 GB of RAM isn't sufficient for browsing many modern web sites. As much as I enjoy terminal mode browsers, having proportional fonts, colors, and a mouse are convenient. Dillo and NetSurf can help, but many sites require JavaScript, and sandboxing the enormous JavaScript runtime is just no longer possible on a 1 GB device.

Despite being *built* to "surf the net", most netbooks can't keep up with the modern web. I'm not happy about this realization, but that doesn't make it any less true.

## Last gasp
If there's one saving grace, it's that many netbooks were built with commodity parts that could theoretically be upgraded. In fact, my netbook could accept a solid-state drive and probably at least 4 GB of RAM. In my case, the hard drive and (single) RAM slot could be accessed by removing the plastic shell and the keyboard. Unfortunately, I learned that my particular netbook has a fickle memory slot: it will only accept "full power" DDR3 RAM--multiple "low power" RAM sticks I plugged in failed to work.

Sadly, numerous trial-and-error RAM surgeries appear to have loosened the keyboard's ribbon connection to the point that it seems unstable. It's a sad day, but I need to lay this netbook to rest.

# The future
Are my netbook days over? Maybe not! At some unknown point in the past, I had acquired a second netbook: an [Asus EeeBook X205](https://en.wikipedia.org/wiki/Asus_EeeBook). It's not upgradable, but it's already equipped with 2 GB of RAM. I'm sure the puny 32 GB hard drive will become a problem at some point, but I'm going to throw Linux on and see what happens--it's not like there's enough space to install Windows 10 updates anyway!

So there you go: my personal netbook history.
