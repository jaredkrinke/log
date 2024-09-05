---
title: 11 programming languages in one week
description: I spent entirely too much time playing with (mostly) new programming languages this week.
date: 2024-03-31
keywords: [100-languages,webassembly,commodore-64]
---
I'm [trying to write code in 100 different programming languages](https://log.schemescape.com/posts/programming-languages/100-languages.html). I just finished week 2, and--somehow--I'm ahead of schedule.

The full list of languages and links to code are in my [100-languages](https://github.com/jaredkrinke/100-languages) repository.

# Summary
After two weeks of "staying on (or ahead of) schedule", I strongly suspect I will *not* be continuing at this current pace of writing code in at least one new language per day. It's fun and oddly addictive, but also fairly time-consuming. **If I don't slow down, I'll probably get burned out and abandon the project** (or need to become a hermit), so I'll likely slow *way* down for the next week.

# Languages
Here are the **languages that were new to me** at the beginning of the week that I managed to write code in:

* [COBOL-85](https://en.wikipedia.org/wiki/COBOL#COBOL-85)
* [WebGPU Shading Language](https://www.w3.org/TR/WGSL/) (which I'm still surprised to learn is "WebGPU *Shading* Language" and not "WebGPU *Shader* Language", in its official spec)
* [WebAssembly Text Format](https://webassembly.github.io/spec/core/text/index.html) (I had *seen* this before, but never *written* it)
* [Scratch](https://scratch.mit.edu/) (block-based)
* [Commodore Basic 2.0](https://en.wikipedia.org/wiki/Commodore_BASIC)
* [XOD](https://xod.io/) (flow-based)

And here are the **languages I'd used before** (mostly only used a little bit or a long time ago):

* [XSLT](https://www.w3.org/TR/xslt-10/)
* [Perl](https://www.perl.org/)
* [AWK](https://en.wikipedia.org/wiki/AWK) (not 100% sure if I've actually used this before, but it seems likely)
* [Verilog](https://en.wikipedia.org/wiki/Verilog)
* [EXA](https://www.zachtronics.com/exapunks/) (from a game by [Zachtronics](https://www.zachtronics.com/))

The rest of this post is just a collection of my notes from trying out these languages.

## XSLT (Extensible Stylesheet Language Transformations)
* I've probably written more XSLT than the vast majority of people, because I naively thought that HTML would be permanently recast into XML and XSLT would become the standard template language (that... didn't happen)
* Browsers still support XSLT, apparently!
* XPath is my favorite query language that many (most?) people don't seem to know about

## COBOL
* First time using a column-oriented language!
* It's not clear to me when periods (`.`) are required and when they break things
* GNU COBOL errors don't have enough information for me to understand them
* My solution takes forever to run in COBOL, as compared to JavaScript--not sure why
* Forgetting an `END-IF` just completely changed the meaning of my program, but didn't produce and errors or warnings
* So, so verbose
* Lots of reserved words
* I dislike the combination of natural language syntax (`ADD 1 TO N.`) and things like `77 TOTAL PIC S9(15) COMP VALUE ZERO.`

## Perl
* Kept getting tripped up by scalar vs. array contexts (even with prior experience)
* I don't recall the details, but there was a case where I ended up needing parentheses when I thought brackets would be correct
* "Here docs" are great!
* I dislike the anonymous function syntax, but I'm glad anonymous functions are supported

## WebGPU Shading Language
* Crashed my GPU several times while running code
* Lots of JavaScript required to setup computation and read back results
* The problem I attempted wasn't a good fit for parallel computation
* A different parallel-friendly problem I attempted required 64-bit arithmetic which apparently isn't supported in WGSL

## AWK
* Order of `for ... in` loop is unspecified
* Arrays of arrays are not officially supported
* Relies on mutation in `gsub()` -- I think I'd prefer a functional version of AWK

## WebAssembly (Text Format)
* Interesting syntax: it uses s-expressions, but you can also just write lines of assembly too
* I would have preferred labels instead of `BLOCK` and `LOOP`
* Resulting binary was tiny! Just 163 bytes!

## Scratch
* I would have enjoyed this as a kid

## Commodore BASIC
* All arithmetic is apparently floating point -- is it done in software? Because it's surprisingly slow
* Line numbers are annoying to deal with, but in the proper historical context they make sense because you entered one line at a time -- today, we're spoiled with text editors

## Verilog
* The [8bitworkshop Verilog IDE](https://8bitworkshop.com/v3.11.0/?platform=verilog&file=clock_divider.v) is amazing

## XOD
* Laying out all the components using my mouse was painfully tedious, but it resulted in [a nice diagram that makes it clear how the solution works](https://github.com/jaredkrinke/100-languages/blob/main/src/p18.png)

## EXA
* [Exapunks](http://www.zachtronics.com/exapunks/) is a great game
* You can use the T register for temporary storage
* You can use files for even more storage
* I still haven't found a great way to route messages between EXAs, other than only having 2 EXAs in a room
* I made a [tool for dumping TEC Redshift discs into a text format](../game-development/tec-redshift-dumper.md) (wait, that was in JavaScript--I used 12 languages this week!)
