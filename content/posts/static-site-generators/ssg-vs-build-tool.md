---
title: Static site generators vs. build tools
description: This is a quick discussion of the differences between static site generators and build tools.
date: 2025-02-15
---
Static site generators (like [Hugo](https://gohugo.io/), [md2blog](https://jaredkrinke.github.io/md2blog/), or my latest fascination, [Blades](https://www.getblades.org/)) read input (often Markdown files) and produce output (HTML). Build tools (like [Make](https://en.wikipedia.org/wiki/Make_(software))) read input and produce output (or run tools that do so).

Static site generators and build tools sound similar. What makes them different?

# Differences
Here are some general differences:

| | Delegation | Build graph | Rebuilds |
|---|---|---|---|
| **Static site generators** | Self-contained, no external tools | Inputs are discovered and dynamic outputs are supported | Rebuilds restart from scratch |
| **Build tools** | Delegate compilation to external tools | Inputs and outputs are prescriptively listed | Intermediate objects are cached to the file system, enabling fast incremental rebuilds |

Let's consider these each in turn.

## Delegation
Build tools (like Make) usually delegate processing to external tools (like a C compiler). **This makes build tools more generic** (they can support multiple languages). Static site generators are less flexible (usually only supporting one or two types of input), so there isn't much motivation to extract processing into a separate tool.

## Build graph
Build tools are generally used to produce specific artifacts that are known ahead of time. Although it's possible to do so, I can't think of very many cases where you'd want a build tool to enumerate arbitrary files and producing unknown (or unexpected) outputs.

On the other hand, **it's more convenient to author a few Markdown files and then have a static site generator automatically find them and rebuild the site**.


## Rebuilds
**Because compilers are often slow, it is frequently important for build tools to cache intermediate objects to the file system, to avoid recompiling unchanged items**. Processing Markdown and generating HTML is generally fast, so there's less need to cache intermediate data.

Additionally, incremental rebuilds *require* the build graph to be easy to compute ahead of time. Now, I don't see a reason why static site generators *couldn't* infer (and cache) a build graph to support incremental rebuilds (in fact, I [prototyped a generic static site generator with accurate incremental rebuilds](lisp-ssg.md)... [twice](speeding-up-rebuilds-2.md)), but it's not as urgent of a concern for static site generators since building static sites is generally quick ([unless you're on slow hardware](speeding-up-rebuilds.md)).

# Summary
If I had to distill my thoughts into one sentence, I'd say that the build graph is the essential part: **static site generators discover their inputs and produce arbitrary outputs whereas build tools know their outputs ahead of time**. Oh, and static site generators produce HTML instead of programs, obviously.

I'm sure there are exceptions, and you could argue that static site generators are a subset of build tools, but I'm going to dogmatically stick to the bolded claim above.