---
title: Designing md2blog 2.0
description: I hadn't even released anything yet and I've already rewritten md2blog. Here's why.
keywords: [metalsmith,md2blog,deno]
date: 2021-11-10
draft: true
---
I really didn't want to do this. I probably shouldn't have done this. But I did it anyway.

I created yet another static site generator.

# The recent past
After [investigating a bunch of existing static site generators](comparison.md), I eventually settled on using [Metalsmith](https://metalsmith.io/) (and various plugins) to build my static dev blog. I even went so far as to clean up my code in hopes of releasing a fully functional static dev blog generator called [md2blog](md2blog-design.md).

But in the end, it just didn't feel right to publish a tool on NPM with 18 direct dependencies and over 200 transitive dependencies. I'm [personally concerned](../web-development/souring-on-npm.md) about the NPM ecosystem's outrageous dependency trees and their security implications (Dependency Hell 2.0?), so I decided that I shouldn't personally be contributing to the problem.

# Enter Deno
Fortunately, as noted [my post about NPM](../web-development/souring-on-npm.md), there's a relatively new JavaScript (and TypeScript) runtime with a security focus: [Deno](https://deno.land/).

Deno doesn't magically make it 100% safe to download and run JavaScript code from anywhere, but it at least tries to provide a secure environment by sand boxing JavaScript programs (similar to what is done in a web browser) and only allowing certain operations if permissions are explicitly granted on the command line, e.g.:

```txt
sh deno run --allow-read=content,out --allow-write=out main.js
```

Additionally, Deno provides a [standard library](https://deno.land/std) that has been audited by the Deno authors, so you no longer have to pull in modules from unknown contributors just for basic tasks like, say, parsing YAML front matter.

Deno also has a focus on the full developer experience and includes facilities for testing, linting, inspecting dependencies, building stand-alone executables, and more. Again, this means that you don't have to rely on tens or hundreds of NPM packages just to run some unit tests or publish a stand-alone tool. Oh, and Deno fully embraces `await` and `async`, so no more dealing with obnoxious error-first callback patterns!

# Goodbye Metalsmith
While Deno has some [facilities for running Node/NPM modules](https://deno.land/manual@v1.16.0/npm_nodejs), I decided that, in order to limit the number of dependencies I take on, and take advantage of async language features, I would essentially recreate Metalsmith for Deno. Fortunately, Metalsmith is so simple, my prototype was only about 150 lines of code.