---
title: It's 2023, so of course I'm learning Common Lisp
description: I'm traveling back in time to explore an ancient development workflow that is somehow more modern than today's workflows.
date: 2023-04-25
keywords: [lisp]
---
I've [spent](future-proof-languages.md) [some](future-proof-languages-2.md) [time](future-proof-languages-3.md) contemplating future-proof programming languages because I want to enusre that code I write will be usable in the future. Generally, if I want to build something and share it with others, I'm a pragmatist, so I'll ~~use JavaScript~~ choose a programming language that is popular, portable, and convenient.

But *other times*, I just want to have fun and experiment with other programming languages and tools. In that vein, I've been monitoring a few single-syllable, intriguing-but-maybe-not-future-proof programming languages such as [Nim](https://nim-lang.org/) and [Zig](https://ziglang.org/). Sometimes these experiments open my eyes to new ways of programming or new tools that eventually become indispensible.

# Janet
Very recently, I ran across a newly-published (free) book about the [Janet](https://janet-lang.org/) programming language called [Janet for Mortals](https://janet.guide/) and it piqued my interest. Janet is a relatively small Lisp/Clojure-inspired scripting language that tries to fill a similar niche to Lua, but with an actual standard library (and, of course, Lisp-style metaprogramming and compile-time execution via macros).

**Janet for Mortals** is an entertaining and informative read, and it gave me the nudge I needed to become interested in Lisps again. I had previously abandoned using Scheme because, frankly, I ran out of free time for exploratory programming. But while I was reading about Janet, I kept coming back to one question: why should I use Janet instead of an established Lisp, e.g. Scheme?

For me, the most attractive qualities of Janet (other than general Lispiness) are portability, embeddability, and [Parsing Expression Grammars](https://janet-lang.org/docs/peg.html). Realistically, however, I don't currently have any need to embed a language, so that leaves portability and parsing. As far as portability, [CHICKEN Scheme](http://www.call-cc.org/), [CLISP](https://www.gnu.org/software/clisp/), and [Steel Bank Common Lisp](http://www.sbcl.org/) looked acceptable. For parsing, [Packrat](https://bford.info/packrat/) looked reasonable.

At this point, I started to run out of reasons to pursue Janet instead of an established Lisp.

# Common Lisp
During my research, I ran across a [blog post describing Common Lisp's (mostly) unique REPL-driven workflow](https://mikelevins.github.io/posts/2020-12-18-repl-driven/). In that post, the author describes handling a runtime error by just fixing the broken code--in-place, without any restarts:

> Try this in your favorite repl:
> 
> Define a function, foo, that calls some other function, bar, that is not yet defined. Now call foo. What happens?
> 
> Obviously, the call to foo breaks, because bar is not defined. But what happens when it breaks?
> 
> ...
> 
> The answer to that question is the differentiating point of repl-driven programming. In an old-fashioned Lisp or Smalltalk environment, the break in foo drops you into a breakloop.
> 
> A breakloop is a full-featured repl, complete with all of the tools of the main repl, but it exists inside the dynamic environment of the broken function. From the breakloop you can roam up and down the suspended call stack, examining all variables that are lexically visible from each stack frame. In fact, you can inspect all live data in the running program.
> 
> What's more, you can edit all live data in the program. If you think that a break was caused by a wrong value in some particular variable or field, you can interactively change it and resume the suspended function.
>
> ...
> 
> Moreover, because the entire language and development system are available, unrestricted, in the repl, you can define the missing function bar, resume foo, and get a sensible result.

I've seen various (often unreliable) "edit and continue" features over the years, but I didn't realize that Common Lisp was built with this sort of workflow in mind.

When I first learned to program, I used "printf debugging", where I'd temporarily add in code to log values, recompile, run, and inspect the output to troubleshoot problems. Eventually, I ran into scenarios where I couldn't modify the program or rerun it, so I learned to use a debugger. Using a real debugger is definitely the right thing to do, but setting up a debugging environment is often painful (and sometimes impossible).

Common Lisp seems to take debugging a step further. Sure, I've modified memory in a debugger to test out potential fixes, but being able to rewrite code and patch into a live process *in a sane way* sounds amazing--almost too good to be true.

That new workflow is my motivation for learning Common Lisp. I want to try interactively building a program to see if it's a pleasant way to work.

Is it a good idea to learn a new programming language and standard library just to explore a new workflow? Maybe not, but I'm not sure there's a great alternative. I'm sure similar REPL-editor integrations exist in other languages, but I also suspect that they're buggier because they've been bolted on, rather than supported from the beginning. Additionally, if I put in the work and am not satisfied with the workflow after all, I can rest assured that I gave it the best possible chance, using standard tools.

Regardless, it should be an interesting adventure!
