---
title: Yet more programming languages
description: Another throwaway post with brief notes about programming languages.
date: 2024-12-29
keywords: [100-languages,lisp]
---
I'm still [solving the first 100 Project Euler problems using 100 different programming languages](100-languages.md). For reference: [here is code for all my solutions so far](https://github.com/jaredkrinke/100-languages).

This is basically a throwaway post with brief notes on the languages I've tried since [the last update](100-languages-12.md).

# Notes
## Odin
* Standard library has a lot of depth
* Yet another capable C successor

## QBasic
* Honestly, the IDE and integrated help are pretty good!
* Have to use a `LONG` to get a 32-bit integer type
* Despite having written many QBasic programs in the 90s, this was the first time I used QBasic `FUNCTION`s

## Python
* Python has a standard library function that essentially solves Project Euler problem 80

## 8080 assembly (Altair 8800)
* First time I've heard of binary-coded decimals
* Took longer than expected because I hit a bug in [SIMH](https://github.com/simh/simh)
* Solution easily fits in the 256 bytes of a non-upgraded Altair 8800

## Janet
* Having non-list syntax was inconvenient when I wanted to splice into a struct literal
* Very impressive Clojure-like scripting language for less than 1 MB!

## Hazel
* Non-code documentation is hard to find
* Nice not having to worry about whitespace
* Annoyingly slow when typing
* It's nice to have contextual help/explanations for what you type it, but it's still not easy to figure out what to type in in the first place
* Very slow (50,000+ slower than a trivial native code solution), no random-access data structure
* Hard-coded 20-second time limit on evaluation (which is hard to avoid since it's so slow...) -- I ended up modifying the time limit in the minified JavaScript source file, as a work around
* I like the mix of ML and C-style syntax

## Ada
* Seems like a lot of boilerplate, but that might be intentional
* I wasn't sure how big Ada.Containers.Count_Type could be and it turns out it's implementation defined--this is surprising for a language that's supposed to be robust
* Structure and syntax is similar to Pascal
* Can only have one top-level procedure per file?

## Shen
* Lots of details are hidden away in the "Shen Book" -- it's available, but only in a scanned, non-OCR'd JPEG format
* None of the implementations I tried actually included the standard library
* For being portable, the main implementation seems to only target Windows
* Having Prolog embedded in a Lisp sounded great, but I found it awkward to use since it's lacking Prolog's most basic standard library functionality
* I was skeptical of the lack of quote/quasiquote in a Lisp, but I didn't actually end up needing either of them!
* I feel like there are some intriguing ideas in Shen, but overall I found Shen impenetrable

## Kitten
* I liked the idea of a simple, functional, statically typed concatenative language
* Switching between Forth-style syntax and C (or Python) syntax feels odd (and I don't like all the commas)
* Very, very slow to compile and run (N.B. a lot of the startup overhead appears to come from "The Haskell Stack")
* Can use absurd amounts of memory in some cases
* Logical `&&` and `||` have no special meaning, so short-circuiting is implemented using (explicit) anonymous functions
* Fun to play with!

## LO
* Dislike `0 as i32` for a signed integer type zero (but I discovered that `+0` is equivalent)
* Found some minor compiler bugs
* Vectors return pointers, so the underlying element can change!

## Bend
* Number types are only 24-bit (probably normal for GPU work, but pretty small for Project Euler!)
* Couldn't seem to run anything on a VM with < 8 GB of memory
* Have to be *very* careful about data types -- there is *no* type-checking at all!

## V
* Fast to compile and run
* Easy to pick up if you've used a C-like language

## Futhark
* Just by using `map`, I was able to get a parallel program with no extra effort
* Confirmed the `multicore` build ran twice as fast on my dual-core laptop

## Lobster
* Easy to write code, thanks to simple and terse syntax
* Couldn't get "exceptions" working at all
* Didn't have to specify any types, which was convenient
* I was excited to see how fast a static, compiled solution was, but... it ended up being slower than Python!
* (Obviously, running a little bit of math is not the intended use case for Lobster--transpiling to C++ might have sped things up, but I couldn't get that working)
* Overall, it felt a bit like Nim

## Dylan
* Developer experience with Open Dylan was not great...
* Hit tons of issues and warnings just trying to build and run a "hello world" program...
* Building a "hello world" program the first time took minutes and required creating multiple text files
* Multiple dispatch, macros, etc. make this feel like Common Lisp, but with conventional syntax -- I'm surprised Dylan wasn't more popular, honestly!

## Quackery
* Ancillary stacks are a nice addition to stack-based languages
* Feels like a cross between Forth and Lisp, but with arrays instead of lists
* Quackery doesn't have variables... but I kind of wish it did
* The foreword from The Book of Quackery was a fun read
