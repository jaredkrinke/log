---
title: Designing md2blog, a zero-config static site generator for dev blogs
description: Here's the design of my in-progress static site generator, md2blog.
keywords: [metalsmith,md2blog]
date: 2021-10-26
---
# Background
After [investigating many popular static site generators](comparison.md), I wasn't able to find a convenient static site generator that met my needs out of the box. Fortunately, I was able to leverage [Metalsmith](https://metalsmith.io/) (and numerous plugins) to get what I wanted. I'm calling the resulting program **md2blog**.

In this post, I'm going to cover the design of md2blog. Note that md2blog is a work in progress that has not been released yet.

# Design goals
Here's the overarching goal of md2blog:

> Convert a *self-contained, organized* pile of [Markdown](https://daringfireball.net/projects/markdown/) posts (along with some basic metadata) into a *minimal, but fully functional* static blog, with *zero configuration*.

The key differentiator for md2blog is the "self-contained, organized" part. By this, I mean:

* **Relative links between Markdown files (including anchors) "just work"** (and are validated at build time)
* Source Markdown files **can be viewed (with links and images) in any Markdown previewer** (e.g. VS Code or GitHub)
* Posts are **implicitly categorized based on directory structure** (supplemental tags are also supported)

Additionally, the produced site is "minimal, but fully functional" in the following sense:

* Page templates use **clean, semantic HTML** and only a few kilobytes of CSS (un-minified/uncompressed)
* Resulting site is **fully functional without client-side JavaScript**
* **Syntax highlighting** is automatically added to code blocks
* An Atom/RSS news feed is automatically generated

Note that "zero configuration" implies that md2blog is highly opinionated, to the point that there are no options to configure. **Instead of fiddling with options and themes, the user's focus is strictly on writing and publishing content.**

# Input
Here's a more detailed look at building a dev blog with md2blog.

## Directory structure
* `content/`: Root directory that contains all source content for the site
  * `site.json`: Site-wide metadata (title, URL, description)
  * `assets/`: Directory for assets (e.g. images)
  * `posts/`: Directory for all posts
    * `category1/`: Directory for posts related to "category1"
      * `post1.md`: Post related to "category1"
      * `post2.md`: Another "category1" post
    * `category2/`: Another category
      * `post3.md`: "category2" post
      * etc.

## site.json
Here's an example `site.json` file:

```json
{
    "title": "My dev blog",
    "url": "https://mydevblog.com/",
    "description": "A very good dev blog indeed"
}
```

## Posts
Posts are written in Markdown and use YAML for front matter.

### Front matter
Here's an example showing all of the supported YAML front matter properties (`keywords` and `draft` are optional, the rest are required):

```yaml
---
title: First post
description: First post on my blog, with a relative link.
date: 2021-10-26
keywords: [additional-tag]
draft: true
---
(Markdown content follows...)
```

Note that `keywords` is used to specify additional tags for categorization of the post.

### Content
Here's example Markdown content, demonstrating relative links (these links get translated to the corresponding HTML files and checked at build time; they also work in VS Code's and GitHub's Markdown previewers):

```md
# Relative link
Here's a relative link to another post in this category: [link](post2.md)!

And here's one to another category: [link 2](../category2/post3.md).

# Image
Here's an image:
![test](../../assets/test.png)
```

Finally, here is an example of including a code block (specifying the language is recommended, but optional):

````md
# Code block
Here's some code:

```javascript
const add = (a, b) => a + b;
```
````

# Output
All output is written to the `out/` directory. Here's what the output might look like for the example above:

* `index.html`: Home page
* `404.html`: Error page
* `feed.xml`: Atom news feed
* `posts/`
  * `index.html`: Archive page containing links to all posts
* `category1/`
  * `index.html`: Index page for "category1"
  * `post1/`
    * `index.html`: Post 1
  * `post2/`
    * `index.html`: Post 2
* `category2/`
  * `index.html`: Index page for "category2"
  * `post3/`
    * `index.html`: Post 3
* `assets/`
  * `test.png`
* `css/`
  * `style.css`: CSS stylesheet