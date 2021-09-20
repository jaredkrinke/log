---
title: Static site generation anecdotes
description: Tales of static site generators in the pre-Markdown age.
keywords: [bash,xslt,sed]
date: 2021-09-12
---

Feel free to skip this post about my personal history with static sites.

# Static sites without the generator
Prior to the year 2000, I maintained a couple of static web sites using just notepad (no build process or even templates). Redesigning a site required editing every page by hand, so I just tried to avoid redesigns entirely. This tedious experience sowed the seeds of my later static site generator projects.

# First attempt
Fast forward to 2001. When free web page hosting was usually limited to a couple of megabytes and static files (uploaded via [FTP](https://en.wikipedia.org/wiki/File_Transfer_Protocol)) were the only option, I actually created a static site generator. It was written in C++ and allowed you to define custom elements using an XML-like syntax. It was one of my earliest programming projects and it introduced me to the joy of creating yet another string class and the horrors of Autoconf. I published it as open source software and, surprisingly, there was one guy who ended up using it for a large site (mostly just because he could store all his content in one huge file).

# New and improved
A year later (in 2002), I rewrote the tool--this time with a domain-specific language (still influenced by XML) and the ability to target multiple output formats (HTML, [man pages](https://en.wikipedia.org/wiki/Man_page), and even plain text). I also wisely used the `string` class from C++'s standard library instead of reinventing the wheel. Despite the improvements, I didn't end up using this tool very much because, frankly, I didn't have a lot of content to post anyway. I don't think anyone else ended up using this version of the tool.

# The UNIX way
The following year (2003), I was enamored with the UNIX philosophy of stringing together simple text-based tools, so of course I made yet another static site generator. This one (which I never released, and nearly lost recently) had some unique features, including the ability to aggregate content across multiple sites.

Unlike my previous tools, this one was not written in C++; in fact, in wasn't written in a compiled language at all. In true UNIX fashion, this static site generator composed a bunch of standard UNIX tools, using [Bourne shell](https://en.wikipedia.org/wiki/Bourne_shell) script as the glue.

The most user-friendly change was that I switched from XML-like markup to wiki-like plain text formatting (very similar to [Markdown](https://en.wikipedia.org/wiki/Markdown), which didn't exist at the time). Despite this huge boost in ergonomics, I went overboard with trying to use standard tools and settled on a decidedly *not* user-friendly template system based on the ever verbose [XSLT](https://www.w3.org/Style/XSL/). Very contradictory choices...

The workflow was quite a doozy, utilizing a long list of tools:

1. Loop through directories using `ls` (one for each topic, following symbolic links, if needed)
1. Escape topic and post names using `tr` for URL-friendliness
1. Loop through posts (one directory for each)
    1. Test if the file had been modified since last generated
    1. Resolve the relative path using `$PWD` and `sed`
    1. Find the "body" (post content) file and format its last modified time using `find` and `date`
    1. Create a summary using `cat ... |head -c 150`
    1. Generate structured XML for the post, as follows
        1. Image files were passed through, but thumbnails were generated using [Image Magick](https://imagemagick.org/index.php)'s `mogrify` tool and captions came from a `.caption` file sitting next to the image file
        1. The content file used my own text-based format that was similar in spirit to Markdown (but Markdown hadn't been invented yet!)
        1. My wiki/Markdown-esque format was implemented entirely using regular expressions (via `sed`), supporting headings, bold text, bulleted lists, and blocks of text or code
        1. There was also some automatic branding and linking using `m4` for find and replace
        1. (Non-inline) References to other URLs were simply just files containing a URL
1. Concatenate all the XML files into one big XML file
1. Generate a home page, an archive page, an RSS feed using XSLT (via `xsltproc`)
1. Generate each post that isn't up to date using XSLT
1. Upload each modified file by generating FTP commands in a shell script and piping that to [SFTP](https://en.wikipedia.org/wiki/SSH_File_Transfer_Protocol#SFTP_client)

It's a bit convoluted for sure, but (other than not using Markdown, which didn't exist until 2004) it relied solely on standard tools. Maybe XSL isn't everyone's favorite, but at least I didn't invent my own template language this time!

**Update**: [Here's the code](https://github.com/jaredkrinke/flog)

# Now what?
So what would I do differently today? I already briefly outlined my ideal workflow (using separate files, Markdown, etc.) in the [last post](overview.md), but I didn't delve into implementation details.

Ideally, I won't have to create my own static site generator today because there are a lot more "off the shelf" options available in 2021. If I did have to write one, I'd probably use [Node](https://nodejs.org/en/[) or [Deno](https://deno.land/) with [TypeScript](https://www.typescriptlang.org/) and possibly [JSX](https://reactjs.org/docs/introducing-jsx.html) for templates. Diagrams would perhaps use [Mermaid](https://mermaid-js.github.io/mermaid/#/) (rendered to SVG at build time), and the whole thing would have a (gasp) GUI implemented using [Visual Studio Code's editor component](https://microsoft.github.io/monaco-editor/), packaged in a reasonably sized executable (perhaps using [Neutralino](https://neutralino.js.org/)).

Here's hoping I don't have to build such a tool!