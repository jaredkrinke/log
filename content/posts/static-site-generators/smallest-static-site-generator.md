---
title: A 270 KB static site generator based on Markdown and Lua
description: Tired of bloat, I made a new static site generator that is 10x faster and 100x smaller than my last effort. And this one runs on NetBSD.
date: 2025-04-22
keywords: [lua]
---
Today, I unveil my most gratuitous static site generator yet: [luasmith](https://github.com/jaredkrinke/luasmith).

* **It's ~~270 KB~~ 450 KB** (static binary + templates for this site, gzip compressed)
* **It builds my ~140 page site in ~~150 ms~~ 300 ms** (wall clock time, on an 11-year-old old laptop)
* **It performs acceptably on a 28-year-old laptop, running NetBSD** (Pentium 166 MHz)
* **It's trivial to compile**, requiring only a C compiler, `make`, `sed`, and `sh`

# Show me the code!
It's like [Metalsmith](https://metalsmith.io/) in Lua. See [the tutorial](https://github.com/jaredkrinke/luasmith/blob/main/docs/tutorial.md) for more, but here's an example that converts Markdown to HTML and adds the page's title to the resulting HTML:

```lua
-- Minimal HTML template (used below)
local outer = [[
<html>
  <head><title><%= title %></title></head>
  <body><%- content %></body>
</html>
]]

-- Read content/*.md, convert to HTML,
-- apply template, write to out/*.html
return {
  readFromSource("content"),
  processMarkdown(),
  applyTemplates({ { "%.html$", outer } }),
  writeToDestination("out"),
}
```

# Motivation
Obviously, the world does not need another static site generator--and I don't expect this SSG to become popular. So how did I end up here?

In a word, my motivation was: **simplicity**. I wanted an SSG that was:

* Simple to understand
* Simple to bootstrap
* Simple to maintain
* Simple to deploy

# Implementation
Here's my take on the goals above.

## Simple to understand
First, I wanted the architecture to be simple:

* The build pipeline is just a Lua script (similar to [Metalsmith](https://metalsmith.io/))
* **Page templates are constructed using Lua** (via [etlua](https://github.com/leafo/etlua))
* Metadata on items can be specified in frontmatter using Lua (or a subset of YAML)
* **Relative links between Markdown files "just work"** and are checked at build time (including links to headings)

Instead of creating a bespoke domain-specific language for defining the structure of a generated site or its templates, you just write some Lua code that glues together a few processing nodes and then supply templates that *also* use Lua (e.g. for iteration).

Overall, I'd describe the architecture as "**Metalsmith in Lua, with zero runtime dependencies** (beyond libc)".

## Simple to bootstrap
Given my [musings about future-proof programming languages](../programming-languages/future-proof-languages.html), it's obvious that I'd like to be able to continue to compile and use my software in the future. That is easier said than done! The problem is that identifying languages that will stick around is hard. Twenty years ago, Perl might have been a reasonable choice for an SSG, but today I don't even remember how to setup a Perl project.

[The best static site generator ever made](https://jaredkrinke.github.io/md2blog/) is built on TypeScript/JavaScript and [Deno](https://deno.com/). As much as I like Deno, I'm not sure it will be maintained decades down the road. Given that I'll never know how to get it running on an i586 computer, I have doubts I'd be able to get it running on potential future architectures either.

**To avoid these headaches, I went with the lowest common denominator: C**. It's not convenient, it's not modern, but C works everywhere and I'm certain C will persist (for better or worse).

Aside: ideally, I'd be writing as much native code in Rust as possible, to ensure memory safety. Unfortunately, **Rust's modern approach is at odds with my desire for simplicity**. The toolchain is huge, the dependency trees are large, and the language is vast. Rust definitely looks like the future of robust low-level software, but **for cozy side projects, I prefer being a simpleton living in the past**.

## Simple to maintain
One frustration I have with the JavaScript ecosystem is that it's constantly changing. Node, Deno, and Bun do a respectable job of keeping old versions around, but I don't want to have to worry about breaking changes.

On the other hand, C changes very slowly, and previous verisons of Lua are essentially set in stone. Throw in some static linking, and you've even got an artifact that should stay usable for a long time.

I've also minimized the number of (vendored, compile-time) dependencies involved. Here's the full list:

* [md4c](https://github.com/mity/md4c) for converting Markdown to HTML
* [Lua](https://www.lua.org/) for metadata, scripting, etc.
* [etlua](https://github.com/leafo/etlua) for templates

**Update**: Added in a few more for syntax highlighting:

* [LPeg](https://www.inf.puc-rio.br/~roberto/lpeg/)
* [Scintillua](https://github.com/orbitalquark/scintillua)

**You'll note that these libraries are doing all of the heavy lifting**. I've basically only written glue code, an entry point, and some infrastructure. And most of the code I wrote is in Lua (which is much easier to write than C--and fast enough for all but the innermost loops).

## Simple to deploy
Static binaries are wonderful. *Tiny* static binaries are even wonderful-er. **Just copy over a tiny zip file, unzip it, and you're done**. Need I say more?

# Downsides
Of course, there are downsides to the approach I took:

* Writing C code is fraught with peril -- fortunately, the hardest parts were mostly already done by the md4c and Lua authors
* Syntax highlighting is *not* simple -- so I just cut that feature, at least for now (**update**: syntax highlighting is now supported!)
* The security model of an SSG that uses Lua scripts for everything is... not ideal -- **only use templates you trust!**

Additionally, I haven't taken the time to setup a proper development and debugging environment for C and Lua. I need to investiage static analysis and debugging tools for Lua, as well as find a tolerable frontend for GDB. This is where I really miss Emacs+SLIME for Common Lisp or VS Code for TypeScript/Python.

# Future areas of exploration
Now that I've got a static site generator running on a vintage laptop with NetBSD, where am I headed next? I'm not exactly sure, but some ideas follow.

## Designing for the text-mode web
At some point, I'd like to redesign my site using an even more minimal theme. In fact, **I'd like to optimize my site for text mode browsers** like [lynx](https://lynx.browser.org/) and [w3m](https://w3m.sourceforge.net/). Why? Because I like using w3m and I want my site to be easy to use within w3m. Or maybe it's because I hate how bloated modern web browsers have become.

## Further simplifying distribution
Distributing native code necessarily requires per-platform packages. Or does it? Can I package and release this minimal static site generator as a multi-OS polyglot binary using [Cosmopolitan libc](https://github.com/jart/cosmopolitan)? Note: sadly, I don't think 32-bit/i386 is supported for now.

## Simplifying the entire system
I'd like to see if I can bootstrap my entire web site's workflow from [Oasis Linux](https://github.com/oasislinux/oasis) (a small, statically linked, Linux-based operating system that is simple, but capable). **Oasis sounds like a modern system that a single person can wrap their head around** (minus the Linux kernel--though perhaps a simpler kernel could be substitutded...).

## Blogging on vintage computers
I'm curious how far back I can go as far as vintage computing and still be able to build a static site. Can I build my SSG on Windows 98? DOS? Amiga? Inquiring minds want to know!

## Incremental builds
Speaking of old, slow computers, I secretly designed this SSG to support incremental rebuilds to ensure that it runs fast even on old hardware. The only issue with this plan is that **md4c is so fast that I'm not sure it's worth optimizing the build process**. I can rebuild my entire site from scratch on a 166 MHz laptop in a few seconds.

# Conclusion
Creating a *non-bloated* Markdown-based static site generator has been a bucket list item for me--and now it's done!

Beyond personal goals, **I found C+Lua to be a comfortable combination for side projects**. This came as a surprise! Lua isn't my favorite language to write (though it's certainly much simpler to wield than C). Having said that, it's a beautifully simple language that's easy to integrate. Despite being primarily driven to Lua by my goal of building a small (in binary size) tool, Lua's minimalist take on a mostly-normal-looking scripting language won me over because I could literally pick it up and be productive within an hour or two.

With that out of the way, **I should probably attend to hobbies other than static site generator performance art**. Until next time!

# Resources
* [Repository for luasmith](https://github.com/jaredkrinke/luasmith)
* [Tutorial for luasmith](https://github.com/jaredkrinke/luasmith/blob/main/docs/tutorial.md)
