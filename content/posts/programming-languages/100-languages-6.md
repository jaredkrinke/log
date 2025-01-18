---
title: Project Euler in your BIOS
description: "Or: 100 languages, week 4: return of the boot sector."
date: 2024-04-11
keywords: [100-languages]
---
I'm still trying to [write code in 100 different programming languages](100-languages.md). See [this repository](https://github.com/jaredkrinke/100-languages) for a summary table and links to code.

As always, **none of this is groundbreaking**, but it *is* fun to see my code running in places I hadn't considered before, like (this time) during the PC boot sequence or [within a PostScript document](100-languages-5.md#postscript).

# Week 4
The calendar says this week isn't over yet, but I doubt I'll finish any more problems this week. Also, I'm compelled to share my first x86 assembly program.

After [experiencing SectorLISP](100-languages-2.md) on day 2, I've been wanting to try my hand at developing for the (in)famous [PC boot sector](https://en.wikipedia.org/wiki/Boot_sector#The_IBM_PC_and_compatible_computers). Thus, I decided to solve Project Euler problem 26 using **16-bit ("real" mode) x86 assembly** (with the BIOS API for text output).

## x86 assembly
### 32-bit, user mode
My first stop was to learn about x86 assembly, and I used [Assembly Nights on ratfactor.com](https://ratfactor.com/assembly-nights) to get started. By coincidence, like the Assembly Nights author, I was developing on an old netbook ([because minimalism](minimal-dev-env-4.md#hello-netbook)). I used [NASM](https://nasm.us/) because it seemed popular, and I'm comfortable with "destination first" syntax.

**I learned the bare minimum x86 assembly necessary to implement a solution** in 32-bit ("protected" mode)--just `mov`, `push`, `pop`, `cmp`, `call`, `ret`, arithmetic, and conditional/unconditional jumps (along with Linux system calls for writing strings and terminating the process).

### 16-bit, "bare metal" (+ BIOS)
After that, it was just a simple* matter of porting the 32-bit code to 16-bit mode (removing `e` from register names and halving the word size). And then I got to experience **the joy of learning about the PC BIOS**.

The web is actually littered with examples of "bare metal" x86 programming (aside: does it count as "bare metal" if you're using the BIOS API?). Annoyingly, **most of the examples I found didn't actually work** for me. There are also many proclamations of required initialization rituals that I didn't (and still don't) understand. Some examples worked in [QEMU](https://www.qemu.org/) but not in Hyper-V or [Blinkenlights](https://justine.lol/blinkenlights/). Others inverted that sentence. And then there's real hardware, which is much more fickle.

**Here's what actually worked for me**  (about which I'm 100% *not* confident):

* *Do not* start with `cli`
* *Do* initialize `ds` and `ss` segment registers
* *Do* initialize  the stack pointer (`sp`)

Here's the code I used (in this case, I chose to have the stack grow down from where boot sector code must start):

```nasm
	mov ax, 0
	mov ds, ax
	mov ss, ax
	mov sp, 0x7c00
```

Then you can set `al` to a character, `ah` to `0xe`, and execute `int 0x10` to output the character (and be moderately confident that it will actually appear).

**The above worked for me on real hardware, QEMU, Blinkenlights, and v86.**

*I will admit that the "simple" port to 16-bit actually took me a while because I forgot to update a line that implicitly depended on word size (`add si, 4` &rarr; `add si, 2`).

Regardless, [here's the final code](https://github.com/jaredkrinke/100-languages/blob/main/src/p26.asm).

You can run the code in your browser using [v86](https://copy.sh/v86/) by [clicking this link](https://copy.sh/v86/?profile=custom&fda.url=data:file/octet-stream;base64,uAAAjtiO0LwAfLsAALoAAL4AAIPDAYH76AN0EYnZ6FUAOfB/AuvsicaJ2uvmidDoDQDplQBQg8AwtA7NEFjDUlFTUFa7CgC+AAC6AAD3+1KDxgGD+AB18oP+AHQJWOjU/4PuAevytA6wDc0QsArNEF5YW1law1dWUlFTUL8AALsKALgKADnIfQUPr8Pr97oAAPf5g/oAdB2J0IPHAVC6AACJ5oPGAoPCATn6dNg7BHXyidDrA7gAAIP/AHQGW4PvAev1W1tZWl5fw/Q=). Even better, [download the assembled boot sector](https://github.com/jaredkrinke/100-languages/blob/main/src/p26.img), copy the boot sector onto a USB stick (or floppy drive), and try it on real hardware!

### Notes
I'll end with some notes I made while writing x86 assembly

* **I had to use *every* register** available to me (not counting `bp`, which I think I could have technically gotten away with using)
* **I wish I'd done this sooner**--knowing even just a tiny bit of assembly would have been helpful on numerous occasions
* Having registers at my disposal *almost* made assembly easier to write than Forth (of course, this is more a reflection of my discomfort with stack-based languages--to say nothing of the interactive development benefits a Forth can provide)
