---
title: Beating myself at chess
description: "Or: programming a chess AI without any preparation whatsoever."
date: 2025-12-29
---
**Programming a chess AI that can beat me is an item that's been on my bucket list for a long time**, believe it or not.

**Spoiler**: I'm terrible at chess, so creating an AI to beat *me* specifically wasn't too difficult.

You can play against the AI from the comfort of your browser here: https://jaredkrinke.github.io/cm-chessboard/

**Edits since this ended up getting some unexpected attention**:

* The demo currently doesn't announce checkmate/stalemate -- consider it a marginally viable product
* It sounds like there's at least one bug, feel free to [email me](mailto:log@schemescape.com) if you notice others (or if you just have suggestions)
* I did eventually manage to stop being terrible at chess and beat the AI twice in a row (even with at least one huge mistake)
* I haven't yet decided if I will make further improvements (either to the AI or to my chess play) -- this was a just fun diversion to "recharge my creative battery"

# Motivation
Similar to [static site generators](../static-site-generators/smallest-static-site-generator.md), no one is clamoring for a new chess engine written by me. My primary motivations were to:

* Experiment with my development environment
* Keep things as simple as possible
* Maybe port the result to an old, slow vintage computer

**I opted to prepare as little as possible**--just start coding!

# Development environment
I'm nostalgic for the pre-always-on-Internet days--without constant distractions and bloat. I also just revived an [Asus EeeBook X205T netbook](../hardware/farewell-to-a-netbook.md#the-future). So **I settled on revisiting late 90s programming**, using GNU Screen, Vim, entr, and w3m, in terminal mode. **Typing into the console on a tiny, light netbook is peak "cozy coding"**.

# Keeping things simple
With an eye toward simplicity, and also portability to old computers, I opted for using C, with as few dependencies as possible.

In the end, the core of my chess engine and its associated AI (excluding the front end) have exactly **zero** dependencies. It uses a fixed amount of memory, with no dynamic allocations! The full chess engine is under 600 lines and the AI is under 150. **Compiled to WebAssembly, the whole shebang is under 6 KB**. I'd been hoping to run it on my Pentium laptop or Raspberry Pi B, but now I'm wondering if it could run on DOS, or maybe even an Amiga!

Not everything went perfectly, however. **In an attempt to rush through the project, I put off writing tests until absolutely necessary**--hoping they would never be needed. But eventually I needed to refactor and rewrite the trickiest bits of movement code (en passant and castling), and I had to stop and build up a test framework and tests from scratch, in the middle of a rewrite. For the record: the tests uncovered multiple bugs in my original implementation. **Kids, don't skip writing tests!**

# Integration
The initial UI used ASCII characters in the terminal, but the non-square VGA font made it hard to imagine piece movements on the board (even after experimenting with ANSI escape codes to invert white squares--a feature I eventually abandoned).

Rather than create a graphical interface from scratch, I opted to integrate with:

1. [XBoard](https://www.gnu.org/software/xboard) (using [CECP, aka "the XBoard protocol"](https://www.chessprogramming.org/Chess_Engine_Communication_Protocol))
2. Web browsers, using [cm-chessboard](https://shaack.com/projekte/cm-chessboard/) and WebAssembly

## XBoard
XBoard uses a line-based text protocol ([documented here](https://www.gnu.org/software/xboard/engine-intf.html)), so I thought it would be easy to implement. Pro tip: if you want to experiment with the XBoard protocol live, you can use `netcat`, but you'll need to issue a `feature sigint=0 done=1` command (otherwise, XBoard will send a `SIGINT` to "wake up" your process, and `netcat` will be so startled that it just dies).

**Given that I never learned standard chess notation, XBoard was actually perfect** since it uses consistent and logical syntax like `a7a8q` (move from **a7** to **a8** and promote to a **q**ueen). Other than disabling features I didn't know or care about, my XBoard client mostly just listened for player moves (e.g. `e2e4`) and replied with the AI's moves (e.g. `move e7e5`). The whole thing was under 100 lines of C.

## Browsers
Integrating with browsers was a little more involved since I used C instead of JavaScript. Without any standard library dependencies, compiling to WebAssembly was fairly simple (my [trivial WebAssembly research](../webassembly/trivial-example.md) came in handy!). **I encoded moves into integers in order to avoid any complex marshalling of strings** back and forth (3 bits for rank, 3 bits for file, 3 bits for promotion, easily fitting within a `Number`'s mantissa).

After more searching than I anticipated, I found a mobile-friendly HTML+JavaScript chessboard that didn't require any exotic build systems (or even NPM!): **[cm-chessboard](https://github.com/shaack/cm-chessboard)**. I had hoped to find a single-file chessboard that worked, but such a thing doesn't appear to exist.

# So can it beat me?
Was I successful in beating myself at chess? **I'm afraid the answer is yes**. Every time I play against the AI, I seem to make some fatal mistake and lose my queen or a rook. I can generally get ahead early, but then I make a series of increasingly boneheaded mistakes until there's not much point in continuing on.

I don't yet know if my chess program can beat anyone other than the worst chess player in the world.

**In summary: mission accomplished!** (At least until I stop being terrible at chess.)

Overall, this project was enjoyable enough that I'd recommend it to anyone wanting to practice programming or wanting to test out a new programming language (or paradigm).

# Resources
* [cchess source code](https://tildegit.org/scms/chess)
* [Browser-based demo](https://jaredkrinke.github.io/cm-chessboard/)
* [XBoard protocol](https://www.chessprogramming.org/Chess_Engine_Communication_Protocol)
