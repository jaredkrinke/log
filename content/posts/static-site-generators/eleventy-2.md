---
title: Test-driving Eleventy for a simple dev blog, part 2
description: Here's my experience integrating Eleventy (a static site generator) into my dev blog.
keywords: [eleventy]
date: 2021-09-16
---

I'm testing out [the most promising static site generators](comparison.md) for my blog. In [part 1](eleventy.md), I recorded my initial impression of Eleventy; in this post, I describe my experience fully integrating Eleventy into my dev blog ([final code here](https://github.com/jaredkrinke/log/tree/eleventy)).

# Background
I [already covered my ideal dev blog setup in detail](overview.md), but here's the gist of it:

* Content is written using [Markdown](https://en.wikipedia.org/wiki/Markdown) (because it's succinct and ubiquitous)
* Each post is a separate file, with YAML front matter for title, date, description, keywords

And the corresponding directory structure:

* `content/`: Root directory of all blog content
  * `posts/`: Root of all blog posts
    * `topic1/`: Blog posts organized by topics
      * `post1.md`: Blog post 1
      * `post2.md`
      * etc.
    * `topic2/`
    * etc.
* `static/`: Static files (namely CSS)
* `templates/`: Template/layout files

# Configuration
My initial `.eleventy.js` configuration file looked something like this:

```
module.exports = function(eleventyConfig) {
    // Copy everything under "static" to the root of the built site (note: this is relative to this config file)
    eleventyConfig.addPassthroughCopy({ "static": "./" });

    return {
        // Don't process Markdown first with a template language
        markdownTemplateEngine: false,

        dir: {
            input: "content",
            output: "out",
            includes: "../templates" // Note: this is relative to the input directory
        }
    }
};
```

Note: the `markdownTemplateEngine: false` setting is to prevent Eleventy from using Liquid to process my Markdown (I don't want this step because it tries to process all instances of `{%`, etc., when I actually want to be able to use those tokens in my blog post content).

# JavaScript templates: easy to write, hard to maintain
After spending the last few posts railing against "unintuivie", "verbose", and "ugly" template languages like Liquid and EJS, [Eleventy's JavaScript templates](https://www.11ty.dev/docs/languages/javascript/) felt like a shining beacon of familiarity and simplicity -- it's just JavaScript! Sure, JavaScript used to be a terrible language (what do you expect for a language that was [originally created in 10 days](https://web.archive.org/web/20160305202500/http://www.computer.org/csdl/mags/co/2012/02/mco2012020007.pdf)?), but modern JavaScript is pleasant to write, especially with [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

I was able to easily dive in and create a bare bones page template (I put this in a shared library, `templates\shared.js`):

```
    renderPage: (data, content) => `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Schemescape${data.title?.length > 0 ? `: ${escapeHTML(data.title)}` : ""}</title>
        ${data.description ? `<meta name="description" content="${escapeHTML(data.description)}" />` : ""}
        ${data.keywords?.length > 0 ? `<meta name="keywords" content="${escapeHTML(data.keywords.join(","))}" />` : ""}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="stylesheet" href="${getPagePathToRoot(data)}/css/style.css" />
    </head>
    <body>
        <main>
            <header><h1><a href="${getPagePathToRoot(data)}/">Schemescape</a></h1></header>
            ${content}
        </main>
    </body>
</html>`,
```

This probably took me 10 minutes to create. But there are a few problems I've noticed along the way:

* It's hard to read because it's constant switching back and forth between strings and code (and the code would balloon if I started pulling code out of the template)
* There's no syntax validation because it's just plain text
  * At one point, after moving some HTML around, I forgot to delete an opening tag -- Node doesn't care because it's just opaque text! I felt bad that the browser had to try and make sense of my malformed HTML
* You always have to add code to escape text that might contain quotation marks, etc.
  * Granted, other template languages can be too overzealous about escaping text, leading to mistakes I see all over the web that look like "I&amp;apos;m double-escaped!"
* As noted in a previous post, "themes" become JavaScript code, which seems like a security issue for anyone who wants to just download and try random themes off the web

Given that I already know JavaScript, for a simple web site like mine, JavaScript templates are quick and easy. I'm not sure I'd want to maintain a large list of such templates, however, because they're a bit messy and error-prone.

Note: the template above uses some helpers defined elsewhere in the file, e.g. to compute the path to the root of the site (so I can use relative links and view my HTML directly from the file system). The full code is in [my GitHub repository, on the eleventy branch](https://github.com/jaredkrinke/log/blob/eleventy/templates/shared.js).

# Blog post pages
Setting up blog post pages was pretty simple:

## 1. Create the HTML template
I called it `templates/post.11ty.js`:

```
const escapeHTML = require("escape-html")
const { renderPage } = require("./shared");

const formatDateAsTimeElement = date => `<time datetime="${date.toISOString().replace(/T.*$/, "")}">${dateFormatter.format(date)}</time>`;

const renderArticle = data => `
<article>
    <header>
        <h1><a href="./">${escapeHTML(data.title)}</a></h1>
        <p>${formatDateAsTimeElement(data.page.date)}</p>
    </header>
    ${data.content}
</article>`;

module.exports = data => renderPage(data, renderArticle(data))
```

## 2. Inject data into all posts
Add `content/posts.json` to inject data to all files under the `content/posts` directory:

```
{
    "layout": "post.11ty.js",
    "tags": "post"
}
```

The first setting selects the template and the second tags all the files as part of the "post" collection (for later iteration).

With those two simple steps, Eleventy will generate directories with an HTML file for each Markdown source file I write.

# Adding a home page
For now, I'm just aggregating all my posts in reverse chronological order on the home page. Also pretty simple:

## 1. Create the HTML template
Along with my generic page template above, the template is pretty simple (note the `data.collections.post.slice().reverse().map(...)` part):

`templates/index.11ty.js`:

```
const { renderPage } = require("./shared");

const renderArticleShort = data => `
<article>
    <header>
        <h1><a href=".${data.page.url}">${data.title}</a></h1>
        <p>${formatDateAsTimeElement(data.page.date)}</p>
    </header>
    <summary><p>${data.description}</p></summary>
</article>`;

module.exports = data => renderPage(data,
`<ul>
    ${data.collections.post.slice().reverse().map(post => `<li>${renderArticleShort(post.data)}</li>`).join("\n")}
</ul>`);
```

Note: the `.slice()` is needed because JavaScript's `reverse()` function mutates the array ([as Eleventy's documentation notes](https://www.11ty.dev/docs/collections/#array-reverse)).

## 2. Add a source file
The `content\index.md` file just points to the template:

```
---
layout: index.11ty.js
---
```

Eleventy will now build my `index.html` file at the root of the output directory.

# Enabling links between pages
I use relative links between my Markdown files for internal links. For example, the post you're reading is [`eleventy-2.md`](eleventy-2.md) and my previous post on Eleventy is [`eleventy.md`](eleventy.md). Here's how I made that second link:

```
[`eleventy.md`](eleventy.md)
```

This setup feels natural and works great for Markdown, both in [Visual Studio Code's Markdown preview mode](https://code.visualstudio.com/Docs/languages/markdown), and when [viewing Markdown files in my repository directly on GitHub](https://github.com/jaredkrinke/log/blob/main/content/posts/static-site-generators/eleventy-2.md).

I was *hoping* that many static site generators would translate these links into ones that worked on the HTML web site, but so far it's seeming like that was just wishful thinking.

Fortunately, since I'm not tweaking output locations, this translation is just a simple mechanical process (prepend "../" and remove the ".md" suffix). Even better, there is a markdown-it plugin named [markdown-it-replace-link](https://www.npmjs.com/package/markdown-it-replace-link) for making such changes. This plugin can be integrated into Eleventy's pipeline via the `.eleventy.js` config file (after `npm install --save-dev markdown-it-replace-link`, of course):

```
module.exports = function(eleventyConfig) {
    // Convert relative Markdown file links to relative post links
    const customMarkdownIt = require("markdown-it")({
            html: true,
            replaceLink: link => link.replace(/^([^/][^:]*)\.md$/, "../$1"),
        })
        .use(require("markdown-it-replace-link"));

    eleventyConfig.setLibrary("md", customMarkdownIt);
...
```

The regular expression just checks for relative links (not starting with "/" or containing a ":") that end with ".md" and then prepends "../" and omits the ".md" suffix, to instead point to the source Markdown file's corresponding output directory (which contains an `index.html`).

# Adding an RSS feed
Many of the static site generators I tested out automagically generate an RSS news feed. Eleventy does not do this.

Eleventy's documentation points to an [official plugin](https://www.11ty.dev/docs/plugins/rss/) for generating an [Atom](https://en.wikipedia.org/wiki/Atom_(Web_standard)) feed.

But if you read the documentation, it becomes apparent that the plugin is just a couple of helpers and the actual Atom template is something you'll be copy-pasting into your repository. Interestingly, I don't see any logic in the sample template to limit the number of posts.

This feels like a shortcoming of Eleventy (and one that probably wouldn't be difficult to fix). I shouldn't have to maintain my own template for a standard format.

# Validating links
In the interest of catching mistakes before sharing them with the entire Internet, I'd like to at least validate all of the internal links between my pages at build time.

My ideal implementation would be a tool that I unleash on the output HTML files, crawling relative links to ensure they're all valid and that all pages are reachable. It would also ensure that any links to anchors within pages exist. Such a tool probably exists, but I haven't found it yet.

For now, I'm just using a quick and dirty hack that validates Markdown files exist in the process of updating the relative links noted previously. The code is fragile and slow enough that I won't advertise it anymore here, but it is in the repository linked below, if you're curious.

# And that's it!
It took a little while to sort out some of the above details, but since I was able to leverage my existing JavaScript knowledge, Eleventy ended up being pretty easy to integrate. As proof, this page exists, and you're reading it.

All of the actual code used to generate this page is [up on GitHub under the "eleventy" branch](https://github.com/jaredkrinke/log/tree/eleventy).

**Update**: I ended up [switching from Eleventy to Metalsmith](metalsmith.md) because Metalsmith has a simpler design and is easier to extend with plugins.