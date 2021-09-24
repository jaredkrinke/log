---
draft: true
title: Generating diagrams when building a static site (part 2)
description: I'd like to use Mermaid to generate SVG diagrams for my static site at build time. Here's my attempt at integrating Mermaid.
keywords: [mermaid]
date: 2021-09-24
---
In the [last post](diagrams.md), I looked at options for generating diagrams from text descriptions at build time for my static site. Here's my attempt at integrating [Mermaid](https://mermaid-js.github.io/mermaid/#/) into my site.

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

Unfortunately, Mermaid's dependencies depend on some SVG functionality that jsdom doesn't implement, e.g. [SVGGraphicsElement.getBBox()](https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement/getBBox). Alright, now it's making more sense why Mermaid has this dependency on a browser--it's using the browser's SVG API to measure text, compute transformations, and so on. I'm still not thrilled with this design, but I can see how one might need to measure text when generating diagrams.
