---
title: JavaScript runtime startup performance
description: Incremental rebuilds with GNU Make use separate processes for each task. So how does startup time compare between Node, Deno, Bun, and Leano?
date: 2023-04-17
keywords: [md2blog,deno]
---
In a previous post, I [set up incremental builds of this site using GNU Make](speeding-up-rebuilds-2.md). I was able to reduce the incremental build time (for updating a single post, on my [twelve year-old netbook](../programming-languages/minimal-dev-env-4.md#hello-netbook)) from 12 seconds (when doing a full rebuild using Deno) to 3 seconds (using Make, and a bunch of smaller scripts, all running under Deno). Unfortunately, the *full* rebuild time ballooned from 12 seconds to 90 seconds when using Make.

Just from watching the console output, it was apparent that Deno's startup overhead was a likely culprit, so I decided to compare Deno to a few other JavaScript runtimes.

# Hello, startup performance!
This is a completely unscientific benchmark, but to get a feel for the minimum amount of startup overhead, I decided to compare the time to run a simple "hello, world" program on:

* [Node](https://nodejs.org/) 18.14.2 (based on [V8](https://v8.dev/))
* [Deno](https://deno.land/) 1.31.1 (based on V8)
* [Bun](https://bun.sh/) 0.5.8 (based on [JavaScriptCore](https://developer.apple.com/documentation/javascriptcore))
* [Leano](../programming-languages/minimal-dev-env-3.md#success-and-leano) (based on [QuickJS](https://bellard.org/quickjs/))

Here are the results:

| Runtime | "Hello, world!" elapsed time |
| :-- | --: |
| Node | 360 ms |
| Deno | 240 ms |
| Bun | (crashed) |
| Leano | 20 ms |

Deno being faster than Node definitely matches my subjective experience. Unfortunately for Bun, I wasn't able to get it to run under Alpine Linux (the official installer seemed to require glibc, and Bun installed via Nix was compiled for a newer instruciton set than what my netbook supports). There appeared to be open issues in Bun's tracker for both problems.

Leano is a minimal (and *barely* functional) wrapper around QuickJS, so I figured it would be fast for a "hello, world", but I wasn't expecting it to be quite *that* much faster!

Of course, this is a contrived example, and it's not clear how QuickJS will fare once I throw gigantic transpiled and bundled scripts at it.

# Template performance
One step above "hello, world" is the last stage of building this site, templating. All this does is read in JSON and HTML and interpolate them into a bunch of vanilla JS template literals. This seems like an ideal place to test Leano because it's a lot less JavaScript code than, say, syntax highlighting. Note: I already know from [a previous experiment](../programming-languages/minimal-dev-env-4.md#performance) that V8 can be 3 - 5 times faster than QuickJS in a complex scenario like an md2blog full rebuild (presumably due to just-in-time compilation and other optimizations).

Here are the times needed to apply templates to 84 posts on this site under both Deno and Leano (which use the same API):

| Runtime | Templating elapsed time |
| :-- | --: |
| Deno | 25 seconds |
| Leano | 4 seconds |

These results line up with the previous ones pretty closely: Deno seems to have a startup overhead of 200 - 250 milliseconds, and that adds up when running 80+ processes sequentially. What if I run Make in parallel?

| Runtime | Templating elapsed time (parallel) |
| :-- | --: |
| Deno | 19 seconds |
| Leano | 3 seconds |

Running two tasks in parallel (on my dual-core machine) closes the gap slightly.

Other simple scripts that took less than a second to run (parsing front matter, generating an index, and creating an Atom feed) showed 30 - 50% improvements.

# Heavy lifting
By far, the most complicated script in the entire pipeline is the one that processes Markdown and applies syntax highlighting to code blocks. Mostly due to embedded grammars, the script for this step weighs in at nearly 2 megabytes of JavaScript.

This is where Deno's caching and V8's JIT shine. Processing a particularly complicated post using Deno (including process creation/termination) took about 1.5 seconds on my netbook, whereas Leano required 3 seconds. I tried precompiling the JavaScript code to QuickJS bytecode (to avoid parsing overhead), but that only saved about 40 milliseconds (I guess parsing is really fast!).

# Final results
After moving all the small/trivial scripts over to Leano while leaving Markdown/syntax highlighting to Deno, I was able to improve upon my previous results:

| Scenario | Elapsed time | 
| :-- | --: |
| Full rebuild using "classic" md2blog | 12 seconds |
| Full rebuild using "make" solely under Deno | 90 seconds |
| Incremental build using "make" soley under Deno | 3 seconds |
| **Full rebuild using "make" using Deno *and* Leano** | 70 seconds |
| **Incremental build using "make" using Deno *and* Leano** | 1.6 seconds |

In the end, removing Deno's startup penalty from the process resulted in a modest speedup. Unfortunately, it's still slower than [running a full rebuild under Deno when in "watch" mode](speeding-up-rebuilds-3.md#further-optimizations), so, while interesting, this experiment did not lead to any changes in my current workflow.

