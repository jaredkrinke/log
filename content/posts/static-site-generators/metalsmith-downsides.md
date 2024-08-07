---
title: Metalsmith's downsides
description: I'm using Metalsmith to generate this site and, while I generally like it, it's not perfect. Here are some of Metalsmith's downsides.
keywords: [metalsmith]
date: 2021-10-14
---
After [testing out a bunch of static site generators](comparison.md), I settled on using [Metalsmith](metalsmith.md) for this site. I like that Metalsmith has a simple design that can be easily extended with plugins (either custom or "off the shelf"), but that's not to say that Metalsmith is perfect.

Let's dive into the downsides of Metalsmith.

# Is Metalsmith being maintained?
There's the question of ownership and maintenance. Metalsmith was created by [Segment](https://segment.com/), and the [main repository](https://github.com/segmentio/metalsmith) lives under their GitHub account. Maintenance duties were [transferred in 2018](https://github.com/segmentio/metalsmith/pull/324/files), but there have been no nontrivial commits since then.

**A pessimistic view is that Metalsmith is a zombie project.**

It's possible that Metalsmith is simple enough that it doesn't *need* any updates, but if you do run into a problem with Metalsmith itself, you're probably going to have to fix it yourself.

This, to me, is probably the biggest downside of building on top of Metalsmith.

# Are the plugins being maintained?
If you take the optimistic view that Metalsmith's core is rock-solid and not in need of updates, how about the plugins? In many cases, **plugins also appear to be unmaintained**.

For example, take the [metalsmith-collections](https://github.com/segmentio/metalsmith-collections) plugin. Its last commit was 3 years ago, but even worse, the [associated NPM package](https://github.com/segmentio/metalsmith-collections) was published 5 years ago. In fact, the published package [doesn't even contain the most up-to-date version of the plugin](https://github.com/segmentio/metalsmith-collections/issues/91). I ran into this particular issue because I wanted to use the plugin's `filterBy` option, but that functionality isn't actually present in the NPM package's version.

This is unfortunate, but there's nothing stopping you from forking and updating plugins yourself.

# Official forum sign-up requirements
[Metalsmith's home page](https://metalsmith.io/) points to a [Gitter](https://gitter.im/) community, which I interpret to be the official forum.

While I like the *idea* of an open source Discord alternative, I was very disappointed with my first experience using (well, attemping to use) Gitter.

Gitter was originally created as a way to chat about GitHub projects, so it was naturally tied to GitHub accounts. This was fine then, but even today Gitter requires one of the following accounts for login:

* GitHub
* GitLab
* Twitter

I use GitHub and have a high opinion of both it and GitLab (Twitter, not so much). But Gitter's *default, required* access requests are repulsive:

* GitHub: "This application will be able to read your ... private project boards."
* GitLab: "Grants complete read/write access ... including all groups and projects ..."
* Twitter: Requires a phone number to sign up (that I assume Twitter turns around and sells to advertisers)

If I already used Twitter, that would be an acceptable option here, but I have no interest in donating my personal data to yet another gigantic advertising company. Without a Twitter account, none of the login options seem even remotely reasonable.

In the end, I created a dummy GitHub account just to access Gitter (which essentially negates any user benefit of using OAuth).

# Plugin ordering and lack of history
My favorite aspect of Metalsmith is its minimal design that can be easily extended with simple plugins, but I think the design is perhaps *too* minimal.

Internally, Metalsmith manages a mapping of files to properties, and this mapping is handed from one plugin to the next, sequentially (and asynchronously). Each plugin *mutates* the mapping however it wants, and eventually Metalsmith's `build()` function writes out the resulting files.

This is indeed a very simple design, but there is a subtle problem lurking: since each plugin can do whatever it wants, information can be changed or lost along the chain. This leads to numerous problems. Here are some examples:

* [metalsmith-markdown](https://github.com/segmentio/metalsmith-markdown) renames files from "page.md" to "page.html"
  * Subsequent plugins can no longer distinguish which HTML files were generated from Markdown and which were just static HTML files
  * This makes supporting relative links (e.g. `./other-page.md`) fragile (e.g. `./static-page.html`, referring to a static HTML page--not generated using Markdown--is ambiguous)
* [metalsmith-permalinks](https://github.com/segmentio/metalsmith-permalinks) moves files into different directories
  * This plugin has to come before [metalsmith-rootpath](https://github.com/radiovisual/metalsmith-rootpath) to correctly construct a "relative path to root" property
  * Replacing paths also makes it essentially impossible to unambiguously link a source file to its destination, without adding additional plugins to the chain

The current behavior is simple to reason over, and can be solved without changing the architecture (using more plugins!), but it is initially surprising, and certainly makes the tool harder to use.

# Configuring Markdown
One less prominent challenge with Metalsmith's architecture is that there is no mechanism (or convention) for communicating between plugins. Probably an uncommon scenario, but it would be nice to allow plugins to configure Metalsmith's Markdown options (without having to use an entirely separate Markdown plugin).

# So do I hate Metalsmith? No!
Honestly, this article makes a compelling case for avoiding Metalsmith--yet, I still use it. Why?

As someone who's familiar with JavaScript, Node, and HTML/CSS, Metalsmith is simply the easiest static site generator for me to use:

* It's simple enough that I know exactly what it's doing
* It's easy to customize and extend
* Simple plugins already exist for most of the things I want to do
* It supports [pretty much any template language](https://github.com/jstransformers)
* I can even debug it, just by hitting F5 in VS Code

Metalsmith is really giving me the best of both using a pre-built static site generator and creating my own. It's possible that the lack of maintenance will force me to switch to something else eventually, but for now I'm happy with it.

**Update**: I eventually gave in and just [made yet another static site generator](md2blog-design.md).