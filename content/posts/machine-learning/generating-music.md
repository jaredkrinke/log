---
title: Generating music using machine learning
description: Let's see if I can use Google Brain's Music Transformer to generate ragtime music
date: 2022-04-25
draft: true
---
Recent music generation results (e.g. [Music Transformer: Generating Music with Long-Term Structure](https://magenta.tensorflow.org/music-transformer)) are part of what piqued my interest in machine learning. After [following an introduction to machine learning](mitx-6.036.md), it's time for some experimentation.

First up: generate a [ragtime](https://en.wikipedia.org/wiki/Ragtime) piano piece.

# Approaches
The most compelling generated music I've seen thus far comes from Google Brain, namely their [Performance RNN](https://magenta.tensorflow.org/performance-rnn) and [Music Transformer](https://magenta.tensorflow.org/music-transformer) papers. The associated GitHub repositories appear to contain models that have been pre-trained on various corpora (e.g. a [piano competition's MIDI recordings](https://www.piano-e-competition.com/)). It's also possible to train using a new corpus. The trained models can generate continuations based on a primer or generate unconditioned music "from scratch".

Here are several approaches:

1. Condition Performance RNN and Music Transformer models with existing ragtime music (either an intro or the first few measures) and generate a continuation
1. Train a new model on a corpus of ragtime music, and then do unconditioned generation
1. Train a new model on a ragtime corpus and generate a continuation from a ragtime primer
1. Train a new model on a ragtime corpus and generate a continuation from an arbitrary primer

I don't have any intuition for how large of a corpus is required to generate a decent model, so it's possible that options 2 - 4 won't be feasible for me (either because finding/generating such a training corpus is too difficult or the compute required to train the model is beyond what my computer can handle).

# Using pre-trained models
