---
title: Test-driving Hugo for a simple dev blog
description: I'm testing out static site generators for my new dev blog. Here's my first experience with Hugo.
keywords: [hugo]
date: 2021-09-13
---

I'm testing out [the most promising static site generators](comparison.md) to see which is closest to [my ideal setup](overview.md). First up is [Hugo](https://gohugo.io/).

# Hugo
First up is Hugo since it's the easiest to install and ([according to Jamstack](https://jamstack.org/generators/)) is one of the top 3 most loved static site generators.

## Installation
Installation is just downloading a binary. Great!

## Setup
Going through their [quick start guide](https://gohugo.io/getting-started/quick-start/), I use `hugo new site quickstart` to create Hugo's desired directory structure. It's a bit more convoluted than I expected (what is `archetypes` for?). Interesting.

## Concepts
Hugo seems powerful, but, as we all know, power ~~corrupts~~ introduces complexity. This is my best understanding of Hugo's concepts (which map to directories):

* Archetypes: Default file contents for each types of content file
  * Since I've only got a simple dev blog, I'll probably only need a single "post" content type, and their default (title, date, draft status) is likely sufficient
* Assets: Stores all the files which need be processed by [Hugo Pipes](https://gohugo.io/hugo-pipes/)
  * This can be used to minify CSS, JavaScript, etc.
  * Minifying CSS is a bonus feature I didn't ask for, but it could be worthwhile
* Content: Actual content can be separated by type (note: I believe this is how archetypes are matched)
* Data: I'm actually unclear on how this is different from the `config` directory
* Layout: Templates
* Static: Files that are copied verbatim to the output

## Templates/theme
The next step is to add a theme. Huh, I thought I'd just plop in some HTML with curly brackets and build my own site. In the past, every theme I've used with a static site generator has been fairly bloated (even so-called "minimal" themes).

I'll eventually try and use my hand-crafted, minimal semantic HTML, but I suppose I can start with their suggested initial theme, "Ananke". It looks like [themes mainly exist to allow reuse by other people](https://discourse.gohugo.io/t/whats-the-difference-between-themes-and-layouts/4851), so I could perhaps even get away without a theme (using layouts exclusively).

## First run
The directory structure is pretty close to what I already had, so I was already to launch the Hugo server:

```
hugo.exe server -D
Start building sites … 
...
Error: Error building site: TOCSS: failed to transform "ananke/css/main.css" (text/css). Check your Hugo installation; you need the extended version to build SCSS/SASS.
Built in 213 ms
```

Well, that's not encouraging. Apparently there's an extended version that I glossed over and is quietly required for their quick start. I do wonder why there's a separate build when the difference in size is only 8%. Maybe it's bundling other non-Go executables that aren't available everywhere?

With *extended* Hugo, the site served up fine and the default theme initially looked adequate, but it had a lot of junk I didn't want. Observations:

* There were corporate logos on each post's page
* An inaccurate copyright notice was added
* My first post's HTML was 3,957 bytes zipped
* The CSS was 15kb zipped
* Surprisingly, there was also a CSS source map that weighed in at 187kb uncompressed that I see no reason to upload with my site

I guess I was right to be wary of default themes.

A few additional Hugo-related notes:

* Supplying "date" metadata appears to be required in Hugo (unless you want the date to be displayed as "January 1, 0001")
* Viewing the HTML files on disk led to broken links because a "/" prefix is added to all the links (not the end of the world since `hugo.exe` can run a server, but still not what I'd hoped for)
* Hugo generates an entire directory for each post -- I was expecting one directory per category, with HTML files for each post

## Using a custom theme
Hugo's documentation was surprisingly unhelpful when it comes to creating a theme from scratch. At least Hugo is popular enough that I was able to find a blog article about [creating a Hugo theme from scratch](https://retrolog.io/blog/creating-a-hugo-theme-from-scratch/).

My first reaction is that [Hugo's template language](https://gohugo.io/templates/introduction/) is bizarre. I thought I'd just be writing code with Go syntax, but instead I'm seeing examples like this:

```
{{ if (isset .Params "description") }}
    {{ index .Params "description" }}
{{ else }}
    {{ .Summary }}
{{ end }}
```

Learning a new language that looks nothing like the languages I'm used to is not something I wanted to have to do for my simple site. Additionally, [Hugo's lookup rules](https://gohugo.io/templates/lookup-order/) are much more complicated than I expected. I'm still not sure if files like `layouts/_default/baseof.html` are hard-coded names or if there's logic somewhere I could simplify in the configuration.

Additional notes:

* It looks like the "/" prefix for paths that I saw earlier is just a shortcut for not having to compute the path to the root of the site, e.g. "css/style.css" won't work when in a subdirectory, but "/css/style.css" will work... unless you're viewing directly from the file system (where "/" means the file system root)
* I was unable to get the 404 page to work using `hugo.exe server`

## Let's stop there for now
Although install was simple and the server worked, at this point, I'm not interested in learning Hugo's unintuitive template language. I honestly found [XSL](https://www.w3.org/Style/XSL/) to be more intuitive (and that is not a compliment).

For posterity, I saved my terribly incomplete theme here:

https://github.com/jaredkrinke/hugo-bare-minimum

Let's hope the next static site generator I try is more my style!