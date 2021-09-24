---
title: Generating diagrams when building a static site (part 1)
description: I'd like to include diagrams in my static site without requiring any client JavaScript. Here's an overview of the problem.
keywords: [mermaid]
date: 2021-09-23
---
# Background
As described in a [previous post](overview.md), I'd like to have a static site that requires no JavaScript whatsoever to view the site in full fidelity. I'd also like to be able to embed diagrams into my posts, ideally by inserting a textual description of the diagram.

Given how huge the NPM ecosystem is, I thought this would be trivial to setup. I might have been wrong.

# Diagramming software
In the past, I've used [Graphviz](https://graphviz.org/) for generating diagrams, with some success. That was almost 15 years ago, so I assumed today there'd be something newer and more Node-friendly that I could easily integrate into my workflow.

After scouring the web for an hour or so, I found a couple of patterns:

* There were several libraries that aggregate diagramming libraries under a unified API
  * But the component libraries were written in a wide variety of languages (Python, C, etc.), so deployment would be a huge hassle ([Kroki](https://kroki.io/) even went so far as to recommend *against* trying to deploy your own instance)
* Many of the libraries were written in Java (a language I'd like to avoid, if possible)
* Most of the libraries didn't have a convenient text-based input format
* Most of the libraries were designed to run *on the client*

I definitely don't want to have to install multiple programming language environments, and it seems silly to have each client re-render the same diagram on every view. I also don't want to depend on a service that is currently free, but could potentially disappear overnight.

My research led me to two candidate tools:

* [Mermaid](https://mermaid-js.github.io/mermaid/#/): Markdown-inspired JavaScript-based tool
* [Graphviz](https://graphviz.org/): Super old (originally created by AT&T!), C-based diagramming tool

Neither of these is perfect for my environment. Will they work? Probably, but how inconvenient will it be?

## Mermaid
Mermaid is written in JavaScript, so I should just be able to install it via NPM, call an API, and be done, right? Actually, no.

Remember, I want to insert the source code of a diagram directly into my Markdown files, but then have that rendered to SVG at build time. [Mermaid's deployment model](https://mermaid-js.github.io/mermaid/#/n00b-gettingStarted) is to have the client parse the source code from within the page, render an image, and insert it into the DOM.

Ok, so I can just run that same code in Node at build time, right? Then I can skip all the client-side JavaScript? Not according to [an issue in Mermaid's issue tracker](https://github.com/mermaid-js/mermaid/issues/146)!

From reading that thread, it sounds like Mermaid interacts directly with the web page's DOM when rendering. Someone created a command line tool ([mermaid.cli](https://github.com/mermaidjs/mermaid.cli)) that apparently uses [Puppeteer](https://github.com/puppeteer/puppeteer)'s headless Chromium environment to supply a functioning DOM. Apparently, this is the normal workaround for using D3.js-based graphics on the back end. I find this implementation slightly appalling.

I'm a little bit worried about the performance of building my site when each diagram has to spin up a new process which hosts a headless Chromium browser, just to spit out SVG. I suspect it will *work*, but it seems wasteful.

Let's see if I can find a better option.

## Graphviz
Graphviz is old and originated at AT&T, so of course it is written in C. I love C, but compiling anything with dependencies beyond the standard library is a chore. Part of what attracted me to the Node ecosystem was that most everything is written in JavaScript and, since JavaScript compilers are so fast these days, performance is surprisingly adequate most of the time.

Anyway, so my first thought for integration is to just make sure Graphviz is installed and then spin up a process to render diagrams. I don't want to have to start a new process each time, but it's native code, so it's probably fast enough for my needs. Taking a dependency on a binary is highly unusual in Node land, however, so I'd like to find some way to avoid doing that.

But wait, someone already solved this problem! [node-graphviz](https://github.com/JosephusPaye/node-graphviz) is a theoretically Node-compatible version of Graphviz. According to the package, they compiled Graphviz to a [Web Assembly](https://webassembly.org/) module, which can be hosted and run within Node.js. No C compiler needed (for users of the library, that is)!

Embedding Graphviz directly seems like a very promising solution, but I haven't vetted the library to ensure it works as advertised. The code certainly is not what I was expecting to see (it's enormous!), so I'm a bit skeptical.

# mermaid.cli or node-graphviz?
Unfortunately, neither of the two most promising solutions appears obviously better than the other.

Mermaid seems nice because it appears to be broadly used and, by virtue of being newer and web-focused, likely has better support for integrating into web pages (and supporting dark mode, etc.). But I'm having a difficult time getting over the idea of it requiring direct access to a DOM. That just doesn't seem like a good fit for my "local build" scenario. I'm afraid that, even if I use the command line tool or cook up some way to avoiding handing Mermaid a DOM, it will be fragile.

Graphviz doesn't seem to support as many diagram types, and I'm a little bit worried to take on a Web Assembly dependency, but on the other hand I've been meaning to learn more about Web Assembly anyway. This project might be a good way to learn what goes into integrating a Web Assembly module into Node.

# Next steps
Hopefully I don't regret this decision, but I think I'm going to first try integrating Mermaid. If I hit any snags or if performance is abysmal, I'll see if node-graphviz is actually what I'm looking for.