---
title: Generating music using machine learning (part 2)
description: Let's see if I can use Google Brain's Music Transformer to generate ragtime music
date: 2022-04-29
---
In [part 1](generating-music.md), I played around with pre-trained [Music Transformer](https://magenta.tensorflow.org/music-transformer) models, in an attempt to generate a piece of ragtime piano music. The results were interesting, but the musical styles were random (and internally inconsistent).

In this part, I attempt to train my own Music Transformer model, using a ragtime-focused corpus.

# First attempt
Initially, I tried to generate music using the official Music Transformer environment, [Magenta](https://magenta.tensorflow.org/), following instructions in [an email thread about using transfer learning with Music Transformer's pre-trained checkpoints](https://groups.google.com/a/tensorflow.org/g/magenta-discuss/c/tRrth7wXF6U). I hit several issues:

* [Magenta install fails for Python >= 3.8 ](https://github.com/magenta/magenta/issues/1962) (worked around via [Anaconda](https://www.anaconda.com/))
* The default optimizer (`AdafactorOptimizer`) appeared to be incompatible with the version of Tensorflow Magenta installed (worked around via `--hparams=optimizer=Adam,...`)
* I couldn't use my GPU to train because it didn't have enough memory
* [Tensor2Tensor terminated on "key not found" errors](https://github.com/magenta/magenta/issues/1862) (worked around with a newer version, as noted in the linked GitHub issue)

## Results
After training for roughly a day (2,500 steps), the [resulting MIDI](../../assets/music-generation/mt-train-2500.mid) sounds mostly like random noise. It's not clear to me if this was due to a bug in my pipeline or if I just needed to spend a lot more time training.

Ultimately, I decided I didn't understand the Magenta and Tensor2Tensor libraries well enough to make much progress (without investing an excessive amount of time). [My code is here](https://github.com/jaredkrinke/music-transformer-fine-tuning).
