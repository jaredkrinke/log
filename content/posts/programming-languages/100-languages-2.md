---
title: Using SectorLISP for Project Euler
description: Four days later, I've completed day two of my challenge.
date: 2024-03-20
keywords: [100-languages,lisp]
---
I'm [trying to write code in 100 different programming languages](100-languages.md). Day (ahem) 2: **SectorLISP**!

# SectorLISP
Ever since discovering [SectorLISP](https://justine.lol/sectorlisp2/) (a minimal Lisp that fits in a boot sector), I've wanted to give it a spin. And it did not disappoint! It was both beautiful and painful.

## Notes
Things I missed while using SectorLISP:

* Tail call optimization
* Mutation
* Integers
* Iteration
* [`LET`](https://www.lispworks.com/documentation/lw60/CLHS/Body/s_let_l.htm)

Mercifully, I was using the "friendly" branch of SectorLISP, which at least included an obvious and idiomatic way to implement recursion via `DEFINE`.

Now, obviously, **the list above is not meant as a complaint**. SectorLISP is a *minimal* Lisp, so I was expecting for it to support only the bare minimum. **Rolling your own integer representation and using recursion for iteration are part of the fun!**

Having said that, there was one unpleasant surprise: because SectorLISP was designed to run on ancient hardware, **it has a miniscule memory budget** (correction: the PC BIOS *always* starts executing the boot sector in 16-bit mode, so this limit is "natural"). There is only space for (I think) *at most* 8,192 cons cells. Without tail call optimization and iteration, several of my attempts at printing decimal numbers ran out of memory.

It took several attempts, but I eventually found that using unary encoding for numbers (i.e. "n" is encoded as a list of length "n"; for example `(QUOTE (T T T))` is the number 3) resulted in the simplest code with the least consing--but only when the numbers are small! For larger numbers, I saved space using 32-bit binary (two's complement) with the least significant bit first.

## Links
* [Solution](https://github.com/jaredkrinke/100-languages/blob/main/src/p2.lisp) (tested using the simulator on the [SectorLISP v2 page](https://justine.lol/sectorlisp2/))