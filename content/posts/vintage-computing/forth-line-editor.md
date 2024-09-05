---
title: Blazin' Forth/Starting Forth editor quick reference
description: For my own reference, this is a quick reference table for vintage line/block-based Forth editors.
date: 2024-08-13
keywords: [commodore-64]
---
**Blazin' Forth** is an implementation of Forth for the Commodore 64, published in 1985 by Scott Ballantyne (for free). Its built-in editor is block- and line-based, and the editor is modeled after one described in the first edition of [Starting Forth](https://www.forth.com/starting-forth/).

The rest of this post provides quick reference for the editor, because I couldn't find any such resource on the web. For a *tutorial*, see the Starting Forth PDF at the previous link.

# Forth editor quick reference

## Block selection/manipulation
| Word | Stack | Description |
|---|:-:|---|
| `LIST` | (n --) | **Select** the given block, **print** it out, and start the editor |
| `N` | (--) | Move to the **next block** |
| `B` | (--) | Move backwards to the **previous block** |
| `SAVE-BUFFERS` | (--) | **Save** modified buffers back to disk blocks |
| `EMPTY-BUFFERS` | (--) | **Discard** buffers/changes |
| `LOAD` | (n --) | **Load and execute** the given block |

## Line editing commands
| Word | Stack | Description |
|---|:-:|---|
| `L` | (--) | **Print** the currently selected block |
| `T` | (n --) | **Select** the given line number |
| `P` | (--) | **Replace** the selected line with the remainder of the input buffer (use 3 spaces to clear the line entirely; leave blank to copy from the insert buffer) |
| `U` | (--) | **Insert under** the current line the rest of the input buffer, shifting any following lines down, and move selection down one line |
| `X` | (--) | **Cut** the current line, and shift following lines up one line (the line that was removed is placed into the insert buffer--use `P`/`U` to "paste") |

## Character editing commands
| Word | Description |
|---|---|
| `F` | **Search** for the rest of the input buffer in the current line |
| `I` | **Insert** the rest of the input buffer before the cursor |
| `E` | **Delete** the string previously found with `F` |
| `D` | **Find and delete** the rest of the input buffer (combination of `F` and `E`) |
| `R` | **Replace** previously found text with the rest of the input buffer (combination of `E` and `I`) |
| `TILL` | Delete everything from the cursor, through the rest of the input buffer |

## Miscellaneous commands
| Word | Stack | Description |
|---|:-:|---|
| `WIPE` | (--) | **Clear** the current block |
| `FLUSH` | (--) | **Save** buffers back to disk blocks, and free associated buffers |
| `COPY` | (src dest --) | **Copy block** from one to another |
| `S` | (n --) | **Search** for the rest of the input buffer in this block *and following blocks*, while the block number is lower than the specified limit |
| `M` | (b l --) | **Copy current line** to a new block and associated line |
