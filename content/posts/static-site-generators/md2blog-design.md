---
title: Designing md2blog, a zero-config static site generator for dev blogs
description: Here's the design of my in-progress static site generator, md2blog.
keywords: [metalsmith,md2blog]
date: 2021-10-26
---
# Background
After [investigating many popular static site generators](comparison.md), I wasn't able to find a convenient static site generator that met this site's needs out of the box. Fortunately, I was able to leverage [Metalsmith](https://metalsmith.io/) (and numerous plugins) to get what I wanted. I'm calling the resulting program **md2blog**.

In this post, I'm going to cover the design of md2blog.

# Design goals
To my surprise, I couldn't find an existing static site generator with the following modest list of functionality:

* Relative linking between Markdown posts that works both on the generated site and GitHub's repository viewer
* Per-category directories for posts (with corresponding index pages for each category)
* Syntax highlighting for code blocks
* Automatic "broken link" checking
* Outputs plain HTML, with no client-side JavaScript (and no bloated themes)

