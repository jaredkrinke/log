---
title: New year, new programming languages
description: I finished my dumb project.
date: 2025-01-16
keywords: [100-languages]
---
I just finished [solving the first 100 Project Euler problems using 100 different programming languages](100-languages.md). For reference: [here is all the code](https://github.com/jaredkrinke/100-languages).

**I'm planning to write up a summary post at some point**, but this is just my last throwaway post with brief notes on the languages I've tried since [the last update](100-languages-13.md). Rye and Nelua were the stars of this round.

# Notes
## ATS
* I didn't understand some of the syntax, e.g. `:<cloref1>` and `t@ype`
* Error messages were sometimes surprising, e.g. `the syntactic entity [impqi0de] is needed.` -- what is `[impqi0de]`???
* Another example: copy-pasting `fn square (x: double): double = x * x` from the official documentation yields `error: ‘PMVtmpltcstmat’ undeclared (first use in this function)` -- solutiong was to put `#include "share/atspre_staload.hats"` at the top of the file (my mistake--but the error was unhelpful)
* I didn't attempt to include any proofs in my code, so I didn't really leverage ATS to its fullest (or, really, any) extent

## Pre-Scheme
* Using the built-in `errors` enum resulted in compilation errors
* Static typing in Scheme is awkward because I couldn't find a clean way to not return anything
* Couldn't find an example of asserting types
* Unstripped solution binary was ~50 KB (C is great!)
* Didn't actually bother deallocating memory (C is great!)

## Common Lisp
* Interactive development is helpful (and fun)
* So many cryptic/inconsistent names, e.g. `fmakunbound`, `mapcon`, `clrhash`, `prin1`
* `=` vs. `equalp` vs. `equal` vs. `eql` vs. `eq`
* SBCL is fast, but a trivial stand-alone binary can be big and uses more memory than I would like
* Common Lisp isn't as elegant as Scheme, but the implementations are more mutually compatible than in the Scheme world

## Mouse-83
* Finally, a programming language with less syntax than Forth!
* Single-letter variables names make it hard to convey their meaning
* Overall, if I wanted a language that was easy to implement, I'd probably opt for Forth, Pascal, or Lisp -- a small increase in complexity is worth unlocking greater readability (easy to say in 2025, I know)

## Cyber
* Once mature, this could be a fast Lua replacement with more Python-like syntax (and zero-based indexing!)

## Varyx
* `while` loop only works if there's a blank line before it
* Arrays appear to be lists under the hood, with slow (O(n)) access

## Rye
* Very compact code
* Surprisingly fast

## Rexx
* Logical operator for "exclusive or" is unfortunately the same as C's "logical and": `&&`
* And `%` is integer division, with `//` being remainder (the opposite of what I've seen elsewhere)

## Nelua
* Always nice to see my code compile down to < 100 KB executables!
* It's like a smaller Nim, but using Lua syntax
* Mostly "just worked" for me -- very easy to pick up
