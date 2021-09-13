---
title: Testing out the most promising static site generators
draft: true
---

I'm testing out [the most promising static site generators](generator-research.md) to see which is closest to [my ideal setup](generator.md).

# Hugo
First up is Hugo since it's the easiest to install and ([according to Jamstack](https://jamstack.org/generators/)) is one of the top 3 most loved static site generators.

## Installation
Installation is just downloading a binary. Great!

## Setup
Going through their [quick start guide](https://gohugo.io/getting-started/quick-start/), I use `hugo new site quickstart` to create Hugo's desired directory structure. It's a bit more convoluted than I expected (what is `archetypes` for?). Interesting.

## Concepts
Hugo seems powerful, but, as we all know, power ~~corrupts~~ introduces complexity. This is my best understanding of Hugo's concepts:

* Archetypes: Base format for new types of content files
  * Since I've only got a simple dev blog, I'll probably only need a single "post" content type, and their default (title, date, draft status) is likely sufficient
* Assets: Stores all the files which need be processed by [Hugo Pipes](https://gohugo.io/hugo-pipes/)
  * This can be used to minify CSS, JavaScript, etc.
  * Minifying CSS is a bonus feature I didn't ask for, but it could be worthwhile
* Config: "Many sites may need little to no configuration, but Hugo ships with a large number of configuration directives"
  * Here's hoping I fall into the "little to no configuration" bucket!
* Content: Actual content can be separated by type (note: I believe this is how archetypes are matched)
* Data: "This directory is used to store configuration files that can be used by Hugo when generating your website"
  * The description sounds awfully similar to "config" -- hopefully my simple site doesn't need this
* Layout: "Stores templates in the form of .html files that specify how views of your content will be rendered into a static website"
  * The relation between layouts and themes is unclear to me; layouts sound like the templates I expect to build, but then I'm not sure what the purpose of a theme is
* Static: Files that are copied verbatim to the output

## Templates/theme
The next step is to add a theme. Huh, I thought I'd just plop in some HTML with curly brackets and build my own site. In the past, every theme I've used with a static site generator has been fairly bloated (even so-called "minimal" themes). Let's see if I can make my own theme from hand-craft semantic HTML.

The suggested `hugo new theme test-theme` command creates another directory structure with several subdirectories and even a boilerplate license. This is... disappointing. Other than not requiring installation, Hugo is looking annoyingly complex.