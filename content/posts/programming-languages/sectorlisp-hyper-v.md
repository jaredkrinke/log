---
title: Running SectorLisp on Hyper-V
description: Please find enclosed a SectorLisp VFD file for use in Hyper-V
date: 2024-03-18
keywords: [lisp]
---
[SectorLisp](https://justine.lol/sectorlisp/) is a minimal implementation of Lisp that miraculously fits in a boot sector. I am in no way involved with the project.

Here's a link to a [zip file containing a SectorLisp VFD that works in Hyper-V](../../assets/sectorlisp-vfd.zip).

**Update**: ... and I just noticed that there's a [SectorLisp v2 page](https://justine.lol/sectorlisp2/) which contains an in-browser REPL. I should just use that instead.

# Background
The SectorLisp home page provides a link to a (raw) image, but it wasn't obvious how to load the image into Hyper-V. Rather than run and download random tools from the web, I decided to use a Linux VM (and the "dd" tool) running in Hyper-V to write the SectorLisp image to a virtual floppy disk image (VFD).

Now, I can just "insert" the SectorLisp VFD into a (generation 1, I assume) Hyper-V VM and it can boot into the SectorLisp prompt. Note that you *must* use CAPITAL LETTERS for SectorLisp, and it will happily ignore errors. Also, the backspace key doesn't seem to work properly, so... don't make any mistakes while typing.

**That's all. I just wanted to share the VFD in case anyone else might want it.** And, yes, I'm attempting to use SectorLisp in my [100 programming languages challenge](100-languages.md).