---
title: Three quarters of the way to 100 programming languages
description: Just some more notes on programming languages. And also my first failure!
date: 2024-10-31
keywords: [100-languages,commodore-64,zig]
---
I recently resumed [solving the first 100 Project Euler problems using 100 different programming languages](100-languages.md). For reference: [here is code for all my solutions so far](https://github.com/jaredkrinke/100-languages).

Of note, **I failed to solve a problem using Micro-Lisp on the Commodore 64**. I think it would have been *possible* to solve the problem (even despite the lack of cons cell mutation), but the Commodore 64 keyboard design can lead to two different space characters being emitted when you hit the space bar, depending on timing, and Micro-Lisp only handled one of those characters. The result is that I'd have code that looked correct, but wouldn't compile. I gave up.

**I also finally decided to solve a problem in C**. On the surface, this might seem pointless since I already know C, but **it gave me an excuse to try calling C code from Zig** (a language I hadn't tried before). Overall, the Zig toolchain is extremely impressive! It's probably the most convenient C (and C++) compiler in existence. And Zig seemed fine, too.

Lastly, **I got around to solving a problem using Prolog. It was worth the wait!** Expect a post on it eventually.

Without further rambling, here are my notes:

# Notes
## G-Pascal (on a Commodore 64)
* Only two types: integer and character ("char")
* No pointers or references -- instead use `addr := address(array)` and index memory directly with `mem[addr]` (integer) or `memc[addr]` (char)
* Docs for newer iteration: http://www.gammon.com.au/G-Pascal/pascal_compiler.htm
* "Note that arrays grow downwards in memory, not upwards."
* Does *not* compile to machine code!
* Built-in line-based editor includes multi-line insert, search and replace, etc. -- a big step up from Commodore BASIC!
* Without native compilation or an interactive environment, this wouldn't be my first choice for programming on a Commodore 64 (but still better than BASIC, thanks to named procedures and functions!)
* Roughly 7x slower than equivalent C, for my solution (N.B. G-Pascal uses a VM and C compiles to native code)
* I didn't notice a way to enter blank lines, so the resulting code looks cluttered.

## Micro-Lisp (on a Commodore 64)
* Shift+space *looks like* a regular space, but is treated as a different character, leading to confusing errors on lines that look correct
* No built-in macros
* No way to modify cons cells
* Line-based editing of Lisp on a 40 column screen was unpleasant (unclear if worse than BASIC editing?)
* Indentation was getting lost on input
* Functions aren't first class objects
* Unfortunately, you have to choose between image-based development or entering source code in lines (a la Commodore BASIC) -- you can't easily develop interactively *and still save your source code*
* Sadly, I gave up on C64 Micro-Lisp due to the issues and missing features noted above -- that's not to say I wasn't impressed to be using Lisp on a Commodore 64!

## Scheme
* R6RS appeared to be incompatible with R5RS and R7RS for a "hello world" program
* Chibi-Scheme's rational numbers were hundreds of times slower than Chez Scheme/Racket
* In theory, I should prefer Scheme to Common Lisp (fewer concepts overall, better naming in the standard library), but I wish the different Scheme revisions and implementations were more compatible with one other

## BCPL
* The language is conceptually simple, but the syntax was foreign enough that I found it difficult to write
* Only having a single word-sized data type feels limiting--but I guess that's the price you pay for a tiny compiler

## MATLAB
* Everything I tried Just Worked!

## MoonScript
* I like the idea of Lua without so much keyword noise
* But there are some weird syntactical quirks around function arguments within table constructors that lead me to think that requiring parentheses around function arguments might have been better
* Seems like "Lua written in Python" -- oh, the docs actually say it's inspired by CoffeeScript
* I kept wanting to omit the commas between function arguments for some reason
* Kind of wish there were built-in functions for appending to a list, concatenating lists, reducing lists, etc.

## Fennel
* I like Lisp and have used Lua a fair amount, so I expected to like combining the two
* But I found mixing Lua semantics and syntax with Lisp was fairly confusing -- I could never decide whether I needed brackets in a macro or not
* Having Macros for Lua is fun! And Fennel papers over some annoyances in Lua

## Erde
* Mostly Lua with braces instead of `do`/`end`
* Erde still interprets variables with typos in their names as globals -- I wish this was fixed

## PureScript
* The [Try PureScript](http://try.purescript.org/) example renders HTML from code, but I *really* dislike the amount of repetition and the lack of support for trailing commas
* First result when searching for "sqrt" in Pursuit is in a package that turned out to be deprecated
* Doesn't appear to include a useful standard library by default?
* I couldn't figure out how to enforce a non-empty array via the type system (`Data.NonEmpty`? `Data.Array.NonEmpty`?)
* Slow compilation
* Seems to warn whenever types aren't explicitly stated... so why bother with type inference?

## Ruby
* Very handy having generators, indefinite ranges, and rational numbers
* Feels pragmatic

## Reason
* Official API documentation's search function can't find `float_of_int` (a function that is mentioned in some error messages I received)
* Line comments (`//`) result in syntax errors in the [in-browser implementation](https://reasonml.github.io/en/try)
* Also in the browser, error line numbers sometimes aren't correct (and "this has type X but somewhere wanted Y" isn't helpful without correct line numbers!)

## T3X/0
* Has two distinct conditionals, `IF` and `IE`
* Pascal syntax and BCPL semantics sounds like a good combination for a minimal or bootstrapping compiler!

## AssemblyScript
* AssemblyScript's landing page has the best developer experience I've encountered (I suspect it is most of Visual Studio Code embedded, along with type info)
* I don't like reusing TypeScript's file extension
* How does its "standard library" get included? I assume the parts that are used are compiled into each WASM blob

## MiniLang
* Couldn't find any math functions, e.g. for finding square roots
* Very nice IDE available on [ryugod.com](https://www.ryugod.com/pages/ide/minilang)

## C
* Had to use C99 to get an official 64-bit integer type

## Zig
* Having unused variables be an error when trying to narrow down problems is annoying...
* Being able to compile and reuse C code is convenient!
* Very impressive for a ~40 MB download

## Clojure
* Slow to compile and run
* Took me a long time to figure out that `(Math/floor ...)` was the simplest way to invoke the standard library's math functions
* Hopefully I don't get a bill in the mail from Oracle for using the JVM

## Raku
* Handy functional utilities like `map` and `flatmap`
* But some of those functional utilities have odd names like `grep` and `elems`

## Vala
* Raw arrays have no bounds checking!
* Collection types are implemented in a separate library

## Prolog
* In SWI Prolog, you can interactively add facts/rules by typing `[user]`, entering information, and then sending "end of file" (Ctrl+D on Linux, possibly Ctrl+Z on Windows)
* SWI-Prolog treats strings in a way that is incompatible with many tutorials I found on the web -- namely, [a double-quoted string is a separate data type than a back-ticked string](https://www.swi-prolog.org/pldoc/man?section=string), which (as far as I understand) uses the traditional data type of a list of character codes (which, I hope, are now actually Unicode code points)
* It took me a *really* long time to figure out that `use_module(library(dcg/basics)).` should have been `:- use_module(library(dcg/basics))` -- the former doesn't do anything useful (but doesn't emit any warnings), whereas the latter actually brings a module into scope
* Accessing documentation via `help` loads modules as a side effect
* The actual Sudoku-solving part was just a few lines of readable code
* Getting to use Prolog's declarative approach was worthwhile, despite my difficulties getting things going
