---
title: My hobby is... bikeshedding?
description: Am I spending development time on things that matter?
date: 2023-11-17
keywords: [lisp,minimalism,netbooks]
---
Although I'd seen the term thrown around, I hadn't looked up the definition of "bikeshedding" until recently. DuckDuckGo tells me that "bikeshedding" is:

> Futile investment of time and energy in marginal technical issues

Wait a minute. That accurately describes much (if not most) of this blog.

**Bikeshedding is my primary hobby**, apparently.

# A quick review
Looking back at my previous posts, I see:

* [Trying to find a static site generator](../static-site-generators/comparison.md) that supports my desired workflow, and [eventually building my own](../static-site-generators/md2blog-deno.md) (instead of just using Hugo)
* Attempting to speed up my home-grown static site generator because, [apparently, 50 millisecond rebuilds doesn't seem optimal](../static-site-generators/speeding-up-rebuilds-4.md) (ignoring the fact that 50 milliseconds is probably actual lightning speed)
* Avoiding Emscripten's bloated (and Python-based) tooling to [generate diagrams](../webassembly/compiling-graphviz-to-webassembly.md) and [pass strings around](../webassembly/passing-strings-to-c.md) (instead of just using the most popular native-to-browser framework)
* [Fretting over the software supply chain of NPM](../web-development/souring-on-npm.html), and switching to Deno (abandoning one of the largest library ecosystems ever created--N.B. this was before Deno added NPM support)
* [Whining about the size of the Rust toolchain on Windows](../programming-languages/rust-first-experience.md) (even though I have a terabyte drive)
* [*Way*](../programming-languages/future-proof-languages.md) [too](../programming-languages/future-proof-languages-2.md) [much](../programming-languages/future-proof-languages-3.md) musing about "future-proof" programming languages (instead of just picking the right tool for the job)
* [Porting a browser-based game to Steam without using Electron](../game-development/browser-based-game-on-steam-2.md) because I thought Electron was too bloated (spoiler: I ended up using Electron to add Linux support anyway)
* [Developing software *on* a Raspberry Pi 1B](../programming-languages/minimal-dev-env-3.md) because *it should be possible, right?*
* [Creating a (nearly unplayable) real-time browser-based game that doesn't use any JavaScript](../web-development/interactive-browser-app-without-js-2.md) because modern browsers eat up all my netbook's memory (even though I mostly use my desktop computer, because it's convenient)
* [Rewriting software to avoid spending a few dollars per month](../web-development/cheap-hosting.md) (despite that money likely being a rounding error in my monthly finances)

# But why?
At the time, I justified most of these plans in terms of economy: **I was optimizing resources in reaction to everything else seeming so bloated**. I was *respecting the user* by minimizing dependencies/system requirements.

But in retrospect, I wonder if **I was just focused on optimization because it was often the most straight-forward and unambiguous task**.

That's not to say that I was necessarily *wasting my time*. I learned a ton from these projects. And minimizing resource usage is extremely important for respecting your users... but that only matters when you have users. Otherwise, it's just premature optimization (assuming a reasonable baseline).

# Goals
I suspect software development can be lucrative because costs scale slowly. Solving a problem for 1 person may take a lot of work, but solving it for 100 (or 1000) additional users often costs very little. Of course, sometimes, I'm just looking to solve my own problem, and I don't plan on having any "users".

Ultimately, **before I start a project, I should have a target audience and/or goal in mind**. This seems obvious, but I'm fairly certain that most of my projects began organically, with only a vague notion of what I wanted to achieve.

Additionally, **I need to critically evaluate any goals and whether or not they're worth the effort**. Creating a Common Lisp-based static site generator in order to learn Lisp because it sounds fun? Probably a good idea! Creating a Common Lisp-based static site generator in order to provide faster incremental and custom templates, for a tool that [will likely only ever have one user](https://blubsblog.bearblog.dev/i-am-the-only-user/)? Probably not worth the effort!

# Looking forward
Fittingly, my current hobby of learning Common Lisp started [because I read about REPL-driven development and wanted to test it out for myself](../programming-languages/learning-lisp-in-2023.md). In the process, I've found many additional reasons to persist with Lisp:

* **Macros**, for ergonomically generating code
* **Conditions**, for observing and handling errors at a distance
* **Lists** (of course), a handy, multi-purpose data structure, built into the core of the language
* With Emacs and SLIME, **a fully-featured editing and debugging experience** that easily runs on an old netbook
* **A broad ecosystem**, with numerous implementations and a wide range of libraries

Lisp is just *too* enticing to a dedicated software developer. It's the most expressive and extensible programming language I've encountered, and it's *just popular enough* that learning it doesn't feel like a waste of time.

**But what is my *goal* with learning Common Lisp?**

* Originally, I just was curious and wanted to try REPL-driven development, and now I'm used to it--it's nice, but not indispensable
* Macros can be handy (in small doses), but I'm pretty sure other languages now support syntax tree-level macros
* Common Lisp "conditions" (and "restarts") still seem unique and useful
* Lists are handy, but they seem inefficient on modern hardware
* Having the equivalent of a language server that runs comfortably in the terminal on a netbook warms my heart, but fast computers are cheap
* Having many interoperable Common Lisp implementations sounds future-proof, but am I realistically going to use anything other than SBCL?

**Overall, I like Common Lisp, but now I can't shake the feeling that using an extensible programming language that fits on netbook is just more bikeshedding.**

Most programming language distinctions could probably be classified as "marginal technical issues" for all but the most demanding workloads.

The whole world seems to be using Python or JavaScript and they're "good enough" for most purposes. Should I just hop on the bandwagon and stop fussing over those languages' deficiencies? Well, that depends on the goal...