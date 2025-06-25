---
title: Syntax highlighting for 150 languages in < 200 KB
description: It's not bloat if I actually use it, right?
date: 2025-06-25
keywords: [lua]
---
# luasmith
After [creating a 270 KB static site generator](smallest-static-site-generator.md) and [adding link-checking with minimal bloat](extending-luasmith.md), the feature creep continues: [luasmith](https://github.com/jaredkrinke/luasmith) now supports syntax highlighting for ~150 languages--**and it only increased the gzipped download by about 180 KB**!

This post briefly describes my path to adding lightweight and customizable syntax highlighting.

## Self-hosting
Aside: this site is now built using luasmith (instead of [md2blog](https://github.com/jaredkrinke/md2blog))! Syntax highlighting was the last missing feature.

# Research

## Initial research
My initial research was fruitless:

* [highlight.js](https://highlightjs.org/) is what I used in md2blog, but it requires JavaScript (or at least a JS regular expression engine) so it couldn't be simply integrated into Lua-based luasmith
* [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) is the undisputed king of high performance syntax highlighting, but it didn't appear to provide an interpreter (instead relying on code generation and a C compiler) -- and, honestly, it seems like overkill for coloring a few code samples on my tiny site
* Most other highlighters were implemented in JavaScript, Rust, or Go which, like highlight.js would significantly complicate luasmith's build process

What I needed was something either Lua-native or small but easily extensible.

## LPeg and Scintillua
The most obvious starting point for parsing in Lua is [LPeg](https://www.inf.puc-rio.br/~roberto/lpeg/), by none other than the original creator of Lua. While investigating LPeg-based highlighters, I ran across [Scintillua](https://orbitalquark.github.io/scintillua/), which supports an impressive number of languages with a minimalist approach--it's even apparently used in the lightweight [vis](https://github.com/martanne/vis) editor.

**Given Scintillua uses one tenth the code of highlight.js and it's Lua-native, it was exactly what I was looking for.**

# Implementation
Rather than ship a zip with 100+ Lua files from Scintillua, I decided to embed all those scripts directly into the executable (with the ability to locally override them, as needed). The only trick was that Scintillua, in its library form, implements its own file search and load system based on probing files with Lua's `loadfile` function. I ended up wrapping `loadfile` with some code to detect Scintillua's calls and point them at the embedded strings (which are lazily loaded into Lua).

In the end, adding in LPeg, Scintillua, almost all its grammars, and glue code only added around 175 KB to the (gzip-compressed) tarball (a 67% increase--not as bad as I originally feared). Even better, syntax highlighting for my blog only increased the generation time by around 50%.

Finally, I have a small, simple static site generator that does what I want!

# Bonus: authoring an etlua grammar
One aspect of Scintillua that hooked me was that adding new grammars simply required writing some Lua code, using the LPeg library. I had not actually used LPeg before, but [its documentation](https://www.inf.puc-rio.br/~roberto/lpeg/) was easy to understand (and there's also [a great LPeg tutorial on leafo.net](https://leafo.net/guides/parsing-expression-grammars.html)).

Given that luasmith uses [etlua](https://github.com/leafo/etlua) for templates, I thought it would be fun to write a syntax highlighter for etlua.

## Structure
Scintillua's documentation provides [information and examples for embedding one parser within another](https://orbitalquark.github.io/scintillua/api.html#embedded-lexers). In the case of etlua, I'm assuming Lua code will always be embedded in HTML, so an etlua parser should simply be an HTML parser with Lua embedded between `<%` ... `%>` tags. The author of Scintillua even pointed out to me that there's already a very similar parser: [RHTML](https://github.com/orbitalquark/scintillua/blob/default/lexers/rhtml.lua) (Ruby in HTML).

## Implementation
Using the RHTML parser as a starting point, it was simply a matter of including the appropriate start and end tags (note: LPeg uses Lua metatables for repurposing arithmetic operations as parsing expression grammar building blocks, e.g. `^-1` means "at most one", `*` means "concatenation/and", and `+` means "alternation/or" -- and `lpeg.P(...)` just matches string literals). Here's the trivial parser:

```lua
local lexer = lexer
local P, S = lpeg.P, lpeg.S

-- Base on the existing HTML parser
local lex = lexer.new(..., {inherit = lexer.load('html')})

-- Embed the existing Lua parser
local lua = lexer.load('lua')

-- Specify `<%` and `%>` (and highlight the tags as "preprocessor directives")
local start_rule = lex:tag(lexer.PREPROCESSOR, '<%' * (P('=') + P('-'))^-1)
local end_rule = lex:tag(lexer.PREPROCESSOR, P('-')^-1 * '%>')

-- Highlight contained code as Lua
lex:embed(lua, start_rule, end_rule)

return lex
```

## Result
Finally, here is an example of a highlighted etlua template:

```etlua
<ul>
<% for i, item in ipairs(table.sortBy(items, "date", true)) do -%>
<li><a href="<%= item.path %>"><%= item.title %></a></li>
<% end -%>
</ul>
```

Not too bad for a few lines of Lua!
