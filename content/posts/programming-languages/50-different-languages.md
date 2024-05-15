---
title: Reflections at 50 (programming languages)
description: Find out if writing code in 50 different programming languages was a good idea!
date: 2024-05-14
keywords: [100-languages]
---
Over the past two months, I've [written code in 50 different programming languages](../100-languages/index.html) (with an eventual goal to [get to 100](100-languages.md)). Here are my thoughts thus far.

# Overview
I started this journey because I wanted to **try new programming languages** in a low-stakes setting. Rather than learn a language in depth, I'm just writing a page of code, **to see what either the programming paradigm or development experience is like**. Since I'm focused on new (to me) languages/paradigms, the majority of the languages aren't even in the top 100 programming languages in the [TIOBE Programming Community index](https://www.tiobe.com/tiobe-index/). I'm definitely *not* trying to improve my job prospects!

## Positives
Overall, this experiment has been a success. Prior to starting, I thought I'd *already* used a wide variety of programming languages, but **I'd never *actually used* an array-based language, and I didn't even know what concatenative languages were** (thought I'd briefly heard of Forth)! I'd also never experienced column- or line-based input or written right-to-left text.

**If you've got the time and desire novel programming experiences, this is a worthwhile journey!**

## Negatives
The last sentence implied it, but **repeatedly starting over from scratch--often in new paradigms--takes time**. I'd say that on average I spent *at least* two or three hours with each language--and often more. Frequently, it was worthwhile, but stumbling through Smalltalk-like UI and syntax felt more tedious than educational, for example.

It's not obvious, but **I also spent a fair amount of time discovering, selecting, and occasionally shelving languages**.

## The road ahead
Additionally, now that I'm 50 languages in, **the novelty is wearing off a bit**. This is welcome, in that the learning process is less taxing, but I'll need to ensure this doesn't just become a slog to 100. If I stop learning and/or enjoying the process, I should quit. **Fifty programming languages is no small feat**, anyway--though I'll feel a bit silly having a repository named "100-languages" if I never quite get there.

Tangentially related: I feel like **there is a distinct possibility that I will end up creating a new programming language** either during or after this exercise. The world definitely needs another Lisp (or maybe Forth)!

## Languages by category
For the record, here is a rough categorization of the languages I've used so far (with categories based mostly on [this article](https://madhadron.com/programming/seven_ur_languages.html)). Note these classifications are subjective!

* **Assembly**: WebAssembly, x86 ("real"/16-bit), Uxntal
* **Imperative**: Fortran, COBOL, Perl, WebGPU Shading Language, Awk, Commodore BASIC, BBC BASIC, TCL, Bash, Turbo Pascal, Hare, wax, Nim
* **Homoiconic**: SectorLISP, fe, Rebol, Boron, Cakelisp
* **Functional**: Standard ML, Unison, Julia, Pkl, Roc, Haskell, Idris, F#
* **Object-oriented**: Squeak, Wren, Self
* **Concatenative**: Gforth, PostScript, RetroForth, Uxntal, Factor, Min
* **Array-based**: J, Lil, APL
* **Declarative**: SQL, XSLT, Verilog
* **Block/flow-based**: Scratch, XOD
* **Esoteric**: SIC-1 Assembly Language, EXA, Piet, قلب (Qalb), 文言 (wenyan)

Excluding intentionally esoteric ones, **the most mind-bending for me have been concatenative and array-based languages**, probably due to my inexperience with them. Dependently-typed languages would probably have been mind-bending if I'd spent more time and actually learned them.

# Programming language observations
Being a newbie nearly 50 times in quick succession theoretically gives me a unique perspective on programming languages. Here are a few observations.

## Ramping up
Overall, for me as an experienced programmer, **the most helpful thing for ramping up has been, unsurprisingly, quality documentation**. Specifically: having **searchable documentation that is clearly organized, using familiar language** (e.g. outlining basic syntax, enumerating control flow options, and diligently documenting the standard library).

The languages I struggled most with seemed to focus their documentation too much on tutorials and examples (usually unrelated to what I wanted to do--which is fair) or they used long-winded prose. In one case, the "hello world" example contained a URL that wasn't even explained--that just made me more confused, rather than less. Thankfully, none of the languages tried to rely on videos or chat apps for "documentation"!

## No one cares about footprint
It's disheartening, but most programming languages don't seem to care about the disk/memory footprints of their environments or, often, their resulting binaries. I don't enjoy slow software, but, these days, **my old computers are more impacted by bloat than sluggishness**.

Hare and Rebol are nice counterexamples, and embeddable scripting languages are also usually pretty light. And let's not forget the old, but [famously lightweight Turbo Pascal environment](https://prog21.dadgum.com/116.html)!

## So, so many languages
Despite my frequent complaints, the quality of virtually all languages I've tried is impressive--even the hobby languages are eminently usable! The amount of work involved is staggering.

**Perhaps people create new programming languages for the same reason they create art, i.e. because they can't *not* do it?**

# Parting thoughts
Now that I've sampled a lot of different programming languages, I'm more confident about matching problems to appropriate languages. In the recent past, I've tried to [find the one true language that I can use for everything](future-proof-languages.md), but that's honestly misguided--most of the time, at least--and especially for hobby projects in wildly different domains.

I guess the good news is that I've now convinced myself that **I could *probably* make do with *any* programming language, so maybe I can finally stop [bike-shedding](../misc/my-hobby-is-bikeshedding.md) [about](future-proof-languages.md) [programming](future-proof-languages-2.md) [languages](future-proof-languages-3.md)**.