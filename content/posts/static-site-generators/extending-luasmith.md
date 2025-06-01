---
title: luasmith gets link-checking and improved Atom feeds
description: Feature creep has set in for my ~270 KB static site generator, luasmith.
date: 2025-06-01
keywords: [lua]
---
Recently, I created [luasmith](https://github.com/jaredkrinke/luasmith), [a ~270 KB static site generator](smallest-static-site-generator.md), with a focus on being small and simple. Obviously, I am now recklessly stuffing it with features.

# "Bloat"
The initial version of luasmith lacked some functionality I valued from [md2blog](https://jaredkrinke.github.io/md2blog/):

* Checking for broken internal links (including hashes/fragments/anchors)
* Including post content directly within the Atom feed

Now, the latest release of luasmith includes these features, and there's good news from a bloat perspective:

* These additions **only added ~3 KB to the (compressed) size of the release**
* **Generating my blog still takes < 200 ms**, on an old laptop (though it *is* ~20% slower, in relative terms)

# Why now? How?
The reason luasmith didn't originally include these features, despite their utility, is that they require **additional parsing** (well... you could maybe hook into the Markdown parser, but, besides tight coupling, it wouldn't work outside of Markdown). For link-checking, it's obvious why parsing is required. For Atom feed content, the reason is that most RSS/Atom readers don't support adjusting relative links using [xml:base](https://www.w3.org/TR/xmlbase/), so relative links from e.g. `posts/topic/foo.html` won't work without modification when viewed from `posts/feed.xml` (which is in a different directory). (My solution is to rewrite relative links.)

**Rather than pull in some heavyweight parsing library, I decided to roll my own minimal HTML parser/transformer: [chtml](https://github.com/jaredkrinke/chtml)**. It's probably deficient and definitely poorly documented, but it seems to work.

## Lua
Once again, I've found C and Lua to be a comfortable combination. I wasn't looking forward to writing string manipulation code in C, but I had no need to fear--I just pushed all string manipulation into the somewhat safer world of Lua. Problem ~~solved~~ avoided!

Having said that, **I'm still trying to decide how I *really* feel about Lua**. On the one hand, I like that I can easily integrate C code, leading to a process where I write performance-critical code in C and everything else in Lua. This combination provides both convenience and performance. *But* I am starting to wonder if it would make more sense to just write *everything* in a more featureful language and then rely on a JIT to make things fast. Yes, I'm talking about TypeScript/JavaScript and Node.js. **It frustrates me to pull in such a huge engineering effort (V8), just to make my own developer life a bit more convenient**... but I can see why businesses are constantly making that choice. Of course, I also dislike these businesses' bloated results, so I don't necessarily *agree* with their logic. Like I said: still pondering.

# The last, biggest challenge
Annoyingly, I'm still not at the point where I can fully replace md2blog because I like build-time syntax highlighting for code blocks. md2blog uses [highlight.js](https://highlightjs.org/) for syntax highlighting, and it was super convenient to integrate with Node and Deno. But luasmith is built on C and Lua instead of JavaScript, so highlight.js doesn't really have a place to plug in. Embedding QuickJS just for highlight.js would contradict my simplicity goal, so I need a different solution. Sadly, most syntax highlighting solutions seem to be based on JavaScript. Or Rust, which I am also avoiding for this side project, due to complexity. It's almost certainly misguided, but, **for hobbies, I'd like to stick to a software stack that I feel like I can at least ever have a hope of understanding in its entirety**.

Maybe some day I will work up the nerve to integrate [Tree-sitter](https://github.com/tree-sitter/tree-sitter) and a bunch of associated grammars, to add syntax highlighting (bringing luasmith into build-time featuer parity with md2blog), but I'm sure that will massively increase the size and (internal) complexity of luasmith. Or perhaps I can write an optional, external tool that is purpose-built for syntax highlighting. We'll see...
