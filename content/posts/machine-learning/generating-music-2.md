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

I had hoped that a simple `pip install magenta` would work as advertised, but it failed spectacularly with a bunch of C/C++ compiler errors. After some troubleshooting and research, the issue appears to be:

* The Magenta code is a little old
* Some of the dependencies are fairly old
* These dependencies don't provide Python 3.10 binaries *for the old versions Magenta depends upon*
* And of course Python had breaking ABI changes since the old dependency versions were released

There's an issue in the Magenta issue tracker that seems to cover this problem, but I don't think anyone is looking at it: [Magenta install fails for Python >= 3.8 ](https://github.com/magenta/magenta/issues/1962).

From what I can gather, this is just business as usual for Python, so there are tools to manage multiple Python installations. After setting up a Python 3.7 environment (using Anaconda), `pip install magenta` completed successfully:

```
conda create -n magenta python=3.6
conda activate magenta
pip install magenta
pip install beam
```

# Training a model
While troubleshooting a few issues, I ran across a helpful thread that [raised the idea of using transfer learning with Music Transformer's pre-trained checkpoints](https://groups.google.com/a/tensorflow.org/g/magenta-discuss/c/tRrth7wXF6U).

I followed the instructions up until the training section where Tensor2Tensor failed when trying to call a method that doesn't exist, *on a class defined within Tensor2Tensor itself*:

```
  File "<removed>\site-packages\tensor2tensor\utils\optimize.py", line 242, in compute_gradients
    gradients = self._opt.get_gradients(loss, var_list)
AttributeError: 'AdafactorOptimizer' object has no attribute 'get_gradients'
```

Fortunately, the optimizer setting is configurable via `--hparams`, and setting `optimizer=Adam` avoided this issue.

Side note: annoyingly, I wasn't able to use my GPU for training because it didn't have enough memory (it hit an "out of memory" error).

# Sampling from the new model
Naturally, sampling from my newly trained model didn't work either. There were a bunch of "key not found" errors with stack traces and messages like this:

```
Not found: ... NotFoundError: Key _CHECKPOINTABLE_OBJECT_GRAPH not found in checkpoint
```

It seems like this was due to a bug in the version of Tensor2Tensor Magenta depended upon. Luckily for me, [someone already reported this problem](https://github.com/magenta/magenta/issues/1862) and a helpful commenter suggested a workaround that worked for me.

After updating Tensor2Tensor and re-training, I was successfully able to sample some music from my model. It was terrible.
