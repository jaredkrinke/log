---
title: Syntax highlighting for 150 languages in < 200 KB
description: It's not bloat if I actually use it, right?
date: 2025-06-25
keywords: [lua]
---
After [creating a (formerly) 270 KB static site generator](smallest-static-site-generator.md) and [adding internal link-checking with minimal bloat](extending-luasmith.md), the feature creep continues: [luasmith](https://github.com/jaredkrinke/luasmith) now supports syntax highlighting for ~150 languages, thanks to [Scintillua](https://orbitalquark.github.io/scintillua/)--**and it only increased the gzipped download by about 180 KB**!

This post describes my path to adding lightweight and customizable syntax highlighting to luasmith.

# Research
## Initial research
My initial research on existing well-supported solutions was fruitless:

* [highlight.js](https://highlightjs.org/) is what I used in [md2blog](https://github.com/jaredkrinke/md2blog), but it required JavaScript (or at least a JS regular expression engine?) so it couldn't be trivially integrated into Lua-based luasmith
* [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) is the undisputed king of high performance syntax highlighting, but it didn't appear to provide an interpreter (instead relying on code generation and a C compiler) -- and, honestly, it seemed like overkill for coloring a few code samples on my tiny site
* Most other highlighters were implemented in JavaScript, Rust, or Go, which, like highlight.js, would significantly complicate luasmith's dependency tree and build process

**What I wanted was something either Lua-native or small but easily extensible.**

## LPeg and Scintillua
The most obvious starting point for parsing in Lua is [LPeg](https://www.inf.puc-rio.br/~roberto/lpeg/), from the same folks who created Lua. While investigating LPeg-based highlighters, I ran across [Scintillua](https://orbitalquark.github.io/scintillua/), which supports an impressive number of languages with a minimalist approach--it's even apparently used in the lightweight [vis](https://github.com/martanne/vis) editor.

Investigating further, I found that [Scintillua was well documented](https://orbitalquark.github.io/scintillua/api.html) and a sample grammar from the documentation was easy to understand. Here's that sample grammar, for reference:

```lua
local lexer = lexer
local P, S = lpeg.P, lpeg.S

local lex = lexer.new(...)

lex:add_rule('keyword', lex:tag(lexer.KEYWORD, lex:word_match(lexer.KEYWORD)))
lex:add_rule('custom', lex:tag('custom', 'quux'))
lex:add_rule('identifier', lex:tag(lexer.IDENTIFIER, lexer.word))
lex:add_rule('string', lex:tag(lexer.STRING, lexer.range('"')))
lex:add_rule('comment', lex:tag(lexer.COMMENT, lexer.to_eol('#')))
lex:add_rule('number', lex:tag(lexer.NUMBER, lexer.number))
lex:add_rule('operator', lex:tag(lexer.OPERATOR, S('+-*/%^=<>,.()[]{}')))

lex:add_fold_point(lexer.OPERATOR, '{', '}')

lex:set_word_list(lexer.KEYWORD, {'foo', 'bar', 'baz'})

return lex
```

**Given that Scintillua used one tenth the code of highlight.js and was Lua-native and well documented, it was exactly what I was looking for.**

# Implementation
## Highlighting code blocks
For maximum efficiency, I would have hooked syntax highlighting directly into [md4c](https://github.com/mity/md4c) (the Markdown parser luasmith uses), so that it would syntax-highlight code as it is parsed. That might have required creating a callback mechanism for md4c, leading to Lua-calling-into-C-calling-into-Lua messiness.

In pursuit of relentless ~~laziness~~ simplicity, I instead used [the trivial HTML parser I previous created for link-checking](extending-luasmith.md) to find `<pre>` and `<code>` blocks with `language-*` CSS classes on them, and funneled those into Scintillua. This resulted in maybe a page of simple Lua code, as opposed to probably a few hundred lines of tricky C-Lua integration code in the "optimal" implementation. **I guess the "efficiency" I optimized for was "time to produce a working tool, with acceptable performance", rather than strict runtime performance**.

Aside: given that this approach used HTML as input, it would be trivial to use it to create a tool that adds syntax highlighting to hand-authored HTML files, or even a tool that adds syntax highlighting as `<b>`, `<i>`, etc. tags instead of `<span>`'s, so that text mode browsers like Lynx or w3m could enjoy the fun!

## Loading grammars
Rather than ship a zip with 100+ Lua files from Scintillua, I decided to embed all those scripts directly into the executable (with the ability to override them, as needed). **This allowed me to ship a single static binary** (my preferred packaging method for one-off tools).

The only trick was that Scintillua, in its library form, implemented its own file search and load system based on probing files with Lua's `loadfile` function. I ended up wrapping `loadfile` with some code to detect Scintillua's calls and point them at the embedded strings (which are lazily loaded into Lua). In general, I dislike Lua's file-loading infrastructure, but I understand that they're limited by the C standard library--specifically, its lack of file enumeration support.

## Result
In the end, adding in LPeg, Scintillua, almost all its grammars, and glue code only added around 175 KB to the (gzip-compressed) tarball (a 67% increase--not as bad as I originally feared). Even better, syntax highlighting for my blog only increased the generation time by around 50% (roughly 1 millisecond per page, on my 2013 laptop).

Finally, I had a small and simple static site generator that did what I wanted!

# Bonus: authoring an etlua grammar
One aspect of Scintillua that hooked me was that adding new grammars simply required writing some Lua code, using the LPeg library. I had not actually used LPeg before, but [its documentation](https://www.inf.puc-rio.br/~roberto/lpeg/) was easy to understand (and there's also [a great LPeg tutorial on leafo.net](https://leafo.net/guides/parsing-expression-grammars.html)).

Given that luasmith uses [etlua](https://github.com/leafo/etlua) for templates, I thought it would be fun to write a syntax highlighter for etlua.

## Structure
Scintillua's documentation provides [information and examples for embedding one parser within another](https://orbitalquark.github.io/scintillua/api.html#embedded-lexers). In the case of etlua, I'm assuming Lua code will always be embedded in HTML, so an etlua parser should simply be an HTML parser with Lua embedded between `<%` ... `%>` tags. The author of Scintillua even pointed out to me that there's already a very similar parser: [RHTML](https://github.com/orbitalquark/scintillua/blob/default/lexers/rhtml.lua) (Ruby in HTML).

## Implementation
Using the RHTML parser as a starting point, it was simply a matter of including the appropriate start and end tags (note: LPeg uses Lua metatables for repurposing arithmetic operations as parsing expression grammar building blocks, e.g. `^-1` means "at most one", `*` means "concatenation", and `+` means "alternation/or" -- and `lpeg.P(...)` just matches string literals). Here's the trivial parser:

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

Notice that `for i, item in ipairs(...)` is highlighted as Lua code, while the surrounding HTML is highlighted as HTML. Of course, this also reveals a limitation of Sctinllua's nesting approach in that the `item.path` Lua code that's inside an HTML attribute is just treated as part of the HTML attribute, i.e. a string. Not perfect, but also not a big deal for, essentially, ornamentation.

Overall, it works pretty well, while remaining small and simple.

# Further reading
If a minimal, Lua-based static site generator sounds good to you, [give luasmith a look](https://github.com/jaredkrinke/luasmith). Note that it's still "alpha" quality, and is likely to remain that way unless it miraculously becomes internet famous.

Example sites are here:

* [This blog](https://log.schemescape.com/) ([source](https://github.com/jaredkrinke/log))
* [List of small things I've learned](https://jaredkrinke.github.io/til/) ([source](https://github.com/jaredkrinke/til))

Note: The latter repository contains [a simple self-contained luasmith "template" (script) for generating its README file](https://github.com/jaredkrinke/til/blob/main/readme.lua).
