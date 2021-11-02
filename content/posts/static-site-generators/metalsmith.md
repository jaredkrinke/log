---
title: Test-driving Metalsmith for a simple dev blog
description: I'm testing out static site generators for my new dev blog. Here's my experience fully integrating Metalsmith.
keywords: [metalsmith]
date: 2021-09-18
---

I'm testing out [the most promising static site generators](comparison.md) to see which is closest to [my ideal setup](overview.md). Next up is [Metalsmith](https://metalsmith.io/).

Spoiler: I really like Metalsmith's modular design, so much so that I'm now using Metalsmith for this blog.

# Metalsmith
Metalsmith is a Node-based static site generator with a modular architecture that relies on many small plugins (similar in style to [gulp](https://gulpjs.com/)). Installation is done via NPM (but note that you'll likely need to track down and install many plugins).

## Architecture
Metalsmith is configured using plain old JavaScript code and building the site is just a matter of running your script, which is especially nice for debugging issues. See their "elevator pitch" on the [Metalsmith home page](https://metalsmith.io/) for an example. It's refreshingly simple and transparent, but you'll need to install plugins and write some code to get a test server with live reloading (unlike many other modern static site generators that support this out the box).

While vetting and adding plugins is tedious, I like the fact that Metalsmith doesn't install 500+ packages by default (... like Eleventy).

Thanks to [jstransformer](https://github.com/jstransformers/jstransformer), Metalsmith supports a wide variety of template languages. I'm not a fan of [Liquid](https://liquidjs.com/) or [Nunjucks](https://mozilla.github.io/nunjucks/), but I'm trying out [Handlebars](https://handlebarsjs.com/) because I find it more intuitive and less verbose. So far, it seems easier to maintain than the plain JavaScript templates I used with [Eleventy](eleventy-2.md).

## Themes?
If you don't want to author your own HTML templates, Metalsmith honestly doesn't seem like a good choice. It's possible to construct a Metalsmith "theme" by combining plugins, configuration, and templates, but really what you're providing is an entire skeleton project (with a `package.json` file, build scripts, and so on). This means the result is less portable and more difficult to integrate (unless you're starting from scratch and don't have any opinions or constraints).

Other static site generators (e.g. Hugo) abstract out the concept of a theme (along with standard metadata that themes can leverage), so you don't have to mix code and configuration together with HTML templates and CSS styling. This seems better for people who don't want total control of every character in their final HTML output.

## Setup
[Metalsmith's home page](https://metalsmith.io/#introduction) has a sample script right at the top you can look at, but you'll end up with a bunch of `require(...)`s followed by something like this:

```javascript
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
    .build(err => { if (err) throw err; });
```

If you just want to build a dev blog like everyone else, it does feel like a lot of boilerplate code, but I like that it forces you to consider and understand each step of the process. Some of the other static site generators were too proactive and did things I didn't expect or understand (or want). With Metalsmith, it only does exactly what you tell it.

But there's a dark side to Metalsmith's simple model, and that's that Metalsmith has to be taught to do even the most basic things. For example, I'm building my site on Windows, which has the unfortunate property of using backslashes for path separators. Metalsmith doesn't seem to know or care about this detail, so I had to actually write code to switch to web-friendly forward slashes when creating links between files in different directories.

### Plugins, plugins, plugins
Metalsmith's modular architecture with a very simple core library means you need plugins--a lot of plugins. Fortunately, most of the functionality I was interested in already existed in the form of published plugins (some official, some third party). Here are the ones I used:

| Plugin (* = official) | Purpose |
| --- | --- |
| [metalsmith-markdown](https://github.com/segmentio/metalsmith-markdown)* | Translates Markdown to HTML (using [Marked](https://marked.js.org/)) |
| [metalsmith-drafts](https://github.com/segmentio/metalsmith-drafts)* | Excludes files marked "draft: true" in YAML front matter (yep, you need a plugin for this) |
| [metalsmith-collections](https://github.com/segmentio/metalsmith-collections)* | Groups and sorts files by path (e.g. for listing blog posts) |
| [metalsmith-permalinks](https://github.com/segmentio/metalsmith-permalinks)* | Creates a directory for each HTML file (so links only specify directories and not files) |
| [metalsmith-layouts](https://github.com/metalsmith/metalsmith-layouts)* | Adds support for templates using [jstransformers](https://github.com/jstransformers) |
| [jstransformer-handlebars](https://github.com/jstransformers/jstransformer-handlebars)* | Adds support for [Handlebars](https://handlebarsjs.com/) |
| [metalsmith-static](https://github.com/TheHydroImpulse/metalsmith-static) | Copies static assets (e.g. CSS and my "CNAME" file) |
| [metalsmith-rootpath](https://github.com/radiovisual/metalsmith-rootpath) | Computes the path to root of each page (allowing you to use relative links to CSS, etc.) |
| [metalsmith-discover-partials](https://github.com/timdp/metalsmith-discover-partials) | Registers [Handlebar partials](https://handlebarsjs.com/guide/partials.html) (for reusing/nesting templates) |
| [metalsmith-feed](https://github.com/hurrymaplelad/metalsmith-feed) | Creates an RSS feed from a collection |
| [metalsmith-broken-link-checker](https://github.com/davidxmoody/metalsmith-broken-link-checker) | Validates relative links in the final site |
| [metalsmith-express](https://github.com/chiefy/metalsmith-express) | Runs a test server for local testing (with live reloading) |
| [metalsmith-watch](https://github.com/FWeinb/metalsmith-watch) | Triggers rebuilds when files are updated (needed for live reloading) |

Note that some of the plugins I installed had dependencies flagged by NPM as having vulnerabilities. I reviewed the notices and none seemed concerning for my use case (e.g. all of the input is code/content I wrote and I don't plan on targeting myself for a regular expression denial of service attack).

### Missing plugins
Despite all these great plugins, I did end up needing to add a little extra functionality. Theoretically, these could be packaged into plugins.

* Translate relative `*.md` links to point to the corresponding output directories
* Compute relative link paths, with forward slashes only (Metalsmith only provides the source path by default)
* A "no-op" plugin for conditional inclusion of plugins without breaking up the giant configuration chain

## Issues
Here are a couple of snags I hit while integrating Metalsmith into my site.

### Inflexible directory structure
For how simple Metalsmith is, I figured it would allow for a flexible directory structure, but Metalsmith actually only allows a single source directory by default. This is a problem for my directory structure because I separated all of my content (Markdown files) from files needed to build the web site (scripts, templates, but also CSS). Fortunately, the [metalsmith-static](https://github.com/TheHydroImpulse/metalsmith-static) plugin handle this scenario:

```javascript
const assets = require("metalsmith-static");

Metalsmith
...
    .use(assets({
        src: "static",
        dest: ".",
    }))
```

### Destination paths aren't available
Somewhere in Metalsmith's pipeline, it knows where a file is going to end up, but for some inexplicable reason, this information isn't available to templates or plugins. In my case, it's easy to infer the destination (although I had to deal with Windows' annoying path-separating backslashes), so it wasn't a big deal, but this really isn't something I should have had to think about.

### Plugin ordering
Since plugins enrich and mutate files and metadata along the way, the ordering of plugins matters. One annoying interaction was between the "layouts" (templating) and "feed" (RSS) plugins:

* "Feed" then "layouts": the RSS feed gets wrapped in HTML ("layouts" is run on *every* file by default)
* "Layouts" then "feed": the RSS content for each post is now a full HTML page, because templates were already applied

The fix in this case was to run "layouts" after "feed" but tell "layouts" to only process HTML files (and not "feed.xml").

This all makes sense if you think about how Metalsmith plugins receive a set of files, manipulate them, and then pass them on to the next plugin, but other generators do a good job of insulating me from mistakes like this.

### Handling internal links
I'm still surprised that using relative links to Markdown files for internal linking between posts isn't well supported by the static site generators I've tried so far (Metalsmith included). I ended up having to extend the [Marked renderer](https://marked.js.org/using_pro#renderer) to enable internal links:

```javascript
const marked = require("marked");
// ...
// Translate relative Markdown links to point to corresponding HTML output files
const markdownRenderer = new marked.Renderer();
const baseLinkRenderer = markdownRenderer.link;
markdownRenderer.link = function (href, title, text) {
    return baseLinkRenderer.call(this,
        href.replace(/^([^/][^:]*)\.md(#[^#]+)?$/, "../$1/$2"),
        title,
        text);
};
// ...
Metalsmith
// ...
    .use(markdown({ renderer: markdownRenderer }))
    .use(permalinks())
```

**Update**: I realized I also want to be able to link to a heading *within* another post (examples: [link to Architecture heading in this post](#architecture); [link to my initial impression of Metalsmith in a different post](comparison.md#metalsmith)). The code above has been updated to handle this case.

### Syntax highlighting
**Update**: I added a [separate post on adding syntax highlighting](metalsmith-syntax-highlighting.md).

## Conclusion
Overall, I really liked that Metalsmith just did exactly what I asked, even if I didn't initially know what, precisely, I wanted. I was able to find plugins for almost everything to get started (including local testing with live reloading). Importantly, I also feel like I fully understand what Metalsmith is doing, so I don't have to worry about later discovering that it was processing files multiple times (something that did happen with Eleventy).

Additionally, because Metalsmith is so simple to extend, I can actually foresee myself writing a plugin to, say, add inline diagrams that are automatically converted to SVG at build time (a feature that's part of my [my ideal workflow](overview.md)).

One comment on Handlebars: this isn't a review of Handlebars, but I did find Handlebars to be a surprisingly agreeable template language. This is actually high praise coming from me, since I find most template languages to be hideous and verbose. Only annoyance is that the automatic indentation isn't always what you want (e.g. in the case of `<pre>` blocks).

Overall, I'm very happy with Metalsmith, and it's likely that I will be using it moving forward. **Update**: I switched from Eleventy to Metalsmith.

For reference, all of my code is here:
[https://github.com/jaredkrinke/md2blog](https://github.com/jaredkrinke/md2blog)
