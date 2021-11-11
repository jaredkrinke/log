---
title: Designing md2blog 2.0
description: I hadn't even released anything yet and I've already rewritten md2blog. Here's why.
keywords: [metalsmith,md2blog,deno]
date: 2021-11-10
---
I really didn't want to do this. I probably shouldn't have done this. But I did it anyway.

I created yet another static site generator.

# The recent past
After [investigating a bunch of existing static site generators](comparison.md), I eventually settled on using [Metalsmith](https://metalsmith.io/) (and various plugins) to build my static dev blog. I even went so far as to clean up my code in hopes of releasing a zero-config static dev blog generator called [md2blog](md2blog-design.md).

But in the end, it just didn't feel right to publish a tool on NPM with 18 direct dependencies and over 200 transitive dependencies (including *6 different file matching libraries*). I'm [personally concerned](../web-development/souring-on-npm.md) about the NPM ecosystem's outrageous dependency trees, and their security implications (Dependency Hell 2.0?), so I decided that I shouldn't be further contributing to the problem.

# Enter Deno
Fortunately, as noted in [my post about NPM](../web-development/souring-on-npm.md), there's a relatively new JavaScript (and TypeScript) runtime with a security focus: [Deno](https://deno.land/).

Deno doesn't magically make it 100% safe to download and run JavaScript code from anywhere, but it at least tries to provide a secure environment by sand boxing JavaScript programs (similar to what is done in a web browser) and only allowing certain operations if permissions are explicitly granted on the command line, e.g.:

```txt
$ deno run --allow-read=content,out --allow-write=out main.js
```

Additionally, Deno provides a [standard library](https://deno.land/std) that has been audited by the Deno authors, so you no longer have to pull in modules from unknown contributors just for common tasks like, say, parsing YAML front matter.

Deno also has a focus on the full developer experience and includes facilities for testing, static analysis, dependenc analysis, stand-alone executables, and more. Again, this means that you don't have to rely on tens or hundreds of NPM packages just to run some unit tests or publish a stand-alone tool. Oh, and Deno fully embraces `await` and `async`, so no more dealing with tedious error-first callback patterns!

# Goodbye, Metalsmith
While Deno has some [facilities for running Node/NPM modules](https://deno.land/manual@v1.16.0/npm_nodejs), I decided that, in order to limit the number of dependencies I take on and to leverage async language features, I would essentially recreate Metalsmith for Deno. Fortunately, Metalsmith is so simple, my prototype was under 150 lines of code.

For now, I'm calling this module Goldsmith. Here's how Goldsmith differs from Metalsmith:

* Built on Deno and TypeScript instead of Node and JavaScript
  * As a result, permissions are limited to only the input and output directories, by default
* Native asynchronous API based on promises
* Will be released alongside a standard library of essential plugins

# Plugins and dependencies
Given that *most* of the Metalsmith plugins I was using were trivially simple, I decided that I'd just rewrite the ones I needed from scratch in TypeScript.

Along the way, I made a few changes to further reduce the number of dependencies:

* Standardized on regular expressoins for file matching instead of using various glob libraries
* Replaced Handlebars with a trivially simple template language based on JavaScript's [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)
* Replaced my usage of [Less](https://lesscss.org/) with color conversion functions and `String.replaceAll()`

# Current state of the tool
While none of the above libraries are fit for general consumption yet, the page you're reading was generated with my rewritten Deno-based tool. Other than cleaning up the code, adding tests, and releasing everything, the only functionality that is currently missing is:

1. Command line configuration arguments
1. Test web server with automatic reloading

The first one should be easy, and I think the second one shouldn't be too hard either (hopefully just a matter of injecting a script to connect to a WebSocket that pushes out reload requests based on [Deno.watchFs()](https://doc.deno.land/builtin/stable#Deno.watchFs)).

# A parting note
So there you have it. Depending on how you count, this is either the 4th or 5th static site generator I've built. I like to hope this will be my last.