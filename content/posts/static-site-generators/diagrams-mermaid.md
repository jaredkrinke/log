---
title: Generating diagrams when building a static site (part 2)
description: I'd like to use Mermaid to generate SVG diagrams for my static site at build time. Here's my attempt at integrating Mermaid.
keywords: [mermaid]
date: 2021-09-24
---
In the [last post](diagrams.md), I looked at options for generating diagrams from text descriptions at build time for my static site. Here's my (failed) attempt at integrating [Mermaid](https://mermaid-js.github.io/mermaid/#/) into my site.

# Mermaid is browser-based
Mermaid is built on top of [D3.js](https://d3js.org/), which is designed to be used in the browser. It exposes a [fluent](https://en.wikipedia.org/wiki/Fluent_interface) API reminiscent of [jQuery](https://jquery.com/). It directly manipulates a DOM, which means you need a browser.

This is a problem for my scenario where I'm building my site outside of any browser in Node.

Mermaid provides a command line interface where you can pass in the text describing a diagram and get SVG back out, but rather than doing something sensible, it uses [Puppeteer](https://github.com/puppeteer/puppeteer) to spin up a headless Chromium browser DOM (enjoy that 200+ MB download!) that D3.js manipulates, and then gets everything back out. I guess this is fine for generating, say, a PNG image file, but for SVG it seems excessively wasteful. You shouldn't need a DOM or browser just to generate XML!

# Sanity check
Just to make sure I'm not missing something obvious, let's try building a Mermaid diagram in Node without doing anything special.

## Module woes...
The first problem I hit is that Mermaid 8.13.0 with D3.js 7.0.3 won't load in either a CommonJS or ES Module environment in Node 14.17.0. If, in CommonJS mode, I try to use `require("mermaid")`, Node rightly points out that D3.js is an ES Module. If, in an ES Module, I try to use `import "mermaid";`, then Mermaid tries to use `require()` on D3.js, which obviously doesn't work. This seems like a bug in Webpack's "universal module" pattern.

## jsdom to the rescue?
[jsdom](https://github.com/jsdom/jsdom) provides a fake DOM implementation for use in Node. Sounds promising!

Unfortunately, Mermaid's dependencies require some SVG functionality that jsdom doesn't implement, e.g. [SVGGraphicsElement.getBBox()](https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement/getBBox). Alright, now it's making more sense why Mermaid has this dependency on a browser--it's using the browser's SVG API to measure text, compute transformations, and so on. I'm still not thrilled with this design, but I can see how one might need to measure text when generating diagrams (althoug embedding a full Chromium engine seems like overkill).

I did a bit of searching to see if anyone has implemented the SVG API for use in Node, but I couldn't find anything that looked promising. There was a library for the [Canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) API that can be used in Node, which probably solved many similar problems (related to CSS and measuring fonts), but implementing SVG just so I can generate diagrams without downloading Chrome is beyond the amount of effort I'm willing to put into this endeavor.

# Taking a step back
It's looking like using Mermaid on the back end is probably going to require either a significant amount of effort or a willingness to settle for using Chromium behind the scenes.

Rather than start investigating the performance characteristics of mermaid-cli, I think I'm going to take a step back and evaluate which of Mermaid, Graphviz, and [MSAGL](https://github.com/microsoft/automatic-graph-layout) (which I just found) has syntax I find most comfortable (while still supporting the features I'm interested in). Honestly, this should have been the first step, but I was hoping that one option would be clearly easier to integrate, at which point I'd probably just make do with whatever syntax and features were available.