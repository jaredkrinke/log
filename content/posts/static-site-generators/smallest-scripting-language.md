---
title: The smallest embeddable scripting language, part 1
description: My search for a small, simple embeddedable scripting language.
date: 2025-07-29
keywords: [lua,lisp]
---
# Background
**I like small software** because I hate bloat. Sadly, bloat is pervasive in this era of Chrome-powered text editors.

**I also like extensible software** because it lets you add the features you actually use without bloating the vanilla version for everyone else.

As an example, take a look at [my < 1 MB static site generator](smallest-static-site-generator.md). **It's ~40 times smaller than [Hugo](https://gohugo.io/)**, yet it has features that Hugo doesn't conveniently support (e.g. preserving relative Markdown links and categorizing posts based on directory). (To be fair, it also lacks zillions of features that Hugo supports--but which I don't need.)

At the heart of small and extensible software lies some sort of flexble configuration/extension scheme. In theory, something declarative would be preferable, but, **in practice, this usually involves an embedded (and, yes, Turing-complete) scripting language**.

# Goal
Getting to the point, I want to find the smallest comfortable scripting language that can be easily embedded into minimal software. When I say "smallest", I mean:

* Small number of orthogonal language features (to make it easy to learn)
* Small implementation code size (to ensure it doesn't work against my goal of producing small software)

I'll admit that optimizing for code size in this era of terabyte drives doesn't seem important on the surface. However, I find that **a small implementation size is a convenient proxy for these more virtuous aspects**:

* Simpler and easier to understand implementation
* Few or zero third-party dependencies
* Smaller surface area for bugs
* And sometimes improved portability, especially with older/slower platforms

Oh, and even more unreasonably, I want the scripting language's *implementation language* to also be simple and portable, so I'm only looking at C-based implementations.

# The contenders
After some unscientific research, these are the languages that looked most promising to me:

* [Lua](https://www.lua.org/)
* JavaScript ([QuickJS](https://bellard.org/quickjs/), [Duktape](https://github.com/svaarala/duktape))
* Python ([MicroPython](https://micropython.org/))
* [Tcl](https://www.tcl-lang.org/)
* Lisp ([TinyScheme](https://tinyscheme.sourceforge.net/home.html), [Otus Lisp](https://github.com/yuriy-chumak/OL), [Owl Lisp](https://github.com/owl-lisp/owl), [s7](https://ccrma.stanford.edu/software/snd/snd/s7.html))
* [Janet](https://janet-lang.org/)
* [Wren](https://wren.io/)

Obviously, Python and JavaScript are the most popular languages in the list, but both languages are big--and getting bigger every day! Also, it's unclear how helpful their ecosystems would be when I'm planning to pull in smaller and less broadly supported implementations like MicroPython and QuickJS.

Lua is arguably the king of embedded scripting languages, but I feel like a simpler language in the vein of Lisp or Scheme could be both smaller and more capable.

## Others
There are also a few languages I like but don't quite fit what I'm looking for right now:

* [lil](https://beyondloom.com/decker/lil.html): bonus points for sporting an awk implementation, but, without mutable data structures, I struggled to get acceptable performance
* [fe](https://github.com/rxi/fe): only supports ~4000 cons cells

# Code size data
As a first pass, here are the sizes of size-optimized (`-Os`) REPL executables:

| Implementation | Language | Size |
|:---:|:---:|---:|
| TinyScheme | Scheme | 75 KB |
| Wren | Wren | 160 KB |
| Lua 5.2 | Lua | 175 KB |
| Duktape | JavaScript | 350 KB |
| Otus Lisp | Scheme | 500 KB |
| QuickJS | JavaScript | 700 KB |
| Owl Lisp | Scheme | 700 KB |
| Janet | Janet | 850 KB |
| s7 | Scheme | 1500 KB |
| Tcl | Tcl | 1700 KB |
| MicroPython | Python | ? |

Note: I didn't actually build MicroPython myself because its source code is > 100 MB (!). The homepage claims a 256 KB binary size, but I can't confirm that figure.

# Analysis
## Lua
An impressive showing by Lua! I have numerous complaints with Lua (conflating arrays with dictionaries, verbose syntax, and, yes, one-based indexing), but Lua's tiny code size is amazing! Even throwing in JIT compilation (via [LuaJIT](https://luajit.org/)) and parsing expression grammars (via [LPeg](https://www.inf.puc-rio.br/~roberto/lpeg/)), the binary is still tiny.

**Honestly, Lua's "bang for your buck" is going to be hard to beat.** No wonder it's so popular!

## TinyScheme
The only embeddable language implementation that handily beats Lua in terms of code size is TinyScheme. Unfortunately, the ecosystem for TinyScheme is practically nonexistent--it's not even mentioned in [the big list of Scheme implementations on scheme.org](https://get.scheme.org/)! **There *is* an interesting runtime for TinyScheme named [TSION](http://www.geonius.com/software/tsion/) that is based on an I/O event loop that ends up around 280 KB in total**. Honestly, that's impressive enough that I should try building something with it.

## Wren
**To my surprise, Wren manages to be smaller than Lua!** I don't enjoy the ceremony of it's strict object-oriented nature, but I suspect it might result in more orderly code than classless languages like Lua and (original) JavaScript.

My main concern with Wren, however, is that the classes that make up pretty much everything are fairly rigid--you can't just add properties whenever you feel like it. This sounds like a great design for something like a game where you have neat and tidy objects and interfaces, but for extensibility, configuration, and prototyping I'm drawn more towards Lua and JavaScript's more flexible data types--despite how messy they can get. Of course, if Wren's rigid types can prevent things from blowing up at run-time as frequently as happens in Lua and JavaScript, it might be a good trade-off.

**I'll need to play with Wren some more to form an actual opinion.**

## JavaScript
As much as I like the good parts of modern JavaScript, the language as a whole has a lot of cruft that probably adds unnecessary bulk to implementations (e.g. block scoping, two-byte characters, the `arguments` object). Ignoring old features, the language is also evolving at a feverish pace. I *do* like object destrucuring and template literals, though. For now, I'm setting aside the wild world of JavaScript.

## Other Schemes (and Tcl)
I'm surprised at how big the other Scheme implementations are. The main draw of Scheme for me is its simplicity, yet somehow most Schemes are JavaScript-sized. Same story for Tcl.

## Janet
And now we come to Janet. **Janet feels like a more batteries-included Lua, with Lisp/Clojure-inspired syntax**. Sure it's a bit heftier, but it packs:

* Parsing expression grammars
* Immutable data structures
* Macros
* Destructuring
* Multithreading
* Networking
* An event loop
* And more!

I don't actually like the Clojure-inspired not-quite-as-regular-as-a-real-Lisp syntax, and I know from experience that any sort of math equations are hard to read and write in prefix notation.

**But Janet throws in practically everything you might want from a "small" language and is still as small as many Scheme implementations!**

Obviously, Lisps aren't popular, but their regular syntax becomes soothing after a while. The consistent sytnax also supports structural editing more simply than other languages (not to mention live editing!). And sometimes it just seems like Lisps attract developers who care about clarity in written code.

So I'm a bit torn. Janet has a lot of what I want, but I can't shake the feeling that it has *too many* features for someone who's claiming to be looking for the smallest comfortable embeddedable scripting language.

**Similar to Wren and TinyScheme, I'm going to need to spend some more time with Janet.**

# End of part 1
Now I will abruptly end this post after only considering code size because I honestly haven't spent enough time with some of the languages to be able to comment on their level of "comfort" (or, rather, my level of comfort with using *them*).

**I suspect that the ultimate answer will be the one that is already staring me in the face: Lua.** Despite this, I'd like to explore other options a bit more, just in case I'm missing something truly special.
