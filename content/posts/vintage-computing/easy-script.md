---
title: Easy Script (Commodore 64) quick reference
description: Here's a quick reference page for Easy Script on the Commodore 64. Because who wouldn't need this?
date: 2024-09-05
keywords: [commodore-64]
---
[Easy Script](https://www.c64-wiki.com/wiki/Easy_Script) is a word processor for the Commodore 64 that was apparently fairly popular. As a modern computer user, I found it fairly difficult to use. The only comprehensive documentation I could find was [the original manual (on The Internet Archive)](https://archive.org/download/retrokit-manuals/c64/c64-original.zip/Easy%20Script%2064%20%28en%29.pdf).

Annoyingly, I couldn't find any sort of *useful* "quick reference" for Easy Script. Humorously, there is an [official Easy Script Quick Reference Card](https://commodore.software/downloads/download/211-application-manuals/13492-easy-script-quick-reference-card), but it omits salient details, such as *how to save documents*. So I made my own documentation.

**The rest of this document includes quick reference for Easy Script on the Commodore 64** (also available [as a gist](https://gist.github.com/jaredkrinke/f77c88449d4616c221bcf7b09be86bbc)). Note: this is *not* a tutorial; see the original manual for a tutorial.

# Keyboard shortcuts
| Key(s) | Description |
|:-:|---|
| Ctrl+W | Move to next word |
| Ctrl+&larr; | Move to previous word |

# F1 commands
| Key | Descriptions|
|:-:|---|
| F | Save (F2 to scan within document for filename in quotes) |
| L | Load |
| O | Output (see [Printing](#printing)) |
| I | Insert mode (instead of the annoying default "overwrite" mode) |
| E | Erase (S for sentence, P for paragraph, R for rest, A for all) |
| Space bar | Go to next screen |
| Shift+space bar | Go to previous screen |
| G | "Go" |
| S | Search |
| R | Select a range of text (Enter to copy/commit) -- then one of the next two |
| X | Move (cut+paste) |
| A | Copy |
| `[` | Start underline (close to stop) |
| `(` | Start bold (close to stop) |
| `-` | "Soft" hyphen |
| \` | Superscript (single character) |
| `,` | Subscript (single character) |
| Run/stop | Reset |

# Format instructions (F3)
Press F3 to get a color-inverted asterisk, indicating a line that won't be part of the document content. Note that the first comment with a filename in quotes specifies the desired file name of the document (See F1, O, F2 above).

| Syntax | Description |
|---|---|
| `nb` | Comment |
| `lm#:rm#:` | Set left margin to # columns, and right margin similarly (set to 1 and 40 for proofreading in "video" mode on the screen) |
| `sp1` or `sp2` | For extra line spacing |
| `ju1` | Turn on justification, `ju0` to turn off |
| `cn1` | Turn on centering, `cn0` to turn off |
| `ps` | Pause (while printing) |

# Printing
F1, O; then V for video/display and P for printer.

* Precede V/P with C for continuous printing
* Toggle continuous printing with Shift+P

| Key | Description |
|:-:|---|
| C | Continue to next page |
| V | Preview next page/switch to video output |
| P | Switch to print output |
| Run/stop | Stop printing/previewing |

# Files
Assuming drive #8, hit F4, and then:
* `+8` Load directory, then F1, L, F2 to list first file, F2 again for next file, etc.

# Notes
* Default to 80 columns wide for printing
* Default to 66 lines of text per page
* Preview with F1, O, V -- then run/stop to end preview, cursor keys to move left/right, and Commodore key to scroll
* F5 for caps lock
