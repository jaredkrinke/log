---
title: Getting started with machine learning
description: For personal enrichment, I'm playing around with machine learning.
date: 2022-03-07
---
One of the reasons I decided to give [Python](../programming-languages/python.md) one last try is that Python is popular for machine learning, and machine learning is a topic I'm interested in.

# Why?
Why am I interested in machine learning?

* It's an area of computer science that has advanced significantly since I studied CS in school
* It has many unique practical applications (speech recognition, language translation, machine vision, generative art)
* I recently acquired a GPU that (as far as I know) is capable of accelerating machine learning pipelines

# First steps
As an introduction, I'm following MIT's [Introduction to Machine Learning (2020)](https://openlearninglibrary.mit.edu/courses/course-v1:MITx+6.036+1T2019/about) class. It's in Python and builds on [NumPy](https://numpy.org/). The first 4 weeks focus on linear classifiers for binary classification.

Although my math is rusty, my biggest struggle is actually with the NumPy API. Here is my list of grievances:

* NumPy implicitly "broadcasts" arrays into compatible shapes
  * I assume this is for convenience, but all it's done for me is silently hide bugs in my code
* NumPy sometimes silently removes dimensions
  * Again, this is probably for convenience, but all it's done is trip me up -- I really wish `keepdims` defaulted to `True`
* The API has a lot of cruft (e.g. a `matrix` class that is no longer recommended for matrix computation)
* The documentation is frustratingly vague, and sometimes circular (e.g. "`*` returns `self * value`")

# Experimentation
## Using a sample data set
To get a better handle on NumPy, I'd like to actually attempt to create a linear classifier from scratch. A quick search led me to a [page with links to data sets for binary classification problems](https://jamesmccaffrey.wordpress.com/2018/03/14/datasets-for-binary-classification/). I'm using [UCI Machine Learning Repository's "banknote authentication" data set](https://archive.ics.uci.edu/ml/datasets/banknote+authentication) because the data format is simple (4 predictor variables and a 0 or 1 for the classification).

To my surprise, simple algorithms (e.g. selecting random parameters) were able to correctly classify over 95% of examples. For what it's worth, my code is posted [here](https://github.com/jaredkrinke/ml/tree/main/binary-classification).

## Solving a problem from scratch
I'd like to try solving a real world problem from scratch, but I don't really have a problem in mind that lends itself to binary classification. For what it's worth, here are some Kaggle data sets that might eventually inspire me:

* [NBA players](https://www.kaggle.com/vivovinco/nba-player-stats)
* [Hacker News data](https://www.kaggle.com/hacker-news/hacker-news)
* [Chord classification](https://www.kaggle.com/deepcontractor/musical-instrument-chord-classification)
* [Movie data](https://www.kaggle.com/rounakbanik/the-movies-dataset)
* [Stack Overflow data](https://www.kaggle.com/stackoverflow/stackoverflow)