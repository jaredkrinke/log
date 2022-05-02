---
title: Generating music using machine learning (part 2)
description: An unsuccessful (but less unsuccessful than last time) attempt to generate ragtime music.
date: 2022-05-02
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

Ultimately, I decided I didn't understand the Magenta and Tensor2Tensor libraries well enough to make much progress (without investing an excessive amount of time), and I'd spent enough time troubleshooting issues already. [My training scripts are here](https://github.com/jaredkrinke/music-transformer-fine-tuning).

# Second attempt
Rather than give up on transformer-based music generation entirely, I searched around for a simpler codebase that I might be able to more easily understand and/or adapt. Here are a few I ran across:

* [transformer-xl](https://github.com/davidsvy/transformer-xl) by [davidsvy](https://github.com/davidsvy)
* [music-transformer-comp6248
](https://github.com/COMP6248-Reproducability-Challenge/music-transformer-comp6248)
* [MusicAutobot](https://github.com/bearpelican/musicautobot) by [Andrew Shaw](https://github.com/bearpelican)

The first one is a noted as a re-implementation from scratch of the ideas from the transformer/attention research papers (mostly the same ones I'd been looking at) using Tensorflow/Keras. The codebase seemed small enough that I could probably understand it all without too much trouble.

I decided to move forward with the transformer-xl repository. I didn't hit any issues with setup, which was a welcome development.

## Training
As an initial test, I tried training on a fairly small corpus of 58 Scott Joplin MIDIs. I was able to decrease the batch size slightly to support training on my roughly 7 year old GPU. Training for 100 epochs only took about 7 hours.

Note: although there was a preprocessing step to convert the MIDI files to another format, I didn't notice any data generation/augmentation, as in the Magenta codebase.

## Initial results
Generating results was surprisingly slow (compared to using Magenta), but I haven't investigated the reason for that yet.

Regardless, the results sounded a (little) bit like music--a huge improvement from my previous attempt (which was just noise). Examples:

* [Example 1](../../assets/music-generation/train-100-1.midi): occasional glimpses of music
* [Example 2](../../assets/music-generation/train-100-2.midi): pleasant notes with essentially no rhythm
* [Example 3](../../assets/music-generation/train-100-3.midi): repetitive, again with inconsistent rhythm

Unfortunately, the results after 250 epochs weren't noticeably any better. It's possible that the small corpus isn't sufficient for training this model.

# Next steps
I started this project for fun, but after struggling with Python environments and coming to the realization that I have insufficient compute resources available, I'm reconsidering whether or not this is a good use of my time.