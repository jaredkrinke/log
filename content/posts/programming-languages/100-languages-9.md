---
title: 50 programming languages in 58 days
description: Here are my notes about a grab bag of programming languages that helped get me half way to sampling 100 programming languages.
date: 2024-05-13
keywords: [100-languages]
---
In the past two months, I've [written code in 50 different programming languages](https://github.com/jaredkrinke/100-languages). **That's half way to [my goal of 100](https://log.schemescape.com/posts/programming-languages/100-languages.html)**.

# Weeks 6 - 8
After tediously [painting a picture to compute digit factorials](piet-for-project-euler.md), **I'm trying to be more strategic about pairing programming languages with suitable Project Euler problems**. Ideally, I can avoid writing "big integer" arithmetic and/or squeezing solutions into a 16-bit address space for the next update. And I'm definitely going to take a break from esoteric programming languages for a bit.

Anyway, here are the languages I used:

* [Turbo Pascal](https://en.wikipedia.org/wiki/Turbo_Pascal) (under DOSBox)
* [Hare](https://harelang.org/) (floppy disk-sized systems language)
* [Wren](https://wren.io/) (object-oriented scripting language)
* [Pkl](https://pkl-lang.org/index.html) (meta-configuration language)
* [قلب (Qalb)](https://nas.sr/%D9%82%D9%84%D8%A8/) (Scheme using Arabic script)
* [Roc](https://www.roc-lang.org/) (functional language)
* [wax](https://github.com/LingDong-/wax) (a common subset of most imperative languages)
* [Boron](https://urlan.sourceforge.io/boron/) (Rebol, but with a smaller scope)
* [文言 (wenyan)](https://wy-lang.org/) (imperative language using Chinese text)
* [Self](https://en.wikipedia.org/wiki/Self_(programming_language)) (prototype-based Smalltalk)
* [Haskell](https://www.haskell.org/) (functional language)
* [Idris](https://www.idris-lang.org/index.html) (dependently-typed functional language)
* [Nim](https://nim-lang.org/) (vaguely Python-esque compiled language)
* [Min](https://min-lang.org/) (concatenative language, based on Nim)
* [Cakelisp](https://macoy.me/blog/programming/CakelispIntro) (s-expression to C compiler)
* [F#](https://fsharp.org/) (functional language for .NET)

A few languages surprised me (one quite pleasantly and one quite *unpleasantly*).

The rest of this post just contains notes from my (minimal) interaction with each language. I'm planning to write a separate post with more general observations. As always, **my observations are from spending at most a few hours with each language, so take my opinions completely encrusted with salt.**

## Turbo Pascal
**I'd always wanted to try Turbo Pascal since two of my heroes helped create it (Anders "Turbo" Heljsberg and Niklaus ("Pascal") Wirth).** It was allegedly far ahead of its time, although my only contemporaneous experience was with QBasic, so I can neither confirm nor deny. Regardless, it's an impressively complete little environment. I highly recommend it for retrocomputing!

Notes:

* **Keyboard shortcut to compile and run is Ctrl+F9... which is the default DOSBox shortcut for killing DOSBox**
* Had to speed up prime test by sieving first 1000 numbers
* Built-in documentation is handy, but lacking detail
* **The IDE is amazing, considering how tiny it is!** (Aside: someone [ported the UI to modern computers](https://github.com/magiblot/turbo))
* Can't have local variables with same name as globals?
* Annoying to have to declare all variables at top, but that probably makes the language faster to compile

## Hare
* Initially, I was confused by the "cannot ignore error here" error, but it turns out it was *literally telling me that I needed to handle a potential error code path* (or tell the compiler to crash on error instead)
* Semicolons required at the end of `for` loops and `if` conditionals (though the docs say this might change)
* **Docs claim the language fits on a 3.5" floppy** -- if true that would be impressive!
* Doesn't officially support Windows/macOS

## Wren
* Doesn't tolerate semicolons
* Can't chain methods on separate lines
* `sqrt`, `floor` are properties instead of functions
* `for` is "for each", but there is no "step some value up to max" loop built in
* Fibers!

## Pkl
According to its web site, Pkl provides "Configuration that is Programmable, Scalable, and Safe". Sounds great! Let's download it. **Eighty four megabytes later**, you can get a taste of Pkl.

Now, I *know* I'm in the minority when pining for [a minimal development environment](minimal-dev-env.md), but how can a *configuration language* be 84 MB? Why does a configuration language require its own JIT compiler?

I understand that INI files aren't enough and that YAML doesn't scale and that JSON probably wouldn't exist if XML had been simpler and less verbose. But (and I apologize for this)... **Pkl is the Electron of configuration languages**. That is both a compliment and an insult.

End rant.

Notes:

* Three times the size of Node.js
* Nice functional language
* Had to convert `IntSeq` to a `List` in order to use `map`, `filter`, etc.
* Slower startup than Python...

## Qalb
* Thought-provoking concept!
* VS Code doesn't have an RTL mode, so it kept getting confused about where to put tokens

## Roc
* Had trouble finding basic documentation (e.g. how to convert between types)
* Accessing lists requires dealing with Result type for error handling, even when I've already checked if the list is long enough (would Idris handle this case?)
* Requires downloading extra code just for "Hello, world!"

## wax
* **I like the idea of a meta-language for "write once, use from any language"** (and I don't mind s-expressions)
* Was kind of hoping for AST-level macros, but I didn't see them...
* Despite liking Lisps, I think I'd prefer less tedious syntax, especially since there aren't macros

## Boron
* **Only 350 KB!**
* Reminds me of TCL
* Didn't see "reduce" and had an issue with "replace", so I had to use lots of mutation and iteration
* Not much documentation

## wenyan
* Machine translating programs back into English is entertaining

## Self
* Download doesn't support HTTPS
* No Windows support
* 32-bit only (at least on Linux)
* GUI-only...
* Similar to Smalltalk/Squeak **I had lots of trouble navigating the UI and figuring out what to click/middle-click/right-click on to make things happen**
* Excellent tutorial: https://sin-ack.github.io/posts/morphic-intro/
* Saving to/loading from text files is done via the `transporter` object (see tutorial)
* Took me a long time to figure out how to supply multiple arguments to a method: "Methods can take arguments, and the keywords for each argument after the first must start with a capital letter."
* Got a "numeric constant too large" error, but actual arithmetic seamlessly transitions to "big integer" arithmetic
* No auto-indent!?
* Seemed very slow
* Globals in method don't work until setting `parent*` slot, to enable it to search up the hierarchy to `globals`

## Haskell
* Documentation for the standard library was surprisingly tricky to search for

## Idris
* Originally, I wanted to try implementing a solution within the type system, but I just couldn't figure it out after a few hours of flailing about
* Couldn't find standard library functions for operations like "first element of a list" or "check if an item exists within a list"
* Never figured out how to test anything other than equality in the type system
* I still don't understand how `Something` and `MkSomething` are related for data types

## Nim
**Nim is the language that impressed me the most in this batch.** Everything I thought would be a problem (significant whitespace, choose-your-own-function syntax, intermediate C compliation step) didn't bother me at all. The small sample of the standard library I played with was a little quirky, but Nim seems like excellent bang for your buck.

Notes:

* Release binary was only 120 KB (linked against libc)!
* Thought I'd dislike the syntax, but it was fine
* **Really easy to get started, many things "just worked" (e.g. grabbing a slice of an array)**
* Didn't have to specify too many types, but still ran fast
* Fast compilation
* Didn't like the "hints" it spews out during compilation, even for `nim r` (build and run)
* Why did `all` take an anonymous function, but `foldl` took just an expression (with `a` and `b` seemingly picked out of thin air) -- is `foldl` a macro?
* **Nim might be a good language for hobby projects because it's easy, fast, and produces small binaries**
* I wonder what the debugging experience is like -- if it's decent, I might be writing a lot more Nim in the future!

## Min
* Operators' arguments are named, which helped me (although I think it's an atypical style for concatenative languages)

## Cakelisp
* Standard library provides convenient macros like `each-in-array`
* I kind of wish I could write my macros using Common Lisp instead of a bespoke Lisp
* Final binary was only 18 KB!

## F#
* `|>` (pipe operator) is nice, but I couldn't find it explicitly stated where the argument goes (it appears to be last--but can I change that?)
* Type inference was convenient--I never had to specify `int`
* F# feels like C# without having to specify types... except I have to type `Seq` *more* than I would have in C#
* Relatively slow to compile
