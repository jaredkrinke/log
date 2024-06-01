---
title: Celebrating International Amiga Day with Project Euler
description: "Programming on the ultimate retro-futuristic computer: the Amiga 500."
date: 2024-05-31
keywords: [100-languages,programming-languages]
---
Today is **[International Amiga Day](https://www.lemonamiga.com/forum/viewtopic.php?f=9&t=11833)**, when retrocomputing enthusiasts are required to boot up the [fanciest multimedia computer line to ever fail](https://en.wikipedia.org/wiki/Amiga). I'm not really qualified to comment on the Amiga since the closest thing I'd used until recently was a [Commodore 64](https://en.wikipedia.org/wiki/Commodore_64), but I won't let such a trivial matter as *not being qualified* stop me from spewing uninformed opinions.

# Amiga
**I recently acquired an Amiga 500 and I've been having some (mostly Type II) fun retrocomputing on it**. For a platform that launched in the US around the same time as the original Nintendo Entertainment System, the Amiga is impressive! N.B. The Amiga *platform* launched with the Amiga 1000, but I'm using a later *model*--the Amiga 500.

Unlike the earlier Commodore 64, the Amiga shipped with a bridge to the future: an [RS-232 serial port](https://en.wikipedia.org/wiki/RS-232). This enables:

* Copying small files to/from a serial port-equipped modern computer (cf. [lrzsz](https://ohse.de/uwe/software/lrzsz.html))
* Dialing into Internet-based [BBSes](https://en.wikipedia.org/wiki/Bulletin_board_system), using a modem emulator (cf. [tcpser](https://github.com/go4retro/tcpser))
* Controlling terminal-mode programs on Linux/BSD-based computers

**With a hard drive, I could theoretically even get on the web**. Unfortunately, my Amiga 500 only has 1 MB of RAM and no hard drive, so I haven't gotten beyond single-floppy programs/games yet.

## Amiga Basic
But, of course, the most urgent task on my plate is to add another programming language to [the pile](../100-languages/index.html), and this brings me to **[Amiga Basic](https://en.wikipedia.org/wiki/Amiga_Basic)**.

Amiga Basic is included on the "extras" disk of Workbench 1.3 (which came with my A500). Similar to Commodore BASIC, it was written by Microsoft and, also similarly, I didn't enjoy it. Here are my notes:

* There aren't functions (other than single-line `DEF FN` statements which... didn't work)
* It supports 32-bit arithmetic... except for `MOD` (ask me how I know)
* The environment is impressively small at 80 KB
* The [Amiga Basic manual ](https://archive.org/details/Amiga_BASIC_1985_Commodore) feels very dated--it spends a lot of time discussing UI that feels obvious to modern users, then moves onto "advanced topics", and only covers everything else in a reference section
* Thankfully, line numbers aren't required (as in Commodore BASIC)
* The UI was fairly slow
* The interpreter is annoyingly slow

Overall, I liked the older BBC BASIC better. **And Turbo Pascal beats all BASICs handily!**

## Looking forward
I'm not precisely sure how much time (and money) I'll spend investigating the Amiga, but I would really like to get a hard drive so that I sample the true Amiga *computer* experience (instead of the game console-esque experience I've had thus far).

If you have any pointers to Amiga resources (or any advice on what to do with an A500), [send me a mail](mailto:log@schemescape.com). Thanks!
