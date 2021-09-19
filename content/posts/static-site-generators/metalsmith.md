---
draft: true
title: Test-driving Metalsmith for a simple dev blog
description: I'm testing out static site generators for my new dev blog. Here's my first experience with Metalsmith.
keywords: [metalsmith]
date: 2021-09-18
---

I'm testing out [the most promising static site generators](comparison.md) to see which is closest to [my ideal setup](overview.md). Next up is [Metalsmith](https://metalsmith.io/).

# Metalsmith
Metalsmith is a Node-based static site generator with a modular architecture that relies on many small plugins (similar in style to [gulp](https://gulpjs.com/)). Installation is done via NPM (but note that you'll likely need to track down and install many plugins).

## Architecture
Metalsmith is configured using plain old JavaScript code and building the site is just a matter of running your script, which is especially nice for debugging issues. See their "elevator pitch" on the [Metalsmith home page](https://metalsmith.io/) for an example. It's refreshingly simple and transparent, but you'll need to install plugins and write some code to get a test server with live reloading (unlike many other modern static site generators that support this out the box).

While vetting and adding plugins is tedious, I like the fact that Metalsmith doesn't install hundreds of packages by default. Of course, with all the bells and whistles I've added (broken link checking, test server with live reloading, RSS), I'm now up to ~300 packages, according to NPM. Still, that's better than Eleventy's ~500 packages I noted on the exact same site.

Thanks to its modular architecture and a template API unifying library named [jstransformer](https://github.com/jstransformers/jstransformer), Metalsmith supports a wide variety of template languages. I'm not a big fan of some of the big name template languages (e.g. [Liquid](https://liquidjs.com/), [Nunjucks](https://mozilla.github.io/nunjucks/)), but I'm trying out [Handlebars](https://handlebarsjs.com/) because I find it more intuitive and less verbose. I'm hoping it will be easier to read than the plain JavaScript templates I used when testing out [Eleventy](eleventy-2.md) (although I'll presumably need to find or write plugins for the cases where I actually needed nontrivial JavaScript code).

Note: Metalsmith makes very few assumptions about what you're producing, so it could in theory be used for more than just generating static HTML.

## Setup
[Metalsmith's home page](https://metalsmith.io/#introduction) has a sample script right at the top you can look at, but you'll end up with a bunch of `require(...)`s followed by something like this:

```
Metalsmith(__dirname)
    .metadata({
        site: {
            title: "Schemescape",
            url: "https://log.schemescape.com/",
            description: "Development log of a life-long coder",
        },
    })
    .source("./content")
    .destination("./out")
    .use(collections({
        posts: {
            pattern: "posts/**/*.md",
            sortBy: "date",
            reverse: true,
        }
    }))
    .use(markdown())
    .use(layouts({
        directory: "templates",
        default: "default.hbs",
    }))
    ...
    .build(err => {
        if (err) {
            throw err;
        }
    });
```

If you just want to build a dev blog like everyone else, it does feel like a lot of boilerplate code, but I like that it forces you to consider and understand each step of the process. Some of the other static site generators were too proactive and did things I didn't expect or understand (or want). With Metalsmith, it only does exactly what you tell it.

But there's a dark side to Metalsmith's simple model, and that's that Metalsmith has to be taught to do even the most basic things. For example, I'm building my site on Windows, which has the unfortunate property of using backslashes for path separators. Metalsmith doesn't seem to know or care about this detail, so I had to actually write code to switch to web-friendly forward slashes when creating links between files in different directories. Much to my surprise, I spent a fair amount of time just trying to insert reasonable relative links into my output HTML.

### Plugins, plugins, plugins
Metalsmith's modular architecture with a very simple core library means you need plugins. A lot of plugins. Fortunately, most of the functionaltiy I was interested in already existed in the form of published plugins (some official, some third party). Here are the ones I used:

TODO TABLE

* [metalsmith-markdown](https://github.com/segmentio/metalsmith-markdown): (Official) Translates Markdown to HTML (using [Marked](https://marked.js.org/))
* [metalsmith-drafts](https://github.com/segmentio/metalsmith-drafts): (Official) Excludes files marked "draft: true" in YAML front matter (yep, you need a plugin for this)
* [metalsmith-collections](https://github.com/segmentio/metalsmith-collections): (Official) Groups and sorts files by path (e.g. for listing blog posts)
* [metalsmith-permalinks](https://github.com/segmentio/metalsmith-permalinks): (Official) Creates a directory for each HTML file (so links only specify directories and not files)
* [metalsmith-layouts](https://github.com/metalsmith/metalsmith-layouts): (Official) Adds support for templates using [jstransformers](https://github.com/jstransformers)
* [jstransformer-handlebars](https://github.com/jstransformers/jstransformer-handlebars): (Official) Adds support for [Handlebars](https://handlebarsjs.com/)
* [metalsmith-static](https://github.com/TheHydroImpulse/metalsmith-static): Copies static assets (e.g. CSS and my "CNAME" file)
* [metalsmith-rootpath](https://github.com/radiovisual/metalsmith-rootpath): Computes the path to root of each page (allowing you to use relative links to CSS, etc.)
* [metalsmith-discover-partials](https://github.com/timdp/metalsmith-discover-partials): Registers [Handlebar partials](https://handlebarsjs.com/guide/partials.html) (for reusing/nesting templates)
* [metalsmith-feed](https://github.com/hurrymaplelad/metalsmith-feed): Creates an RSS feed from a collection
* [metalsmith-broken-link-checker](https://github.com/davidxmoody/metalsmith-broken-link-checker): Validates relative links in the final site
* [metalsmith-express](https://github.com/chiefy/metalsmith-express): Runs a test server for local testing (with live reloading)
* [metalsmith-watch](https://github.com/FWeinb/metalsmith-watch): Triggers rebuilds when files are updated (needed for live reloading)

### Missing plugins
Despite all these great plugins, I did end up needing to add a little extra functionality. Theoretically, these could be packaged into plugins.

* Translate relative `*.md` links to point to the corresponding output directories
* Compute relative link paths, with forward slashes only (Metalsmith only provides the source path by default)
* Format dates (there were some plugins for this, but I already had my code handy and didn't want to learn how to configure a plugin)

## Issues
### Inflexible directory structure
For how simple Metalsmith is, I figured it would allow for a flexible directory structure, but Metalsmith actually only allows a single source directory by default. This is a problem for my directory structure because I separated all of my content (Markdown files) from files needed to build the web site (scripts, templates, but also CSS). Fortunately, there's a plugin to get around this limitation.

Metalsmith expects you to start with a site and then transform it, but I'm actually just starting with pure content, later transforming it and adding assets that exist only for building a web page (namely CSS, but also a "CNAME" file that GitHub Pages requires when hosting on a subdomain).

Obviously, I can work around this limitation, but Metalsmith should really just support aggregating multiple source paths.

### Destination paths aren't available
Also slashes follow platform format

### Plugin ordering
e.g. permalinks and root path plugins

### Handling internal links
Had to rewrite links using a renderer

## First run

## Themes?


## Issues

## Let's stop there
That's probably enough for one post.

Overall, ramping up on Eleventy was more confusing than I anticipated, but all the pain I felt around Hugo's template language was partially avoided in Eleventy by the ability to use good old JavaScript code. I'm not a fan of some of the design decisions (namely, drawing content from the root folder), but I feel like I could actually end up choosing Eleventy just because it prevents me from having to learn (and, later, remember) another programming language.

**Update**: I fully integrated Eleventy into my dev blog, details are in [part 2](eleventy-2.md).