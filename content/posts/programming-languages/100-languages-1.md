---
title: 100 programming languages, day 1
description: "Up first: SIC-1 Assembly Language."
date: 2024-03-16
keywords: [100-languages,sic1]
---
I'm [trying to write code in 100 different programming languages](https://log.schemescape.com/posts/programming-languages/100-languages.html). Note: I'm not necessarily planning on blogging about each programming language, but I *will* try to collect (and share) notes about my experiences, likely in batches.

# SIC-1 Assembly Language
In order to ensure progress doesn't fizzle out immediately, I'm starting with a programming language I know well: **[SIC-1 Assembly Language](https://esolangs.org/wiki/SIC-1_Assembly_Language)**. I'm familiar with this language because I designed both it and the (fictional) 8-bit SIC-1 computer it runs on myself (for a game titled, fittingly, [SIC-1](https://store.steampowered.com/app/2124440/SIC1/)). **SIC-1 Assembly Language is basically my take on a usable (though somewhat un-ergonomic) [subleq](https://esolangs.org/wiki/Subleq) assembly language**.

I'm mildly familiar with assembly languages, and have written assembly code for MIPS and ATmega (non-professionally), but **most code I write is not performance-sensitive, so I prefer to use more expressive languages**, despite any potential overhead.

## Notes
* Subleq is inconvenient, but straight-forward, however **the SIC-1 is an 8-bit computer with only a single 256 byte address space**, yielding space for less than 85 instructions, even before adding in any variables
* Fitting "big int" arithmetic, formatting, and the actual logic into roughly 70 "subtract and maybe branch" instructions" required some creativity
* The tedium of subleq and my lack of focus led to several bugs, so I had to add a lot of comments to ensure I could remember what all those subleqs were for
* I had to invent a subroutine calling convention in order to make my solution "fit"

Overall, **subleq is interesting theoretically** (but not *practically*), and, while **the tight constraints of the SIC-1 give me an appreciation for assembly language hacks of yore**, I'd never want to use subleq for anything substantial (though I've heard [it's been done](http://users.atw.hu/gerigeri/DawnOS/index.html)!).

## Links
* [Main GitHub repository where I'm tracking progress](https://github.com/jaredkrinke/100-languages)
* [Solution](https://github.com/jaredkrinke/100-languages/blob/main/src/p1.sic1)