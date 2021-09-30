---
title: My ideal static site generator
description: A static site generator is essential for hosting a fast and free dev blog. Here's my theoretical ideal setup.
keywords: [blog]
date: 2021-09-11
---

In the interest of documenting some of my programming misadventures, I'm creating a developer blog. But first, I need a static site generator.

# Motivation
I'm creating a developer blog for a couple of reasons:

* Writing helps me organize my thoughts (into bulleted lists)
* Documenting my progress means I don't have to rely solely on my (unreliable) memory
* Someone, somewhere with a similar problem *might* benefit from me writing down my research and solutions

Now, why do I need a static site generator? Two simple reasons:

* Hosting static content is practically free these days and plain old HTML is supported on basically every device
* Writing HTML by hand becomes painful as soon as you add a second page (~~something I am hoping to eventually do~~ done!)

# The ideal setup
## Input
Ideally, I'd like to organize content as follows:

* Content is written using [Markdown](https://en.wikipedia.org/wiki/Markdown) (because it's succinct and ubiquitous)
* Each post is stored in a separate, self-contained file (for easy management)
  * One exception: posts should be able to easily reference each other
  * Diagrams and images can be directly embedded into posts
* File system metadata (e.g. topic folder) is used, where useful

My directory structure is going to look like this:

* `content/`: Root directory of all blog content
  * `posts/`: Root of all blog posts
    * `topic1/`: Blog posts organized by topics
      * `post1.md`: Blog post 1
      * `post2.md`
      * etc.
    * `topic2/`
    * etc.
* `static/`: Static files (namely CSS)
* `templates/`: Template/layout files

Blog posts will use YAML front matter (draft and keywords are optional, but date is not since Git doesn't preserve file system dates):

```
---
title: Title of blog post
description: Plain text description of the post (for HTML header, blurbs, etc.)
keywords: [search,keywords]
date: Publish date
draft: true
---
```

Note: I'd like to be able to automatically insert keywords into every post within a given topic.

## Output
The output should be as simple as possible:

* Each post should get its own HTML file (and, optimistically, [permalink](https://en.wikipedia.org/wiki/Permalink))
  * Pages should use plain old HTML, using CSS for styling (no JavaScript required)
  * References to other posts should use relative links (so that links don't break if the site is moved or viewed directly from the file system)
  * References should be validated at build time
  * Embedded resources should be separated out into unique files (I guess you could call this "no images required")
    * Diagrams should use the SVG format (to support high resolution displays)
* Index/archive pages should be generated by aggregating content from multiple posts
* An RSS news feed should be generated
* Non-markdown files (e.g. CSS files, other assets) should pass through, unmodified
* Ideally, I'd like to be able to load the HTML files directly from the file system and have all styling and links work normally (no web server required for testing)

## Hosting
I'll store the content in a [Git](https://git-scm.com/) repository on [GitHub](https://github.com/) for archival purposes.

The pages will be served using [GitHub Pages](https://pages.github.com/) (because it's fast and free, at least for my purposes).