---
title: Wrapping up week 1 of the 100 languages challenge
description: So far I'm on schedule and have sampled each kind of programming language.
date: 2024-03-23
keywords: [100-languages]
---
I'm [trying to write code in 100 different programming languages](https://log.schemescape.com/posts/programming-languages/100-languages.html). Today, I'm wrapping up week 1.

The full list of languages and links to code are in my [100-languages](https://github.com/jaredkrinke/100-languages) repository.

# Days 1 - 2
**I got off to a pretty rocky start by starting with two languages that run in limited environments**: [SIC-1 Assembly Language](100-languages-1.md) (which runs on an 8-bit single-instruction CPU with 256 bytes addressable) and [SectorLISP](100-languages-2.md) (which has only lists--no integers!--and with a max of a few thousand linked list cells). Economizing solutions was fun, but time-consuming.

# Days 3 - 7
I could have breezed through the first week by using procedural languages I already knew, **but the whole point of this journey is to play with new programming languages with minimal investment**, so I set two goals for the rest of the week:

* Use at least one language of each type (cf. [The Seven Programming Ur-Languages](https://madhadron.com/programming/seven_ur_languages.html))
* Explore new languages, or new ways of using languages, when possible

Here are the languages I ended up using:

* [Fortran](https://fortran-lang.org/) (procedural language)
* [J](https://www.jsoftware.com/#/) (array language)
* [Gforth](https://gforth.org/) (stack-based language)
* [Standard ML](https://en.wikipedia.org/wiki/Standard_ML) (functional language)
* [Squeak](https://squeak.org/)/Smalltalk (object-oriented language)
* [SQL](https://en.wikipedia.org/wiki/SQL) (declarative language)

Technically, I think I've written Smalltalk and Standard ML code before, but it was a long time ago, and I definitely did not remember anything beyond high level concepts. SQL was the only language I was fluent in (but not for solving math problems!).

# Doubts about this challenge
I've tried to make it clear that **I'm not expecting to actually *learn* or *become proficient in* all of these languages**--I'm just sampling them and ensuring that I *apply* what little I *do* learn. Eventually, maybe I'll dive into a few of the languages that intrigued me the most.

Honestly, it's been fun to dabble in languages I have no business writing code for. In that aspect, this challenge has been a resounding success.

*However*, sometimes **it feels like this is actually just a challenge to learn 100 different syntaxes**. In other words, **I might be spending time on the *least interesting part* of any programming language: syntax**. (Not to say syntax isn't important, just that syntax is *almost* never a reason to use or avoid a programming language. For the record, I said "almost never".)

It remains to be seen if syntax overload ends up sinking this adventure, but for now I'm planning to forge ahead.

# Language notes
I'll end this update with some notes about the languages I used.

## Fortran
**Fortran is verbose**. It tries to be precise, but there's enough historical baggage and implicit behavior that it seems really easy to screw up. I don't think this particular programming problem played to any of Fortran's strengths, however, so my perspective is skewed--I was basically writing C in Fortran.

Notes:

* Opted for Fortran 90, with extravagances like "free-form source input" (instead of fixed column input)
* Requires lots of redundant typing (function names and return types, variable definitions)
* Native logical/Boolean type!
* [Plenty of gotchas](https://fortran-lang.org/learn/quickstart/gotchas/)

## J
I was excited to try an array language, **but *wow* was I unprepared for the overwhelming cyclone of syntax**. Like regular expressions, I'm sure once you're proficient with J it's quick to whip up little programs. Also like regular expressions, J seems difficult to parse at a glance. **Trying to wade through dozens of sigils as quickly as possible was probably the worst possible introduction to J**.

Despite being in the wrong mindset, I *did* enjoy programming in J, because it felt so novel. The closest I've used to an array language is probably [NumPy](https://numpy.org/), but J is its own language, designed from the ground up.

Notes:

* `_5` is a negative number and `_` is infinity
* `3 : 0` defines a verb (operator) -- hopefully there's a good reason for this...
* Unique terminology ("verbs", "adverbs", "ravel") makes it hard to find information in the wiki
* Search engines don't seem to understand that "J" is the name of a programming language -- only good way to search was on Stack Overflow with the `[j]` tag
* Comments start with `NB.`!

## Gforth
After reading a [very long and entertaining post about Forth](https://ratfactor.com/forth/the_programming_language_that_writes_itself.html) roughly a year ago, I've wanted to give Forth a try. Forth's minimalism aligns nicely with [my own aspirations](minimal-dev-env.md). Who knows, maybe Forth will [control a post-apocalyptic world](http://duskos.org/).

I was prepared for Forth's minimal syntax (even more minimal than Lisp) and I knew how to use a stack. **But I underestimated just how *exasperatingly tedious* managing the parameter stack would be**. I'm sure there's some better solution for temporaries that I skimmed over, but having to `SWAP 1 + SWAP`, etc. was inconvenient.

Overall, I'm not sure how I feel about Forth outside of the embedded world. I *do* hope to implement my own Forth one day--and maybe with the benefit of enlightenment I'll feel differently.

Notes:

* I actually kind of enjoyed having no type-checking, not even at run-time--although it's probably not usually a good idea
* Interacting with Forth really feels like interacting directly with hardware

## Standard ML
**I love arrow functions, map, reduce, etc.** -- and I have functional programming languages to thank for those, even when I'm using JavaScript. Having said that, Standard ML was the first language I ran into during this challenge where it felt like I was wasting my time stumbling through syntax. I still don't know when I need parentheses and when I don't. As usual, this is not necessarily the fault of the language--just of the environment I've created for myself.

Having said that (and I'm sure people will disagree), **I prefer Lisp's regular syntax when compared to something like Standard ML**. Maybe I'd like Clojure?

## Squeak
I was prepared for everything to be an object in Squeak. I was excited for a fully introspectable language. Want to know what something does? Just look at its source!

**I was *not* prepared for clicking through menus and having to use the mouse all the time**. I'm also not sold on image-based development being *the default*.

In the end, I think there's a lot of value in a standardized development environment and separating logic into objects, but I think most of those benefits are visible when working in teams or over longer periods of time.

Notes:

* Use the browser
* Use all your mouse buttons

## SQL
Similar to J, **it's fun to tell the computer *what* I want it to do without having to specify the particular steps for *how* to do it**.

Notes:

* It's possible to produce a range of numbers in SQLite!
* Strings can be automatically coerced to numbers in SQLite
