---
title: Python is the new BASIC
description: What makes Python the BASIC of today?
keywords: [python]
date: 2024-11-20
---
As far as programming languages go, [BASIC](https://en.wikipedia.org/wiki/BASIC) ("Beginners' All-purpose Symbolic Instruction Code") is... **not a language I would choose today**. Granted, when it was originally developed in the 60s, line numbers and single-character identifiers were *an improvement*. But in its heyday (which I'm going to claim, without evidence, was in the late 70s and early 80s), there were better options (Pascal, Lisp, Forth, even C!). Yet, **BASIC was everywhere! It *was* the interface for many old computers, like the Commodore 64.** Why? I'd say (again, without evidence) it's because BASIC was designed to be usable by anyone--not just experienced programmers.

Today, there's a *different* language with ugly historical baggage that enjoys a strong following, notably amongst people that don't identify as programmers. That language is Python.

**Python is the new BASIC.**

# Back to BASIC
## Background
BASIC was created at Dartmouth College in 1963 by John G. Kemeny and Thomas E. Kurtz (see [In Memoriam: Thomas E. Kurtz, 1928–2024](https://computerhistory.org/blog/in-memoriam-thomas-e-kurtz-1928-2024/)). If you want a historical account, there is an [Advent of Computing podcast episode about BASIC](https://podcasts.apple.com/us/podcast/keeping-things-basic/id1459202600?i=1000502282724) that is excellent (as is the entire podcast).

## Commodore BASIC
My personal history with BASIC goes back to [the first computer I ever used, the Commodore 64](../vintage-computing/40-year-old-dev-environment.md). That computer booted directly into BASIC. Although I didn't realize it at the time, to launch programs, you had to type in BASIC code. **Every user was secretly a programmer!** I don't think I wrote any programs beyond `10 PRINT "HAHA"`; `20 GOTO 10`, but I suppose I at least learned about commands and quotation marks.

## QBasic
At some point, I decided that I wanted to make a computer do whatever I wanted, so I needed to learn how to program. Fortunately, my [MS-DOS](https://en.wikipedia.org/wiki/MS-DOS) computer included a development environment--impressively fully-featured, in retrospect--named [QBasic](https://en.wikipedia.org/wiki/QBasic). Yes, BASIC (specifically QBasic) was the first programming language I attempted to learn. I don't think I ever discovered subroutines in QBasic, but I did at least learn about conditionals, loops, and arrays.

Regardless, BASIC served its purpose. I, a non-programmer at the time, learned how to write some simple programs without throwing up my hands in despair and swearing off computers forever. **I guess I'm a BASIC success story!**

As an aside, I recently found an old box of floppy disks, including one "double density" disk with my first name written on the label. That disk contained several programs I had written using QBasic, circa 1997. The code was... not good--again, I hadn't discovered subroutines yet.

# Back to Python
## Pros and cons
**I don't actually like Python.** Despite its "elegant" indentation-based blocks, I find the syntax ugly (format strings, overloading of asterisks, ternary operator with the condition sandwiched in the middle, etc.). Python breaks compatibility more than I'd expect (or perhaps tolerate). The package ecosystem, although broad, gives me supply chain nightmares.

Despite my complaints, however, Python has a lot going for it:

* It's **ubiquitous**
* **It comes with "batteries included"**, i.e. a comprehensive standard library
* **It's simple** (or, at least, you can pretend it is, for casual use)

**Python is far from perfect, but it is often good enough.**

## Why Python is the new BASIC
But why is Python the new BASIC? The answer is simple: **Python is the new BASIC because Python is the language that non-programmers always seem to use**. It's reached critical mass. Python has won!

Of course, that is more of an observation than a reason. I honestly have no idea why people originally gravitated to Python (apologies for implying otherwise), but if I had to guess it would be some combination of the following:

* Python emerged when the world desperately needed a scripting language that was less ugly and error-prone than [Perl](https://www.perl.org/)
* Python used indentation instead of braces to denote blocks, and this was deemed by the masses as "elegant"--not a good reason in my opinion but, well, I use Lisp, so I'm clearly an outlier
* Python often includes everything you need, right in the standard library
* Python was math-friendly enough to gain a foothold in physics, finance, etc. research, thus broadening its ecosystem and influence
* Python smartly borrowed convenient features from more complex languages, while remaining reasonably simple itself
* Python was never owned by a litigious corporation

In other words: **some combination of smart design, community management, and happenstance**.

## Definitive proof of Python's dominance
Despite having intentionally avoided Python for my entire adult life, **I recently gave in and wrote a personal utility program in Python** because I knew Python would have everything I needed and I had confidence that Python was entrenched enough that I'd still be able to use my program for the foreseeable future.

**If even a Python-hater like me defaults to using Python, then I think it's pretty clear that Python has taken over the world, just as BASIC once did.**

One parting thought: how long will Python's reign last?
