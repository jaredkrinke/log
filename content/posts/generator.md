---
title: Finding the right static site generator
---

In the interest of documenting some of my projects (mainly so that I don't have to rely on my unreliable memory), I'm creating a developer blog. But first, I need a static site generator.

# The case for a static site
Why bother with a static site generator at all? A couple of reasons:

* Hosting static content is practically free these days (e.g. using GitHub Pages) and plain old HTML is supported on basically every device
* Writing HTML by hand becomes painful as soon as you add a second page (something I am hoping to do)

# The ideal setup
My ideal workflow is as follows:

* Content is written using Markdown (because it's succinct and ubiquitous)
* Each post is stored in a separate file (for easy navigation)
* Diagrams and images can be directly embedded into posts (to keep each post self-contained)
* File system metadata (namely date created/modified) is used, when available (to simplify management)
* Templates are generated programmatically using React (specifically JSX/TSX)
