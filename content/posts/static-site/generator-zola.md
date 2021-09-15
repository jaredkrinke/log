---
title: Test-driving Zola for a simple dev blog
date: 2021-09-15
---

I'm testing out [the most promising static site generators](generator-research.md) to see which is closest to [my ideal setup](generator.md). Next up is [Zola](https://www.getzola.org/).

# Zola
Zola is a zero-dependency static site generator, similar to Hugo. Since it's compiled to native code, I expect it to be fast.

## Installation
I do my development on Windows (despite having been a Linux desktop user in the past), so where do I download the Zola binary? Let's check the [Zola docs](https://www.getzola.org/documentation/getting-started/installation/)

> Zola is available on Scoop ... and Chocolatey

Hmmm... so I have to install software to install my software? Maybe I can go to the [Scoop web site](https://scoop.sh/) and find a zip file? It looks like they just have a huge JSON file that points to Zola's releases on GitHub. Maybe I'll just go to the [Zola release page](https://github.com/getzola/zola/releases) directly. Ok, found a zip file (only 7.5mb, too!). Time to dig in.

## Concepts
Zola's [overview documentation](https://www.getzola.org/documentation/getting-started/overview/) is excellent. It introduces concepts succinctly in the form of an example, while still making it easy for me to skim and jump around to quickly understand the basics. This is the sort of introduction that I wished Hugo and Eleventy had.

The documentation is so well organized, that I'm not going to bother trying to explain the concepts here -- just go [read the docs](https://www.getzola.org/documentation/getting-started/overview/) instead!

One note: Zola uses a template language called [Tera](https://tera.netlify.app/docs#templates) that is supposed to be similar to what Django uses. That might be helpful to some folks, but I haven't used Django. I don't like the looks of the language, but the documentation seems adequate.

## First run
Following the documentation to initialize Zola, it oddly demands that the directory be empty (in my case, I already have content, such as this article). This seems unnecessary given that Zola doesn't actually do anything other than create empty directories (which happen to match my existing naming scheme) along with a configuration file.

## Some opinions
Zola is an opinionated static site generator and sometimes these opinions get in my way. For instance, despite [YAML](https://en.wikipedia.org/wiki/YAML) being the standard for front matter, Zola strongly encourages [TOML](https://toml.io/en/) (which I find to be unnecessarily verbose for my simple key-string value pairs), and the documentation makes it sound like supporting YAML is a grudging favor for those migrating content out of other systems.

Additionally, Zola draws a line between the variables it supports and any "extra" variables you want to use. I'm also not sure I like  mixing template input data with content, as Zola does with `_index.md` files in each section (this makes sense for, say, keywords, but not as much for custom data that exists solely to modify behavior in a parent template--I'd like to do that in the child template itself).

Opinions are great for nudging people into good choices when they might not foresee the benefits, but I am starting to wonder if maybe Zola is a little *too* opinionated.

## Templates
My experience with static site generators until recently was all home-built stuff, so I don't have any experience with standard template languages like Tera, Jinja, or Liquid. I like to think my fresh eyes let me accurately grade the ergonomics of template languages for career developers.

So far, (as with Hugo's templates) I don't like what I see. The syntax is incredibly ugly and verbose. Here's how you mark an input to a template (I was hoping for something more like this JavaScript's template literal syntax):

```
{% block content %}{% endblock %}
```

How do I supply an input to the template?

```
{% block content %}
<p>Content goes here</p>
{% endblock content %}
```

The definition is so similar to the declaration that I'm not sure how you even tell them apart if the definition is empty.

Conditionals also aren't just expressions which means lots of `{%` and `%}` in my case where I just want my home page title to be "Blog" and all pages to be "Blog: Some page":

```
{% if section.extra.root %}
    Blog
{% else %}
    Blog: {{ section.title }}
{% endif %}
```

Ok, enough griping about standard template languages (even if they do seem ripe for a Markdown-like takeover). Some people are probably perfectly at home with Tera/Jinja.

## I guess we're stopping here now
A little ways into integrating Zola into this blog, I hit a couple of snags:

* `zola serve` doesn't seem to serve up all the pages that `zola build` creates -- there was a past Windows-only issue for this, but my problem seems more specific to my particular site
* Zola doesn't seem to like that I've grouped my posts into subdirectories (that don't represent a new type of content)

If I was persistent, I probably could have solved these problems this evening, but I'm not sure that Zola's opinions are compatible with my own, so I'm ok with setting this experiment aside for later.