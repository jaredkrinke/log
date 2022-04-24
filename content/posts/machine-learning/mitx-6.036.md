---
title: "MITx - 6.036: Introduction to Machine Learning"
description: "I'm following a freely available MIT coure: Introduction to Machine Learning."
date: 2022-04-24
---
As [noted previously](getting-started.md), I've been researching machine learning (just for fun).

# MITx - 6.036
I'm starting with an undergraduate course from MIT that is online for free: [MITx - 6.036: Introduction to Machine Learning](https://openlearninglibrary.mit.edu/courses/course-v1:MITx+6.036+1T2019/about).

Having just completed the course, here are some observations:

* The lectures are excellent, but note that they're theory- and math-heavy (and my math was rustier than I realized)
* I'd recommend learning about [NumPy](https://numpy.org/) *prior* to starting this course (especially [element-wise operations and broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html))
* So far, there has been no need (and no benefit) to enabling GPU acceleration (and setting it up on Windows was painful, for [reasons I still don't understand](https://github.com/tensorflow/tensorflow/issues/48868))
* The provided code seems to be built for a previous version of TensorFlow's Keras interface (although the [updates I have needed thus far](https://gist.github.com/jaredkrinke/0fed897dfbdf35af2c4eb388bfe0d754) were minor)

The course provides a great introduction to:

* Classification
* Regression
* Neural networks
* Convolutional neural networks
* Recurrent neural networks
* Recommender systems
* Decision trees

Note that the course *doesn't* cover some of the machine learning topics I'm most interested in:

* [Transformers](https://en.wikipedia.org/wiki/Transformer_(machine_learning_model))
* [Generative adversarial networks](https://en.wikipedia.org/wiki/Generative_adversarial_network)

Overall, it was a fun course and good Python practice, but I wasn't really inspired to go start a machine learning project because I'm not terribly interested in classification and regression problems at the moment.