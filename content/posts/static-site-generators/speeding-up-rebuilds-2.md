---
title: Speeding up md2blog, part 2
description: Using GNU Make to enable incremental builds of this site.
date: 2023-04-02
keywords: [deno,md2blog,netbooks]
---
In [part 1](speeding-up-rebuilds.md), I brainstormed some ideas to speed up rebuilds of my static site (because I've been [playing around with using old/slow computers](../programming-languages/minimal-dev-env-3.md)).

In this update, I'm going to share a potentially misguided (but functional!) approach to supporting incremental builds using [GNU Make](https://www.gnu.org/software/make/). The code is [here](https://github.com/jaredkrinke/make-blog).

# Background
My static site generator, [md2blog](md2blog-deno.md), is written in TypeScript, simply because I'm used to the language and it's popular. On my desktop computer, rebuilding this site is trivially fast. But once I switched to a Raspberry Pi 1 B (and now a 12 year-old netbook), the overhead of JavaScript became more noticeable. On my netbook, I've been able to get the full rebuild time of this site (only full rebuilds are supported in md2blog) down to about 12 seconds. This is tolerable, but obviously still inefficient. If I'm only adding or modifying a single post, why should I rebuild the entire site?

Incremental builds should be possible by caching some intermediate state. Originally, I'd hoped to implement a generic solution in TypeScript, but part way through I realized that I was essentially reimplementing Make. So why not just use Make?

# md2blog's build process
md2blog is designed to be simple, but complete. This means that the build process is straight-forward:

* Clean up the output directory (delete everything)
* Read (and validate) site-wide metadata from `site.json`
* Read (and validate) front matter from all posts (and remove drafts, if requested)
* Implicitly tag posts with their parent directory name (in addition to any explicitly-entered keywords)
* Generate an index of tags to posts
* Generate some necessary files (error page, stylesheet)
* Process Markdown (adding syntax highlighting and rewriting relative `*.md` links, as needed)
* Generate an Atom feed of recent posts
* Generate an archive and tag index pages
* Validate all internal links

After writing down that list, I'm realizing there are a lot of steps, but they're mostly just to support implicit tags and various index pages. Regardless, it's relatively straight-forward.

# Using GNU Make
Like a good little developer, I've shied away from using GNU Make-specific functionality, and have just used the limited subset of Make that is widely supported. But for this project, I ended up needing to dig deep into GNU Make's functionality to model md2blog's build process correctly.

Specifically, there were a few aspects of md2blog's build process that were tricky to implement using GNU Make:

* Enumerating posts and their implicit directory structure
* Cleaning up extraneous files in the `out` directory
* Aggregating all posts into a single archive
* Discovering and handling tags that don't correspond to any directory (i.e. keywords)

## Enumerating and cleaning files
In this case, I wanted to avoid listing all posts explicitly in my `Makefile`--I just wanted it to discover all of the files in the file system, a la "classic" md2blog. GNU Make supports enumerating files by letting you delegate that job to the `find` command:

```Makefile
# Use "find" to enumerate all directories and files under "content/" (excluding "content/" itself)
INPUT_FILES := $(shell find content -follow -type f -not -name '.*')
INPUT_DIRECTORIES := $(filter-out content,$(shell find content -follow -type d))
```

Note that in the above snippet I also enumerate directories. This is so that I can recreate the same directory structure in the output directory. I also exclude files beginning with a dot (e.g. swap files).

How do I "clean" up any extraneous files *before* anything builds? The only reliable solution I could come up with was to sneakily run a command while expanding an usused *simply expanded* (`:=` instead of `=`) variable (note: it must be simply expanded to ensure it is expanded first, and only once):

```Makefile
INPUT_FILES_POSTS := $(filter content/posts/%.md,$(INPUT_FILES))
INTERMEDIATE_FILES_POST_METADATA := $(patsubst content/posts/%.md,cache/posts/%.metadata.json,$(INPUT_FILES_POSTS))
...
INTERMEDIATE_FILES_EXTRANEOUS := $(filter-out $(INTERMEDIATE_FILES),$(shell mkdir -p cache && find cache -type f))
...
TIDY_RESULT := $(shell rm -f $(INTERMEDIATE_FILES_EXTRANEOUS))
```

This feels like a hack, since it relies on a side-effect of a `$(shell ...)` expansion, but it's the best solution I could come up with.

## Aggregating posts
Aggregating a bunch of posts into a single index sounds like a trivial problem, and it really should be. But since GNU Make relies on command lines, I'm paranoid that any solution which relies on passing paths to *every* post via the command line will run into the dreaded command line length limit (which varies significantly in the wild, and isn't always documented properly).

The only solution I could come up with was to pass the large list via the file system. This could either be done using a file that lists the paths, or it could be implicit by searching a directory tree (assuming that the tree has been purged of extraneous files--as I do above).

```Makefile
cache/posts/index.json: $(INTERMEDIATE_FILES_POST_METADATA) | $(INTERMEDIATE_DIRECTORIES)
	deno run --allow-read=cache --allow-write=cache index.ts cache/posts $@
```

Note the order-only prerequisite for `$(INTERMEDIATE_DIRECTORIES)` that ensures the directory structure is already in place before the script runs.

### Aside on AI/GPT
Given that I was somewhat stumped by this problem, I decided to try asking Bing's fancy new GPT-based AI chat thingy. Its response was pretty underwhelming. Its first suggestion was to switch from GNU Make to... GNU Make. The second suggestion was to use VPATHs--but that's a solution to a different problem. And its last suggestion was just clearly copy-pasted--without proper context!--from GNU Make's documentation.

Overall, the answer pointed to documentation I had already consulted (so it *did* find information I had already noted as potentially relevant), but the answer was mostly "just don't do that, duh!". Color me not impressed.

## Discovering tags that don't exist as directories
My current solution to discovering tags that don't also exist as directories runs a script that enumerates tags programmatically and then outputs *all* index pages. This requires also managing the creation and non-cleanup-ification of those directories. Sadly, my current solution has a bug (it doesn't programmatically clean up extraneous tag indexes), but the scenario (deleting a unique keyword) is rare enough that I haven't bothered to fix the bug yet.

Here's where I had to hack in a pattern to avoid treating programmatically-discovered tags' index pages as extraneous (for the purposes of cleaning up the output directory):

```Makefile
OUTPUT_FILES_EXTRANEOUS := $(filter-out $(OUTPUT_FILES) out/posts/%/index.html,$(shell mkdir -p out && find out -type f))
```

# Performance
So was this all worth it? The answer is: kind of. Here's a table with the results:

| Scenario | Elapsed time | 
| :-- | --: |
| Full rebuild using "classic" md2blog | 12 seconds |
| Full rebuild using "make" | 90 seconds |
| Incremental build using "make" | 3 seconds |

I haven't heavily optimized the incremental build process, but as it stands currently, an incremental build using Make is 4x faster, but a full rebuild using Make is 8x slower. If I could get the "full rebuild" time down to a reasonable level, I'd be very happy.

## Bottlenecks
The biggest issue with leveraging Make in this case is that it spins up a separate process for each build command, but I'm using a JavaScript runtime that has a significant startup cost. I'm not sure exactly how Deno works internally, but setting up a relatively heavy JavaScript environment for processing markdown and adding syntax highlighting, just for a single file, seems wasteful and slow (even when running in parallel--something that GNU Make enables).

## Potential improvements
There's a silver lining, however. Because Make decomposes each step into a separate command line, I could theoretically replace the underlying tool of the slowest commands with a more efficient implementation (without touching anything else). In my case, the slowest processes are syntax highlighting and processing markdown (in that order). I'm tempted to try using native code implementations of these two steps to see how much startup/process creation overhead that avoids.

Another solution might be to run a persistent JavaScript server and use a trivial tool to communicate with it. For example, running an HTTP server with Deno and using `wget` in my command lines to send it processing jobs. I'm not sure if GNU Make has any support for such a server process, but I suspect I could hack something together by launching a server process into the background and just having it spin itself down after some number of seconds of inactivity.

# This post brought to you by **make-blog**
A 9 second improvement for incremental builds doesn't sound terribly noticeable, but just in the process of authoring this post I'm already finding it useful. Now I can tweak a few words or a bit of formatting and view the result (almost) immediately, even on my super slow twelve year-old netbook.

I'll most likely continue using "old" md2blog for officially updating the site prior to publishing (just because I'm paranoid), but I'm still satisfied with my improved local workflow.

In case anyone's curious, here is the code:

* [make-blog](https://github.com/jaredkrinke/make-blog)

