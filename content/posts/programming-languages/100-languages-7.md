---
title: One third of the way to 100 programming languages
description: "Or: A tour of the syntax continuum."
date: 2024-04-28
keywords: [100-languages]
---
I'm *still* trying to [write code in 100 different programming languages](https://log.schemescape.com/posts/programming-languages/100-languages.html). My progress is being recorded in [this repository](https://github.com/jaredkrinke/100-languages). I'm roughly one third of the way to 100 languages already!

In this update, I explored stack-based languages and (unintentionally) **traveled the programming language syntax continuum, from (almost) no syntax to (almost) *only* syntax**.

# Weeks 4 and 5
Given my previous struggles with Forth-like stack-based languages, I decided to focus on stack-based and/or concatenative languages.

## RetroForth
RetroForth bills itself as a "modern, pragmatic Forth", and I agree with that description. It adds one-character "sigils" to distinguish numbers, strings, definitions, comments, etc. These sigils allegedly simplify the interpreter, and I think this one extra bit of syntax is helpful.

Overall, I enjoyed Retro's take on Forth, and I finally felt like I was making progress on creating simpler, more idiomatic Forth code.

Notes:

* Got in infinite loops several times
* Fatal errors are just numbers and I don't know where to look them up

## Uxntal
Ever since reading about [uxn](https://100r.co/site/uxn.html), I'd wanted to see what a simple VM that runs on an NES could look like. After digging in a bit more, I learned that uxn was inspired by Forth--that got my attention!

After writing some code in uxn's assembly language (tal), I'll say that I mostly like uxn (the virtual machine), but... I struggled with tal.

Notes:

* Numbers *must* be written in lowercase hexadecimal (decimal not supported)
* Instructions can set a "keep" bit that causes inputs to remain on the stack
* The instruction set doesn't include modulus/remainder
* Supports both global and local labels, which is convenient
* Instructions must be UPPERCASE (except for flags), but hexadecimal must be lowercase
* **Names like `b1` aren't allowed** because they're actually hexadecimal numbers...
* Mixing 8-bit and 16-bit values on the stack is tricky
* Must specify `&` on relative references, but not `@` on global references...
* Pro tip: don't DUP relative addresses!

## APL
After playing with J and K (although I couldn't actually find an official implementation of K5), it was time to play with their spiritual predecessor, APL.

With J, I felt like I was re-learning Perl-compatible regular expressions, but with a much larger menu of ASCII sigils. APL is the same, **except I can't type (and don't even know the names of) the sigils**.

## Factor
**Factor is the niftiest concatenative language I've tried**.

Intriguingly, it borrows heavily from Common Lisp (e.g. restarts, editor integration, multiple dispatch, image-based development). I'd even go as far to say that, in my limited experience, **Factor feels like a concatenative expression of Common Lisp**.

* Common Lisp-like restarts!
* [This Factor tutorial](https://andreaferretti.github.io/factor-tutorial/) is a great introduction--not just to Forth, but to concatenative languages in general
* Factor's compiler validates documented stack effects
* Factor supports editor integration, e.g. "go to definition"
* Can save images, refresh files from disk, etc.
* Built-in help
* Support for local variables, using `::`

## Rebol
**Rebol is a minimal, but impressively capable scripting language**. The entire language, including GUI support is well under 1 MB. How did I not run across Rebol when I was [looking for a minimal development environment](minimal-dev-env-5.md)!? I only scratched the surface of Rebol, but it felt like exactly what I was looking for.

Having said that, I'm uncertain about the future of Rebol--it doesn't appear to fully support 64-bit architectures.

Notes:

* Entire language is 440 KB!
* Used the console version
* Variables in functions don't default to locals?

## Bash
I've successfully been avoiding writing Bash recently, but I thought it might be fun to see what math looks like in Bash.

Notes:

* Unpleasant syntax (double parentheses, double brackets)
* Little inconsistencies, e.g. `fi` vs `done`
* Lots of symbols to remember: `#`, `@`, `/`
* But *very* widely deployed!

## Julia
From my uninformed perspective, Julia looks like a great language for academics.

Notes:

* Excellent documentation!
* Base runtime includes a constant indicating the precision of floating points numbers!
* Has a REPL, but I didn't use it
* Built-in rational type!
* My solution is horrible and didn't take advantage of any of Julia's nice features...
