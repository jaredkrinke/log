---
title: Speeding up md2blog, part 3
description: I made a rookie mistake while trying to optimize my workflow for building this site.
date: 2023-04-07
keywords: [md2blog]
---
In [part 2](speeding-up-rebuilds-2.md), I added support for incremental builds of this site, based on GNU Make.

# Original thought process
My reasoning for investigating incremental builds seemed sound:

* Rebuilding the entire site *every time* was obviously unnecessary
* Based on some measurements, syntax highlighting and processing Markdown were the most time-consuming operations (in that order), by far
* Thus, it made sense to avoid re-running these steps for pages that didn't require updates

I went ahead with my experiment fully aware that GNU Make probably wasn't well-suited to the project (because it creates a new process for each task and Deno, while reasonable, has significant startup overhead). I'm still happy I used Make because this issue has straight-forward mitigations: don't spin up new processes (e.g. rely on a server) or move the dependency graph into md2blog's main process.

# But...
... I made a rookie mistake. Rather than carefully scrutinizing my workflow, I just charged ahead with optimizing the obvious bottleneck. In the end, I was able to easily get the incremental build down to 3 seconds (N.B. on a 12 year-old netbook). This meant that I could author a new post and view the results on my (slow) computer fairly quickly, to enable fast iteration.

So what's the problem?

The problem is that I measured a full clean build in isolation, but my actual workflow when using md2blog is to run md2blog as a server that watches the file system and automatically triggers rebuilds, and *those* subsequent (full) rebuilds are not only about 50% faster (down in the 6 second range), they are also ripe for *even simpler* optimizations.

# A new approach
Given that rebuilds in my "edit and test" (hot-reloading server) workflow all run in the same process and most of the work is redundant (rebuilding pages that haven't changed), and that the most expensive operation (by far) is adding syntax highlighting, one trivial optimization would be to simply [memoize](https://en.wikipedia.org/wiki/Memoization) the syntax highlighting function.

For memory efficiency, I initially planned to hash input strings and use that as the key to look up results in a cache. This ended up being trickier than I expected because the [`crypto.subtle.digest`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest) function provides its result asynchronously and [Marked's highlight callback](https://marked.js.org/using_advanced#highlight) is synchronous. In the end, I decided this was premature optimization anyway--I'm already going to be caching the entire output in memory, so caching the entire input as well is just a linear increase in memory usage--there's no need to complicate things.

After writing about 10 lines of trivial code, I had a working cache, and rebuilds were under 3 seconds--faster than my previous convoluted incremental approach. Most of the remaining time was simply validating that internal links are not broken (a step I haven't implemented in my Makefile yet).

Lesson learned: always measure and optimize the *actual* scenario--not an artifical (or easier to measure) one!

# Further optimizations
With this one trivial optimization, I got an acceptably fast workflow, even on a 12 year-old netbook. But there were still two obvious avenues for improvement (that didn't involve switching languages or runtimes):

1. Move internal link-checking off the critical path of my workflow (either by deferring it or skipping it entirely--broken links will be caught when I do a full "official" build, prior to uploading the site)
1. Implement real incremental builds, at least for internal rebuilds (done properly, this could even avoid a significant chunk of link-checking work)

After moving link-checking off the critical path (#1 above), hot rebuilds now complete in under a second (with link-checking completing a second or two later), so I'm no longer feeling terribly motivated to rearchitect everything around an accurate dependency graph (#2), at least not until I either add enough content to make things feels sluggish once again or I downgrade to an even slower computer.

