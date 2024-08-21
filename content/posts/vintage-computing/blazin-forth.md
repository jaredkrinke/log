---
title: Stumbling along with Blazin' Forth
description: Here are some notes on my first attempt at using Blazin' Forth on a Commodore 64.
date: 2024-08-20
keywords: [100-languages,programming-languages]
---
After [showing off my "new" Commodore 64](40-year-old-dev-environment.md) and posting a [Forth editor "quick reference"](forth-line-editor.md), it should be no surprise that ([in pursuit of using 100 programming languages](../programming-languages/100-languages.md)) I sat down and, over the course of several evenings, solved a Project Euler problem using Blazin' Forth ([code here](https://github.com/jaredkrinke/100-languages/blob/main/src/p55.forth)).

Curious about using an old Forth, on old hardware? The rest of this post contains my notes, along with links to resources, in case you'd like to give it a try.

# Blazin' Forth
Blazin' Forth, being 39 years old, doesn't have a GitHub repository. It doesn't even have a SourceForge project. In fact, I couldn't find a canonical web site. The best resources I can point to are:

* [An excellent Web 1.0 page about programming languages on the Commodore 64](https://www.lyonlabs.org/commodore/onrequest/collections.html) -- there's a line for Blazin' Forth with links to disk images
* [A retrospective interview with Blazin' Forth's author, Scott Ballantyne](https://jimlawless.net/blog/posts/blazin/)
* [A contemporaneous article from Transactor Magazine about Blazin' Forth, by its author](https://archive.org/details/transactor-magazines-v7-i05/page/n59/mode/2up)

Since I haven't found a convenient way to read .seq files on a modern computer, [here is an ASCII dump of Blazin' Forth's documentation](https://gist.github.com/jaredkrinke/d8a801274a9a66bb06a0e2c8778624ca) (it is copyright 1985 Scott Ballantyne, but "distribution on a not for profit basis is encouraged").

## Running Blazin' Forth
It's possible to run Blazin' Forth in an emulator such as [VICE](https://vice-emu.sourceforge.io/), but I should note that I ran into some issues when loading and saving screens (saved code blocks). I'm unsure if my issues are due to a bug or a simple mistake on my part, but I didn't run into any such issues on a real C64.

## Learning Forth
I've written a small amount of code in a smattering for Forths, but Blazin' Forth really opened my eyes to Forth, for two reasons:

1. **Blazin' Forth's documentation (linked above) clarifies a lot of the "whys" of Forth**, and also provides interesting sample code
2. **Blazin' Forth, as in classic Forth, brings its own operating system**, in the sense that it provides its own durable storage implementation: 1 KB blocks (usable, with a built-in editor, for code *or* anything else you want)

Note that, unless you're well versed in Forth, you'll probably want to have [Starting Forth](https://www.forth.com/starting-forth/) handy while reading Blazin' Forth's documentation.

Aside: **I also enjoyed Blazin' Forth's documentation as a time capsule from the mid-80s**. It mentions Compuserve, a Forth Interest Group, and the software even sports a dedication--something I'm used to seeing in books, but which is curiously absent from most software (modern software, at least).

## Block-based editing -- not my favorite
N.B. "Block-based" as in **you're writing directly to 1 KB blocks on disk**--*not* as in dragging around blocks in a GUI to create programs (a la [Scratch](https://scratch.mit.edu/)).

This was my first experience using both a line-based interactive editor and with Forth-style block/screen-based programming. **Essentially, you are given ~130 one kilobyte blocks, with each being divided into 16 lines of 64 characters**. The upside is that you don't need a file system (and Forth can provide a line-based editor). The downside is that now you have to ensure your lines aren't too long and that there aren't too many of them (lest you need to spill code onto a subsequent block).

More irritatingly, **the Commodore 64 provides a 40 column wide display** (with no status bar), so now it's not even obvious when a 64 character line is getting too long. And even if a line is less than 64 characters, if it's at least 40 characters, it will wrap when being printed out, potentially causing the first couple of lines to scroll off screen.

Overall, I found line-based editing to be a decent experience (no more annoying than having to always specify line numbers in Commodore BASIC). Using blocks instead of a file system was cute, but unpleasant--especially due to the mismatch between display width and line width (aside: I wonder if a Commodore 128's 80-column mode would work with Blazin' Forth?).

Interestingly, after coming to this conclusion, I read through the interview linked above, and found that **Blazin' Forth's author actually thinks that files would have been a better choice**:

> Today I would probably not implement the Forth block system, I’d use files instead. I never liked that, to tell the truth. It made a certain sense with the 64 disk drives, and the code I wrote is optimized for the rotational speed of those things, but I think it leads to better programming to just store your code in a file with a name.

Agreed!

### Improvement: running the current line
For my workflow, I would usually do the following:

1. Start a definition on a new line
1. Compile the line
1. Test the line
1. Fix/refine the definition by `FORGET`-ing it and then go back to 1

To my surprise, **there was no built-in support for the second step (compiling/running the current line)**. Blazin' Forth doesn't support the [EVALUATE](https://forth-standard.org/standard/core/EVALUATE) word, so I had to fashion my own version:

```forth
// RL RUNS THE CURRENT EDITOR LINE
: LINE-INDEX R# @ C/L / ;
: LINE>OFFSET C/L * ;
: CURLINE SCR @ BLOCK LINE-INDEX LINE>OFFSET + ;
: C>TIB TIB SWAP CMOVE ;
: CL>TIB CURLINE C/L C>TIB C/L #TIB ! ;
: RL CL>TIB 0 >IN ! INTERPRET ;
```

#### Explanation

* `LINE-INDEX` (-- line) pushes the index of the currently selected line (0 through 15), using an internal word named `R#` that represents the offset into a block of the current cursor (note: this may be in the middle of a line)
* `LINE>OFFSET` (line -- offset) pushes the offset of the beginning of the given line (`C/L` is an internal constant for the number of characters per line--64)
* `CURLINE` (-- address) pushes the address of the current line, in the current block (whose index is in the variable [SCR](https://forth-standard.org/standard/block/SCR), and whose address is obtained via [BLOCK](https://forth-standard.org/standard/block/BLOCK))
* `C>TIB` (bytes --) copies the given number of bytes to `TIB` (the location of the text input buffer)
* `CL>TIB` (--) copies the current editor line into the text input buffer (and sets the size of the input, `#TIB` appropriately)
* `RL` (--?) copies the current line into the text input buffer (see previous), sets the current input buffer index to 0, and runs the line using `INTERPRET`

## Thinking in Forth
Despite making some progress in beginning to truly *see* Forth, I still have not reached Forth Enlightenment. Specifically, **I still don't know what to do when a function needs to operate on more than 2 or 3 inputs**.

As an example, I have a word (function) for adding two "big integer" values (represented as arrays of decimal digits, least significant digit first), named `N+`. The stack annotation for that function is `(a1 a2 -- )`, meaning it takes the address of two numbers, adds the two numbers, and writes the result into the second number, something like `a2 = a1 + a2`.

Internally, this function loops over the digits and adds them, including any carry from the previous digit. The problem I ran into is that **now I've got two addresses and a carry to worry about. If I put all of those on the stack, then I feel like I'm constantly shuffling items around** and trying to avoid letting the stack get too deep (reaching down beyond 3 items gets tricky).

**Ideally, I'd like to assign names to the elements on the stack and then just be able to copy them to the top of the stack using those names** -- something like:

```forth
: n+ ( a1 a2 -- ) 0 ( carry ) a1 a2 + + ( to add the carry, a1, and a2 together )
```

I think newer Forths support syntax like this, but back in the days of Blazin' Forth, the only solutions I see are to either:

* Be smarter about the stack... somehow
* Throw some of the values into variables!

I went with the second option and just used a variable for the carry. This obviously wouldn't work in any case where a global variable wouldn't suffice (e.g. any function that can appear on the call stack multiple times). **But maybe that's the point of Forth? I know this function will never nest, so perhaps a global is ok?** Clearly, I will need to meditate on this.

## But there's much more
Of course, I only barely scratched the surface of what Blazin' Forth is capable of. There are affordances for turtle graphics, sound generation via the SID chip, device access, etc. It feels like a complete and very capable system! One day, I'd like to try and write a game entirely in Blazin' Forth--though I doubt I'll ever actually get around to it.

Regardless, that's enough rambling. Hopefully I've piqued your interest enough that you'll give Blazin' Forth a try--it's well worth a look, especially if the Commodore 64 holds a special place in your heart or you have always been curious about Forth.
