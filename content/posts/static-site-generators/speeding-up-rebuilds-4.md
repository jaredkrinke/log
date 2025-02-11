---
title: Building the fastest static site generator... or not
description: This is a personal anecdote about the struggle to avoid over-engineering a static site generator.
date: 2023-11-08
keywords: [md2blog]
---
Well, I did it.

**I have successfully staved off the urge (at least temporarily) to create [yet](pre-markdown.md) [another](md2blog-design.md) static site generator** by instead making [md2blog](https://jaredkrinke.github.io/md2blog/) (my zero-config dev blog generator) *just fast enough* for my workflow that it seems pointless to bother improving upon its performance.

Spoiler: adding trivial caching and bypassing the file system shrunk live rebuild times by ~80%--down to **50 milliseconds** on my (decade old) desktop computer. Updates now appear in roughly the amount of time it takes me to shift the focus of my eyes from my text editor to the adjacent browser.

# Background
Possibly as a reaction to [releasing a piece of software based on Electron](../game-development/web-game-on-steam-for-linux-2.md), I've been playing with a [minimal development environment, running on an old netbook](../programming-languages/minimal-dev-env-4.md). Unfortunately, my static site generator was taking roughly 6 seconds (on the netbook) to perform live rebuilds of my site (~90 pages), and I'm generally not patient with poorly optimized software.

Fortunately, after [a few tweaks](speeding-up-rebuilds-3.md), I was able to reduce that time down to around 900 milliseconds. Sub-second updates are acceptable (impressive, even--on a netbook), but I couldn't shake the feeling that it could be *a lot* faster.

# Plans for a new static site generator
**The most obvious way to speed up rebuilds of a static site is to avoid doing unnecessary work**. Given that [a previous experiment of mine](speeding-up-rebuilds.md) showed it was only necessary to rebuild roughly 5 pages when updating (or adding) a single blog post, I started making plans for an extensible static site generator (similar to [Goldsmith](https://github.com/jaredkrinke/goldsmith)/[Metalsmith](metalsmith.md)) *with an accurate dependency graph*.

Since I'm [learning Lisp](../programming-languages/learning-lisp-in-2023.md), I started planning to rebuild md2blog in Common Lisp. With an accurate dependency graph, compilation to native code, and the ability to process Markdown/syntax highlighting in parallel, I was fairly certain I could significantly improve live rebuild times.

Additionally, Common Lisp would trivially allow for beautiful s-expression-based templates, interactive debugging and introspection, and even automatic detection of pipeline/code updates.

**I could build the most extensible--and fastest--static site generator ever!**

# Or I could do something else
But I already have a perfectly functional (and tolerably fast) static site generator. **And I'm (nearly) the only user**. Is it really a good use of my time to build the same thing, just faster and in Lisp? It would certainly be educational, and a great way to learn Common Lisp, but finding Common Lisp libraries for Markdown processing, syntax highlighting, JSON validation, cache storage, and file system monitoring sounds... daunting.

I still maintain that static site generators are a perfect first project for learning a programming language (and its ecosystem). It forces you to interact with the file system, understand data flows, find relevant libraries, and maybe even build a web server. In the end, you can produce a fast and efficient web site.

But I've already done this at least four times and I'm probably past the point of diminishing returns. Is this a project that's really worth spending a few weeks of my spare time on?

Analogous to speeding up a static site generator, **the most obvious way to speed up a *software project* is to avoid doing unnecessary work** (i.e. avoid starting over from scratch). So I refocused my efforts on wringing maximal performance from md2blog, while staying within its existing design constraints.

## An epiphany around caching
What if, instead of making a really smart cache, I made a really dumb one?

While planning a scheme for reliably caching the results of arbitrary steps in the processing pipeline (specifically, deciding between simply using files' "last modified time" vs. using their actual content--or a hash--to detect changes), I realized that **most of the challenges evaporated if I scoped the cache to a single run of the tool**.

As noted in a previous post, my primary performance-sensitive workflow is:

1. Run md2blog as a live-reloading server
2. Edit a blog post
3. Hit Ctrl+S in my text editor
4. Wait for updated content to render in my browser
5. Go to 2

I.e. **it's all one run of md2blog**.

As an experiment, I added a trivial in-memory Markdown cache and found that this One Weird Trick removed plugin processing as the primary bottleneck. The largest remaining bottleneck was the file system itself (writing out all the file contents to disk).

## An epiphany around the file system
**Why am I even waiting on the file system?** md2blog reads in files and then all subsequent processing is done in memory. Since I'm already running my own web server, **I can just serve HTTP requests straight out of memory** while files are written to disk in the background!

That removed the final obvious bottleneck.

# Results
Here's a table of approximate "live rebuild" times from:

* md2blog 1.1.1: no optimizations whatsoever
* md2blog 1.2.0: syntax highlighting cached and link-checking moved to the background
* md2blog 1.2.2 (new): Markdown cached and file system output moved to the background

| md2blog version | Netbook (ms) | Desktop (ms) |
|---|--:|--:|
| v1.1.1 | 6000 | 1200 |
| v1.2.0 | 900 | 190 |
| v1.2.2 | 200 | 50 |

As noted in the spoiler, on my desktop computer (with an 11 year-old processor), updates appear almost instantaneously (fortunately, my site has simple HTML and no JavaScript, so rendering is also fast).

I'm fairly certain this is still *not* the fastest static site generator in existence. Maybe the fastest full-featured, JavaScript-based one? Regardless, it is clearly *fast enough*--at least for now.