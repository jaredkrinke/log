---
title: Generating music using machine learning
description: Let's see if I can use Google Brain's Music Transformer to generate ragtime music
date: 2022-04-26
---
Recent music generation results (e.g. [Music Transformer: Generating Music with Long-Term Structure](https://magenta.tensorflow.org/music-transformer)) are part of what piqued my interest in machine learning. After [following an introduction to machine learning](mitx-6.036.md), it's time for some experimentation.

First up: generating a [ragtime](https://en.wikipedia.org/wiki/Ragtime) piano piece.

# Approaches
The most compelling generated music I've seen thus far comes from Google Brain, namely their [Performance RNN](https://magenta.tensorflow.org/performance-rnn) and [Music Transformer](https://magenta.tensorflow.org/music-transformer) papers. The associated GitHub repositories appear to contain models that have been pre-trained on various corpora (e.g. a [piano competition's MIDI recordings](https://www.piano-e-competition.com/)). It's also possible to train using a new corpus. The trained models can generate continuations based on a primer or generate unconditioned music "from scratch".

Here are several approaches I'm investigating for generating a ragtime piece:

1. Condition pre-trained Performance RNN and Music Transformer models with existing ragtime music (either an intro or the first few measures) and generate a continuation
1. Train a new model on a corpus of ragtime music, and then do unconditioned generation
1. Train a new model on a ragtime corpus and generate a continuation from a ragtime primer
1. Train a new model on a ragtime corpus and generate a continuation from an arbitrary primer

I don't have any intuition for how large of a corpus is required to generate a decent model, so it's possible that options 2 - 4 won't be feasible for me (either because finding/generating such a training corpus is too difficult or the compute required to train the model is beyond what my computer can handle).

# Using pre-trained models
Without installing anything locally, you can use the [Music Transformer notebook](https://colab.research.google.com/notebooks/magenta/piano_transformer/piano_transformer.ipynb) to generate music. There are several options:

* Generate music "from scratch" (unconditional)
* Generate a continuation based on a primer
* Generate accompaniment for a (monophonic) melody

## Unconditional generation
Without providing a primer, I don't think it's possible to indicate what genre of music you'd like to generate. For example, the clip I got sounds like some sort of [boogie-woogie folk march](../../assets/music-generation/mt-unconditioned.mid). Obviously this isn't the genre that I was looking for (or, really, than anyone was looking for). Rather than continuing on randomly like this, I'll investigate primed generation.

## Continuations
The notebook linked above also supports providing a primer, either from a provided list or by uploading a MIDI file directly in the UI.

### Cropping MIDI primers
The primer is included in the output, so I assume it should be reasonably short. My original plan was to edit down an existing ragtime MIDI using [MuseScore](https://musescore.org/en), but MuseScore's output appears to be incompatible with the [pretty_midi](http://craffel.github.io/pretty-midi/) module that the notebook uses, resulting in the following error:

```
pretty_midi\pretty_midi.py:97: RuntimeWarning: Tempo, Key or Time signature change events found on non-zero tracks. This is not a valid type 0 or type 1 MIDI file. Tempo, Key or Time Signature may be wrong.
```

My workaround was to switch to using [Audacity](https://www.audacityteam.org/) to crop my MIDI primer (and this worked without issue).

### Example continuations
First, I tried using just the intro bars of some Scott Joplin rags:

* [Wall Street Rag intro](../../assets/music-generation/mt-continuation-intro-wall-street.mid): this generated an interesting continuation that sounded vaguely like a cross between ragtime and new age piano
* [Magnetic Rag intro](../../assets/music-generation/mt-continuation-intro-magnetic.mid): this generated a continuation with a halting style that keeps repeating notes

Overall, the results are impressive, but also somewhat alien. And definitely not ragtime.

Next, I tried supplying the beginning of a few sections of Joplin rags:

* Wall Street Rag
  * The [first continuation](../../assets/music-generation/mt-continuation-wall-street-1.mid) gets a bit stuck on the primer, but then recovers nicely into a very short still-not-quite-ragtime section
  * The [second continuation](../../assets/music-generation/mt-continuation-wall-street-2.mid) strays quickly and widely from ragtime (continuing the trend of "impressive, but not what I wanted")
* Maple Leaf Rag
  * This [continuation](../../assets/music-generation/mt-continuation-maple-leaf.mid) seemed to ignore the primer and just started cycling through music I can only describe as "movie soundtrack"
* Magnetic Rag
  * The [first continuation](../../assets/music-generation/mt-continuation-magnetic-1.mid) was short, but rag-like!
  * The [second continuation](../../assets/music-generation/mt-continuation-magnetic-2.mid) was similarly short, but promising
  * The [third continuation](../../assets/music-generation/mt-continuation-magnetic-3.mid) was much longer, but... bad

## Accompaniment
Out of curiosity, I also tried generating an accompaniment (based on a monophonic melody that consists of the highest non-overlapping notes in the cropped MIDIs from the last section):

* [Magnetic Rag accompaniment](../../assets/music-generation/mt-accompaniment-magnetic.mid): this was a baroquely ornamented mix of classical and blues

## Reflecting on pre-trained models
Unsurprisingly, the generic pre-trained models I used, while undoubtedly impressive, seem best suited for exploration and amusement, rather than producing something focused on a particular genre.

I suspect that the best path forward for this experiment is to train a new ragtime-focused model on a corpus of typical ragtime MIDIs. As noted earlier, it's possible I won't be able to find either a large enough corpus or enough compute power to produce a reasonable model, but if I *do* succeed, I think the results will be more consistently rag-like.