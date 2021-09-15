---
title: Test-driving Eleventy for a simple dev blog
description: I'm testing out static site generators for my new dev blog. Here's my first experience with Eleventy.
keywords: [eleventy]
date: 2021-09-14
---

I'm testing out [the most promising static site generators](generator-research.md) to see which is closest to [my ideal setup](generator.md). Next up is [Eleventy](https://www.11ty.dev/).

# Eleventy
Eleventy is a Node-based static site generator that seems to be popular with people who would rather use JavaScript instead of Ruby/Jekyll.

## Installation
Installation is done via NPM. Obnoxiously, if you don't install globally, [there is a non-Eleventy NPM package named "eleventy" that is picked up by default](https://www.11ty.dev/docs/usage/), so you have to use `npx @11ty/eleventy ...` for commands. This is the recommended approach and I find it very awkward to type (NPM scripts seem like a good mitigating practice). At least the other package doesn't appear to obviously be name squatting malware!

## Setup
Configuration of input/output directories, etc. is done on the command line or in a JavaScript config file (yes, it's real JavaScript code). Their [sample](https://www.11ty.dev/docs/config/) feels a bit convoluted for what amounts to JSON:

```
module.exports = function(eleventyConfig) {
  // Return your Object options:
  return {
    dir: {
      input: "views",
      output: "dist"
    }
  }
};
```

I was curious what all might go in an Eleventy configuration file, so I took a peek at their [official blog sample](https://github.com/11ty/eleventy-base-blog) and was horrified to see 142 lines of JavaScript code in their `.eleventy.js` config file. I thought this was supposed to be the simplest static site generator! Looking more closely, there appear to be helper functions defined in this configuration file. I'm not going to question their design yet, but it makes me nervous.

## Concepts
[Eleventy's documentation](https://www.11ty.dev/docs/) has lots of details, but there isn't a great overview of all the concepts and the associated directory structure. For example, I still haven't found a clear definition for their use of the word "template".

I'm far from an expert, but here is my understanding of Eleventy's concepts:

* Input: directory that content is pulled from (defaults to root)
  * Note: Content is opt *out* not opt in, so you have to tell Eleventy which files you don't want published (this seems like a risky default to me)
* Output: directory where built/rendered/copied content goes (for subsequent uploading/publishing)
* Layouts: templates for rendering content; a wide variety of template engines are supported (including Liquid, EJS, JavaScript, but but [*not* JSX](https://github.com/11ty/eleventy/issues/235))
* Data: properties that come from several sources and can be used in layouts, including the file system, per-directory JSON files, templates, YAML front matter in content files
* Collection: specified with the "tags" property, collections are used for iterating over multiple pieces of content
* (Pagination, filters, shortcodes, and custom tags are other concepts I haven't needed yet)

I found Eleventy's terminology to be unintuitive (templates vs. layouts vs. includes), but the concepts make sense. The [cascading data model](https://www.11ty.dev/docs/data-cascade/) is particularly elegant.

The default directory structure for a blog could look like this:

* (root): By default, the root is the directory from which Eleventy pulls content (note: content is opt *out* not opt in)
  * `index.html`: Home page for the blog
  * `_data`: Directory for site-wide data
    * `site.json`: Site-wide metadata properties
  * `_includes`: Directory for storing templates, etc.
    * `post.ejs`: EJS template for blog posts
  * `_site`: Output directory (yes, the output directory is a subdirectory of the input directory by default)
  * `posts`: Directory for storing blog posts
    * `posts.json`: Metadata properties to apply to all posts (namely: `layout: post.ejs`)
    * `something-interesting.md`: A blog post

## First run
Eleventy's directory structure initially seemed simpler than Hugo's, but as I dove in, I found that it muddled distinct concepts and I ended up having to change the configuration quite a bit to give me what I wanted. Because I wanted to separate content from everything else, I ended up with a `.eleventy.js` configuration file that looked like this:

```
module.exports = function(eleventyConfig) {
    // Copy everything under "static" to the root of the built site (note: this is relative to this config file)
    eleventyConfig.addPassthroughCopy({ "static": "./" });

    return {
        dir: {
            input: "content",
            output: "out",
            includes: "../templates" // Note: this is relative to the input directory
        }
    }
};
```

My corresponding directory structure is visible on the [eleventy branch of this repository on GitHub](https://github.com/jaredkrinke/log/tree/eleventy).

## Themes?
My experience with Hugo themes wasn't great because they push hard to make you want to share your theme. Eleventy is basically the opposite. Because configuration is JavaScript code run in Node, you probably don't want to download others' themes unless you've gone through the code to make sure it does only what you want.

Not supporting themes in a safe manner could be a downside for people who don't want to create their own templates, but it's fine for me because I want to craft the HTML myself to ensure it has only what I want (simple HTML) and nothing that I don't (e.g. social media icons).

## JavaScript templates
Originally, I planned to use a standard template system because that knowledge would be portable across different static site generators. But as I looked at examples of Hugo's templates or Liquid templates, I came to the conclusion that these template languages are surprisingly ugly and unfamiliar. Eleventy supports plain old JavaScript templates which (security concerns aside, since I'm writing my own templates) is convenient because it's just JavaScript. Sure, it's is a quirky language, but with [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), it's surprisingly readable (although you have to take care to properly escape everything):

```
module.exports = function(data) {
    return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Blog: ${data.title}</title>
    </head>
    <body>
        <main>
            <header><h1>My Blog</h1></header>
            <article>
                <header>
                    <h1>${data.title}</h1>
                    <p>Date: <time>${data.page.date}</time></p>
                </header>
                ${data.content}
            </article>
        </main>
    </body>
</html>
`
}
```

### Escaping HTML
Note: when using Eleventy's JavaScript template language, I didn't see a built-in, documented way to escape arbitrary text for inserting into HTML. The [escape-html NPM Package](https://www.npmjs.com/package/escape-html) worked for my purposes, but now I feel like I'm getting close to wanting to build my own template language.

## Issues
### Relative links don't work
I'm using relative links to `*.md` files for linking between posts, but (at least with the default configuration), those links aren't being being updated to point to the resulting HTML files. Note: I'm not implying that Eleventy told me this would work -- it's just part of my desired workflow.

### Markdown post-processed by default
In one of my posts, written in Markdown, I show Liquid/Tera/Jinja syntax (e.g. `{%`) inside a code block. With my mostly-default setup, Eleventy tried to interpret this as template syntax, which is definitely not what I would have expected (it's Markdown, not a template!). Fortunately, you can disable this behavior with the [markdownTemplateEngine: false](https://www.11ty.dev/docs/config/#default-template-engine-for-markdown-files) setting.

### Page URLs aren't relative
This problem isn't unique to Eleventy (and arguably it's easier to handle in Eleventy's JavaScript template language), but Eleventy doesn't supply relative links to posts -- the `page.url` property starts with `/`. This prevents you from just viewing the HTML files directly from the file system (and it also makes it difficult to host a site in a subdirectory).

In my case, since it's just JavaScript code hosted in Node anyway, I'm using Node's [path.posix API](https://nodejs.org/api/path.html#path_path_relative_from_to) to compute the relative path to the site root.

## Let's stop there
That's probably enough for one post.

Overall, ramping up on Eleventy was more confusing than I anticipated, but all the pain I felt around Hugo's template language was partially avoided in Eleventy by the ability to use good old JavaScript code. I'm not a fan of some of the design decisions (namely, drawing content from the root folder), but I feel like I could actually end up choosing Eleventy just because it prevents me from having to learn (and, later, remember) another programming language.

For reference, my unfinished attempt at integrating Eleventy into this dev blog is here: https://github.com/jaredkrinke/log/tree/eleventy