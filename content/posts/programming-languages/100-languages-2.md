---
title: Using SectorLISP for Project Euler
description: Four days later, I've complete day two of my challenge.
date: 2024-03-20
keywords: [100-languages,lisp]
---
I'm [trying to write code in 100 different programming languages](https://log.schemescape.com/posts/programming-languages/100-languages.html). Day (ahem) 2: **SectorLISP**!

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

Having said that, there was one unpleasant surprise: because SectorLISP was designed to run on ancient hardware, **it has a miniscule memory budget**. There is only space for (I think) *at most* 8,192 cons cells. Without tail call optimization and iteration, several of my attempts at printing decimal numbers ran out of memory.

**In the end, I punted on printing in decimal** and decided to print out the result in hexadecimal (which is easily computed from my "list of binary bits" integer representation). I am a miserable failure! But I need to move on.

## Links
* [Solution](https://github.com/jaredkrinke/100-languages/blob/main/p2.lisp) (tested using the simulator on the [SectorLISP v2 page](https://justine.lol/sectorlisp2/))