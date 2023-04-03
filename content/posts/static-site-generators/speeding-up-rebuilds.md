---
title: Speeding up md2blog
description: md2blog is fast on my desktop, but slow on my Raspberry Pi. Here are my plans to improve rebuild performance.
date: 2023-03-07
keywords: [md2blog]
---
I've been happily using [md2blog](md2blog-deno.md) to generate this site for over a year now, but I recently ran into a problem: it's not as fast as it could be.

On my desktop computer, this is no big deal because a clean build only takes a couple of seconds and a live rebuild takes less than 2 seconds. But on my [minimal development environment I've been playing with](../programming-languages/minimal-dev-env-3.md) (which runs on a Raspberry Pi 1, model B), even after some basic optimization, it still takes 2 minutes to build the site from scratch! I haven't bothered to attempt a "live" rebuild.

One reason for this is the fact that md2blog always rebuilds the entire site, regardless of whether or not anything changed. This was a design decision I made solely to simplify the implementation, with the understanding that my site was small enough and my computer fast enough that it wouldn't matter. Now, my computer is slow.

# Solutions to explore
Here are some ideas I had for improving performance on low-end devices:

* **Hugo**: Give up on JavaScript/Deno/[Goldsmith](https://github.com/jaredkrinke/goldsmith) and port everything to [Hugo](https://gohugo.io/) (which is implemented in Go and therefore compiled to native code, so probably faster)
* **Rust**: Give up on JavaScript and rewrite md2blog (and possibly Goldsmith) in Rust (also compiles to native code, but without a garbage collector, so maybe even faster)
* **Caching**: Refactor Goldsmith so that it avoids rebuilding items whose source files haven't changed

## Hugo
Hugo is a popular static site generator. I [tried it out](hugo.md) when I was first creating this site, but I hated the template language and the learning curve for creating new themes was fairly steep. Despite my complaints, I admire Hugo's portability and speed, so I'm willing to give it another shot, so this option remains on the table.

**Update**: I looked into Hugo more, and it doesn't support deriving taxonomies from file system metadata (namely: parent directory), so I'd have to make some compromises (either to my workflow or the site design) if I wanted to switch to Hugo. Still on the table (just less attractive).

## Rust
I'd like to learn Rust because it's unique as a *safe* systems language, and redesigning/reimplementing Goldsmith+md2blog in Rust would be a great way to learn the language. Using a compiled language would enable parallel builds (although my Raspberry Pi 1 only has a single CPU core), and I suspect that native Markdown/syntax highlighting libraries would speed things up.

This would be a large project, but educational enough that I'm open to it.

## Caching
It's hard to estimate the impact of caching intermediate objects and outputs, but done correctly this would at least reduce the number of files written out from roughly 100, down to just a handful.

This option also has the attractive quality that it doesn't require reimplementing everything in a new language or framework, so it's probably the shortest path to performance improvements without functional regressions.

For now, I'm planning to investigate caching first since it's the easiest and safest option.

# Adding caching to Goldsmith
I never got around to documenting Goldsmith (the base upon which md2blog is built), but it's essentially "[Metalsmith](metalsmith.md) for Deno, with very few dependencies". Unfortunately, Metalsmith's data model (which Goldsmith copies) doesn't trivially lend itself to caching.

## Goldsmith's data model vs. caching
Goldsmith's data model is essentially one giant mutable map of filenames to metadata and content. A sequence of plugins manipulate this map, in order to transform input files to output files (adding/modifying metadata along the way). At the end of the plugin chain, files are written out to disk.

The problem with this approach is that output files never specify their dependencies. Looking at it from the other direction, if I modify this post's Markdown file, the only change to Goldsmith's initial data model is the content of this Markdown file. The problem is that this one input file could impact numerous output files: the post itself, the Atom feed, any category/keyword index pages (especially if keywords are added or removed), the home page, and, of course, the archive page.

## Caching requirements
In order to rebuild the minimal set of files when a change is detected, I need an accurate dependency graph. There are a couple of pitfalls:

* **The pipeline itself can change** (in general for Goldsmith, and in configuration for md2blog)
* Plugins always consume the entire data model (plugins internally may filter the set of files, but that's an implementation detail)
* Plugins can add/delete files at will (there isn't even a "rename" operation--it just shows up as two independent operations: add and delete)

## Brainstorming dependency graph approaches
Obviously, I could just mandate that Goldsmith plugins have to accurately enumerate their dependencies when adding or modifying entires in the collection data model. For md2blog, with its fixed pipeline, this should be feasible, but potentially error-prone.

Another approach would be to automatically gather dependency information for each output by providing the data model wrapped in a [proxy object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). The trick is scoping the proxy object to a single output, and I don't see a way to accomplish this without changing the plugin contract. One approach might be to create a new class of plugins that *only* transform/rename files individually. **This would also open the door to parallel processing of these "per-file" plugins**.

Having the dependency graph computed automatically is preferable, so I'll try that first.

## From dependencies to caching
Creating the dependency graph is necessary, but not sufficient. I'll need to also cache the intermediate results from plugins, along with the timestamps of input files so that I can:

1. Check to see which files have changed
1. Restart the build pipeline from the deepest point that hasn't changed
1. Add back in unmodified data model entries

## Testing
Other than ad-hoc tests, it will probably be a good idea to **run both the new cache-aware pipeline and the old rebuild-the-world approach to ensure there aren't any differences**.

I'll also, of course, need to **ensure that the additional overhead from caching isn't so large as to negate any of the benefits**, at least on my personal site (I'm not the only md2blog use in the entire world, but there are very few, and I suspect most won't ever find the updated version).

# Stay tuned
I have no idea how long this project will take or whether I'll abandon it, but if I make progress, I'll be sure to post an update (and link it from here--hopefully the rebuild picks up the change!).

**Update**: I prototyped [incremental builds using GNU Make](speeding-up-rebuilds-2.md).

