---
title: 100 programming languages in one post
description: Here is a summary of the 100 languages I used for Project Euler.
date: 2025-01-19
keywords: [100-languages]
---
Now that I've finished [writing code in 100 different programming languages](100-languages.md), here is a summary of the (mostly lesser-known) languages I used, along with links to my code and notes, unscientifically grouped into categories. (Obviously, some languages could fit into more than one category, but I decided to list each language only once.)

**The languages I enjoyed the most were the following** (in alphabetical order):

* [8080 assembly](https://en.wikipedia.org/wiki/Intel_8080): the language of the first home computer kit, the [Altair 8800](https://en.wikipedia.org/wiki/Altair_8800)
* [Common Lisp](https://en.wikipedia.org/wiki/Common_Lisp): a pragmatic Lisp, with numerous compatible implementations
* [Factor](https://factorcode.org/): a modern concatenative/stack-oriented language
* [Futhark](https://futhark-lang.org/): data-parallel language that's easy to write
* [J](https://www.jsoftware.com/#/): open source array-oriented language
* [Nim](https://nim-lang.org/): honestly, **the language I'm most excited to try again**
* [Piet](https://www.dangermouse.net/esoteric/piet.html): 2D, pixel-based, stack-oriented esoteric language
* [Prolog](https://en.wikipedia.org/wiki/Prolog): the most popular language for logic programming
* [Rebol](http://www.rebol.com/): a tiny but powerful scripting language that didn't quite catch on
* [Tcl](https://en.wikipedia.org/wiki/Tcl): a scripting language that is beautiful in its simplicity
* [Turbo Pascal](https://en.wikipedia.org/wiki/Turbo_Pascal): the world's tiniest integrated development environment
* [Unison](https://www.unison-lang.org/): pioneering content-addressable code management/sharing

Now, without further ado, here is The List:

<!-- Make all tables the same size -->
<style>
table { width: 100% }
td:nth-of-type(1) { width: 100% }
</style>

# Array
| Language | Code | Notes |
|---|:---:|:---:|
| [APL](https://en.wikipedia.org/wiki/APL_(programming_language)) | [p29.apl](https://github.com/jaredkrinke/100-languages/blob/main/src/p29.apl) | [notes](100-languages-7.md#apl) |
| **[J](https://www.jsoftware.com/#/)** | [p4.ijs](https://github.com/jaredkrinke/100-languages/blob/main/src/p4.ijs) | [notes](100-languages-3.md#j) |
| [K](https://en.wikipedia.org/wiki/K_(programming_language)) ([oK](http://johnearnest.github.io/ok/index.html)) | [p53.k](https://github.com/jaredkrinke/100-languages/blob/main/src/p53.k) | [notes](100-languages-10.md#k) |
| [MATLAB](https://en.wikipedia.org/wiki/MATLAB) ([GNU Octave](https://octave.org/)) | [p59.m](https://github.com/jaredkrinke/100-languages/blob/main/src/p59.m) | [notes](100-languages-12.md#matlab) |

# Assembly
| Language | Code | Notes |
|---|:---:|:---:|
| **[8080 assembly](https://en.wikipedia.org/wiki/Intel_8080) ([Altair 8800](https://en.wikipedia.org/wiki/Altair_8800))** | [p97.asm](https://github.com/jaredkrinke/100-languages/blob/main/src/p97.asm) | [notes](100-languages-13.md#8080-assembly-altair-8800) |
| [EXA](https://www.zachtronics.com/exapunks/) ([TEC Redshift](https://store.steampowered.com/app/948420/EXAPUNKS_TEC_Redshift_Player/)) | [p19.exa](https://github.com/jaredkrinke/100-languages/blob/main/src/p19.exa) | [notes](100-languages-4.md#exa) |
| [Uxntal](https://wiki.xxiivv.com/site/uxntal.html) | [p28.tal](https://github.com/jaredkrinke/100-languages/blob/main/src/p28.tal) | [notes](100-languages-7.md#uxntal) |
| [WebAssembly](https://webassembly.org/) ([Text Format](https://webassembly.github.io/spec/core/text/index.html)) | [p14.wat](https://github.com/jaredkrinke/100-languages/blob/main/src/p14.wat) | [notes](100-languages-4.md#webassembly-text-format) |
| [x86 assembly](https://en.wikipedia.org/wiki/X86) (BIOS) | [p26.asm](https://github.com/jaredkrinke/100-languages/blob/main/src/p26.asm) | [notes](100-languages-6.md) |

# Block-based
| Language | Code | Notes |
|---|:---:|:---:|
| [Scratch](https://scratch.mit.edu/) | [p15.sb3](https://github.com/jaredkrinke/100-languages/blob/main/src/p15.sb3) | [notes](100-languages-4.md#scratch) |

# Concatenative
| Language | Code | Notes |
|---|:---:|:---:|
| [Blazin' Forth](https://jimlawless.net/blog/posts/blazin/) | [p55.forth](https://github.com/jaredkrinke/100-languages/blob/main/src/p55.forth) | [notes](../vintage-computing/blazin-forth.md) |
| **[Factor](https://factorcode.org/)** | [p30.factor](https://github.com/jaredkrinke/100-languages/blob/main/src/p30.factor) | [notes](100-languages-7.md#factor) |
| [Gforth](https://gforth.org/) | [p5.fth](https://github.com/jaredkrinke/100-languages/blob/main/src/p5.fth) | [notes](100-languages-3.md#gforth) |
| [Kitten](https://kittenlang.org/) | [p83.ktn](https://github.com/jaredkrinke/100-languages/blob/main/src/p83.ktn) | [notes](100-languages-13.md#kitten) |
| [Min](https://min-lang.org/) | [p48.min](https://github.com/jaredkrinke/100-languages/blob/main/src/p48.min) | [notes](100-languages-9.md#min) |
| [PostScript](https://en.wikipedia.org/wiki/PostScript) | [p24.ps](https://github.com/jaredkrinke/100-languages/blob/main/src/p24.ps) | [notes](100-languages-5.md#postscript) |
| [Quackery](https://github.com/GordonCharlton/Quackery) | [p90.qky](https://github.com/jaredkrinke/100-languages/blob/main/src/p90.qky) | [notes](100-languages-13.md#quackery) |
| [RetroForth](http://retroforth.org/) | [p27.forth](https://github.com/jaredkrinke/100-languages/blob/main/src/p27.forth) | [notes](100-languages-7.md#retroforth) |

# Data-oriented
| Language | Code | Notes |
|---|:---:|:---:|
| **[Futhark](https://futhark-lang.org/)** | [p94.fut](https://github.com/jaredkrinke/100-languages/blob/main/src/p94.fut) | [notes](100-languages-13.md#futhark) |
| [WebGPU Shading Language](https://www.w3.org/TR/WGSL/) | [p12.wgsl](https://github.com/jaredkrinke/100-languages/blob/main/src/p12.wgsl) | [notes](100-languages-4.md#webgpu-shading-language) |

# Declarative
| Language | Code | Notes |
|---|:---:|:---:|
| **[Prolog](https://en.wikipedia.org/wiki/Prolog) ([SWI-Prolog](https://www.swi-prolog.org/))** | [p96.pro](https://github.com/jaredkrinke/100-languages/blob/main/src/p96.pro) | [notes](100-languages-12.md#prolog) |
| [SQL](https://en.wikipedia.org/wiki/SQL) ([SQLite](https://www.sqlite.org/index.html)) | [p8.sql](https://github.com/jaredkrinke/100-languages/blob/main/src/p8.sql) | [notes](100-languages-3.md#sql) |
| [XSLT](https://www.w3.org/TR/xslt-10/) | [p9.xsl](https://github.com/jaredkrinke/100-languages/blob/main/src/p9.xsl) | [notes](100-languages-4.md#xslt-extensible-stylesheet-language-transformations) |

# Esoteric
| Language | Code | Notes |
|---|:---:|:---:|
| [SIC-1 Assembly Language](https://esolangs.org/wiki/SIC-1_Assembly_Language) | [p1.sic1](https://github.com/jaredkrinke/100-languages/blob/main/src/p1.sic1) | [notes](100-languages-1.md) |
| **[Piet](https://www.dangermouse.net/esoteric/piet.html)** | [p34.png](https://github.com/jaredkrinke/100-languages/blob/main/src/p34.png) | [notes](piet-for-project-euler.md) |
| [قلب](https://nas.sr/%D9%82%D9%84%D8%A8/) | [p39.qlb](https://github.com/jaredkrinke/100-languages/blob/main/src/p39.qlb) | [notes](100-languages-9.md#qalb) |
| [文言](https://wy-lang.org/) | [p45.wy](https://github.com/jaredkrinke/100-languages/blob/main/src/p45.wy) | [notes](100-languages-9.md#wenyan) |

# Functional
| Language | Code | Notes |
|---|:---:|:---:|
| [F#](https://fsharp.org/) | [p50.fs](https://github.com/jaredkrinke/100-languages/blob/main/src/p50.fs) | [notes](100-languages-9.md#f) |
| [Haskell](https://www.haskell.org/) | [p44.hs](https://github.com/jaredkrinke/100-languages/blob/main/src/p44.hs) | [notes](100-languages-9.md#haskell) |
| [Hazel](https://hazel.org/) | [p77.hazel](https://github.com/jaredkrinke/100-languages/blob/main/src/p77.hazel) | [notes](100-languages-13.md#hazel) |
| [Idris](https://www.idris-lang.org/index.html) | [p46.idr](https://github.com/jaredkrinke/100-languages/blob/main/src/p46.idr) | [notes](100-languages-9.md#idris) |
| [Pkl](https://pkl-lang.org/index.html) | [p38.pkl](https://github.com/jaredkrinke/100-languages/blob/main/src/p38.pkl) | [notes](100-languages-9.md#pkl) |
| [PureScript](https://www.purescript.org/) | [p64.purs](https://github.com/jaredkrinke/100-languages/blob/main/src/p64.purs) | [notes](100-languages-12.md#purescript) |
| [Reason](https://reasonml.github.io/en/) | [p66.re](https://github.com/jaredkrinke/100-languages/blob/main/src/p66.re) | [notes](100-languages-12.md#reason) |
| [Roc](https://www.roc-lang.org/) | [p40.roc](https://github.com/jaredkrinke/100-languages/blob/main/src/p40.roc) | [notes](100-languages-9.md#roc) |
| [Standard ML](https://en.wikipedia.org/wiki/Standard_ML) ([SOSML](https://sosml.org/)) | [p6.sml](https://github.com/jaredkrinke/100-languages/blob/main/src/p6.sml) | [notes](100-languages-3.md#standard-ml) |
| **[Unison](https://www.unison-lang.org/)** | [p21.u](https://github.com/jaredkrinke/100-languages/blob/main/src/p21.u) | [notes](100-languages-5.md#unison) |

# Hardware description
| Language | Code | Notes |
|---|:---:|:---:|
| [Verilog](https://en.wikipedia.org/wiki/Verilog) | [p17.v](https://github.com/jaredkrinke/100-languages/blob/main/src/p17.v) | [notes](100-languages-4.md#verilog) |
| [XOD](https://xod.io/) | [p18.xodball](https://github.com/jaredkrinke/100-languages/blob/main/src/p18.xodball) | [notes](100-languages-4.md#xod) |

# Homoiconic
## Lisp-inspired
| Language | Code | Notes |
|---|:---:|:---:|
| [Cakelisp](https://macoy.me/blog/programming/CakelispIntro) | [p49.cake](https://github.com/jaredkrinke/100-languages/blob/main/src/p49.cake) | [notes](100-languages-9.md#cakelisp) |
| [Clojure](https://clojure.org/index) | [p71.clj](https://github.com/jaredkrinke/100-languages/blob/main/src/p71.clj) | [notes](100-languages-12.md#clojure) |
| **[Common Lisp](https://en.wikipedia.org/wiki/Common_Lisp)** | [p84.lisp](https://github.com/jaredkrinke/100-languages/blob/main/src/p84.lisp) | [notes](100-languages-14.md#common-lisp) |
| [fe](https://github.com/rxi/fe) | [p25.fe](https://github.com/jaredkrinke/100-languages/blob/main/src/p25.fe) | [notes](100-languages-5.md#fe) |
| [Fennel](https://fennel-lang.org/) | [p61.fnl](https://github.com/jaredkrinke/100-languages/blob/main/src/p61.fnl) | [notes](100-languages-12.md#fennel) |
| [Hy](https://hylang.org/) | [p63.hy](https://github.com/jaredkrinke/100-languages/blob/main/src/p63.hy) | |
| [Janet](https://janet-lang.org/) | [p89.janet](https://github.com/jaredkrinke/100-languages/blob/main/src/p89.janet) | [notes](100-languages-13.md#janet) |
| [PreScheme](https://prescheme.org/) | [p81.scm](https://github.com/jaredkrinke/100-languages/blob/main/src/p81.scm) | [notes](100-languages-14.md#pre-scheme) |
| [Scheme](https://en.wikipedia.org/wiki/Scheme_(programming_language)) | [p57.scm](https://github.com/jaredkrinke/100-languages/blob/main/src/p57.scm) | [notes](100-languages-12.md#scheme) |
| [SectorLISP](https://justine.lol/sectorlisp2/) | [p2.lisp](https://github.com/jaredkrinke/100-languages/blob/main/src/p2.lisp) | [notes](100-languages-2.md) |
| [Shen](https://shen-language.github.io/) | [p79.shen](https://github.com/jaredkrinke/100-languages/blob/main/src/p79.shen) | [notes](100-languages-13.md#shen) |

## Rebol-inspired
| Language | Code | Notes |
|---|:---:|:---:|
| [Boron](https://urlan.sourceforge.io/boron/) | [p42.b](https://github.com/jaredkrinke/100-languages/blob/main/src/p42.b) | [notes](100-languages-9.md#boron) |
| **[Rebol](http://www.rebol.com/)** | [p31.r](https://github.com/jaredkrinke/100-languages/blob/main/src/p31.r) | [notes](100-languages-7.md#rebol) |
| [Rye](https://ryelang.org/) | [p98.rye](https://github.com/jaredkrinke/100-languages/blob/main/src/p98.rye) | [notes](100-languages-14.md#rye) |

# Imperative
## Scripting
| Language | Code | Notes |
|---|:---:|:---:|
| [AWK](https://en.wikipedia.org/wiki/AWK) | [p13.awk](https://github.com/jaredkrinke/100-languages/blob/main/src/p13.awk) | [notes](100-languages-4.md#awk) |
| [Bash](https://www.gnu.org/software/bash/) | [p32.sh](https://github.com/jaredkrinke/100-languages/blob/main/src/p32.sh) | [notes](100-languages-7.md#bash) |
| [Cyber](https://cyberscript.dev/) | [p93.cy](https://github.com/jaredkrinke/100-languages/blob/main/src/p93.cy) | [notes](100-languages-14.md#cyber) |
| [Erde](https://erde-lang.github.io/) | [p62.erde](https://github.com/jaredkrinke/100-languages/blob/main/src/p62.erde) | [notes](100-languages-12.md#erde) |
| [Lil](https://beyondloom.com/tools/trylil.html) | [p23.lil](https://github.com/jaredkrinke/100-languages/blob/main/src/p23.lil) | [notes](100-languages-5.md#lil) |
| [MoonScript](https://moonscript.org/) | [p60.moon](https://github.com/jaredkrinke/100-languages/blob/main/src/p60.moon) | [notes](100-languages-12.md#moonscript) |
| [Perl](https://www.perl.org/) | [p11.pl](https://github.com/jaredkrinke/100-languages/blob/main/src/p11.pl) | [notes](100-languages-4.md#perl) |
| [Raku](https://raku.org/) | [p73.raku](https://github.com/jaredkrinke/100-languages/blob/main/src/p73.raku) | [notes](100-languages-12.md#raku) |
| **[Tcl](https://en.wikipedia.org/wiki/Tcl)** | [p22.tcl](https://github.com/jaredkrinke/100-languages/blob/main/src/p22.tcl) | |
| [Wren](https://wren.io/) | [p37.wren](https://github.com/jaredkrinke/100-languages/blob/main/src/p37.wren) | [notes](100-languages-9.md#wren) |

## High-level
| Language | Code | Notes |
|---|:---:|:---:|
| [Dylan](https://en.wikipedia.org/wiki/Dylan_(programming_language)) | [p88.dylan](https://github.com/jaredkrinke/100-languages/blob/main/src/p88.dylan) | [notes](100-languages-13.md#dylan) |
| [Haxe](https://haxe.org/) | [p51.hx](https://github.com/jaredkrinke/100-languages/blob/main/src/p51.hx) | [notes](100-languages-10.md#haxe) |
| [Julia](https://julialang.org/) | [p33.jl](https://github.com/jaredkrinke/100-languages/blob/main/src/p33.jl) | [notes](100-languages-7.md#julia) |
| [Lobster](http://strlen.com/lobster) | [p87.lobster](https://github.com/jaredkrinke/100-languages/blob/main/src/p87.lobster) | [notes](100-languages-13.md#lobster) |
| **[Nim](https://nim-lang.org/)** | [p47.nim](https://github.com/jaredkrinke/100-languages/blob/main/src/p47.nim) | [notes](100-languages-9.md#nim) |
| [Python](https://www.python.org/) | [p80.py](https://github.com/jaredkrinke/100-languages/blob/main/src/p80.py) | [notes](100-languages-13.md#python) |
| [Ruby](https://www.ruby-lang.org/en/) | [p65.rb](https://github.com/jaredkrinke/100-languages/blob/main/src/p65.rb) | [notes](100-languages-12.md#ruby) |
| [TypeScript](https://www.typescriptlang.org/) (type system only) | [p54.ts](https://github.com/jaredkrinke/100-languages/blob/main/src/p54.ts) | [notes](extreme-typing-in-typescript.md) |
| [V](https://vlang.io/) | [p86.v](https://github.com/jaredkrinke/100-languages/blob/main/src/p86.v) | [notes](100-languages-13.md#v) |
| [Vala](https://vala.dev/) | [p74.vala](https://github.com/jaredkrinke/100-languages/blob/main/src/p74.vala) | [notes](100-languages-12.md#vala) |
| [Varyx](https://www.vcode.org/) | [p95.vx](https://github.com/jaredkrinke/100-languages/blob/main/src/p95.vx) | [notes](100-languages-14.md#varyx) |

## Low-level
| Language | Code | Notes |
|---|:---:|:---:|
| [Ada](https://en.wikipedia.org/wiki/Ada_(programming_language)) | [p78.adb](https://github.com/jaredkrinke/100-languages/blob/main/src/p78.adb) | [notes](100-languages-13.md#ada) |
| [AssemblyScript](https://www.assemblyscript.org/) | [p68.ts](https://github.com/jaredkrinke/100-languages/blob/main/src/p68.ts) | [notes](100-languages-12.md#assemblyscript) |
| [ATS](https://www.cs.bu.edu/~hwxi/atslangweb/) | [p91.dats](https://github.com/jaredkrinke/100-languages/blob/main/src/p91.dats) | [notes](100-languages-14.md#ats) |
| [Bend](https://github.com/HigherOrderCO/bend) | [p85.bend](https://github.com/jaredkrinke/100-languages/blob/main/src/p85.bend) | [notes](100-languages-13.md#bend) |
| [C](https://en.wikipedia.org/wiki/C_(programming_language)) (C99) | [p70.c](https://github.com/jaredkrinke/100-languages/blob/main/src/p70.c) | [notes](100-languages-12.md#c) |
| [Hare](https://harelang.org/) | [p36.ha](https://github.com/jaredkrinke/100-languages/blob/main/src/p36.ha) | [notes](100-languages-9.md#hare) |
| [LO](https://github.com/glebbash/LO) | [p82.lo](https://github.com/jaredkrinke/100-languages/blob/main/src/p82.lo) | [notes](100-languages-13.md#lo) |
| [MiniLang](https://github.com/NICUP14/MiniLang) | [p69.ml](https://github.com/jaredkrinke/100-languages/blob/main/src/p69.ml) | [notes](100-languages-12.md#minilang) |
| [Nelua](https://nelua.io/) | [p100.nelua](https://github.com/jaredkrinke/100-languages/blob/main/src/p100.nelua) | [notes](100-languages-14.md#nelua) |
| [Odin](https://odin-lang.org/) | [p75.odin](https://github.com/jaredkrinke/100-languages/blob/main/src/p75.odin) | [notes](100-languages-13.md#odin) |
| [T3X/0](https://t3x.org/t3x/0/) | [p67.t](https://github.com/jaredkrinke/100-languages/blob/main/src/p67.t) | [notes](100-languages-12.md#t3x0) |
| [wax](https://github.com/LingDong-/wax) | [p41.wax](https://github.com/jaredkrinke/100-languages/blob/main/src/p41.wax) | [notes](100-languages-9.md#wax) |
| [Zig](https://ziglang.org/) | [p72.zig](https://github.com/jaredkrinke/100-languages/blob/main/src/p72.zig) | [notes](100-languages-12.md#zig) |

## Historical
| Language | Code | Notes |
|---|:---:|:---:|
| [Amiga Basic](https://en.wikipedia.org/wiki/Amiga_Basic) | [p52.bas](https://github.com/jaredkrinke/100-languages/blob/main/src/p52.bas) | [notes](../retrocomputing/amiga-day-project-euler.md) |
| [BBC BASIC](https://en.wikipedia.org/wiki/BBC_BASIC) | [p20.bas](https://github.com/jaredkrinke/100-languages/blob/main/src/p20.bas) | [notes](100-languages-5.md#bbc-basic) |
| [BCPL](https://en.wikipedia.org/wiki/BCPL) | [p58.b](https://github.com/jaredkrinke/100-languages/blob/main/src/p58.b) | [notes](100-languages-12.md#bcpl) |
| [COBOL-85](https://en.wikipedia.org/wiki/COBOL#COBOL-85) | [p10.cbl](https://github.com/jaredkrinke/100-languages/blob/main/src/p10.cbl) | [notes](100-languages-4.md#cobol) |
| [Commodore BASIC](https://en.wikipedia.org/wiki/Commodore_BASIC) ([2.0](https://www.c64-wiki.com/wiki/BASIC#BASIC_V2.0_of_C64)) | [p16.bas](https://github.com/jaredkrinke/100-languages/blob/main/src/p16.bas) | [notes](100-languages-4.md#commodore-basic) |
| [Fortran](https://fortran-lang.org/) | [p3.f90](https://github.com/jaredkrinke/100-languages/blob/main/src/p3.f90) | [notes](100-languages-3.md#fortran) |
| [G-Pascal](https://gammon.com.au/GPascal/) | [p56.pas](https://github.com/jaredkrinke/100-languages/blob/main/src/p56.pas) | [notes](100-languages-12.md#g-pascal-on-a-commodore-64) |
| [Mouse-83](http://mouse.davidgsimpson.com/mouse83/index.html) | [p92.mou](https://github.com/jaredkrinke/100-languages/blob/main/src/p92.mou) | [notes](100-languages-14.md#mouse-83) |
| [QBasic](https://en.wikipedia.org/wiki/QBasic) | [p76.bas](https://github.com/jaredkrinke/100-languages/blob/main/src/p76.bas) | [notes](100-languages-13.md#qbasic) |
| [Rexx](https://en.wikipedia.org/wiki/Rexx) | [p99.rex](https://github.com/jaredkrinke/100-languages/blob/main/src/p99.rex) | [notes](100-languages-14.md#rexx) |
| **[Turbo Pascal](https://en.wikipedia.org/wiki/Turbo_Pascal) ([7.0](https://archive.org/details/turbopascal7.0))** | [p35.pas](https://github.com/jaredkrinke/100-languages/blob/main/src/p35.pas) | [notes](100-languages-9.md#turbo-pascal) |

# Object-oriented
| Language | Code | Notes |
|---|:---:|:---:|
| [Self](https://en.wikipedia.org/wiki/Self_(programming_language)) | [p43.self](https://github.com/jaredkrinke/100-languages/blob/main/src/p43.self) | [notes](100-languages-9.md#self) |
| [Squeak](https://squeak.org/) ([2.2](https://squeak.js.org/demo/simple.html)) | [p7.st](https://github.com/jaredkrinke/100-languages/blob/main/src/p7.st) | [notes](100-languages-3.md#squeak) |
