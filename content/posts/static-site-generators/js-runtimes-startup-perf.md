---
title: JavaScript runtime startup performance
description: Incremental rebuilds using GNU Make run separate processes for each task. So how does startup time compare between Node, Deno, Bun, and Leano?
date: 2023-04-16
keywords: [md2blog,deno]
draft: true
---
In a previous post, I [set up incremental builds of this site using GNU Make](speeding-up-rebuilds-2.md). I was able to reduce the incremental build time (for updating a single post, on my [twelve year-old netbook](../programming-languages/minimal-dev-env-4.md#hello-netbook)) from 12 seconds (when doing a full rebuild using Deno) to 3 seconds (using Make, and a bunch of smaller scripts, all running under Deno). Unfortunately, the full rebuild time ballooned from 12 seconds to 90 seconds.

Just from watching the console output, it was apparent that Deno's startup overhead was a likely culprit, so I decided to compare Deno to a few other JavaScript runtimes.

# Hello, startup performance!
This is a completely unscientific benchmark, but to get a feel for the minimum amount of startup overhead, I decided to compare the time to run a simple "hello, world" program on:

* [Node](https://nodejs.org/) 18.14.2 (based on [V8](https://v8.dev/))
* [Deno](https://deno.land/) 1.31.1 (based on V8)
* [Bun](https://bun.sh/) 0.5.8 (based on [JavaScriptCore](https://developer.apple.com/documentation/javascriptcore))
* [Leano](../programming-languages/minimal-dev-env-3.md#success-and-leano) (based on [QuickJS](https://bellard.org/quickjs/))

Here are the results:

| Runtime | Elapsed time |
| :-- | --: |
| Node | 360 ms |
| Deno | 240 ms |
| Bun | (crashed) |
| Leano | 20 ms |

Deno being faster than Node definitely matches my subjective experience. Unfortunately for Bun, I wasn't able to get it to run under Alpine Linux (either installed via the bun.sh script or installed via Nix).

Leano is a minimal (barely functional) wrapper around QuickJS, so I figured it would be fast for a "hello, world", but I wasn't expecting it to be quite *that* fast!

Of course, this is a contrived example, and it's not clear how QuickJS will fare once I throw gigantic transpiled and bundled scripts at it.

# Template performance
One step above "hello, world" is the last stage of building this site, templating. All this does is read in JSON and HTML and interpolate them into a bunch of vanilla JS template literals. This seems like an ideal place to test Leano because it's a lot less JavaScript code than, say, syntax highlighting. Note: I already know from [a previous experiment](../programming-languages/minimal-dev-env-4.md#performance) that V8 can be 3 - 5 times faster than QuickJS (presumably due to just-in-time compilation and other optimizations) in a complex scenario like an md2blog full rebuild.

Here are the times needed to apply templates for posts on this site under both Deno and Leano (which use the same API):

| Runtime | Elapsed time |
| :-- | --: |
| Deno | |
| Leano | |

