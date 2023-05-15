---
title: Resources for learning Common Lisp
description: Here are the resources I've personally found most helpful for learning Common Lisp.
date: 2023-05-15
keywords: [lisp]
---
In order to test out fully interactive program development ([as noted previously](learning-lisp-in-2023.md)), I've been learning Common Lisp. I assumed that it would take a while to catch up on nearly four decades of Common Lisp's progress and... I was not wrong about that. On the plus side, given the long timeline, there *are* a lot of resources available. On the flip side, they're not always up to date.

Regardless, here are the resources that I've found most helpful over the last couple of weeks. My intention is to keep this list up to date as I go.

# Introductory materials
In descending order of how much time I've spent studying them (i.e. in completely arbitrary order):

* [**Practical Common Lisp**](https://gigamonkeys.com/book/) by Peter Seibel
* [**Successful Lisp**](https://dept-info.labri.fr/~strandh/Teaching/MTP/Common/David-Lamkins/cover.html) by David B. Lamkins
* [**Loving Common Lisp, or the Savvy Programmer's Secret Weapon**](https://leanpub.com/lovinglisp) by Mark Watson

# In-depth materials

* Various topics: [Common Lisp Cookbook](https://lispcookbook.github.io/cl-cookbook/)
* Debugging: [Debugging Lisp (series)](https://malisper.me/debugging-lisp-part-1-recompilation/)
* Packaging/libraries: [Source Code Organization](https://lispmethods.com/libraries.html)
* The LOOP macro: [Tutorial for the Common Lisp Loop Macro](https://www.ai.sri.com/~pkarp/loop.html)
* JSON libraries: [Review of CL JSON libraries](https://sabracrolleton.github.io/json-review.html)

# Resource collections:

* List of libraries/tools: [Awesome Common Lisp](https://awesome-cl.com/)
* List of books: [lisp-lang.org/books](https://lisp-lang.org/books/)

# General reference

* [Common Lisp HyperSpec](http://clhs.lisp.se/Front/index.htm)

# That's great, but what have you been *doing*?
That's mostly a topic for a future post. Briefly: my first project has been building a service that hosts webhooks which implement [Battlesnake](https://play.battlesnake.com/) clients. Surely there's no more noble endeavour than programming games!

Battlesnake is a competitive programming game where snakes move around a grid collecting food and trying not to collide with each other or the walls. Each snake is implemented as a webhook which is given 500 milliseconds to respond with the direction it would like to move. It's a simple concept, but that just leaves lots of room for optimization. As an aside, the global leaderboard is a little bit pointless in that it can't take into account hardware, so for all I know my little netbook is competing with a rack of servers, but I'm still having fun.

Hopefully I'll have more to say about Battlesnake and Common Lisp soon!

