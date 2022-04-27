---
title: Generating music using machine learning (part 2)
description: Let's see if I can use Google Brain's Music Transformer to generate ragtime music
date: 2022-04-27
draft: true
---
In [part 1](generating-music.md), I played around with pre-trained [Music Transformer](https://magenta.tensorflow.org/music-transformer) models, in an attempt to generate a piece of ragtime piano music. The results were interesting, but the musical styles were random (and internally inconsistent).

In this part, I attempt to train my own Music Transformer model, using a ragtime-focused corpus.

# Setup
Setting up an environment for [Magenta](https://magenta.tensorflow.org/) (the development environment for Music Transformer) is turning into a crash course in Python modules, dependencies, and environments.

## On Windows
`pip install magenta` fails miserably, in numerous places. Unfortunately, many of the libraries Magenta depends on are built on top of C/C++ libraries that don't appear to provide Windows binaries (at least for the version of Python that's in the Microsoft Store). It's a bit ironic that all of my attempts at escaping C/C++ (JavaScript, Rust, and now Python), result in me troubleshooting C/C++ compiler errors and installations.

## On Debian
In the interest of just getting something up and running, likely in an inefficient manner, I attempt to install Magenta's dependencies via Debian's `apt` package manager, running under the Windows Subsystem for Linux. This also fails when trying to build the same dependency (`python-rtmidi`).

It feels a bit silly to be stuck on a MIDI library, especially since (as far as I understand) all the Music Transformer setup does is convert MIDI files into a proprietary format (i.e. all of these build errors relating to *playing* MIDI files are in code I'm not actually going to be using). Installing the `cython3` package *seems* to have resolved the issue with `python-rtmidi`.

Now I just need to debug a build error in `llvmlite` (aside: why do I need LLVM? I'm not building a compiler...). The error is:

```
Building llvmlite requires LLVM 7.0.x, 7.1.x or 8.0.x, got '9.0.1'. Be sure to set LLVM_CONFIG to the right executable path.
```

Fun.