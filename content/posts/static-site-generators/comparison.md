---
title: Finding the right static site generator
description: There are hundreds of static site generators available today for creating a blog. Here I compare some of the most popular SSGs.
keywords: [metalsmith,hugo,eleventy]
date: 2021-09-12 01:00:00
---

Having already described [my ideal static site generator](overview.md), I'm investigating tools that hopefully meet my needs.

**Update**: I initially [used Eleventy](eleventy-2.md)... but then I [switched to Metalsmith](metalsmith.md) because it was simpler... and then I [abandoned Metalsmith due to huge, overlapping dependencies](metalsmith-downsides.md) and [built md2blog](md2blog-design.md) instead.

# Static site generators in 2021
Given that I don't want to go back to the [pre-Markdown stone age](pre-markdown.md) of static site generators, what are my options (that don't involve building my own)?

Fortunately, we're living in the golden age of static site generators. A quick web search turned up the following options (most with splashy landing pages, theme repositories, and even glowing testimonials):

* [Jekyll](https://jekyllrb.com/)
* [Gatsby](https://www.gatsbyjs.com/)
* [Hugo](https://gohugo.io/)
* [NuxtJS](https://nuxtjs.org/)
* [VuePress](https://vuepress.vuejs.org/)
* [Eleventy](https://www.11ty.dev/)
* [Hexo](https://hexo.io/)
* [Pagic](https://pagic.org/)
* [Docusaurus](https://docusaurus.io/)
* [Next.js](https://github.com/vercel/next.js/tree/canary/examples/blog-starter)
* [Pelican](https://blog.getpelican.com/)
* [React Static](https://github.com/react-static/react-static)
* [Metalsmith](https://metalsmith.io/)
* [Zola](https://www.getzola.org/)

# Preferences
I'm fairly picky about the software I use ("opinionated" some might say). If a piece of software (or a web site) gets in my way, I usually just give up and move on because that first irritation is usually just the first drip of an approaching cascade of frustration.

For example, am I reading an article on a web site and it asks me to sign up for something? That tab gets closed. If there's a huge cookie pop-up that doesn't let me easily opt out? Tab closed. If a piece of new software I'm interested in tells me to install the Java runtime? Forget it! Multi-gigabyte install for a compiler? No thank you. A program takes too long to launch? Uninstall. And so on.

With that in mind, what am I looking for in a static site generator's implementation (having [covered the design in a previous post](overview.md))?

* Must be free and open source without any obnoxious upselling
* Must be simple and quick to install (on Windows, since that's what I'm using)
* Must not produce complex output (e.g. extraneous JavaScript)
* Must not be extremely slow (it can be a little slow, since my site is currently small)
* Must not require a vast graph of plugins to do what I need (unless there are sane defaults)
* ... and probably some other requirements that will become obvious as I investigate further

# Let the battle royale begin!
Below is a table summarizing what I found in my research (note: by "portable" I mean content is just a collection of Markdown files with few constraints/conventions):

| Tool | Dependencies | Output | Configuration | Portable | Templates |
| ---- | :---: | :---: | :---: | :---: | :---: |
| Jekyll | Ruby | HTML | Simple | ✔ | [Liquid](https://liquidjs.com/) |
| Gatsby | Node | SPA | Very complicated | ? | [JSX](https://reactjs.org/docs/introducing-jsx.html) |
| Hugo | *None!* | HTML | Simple | ✔ | [Go templates](https://gohugo.io/templates/introduction/) |
| NuxtJS | Node, Vue | HTML | ? | ✖ | [Vue](https://vuejs.org/)/[JSX](https://reactjs.org/docs/introducing-jsx.html) |
| VuePress | Node, Vue | HTML | ? | ✖ | [Vue](https://vuejs.org/)/[JSX](https://reactjs.org/docs/introducing-jsx.html) |
| Eleventy | Node | HTML | Simple | ✔ | [Liquid](https://liquidjs.com/), [many more](https://www.11ty.dev/docs/languages/) |
| Hexo | Node | HTML | Complicated | ✖ | [EJS](https://ejs.co/), [many more](https://hexo.io/plugins/) |
| Pagic | Deno | SPA | Simple? | ✔ | [Vue](https://vuejs.org/)/[JSX](https://reactjs.org/docs/introducing-jsx.html) |
| Docusaurus | Node | SPA | Complicated? | ✖ | [JSX](https://reactjs.org/docs/introducing-jsx.html) |
| Next.js | Node | HTML | Complicated | ? | [JSX](https://reactjs.org/docs/introducing-jsx.html) |
| Pelican | Python | HTML | Complicated | ✖ | [Jinja](https://jinja.palletsprojects.com/en/3.0.x/) |
| React Static | Node | SPA | Complicated | ✖ | [JSX](https://reactjs.org/docs/introducing-jsx.html) |
| Metalsmith | Node | HTML | Complicated | ✔ | [Handlebars](https://handlebarsjs.com/), [many more](https://github.com/jstransformers/jstransformer) |
| Zola | *None!* | HTML | Complicated | ✔ | [Tera](https://tera.netlify.app/) |

Note: all of the generators support Markdown, so I didn't bother adding a column for Markdown support.

# Summary
After my first pass through all of these static site generators, my top picks to investigate further are (in no particular order):

* Hugo
* Eleventy
* Zola
* and maybe Metalsmith

## Where did the others fall short?
A couple of static site generators required installing development environments for languages I'm not interested in:

* Jekyll requires Ruby
* Pelican requires Python

A surprising number of generators wanted to output an over-engineered (for my purposes) single-page app, chock full of JavaScript:

* Gatsby
* Pagic
* Docusaurus
* React Static

Several more generators were built to leverage frameworks that I'm not familiar with (and don't have any plans to learn in the near future):

* NuxtJS
* VuePress
* Next.js

The final two generators I'm hesitant to use appeared to be victims of trying to cater to every possible use case, leading to complicated configuration and/or voluminous documentation (or plugin registries):

* Hexo
* and probably Metalsmith

# Research notes
The previous sections are probably more useful than my "stream of consciousness" notes below, but if you want to see what I was thinking, go ahead and read it!

## Jekyll
First, I'm looking at Jekyll, because it's [supported out of the box on GitHub Pages](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll).

Naturally, I want to test things locally. Fortunately, [testing locally is documented on GitHub's site](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll):

> We recommend using Bundler to install and run Jekyll. Bundler manages Ruby gem dependencies

Wait, I have to manage Ruby gem dependencies? Let's consult the [Jekyll site](https://jekyllrb.com/) to see their "quick-start instructions":

> gem install bundler jekyll

Alright, it looks like I need a full blown Ruby environment.

## Gatsby
[Gatsby requires Node v12+](https://www.gatsbyjs.com/get-started/) for installation. I realize this isn't "fair", but I actually use Node and NPM, so this isn't a deal-breaker for me.

Diving into [how Gatsby works](https://www.gatsbyjs.com/how-it-works/), I see some alarmingly complex boasts:

> Combine Content & Data from Anywhere

This might be overkill. What did they have in mind?

> Content Management Systems like WordPress, or Ecommerce platforms like Shopify

Ok, definitely overkill for my purposes. But maybe I can just ignore those features and be happy?

> If you build your site with Gatsby, your site will be a lightning-fast progressive web app (PWA)

... but I just want plain old HTML.

## Hugo
Hugo is written in Go and [distributed as a single executable](https://gohugo.io/getting-started/installing). It doesn't get any simpler than that! In [their quick-start](https://gohugo.io/getting-started/quick-start/), it looks like posts can be stored in markdown files with front matter for title, date, and draft status:

```yaml
---
title: "My First Post"
date: 2019-03-26T08:47:11+01:00
draft: true
---
```

Their example output showed a build complete in 11 milliseconds. These are all very good signs so far.

Hugo has emerged as an early front runner.

**Update**: I documented [my initial look at Hugo](hugo.md), but did not want to learn the template language.

## NuxtJS
NuxtJS appears to be a static site generator for people who use [Vue](https://v3.vuejs.org/). While Vue is on my list of frameworks to research, I don't have any experience with it yet. The NuxtJS page mentions server-side rendering which isn't the approach I'm most interested in these days.

I'm going to set aside NuxtJS for now.

## VuePress
Two strikes from the VuePress landing page:

* "Enjoy the dev experience of Vue + webpack" (since when have I enjoyed webpack?)
* "VuePress generates pre-rendered static HTML for each page, and runs as an SPA once a page is loaded." (I understand the potential performance benefits, but I don't want JavaScript to be required and I'm sure there is substantial overhead in doing this, even if latency of subsequent page loads is improved)

## Eleventy
Eleventy requires Node and NPM which, while not optimal, is something I will tolerate since I already need those for a couple of projects. I do wonder if this will eventually become a burden in the future when Node inevitably falls out of favor.

The first few pages of documentation don't discuss themes, which I actually find to be semi-encouraging because that implies that I can just hand-author some minimal HTML templates without having to learn some complex theming system.

[Eleventy's quick tips page](https://www.11ty.dev/docs/quicktips/) boasts some encouraging features:

* "Zero Maintenance Tag Pages for your Blog" (nice for categorization)
* "Adding a 404 Not Found Page to your Static Site" (something I hadn't considered, but appears to be supported on GitHub Pages)

But there's also a lot of oddly specific integrations:

* "Add Edit on GitHub Links to All Pages" (interesting, I suppose)
* "Fetch GitHub Stargazers Count (and More) at Build Time" (... why?)
* "Trigger a Netlify Build Every Day with IFTTT" (ok, now things are getting out of hand)

Eleventy looks interesting; sort of like Jekyll, but using Node/JavaScript. This is my #2 choice at this point.

**Update**: I took [an initial look at Eleventy](eleventy.md) and ended up [fully integrating it into this site](eleventy-2.md)... but then I [switched to Metalsmith](metalsmith.md) because it was simpler... and then I [abandoned Metalsmith due to huge, overlapping dependencies](metalsmith-downsides.md) and [built md2blog](md2blog-design.md) instead.

## Hexo
Hexo also requires Node and NPM (similar to Eleventy). Fine.

Hexo appears to use the "million plugins" architecture that is popular in the Node world. I understand the appeal of isolating each component and not reinventing the wheel, but I usually prefer a more opinionated, top-down approach because it lets everyone have a common setup that they can discuss. For example, I like [Parcel](https://parceljs.org/) and not [webpack](https://webpack.js.org/), but I do understand "zero configuration" constraints can come back to bite me later (**update**: as happened in the case of Parcel).

Anyway, [Hexo's default](https://hexo.io/docs/setup) includes EJS, Stylus, and Markdown. I'm not familiar with the first two. Is this going to be geared toward web developers?

Hexo looks decent, but certainly not any closer to what I want than Hugo or Eleventy. I'll come back to Hexo, if needed.

## Pagic
Pagic uses Deno which, while intriguing, isn't something I've actually installed or played with yet. Maybe this is the motivation I need to try Deno?

But unfortunately, Pagic seems to be pushing a Gatsby-like single-page app build which, as noted previously, is not an approach I'm interested in.

## Docusaurus
Docusaurus seems to be targeting technical documentation with support for translating into multiple languages. This is admirable, but I'm hesitant to use complex software when my needs are so simple.

## Next.js
[Next.js](https://nextjs.org/) appears to be a framework for server-side rendering using React concepts (e.g. JSX). Even with a [skeleton project](https://github.com/vercel/next.js/tree/canary/examples/blog-starter) available, similar to the Vue-based static site generators I already looked at, I feel like I wouldn't benefit from this tool because I'm not already using Next.js for other purposes.

## Pelican
Pelican requires Python and (at the time of this writing) I wasn't using Python, so I unfairly didn't give Pelican a try.

## React Static
Yet another static site generator that adds *more* complexity:

> React Static gathers your data, and templates together and intelligently splits them into bite-size static files using webpack and javascript. ... Little did you know that when React Static exported your site, it also generated a tiny, optimized, and code-split version of your original React application for every page of your site! After these pages have loaded, React invisibly mounts this application to the existing HTML on the page and...

## Metalsmith
Metalsmith is built on Node and requires you to write actual JavaScript code to build your site.

While I didn't really want to have to write code, at least I'd be able to debug the tool when something didn't behave as expected.

Metalsmith's most interesting aspect for me is that it's modular and pluggable, similar to [Gulp](https://gulpjs.com/). This could come in handy if I need to extend the existing functionality a little (e.g. to allow embedding of images and diagrams).

Similar to Gulp, I think I'd probably end up frustrated with an endless graph of plugins that interact in bizarre ways, but I *might* be willing to give Metalsmith a try if I find too many gaps in the other generators I've liked so far.

**Update**: I ended up [fully integrating Metalsmith into my site](metalsmith.md) (including [syntax highlighting](metalsmith-syntax-highlighting.md)) because I liked the modular architecture and simple plugins met most of my needs. Eventually, however, I [abandoned Metalsmith due to numerous, overlapping dependencies](metalsmith-downsides.md) and [built md2blog](md2blog-design.md) instead.

## Zola
Zola is written in Rust. A fast, native binary with no dependencies is certainly a strong start for Zola.

Annoyingly (from a portability aspect), Zola wants me to use `+++` to demarcate front matter in [TOML](https://toml.io/en/) (definitely not my preferred metadata language), but "YAML front matter is also supported to ease porting legacy content" -- hopefully that support doesn't disappear someday!

Zola's documentation looks pretty good, and they [explicitly mention support for RSS](https://www.getzola.org/documentation/templates/overview/#built-in-templates) as a feature.

Zola makes it onto my short list.

**Update**: I described [my initial experience with Zola](zola.md). Similar to [Hugo](hugo.md), I set it aside because I didn't want to learn a new language just for creating page templates.

# Next steps
My next step is to test out Hugo, Eleventy, Zola, etc. to see which one can meet my needs with the least amount of hassle. Stay tuned!

**Update**: I tested several static site generators out. My initial reviews are documented below:

* [Hugo](hugo.md) (didn't like the template language)
* [Eleventy](eleventy.md) ([I initially used Eleventy](eleventy-2.md), but later switched to Metalsmith--[which I also later abandoned](metalsmith-downsides.md) for [md2blog](md2blog-design.md))
* [Zola](zola.md): (didn't like TOML or the template language)
* [Metalsmith](metalsmith.md) (I used Metalsmith for a while, but [didn't like the huge dependency tree](metalsmith-downsides.md), so I made [md2blog](md2blog-design.md) instead)
