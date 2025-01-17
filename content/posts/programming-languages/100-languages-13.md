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
* To my surprise, this is the first time I've heard of binary-coded decimals!
* Actually found a bug in [SIMH](https://github.com/simh/simh)
* Solution easily fits in the 256 bytes of a non-upgraded Altair 8800

## Janet
* Having non-list syntax was inconvenient when I wanted to splice into a struct literal
* Very impressive Clojure-like scripting language for less than 1 MB!

## Hazel
* Nice not having to worry about whitespace
* Very slow (50,000+ slower than a trivial native code solution), no random-access data structures
* Hard-coded 20-second time limit on evaluation -- I ended up modifying the time limit in the minified JavaScript source file, as a work around
* I like the mix of ML and C-style syntax

## Ada
* Seems like a lot of boilerplate, but that might be intentional
* I wasn't sure how big Ada.Containers.Count_Type could be and it turns out it's implementation defined -- not what I expected!
* Structure and syntax is similar to Pascal
* Can only have one top-level procedure per file?

## Shen
* Lots of details are in the "Shen Book", but it only seems to be available in a scanned, non-OCR'd JPEG format
* None of the implementations I tried seemed to  include the standard library...?
* Having Prolog embedded in a Lisp sounded great, but I found it awkward to use since it's lacking Prolog's standard library
* I was skeptical of the lack of quote/quasiquote in a Lisp, but I didn't actually end up needing either of them!
* I feel like there are some intriguing ideas in Shen, but overall I found Shen somewhat impenetrable

## Kitten
* I liked the idea of a simple, functional, statically typed concatenative language
* Switching between Forth-style syntax and C (or Python) syntax feels odd (and I don't like all the commas)
* Seemed to use a lot of memory
* Logical `&&` and `||` have no special meaning, so short-circuiting is implemented using (explicit) anonymous functions
* Fun to play with!

## LO
* Dislike `0 as i32` for a signed integer type zero (but I discovered that `+0` is equivalent)
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
* Confirmed the `multicore` build ran twice as fast on my dual-core laptop!

## Lobster
* Easy to write code, thanks to simple and terse syntax
* Couldn't get "exceptions" working -- never figured out why
* Didn't have to specify any types, which was convenient
* I was excited to see how fast a static, compiled solution was, but for some reason it was slower than Python
* Overall, it felt a bit like Nim

## Dylan
* Building a "hello world" program the first time took minutes and required creating multiple text files
* Multiple dispatch, macros, etc. make this feel like Common Lisp, but with conventional syntax -- I'm surprised Dylan wasn't more popular, honestly!

## Quackery
* Ancillary stacks are a nice addition to stack-based languages
* Feels like a cross between Forth and Lisp, but with arrays instead of lists
* Quackery doesn't have variables... but I kind of wish it did
* The foreword from The Book of Quackery was a fun read
