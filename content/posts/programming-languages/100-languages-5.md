---
title: One quarter of the way to 100 programming languages
description: "Or: PostScript is a programming language!?"
date: 2024-04-08
keywords: [100-languages]
---
I'm **25% of the way** to [having written code in 100 different programming languages](https://log.schemescape.com/posts/programming-languages/100-languages.html).

See [this repository](https://github.com/jaredkrinke/100-languages) for proof.

# Week 3 (plus a day)
As planned, I slowed down from [last week](100-languages-4.md), but I still managed to make it to the 25% mark. That's 25 languages down, and 75 to go! Now that I'm no longer rushing, I'm enjoying the process of playing with new languages more.

All languages were new to me for this week. Notably, **I didn't even realize that [PostScript](https://en.wikipedia.org/wiki/PostScript) was a programming language at all**! Turns out it's a [Forth](https://en.wikipedia.org/wiki/Forth_(programming_language))-like (stack-based) procedural language. I'm still feel like I'm struggling with stack-based languages, but it might just be a matter of perspective--compared to straight assembly, Forths are a joy to use!

The rest of this post contains notes on the languages I used.

## BBC BASIC
**I've never seen or used a [BBC Micro](https://en.wikipedia.org/wiki/BBC_Micro)** (the closest I've used is a [Commodore 64](https://en.wikipedia.org/wiki/Commodore_64)), but it's famous enough that I wanted to give one an ([emulated](https://bbcmic.ro/)) spin.

* **BBC BASIC puts Commodore BASIC to shame** with features like named procedures (finally, no more line numbers!)
* With respect to solving Project Euler problems, integer arithmetic and division with remainders are welcome additions
* Despite its age, [excellent documentation](https://www.bbcbasic.co.uk/bbcwin/tutorial/index.html) is still available

## Unison
**[Unison](https://www.unison-lang.org/) stores and references code in a content-addressed syntax tree format**, allowing for things like accurate incremental builds. It appears to be designed for distributed systems, so I'm not in the target audience, but it sounded interesting enough that I've always wanted to try it.

* Having the codebase manager cache and update code automatically is convenient
* "Watches" and tests allow for **immediate feedback when code is updated**
* The codebase manager also supports **searching for and displaying documentation**
* I struggled a bit with syntax, especially significant whitespace (note to self: only use tab width of 8 for Unison--or just don't use tabs at all)
* The docs indicate that **the codebase format is append-only** -- what happens if you *really* need to expunge all traces of some code? Is there *code* garbage collection?
* Integrated tooling like the codebase manager and code versioning sounds interesting, although I'm mostly allergic to additional tooling
* Unison feels innovative, for sure!

## Lil
[Lil](https://beyondloom.com/decker/lil.html) is a bespoke scripting language for [Decker](https://beyondloom.com/decker/) (a Mac Classic-esque multimedia tool). Despite being a single header of around 1300 lines of (dense) C code, Lil packs an impressive array of features: **immutable data structures, vector programming, and a built-in query language**.

* Elements in lists (surrounded by parentheses) are separated by commas, but function arguments (surrounded by *brackets*) are *not* (I know it's subjective, but I found this to be fairly annoying)
* Some operators (e.g. modulus) have their order reversed
* `where` clauses in the query language are actually column (list) expressions
* **Performance was a challenge for me** due to the lack of mutable data structures--I ended up having to repurpose a string because the language doesn't *natively* provide a mutable array (though the host app can--and in the case of Lilt, does--provide mutable data types)

## PostScript
**PostScript isn't just a document format, it's a programming language!** Who knew? Open [my solution](https://github.com/jaredkrinke/100-languages/blob/main/src/p24.ps) in a document viewer and see for yourself! (Just tried it in GIMP and it works!)

I can't imagine such a security minefield of a format being created today. It's basically a quilt made out of red flags. PDF has had enough exploits and it's (supposedly) declarative! **I will probably never open a PostScript file from the web again** (though I promise I'm too inept at stack-based languages to have created a virus).

Regardless, here are my notes about the language:

* I had a lot of trouble managing the stack again, but at least you can duplicate a value at any depth in the stack in one command
* Having branches appear before knowing what kind of conditional they're for hard for me to read
* Fortunately, being an old standard means that there is excellent documentation: [PostScript Language Reference Manual](https://www.adobe.com/jp/print/postscript/pdfs/PLRM.pdf)

## fe
[fe](https://github.com/rxi/fe) is a **minimal Lisp that uses a fixed block of memory (no dynamic allocations)**. It is not to be confused with [Fe](https://fe-lang.org/), whose web site mentions smart contracts.

Given that fe is less than 900 lines of readable C, it's an impressively ergonomic language.

* The stand-alone interpreter defaults to 64,000 bytes of memory (in addition to the C stack, obviously)
* On 64-bit architectures, cons cells are each 16 bytes, so only 4,000 cons cells max
* Numbers (single-precision floats) are *also* stored as objects, which unfortunately means **each 4-byte number takes up 16 bytes**
* Macros work, but are missing a few key pieces (gensym, quasiquote, "rest" arguments)
