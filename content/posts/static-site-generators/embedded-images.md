---
title: Embedding images directly into Markdown posts -- terrible idea?
description: How should images be attached to Markdown posts? Let's see how embedding them directly works.
date: 2021-09-21
---
This might turn out to be a terrible idea, but in pursuit of self-contained Markdown-based blog posts, I'm going to try embedding images (and, maybe later, other assets) directly into my Markdown posts.

# Background
Most blogging platforms I've looked at support inserting images into posts as follows:

* Images are uploaded to a specific location
* Output HTML files reference the images (ideally using relative links)

This is great if an image needs to be shared between posts, but that's not the typical use case. In the usual case, I see images used once in a single post.

As a *viewer* I like this setup because the images can be loaded lazily, I can open the image link in a new tab, etc.

# Gripes
As an author, however, I have some complaints about this setup because posts and images become coupled:

* I have to add multiple files to build a particular post
* If I want to remove a post, I have to also remove the images it contains
* Probably not common, but if I want to duplicate a post elsewhere, I have to grab the images as well

# My previous solution
In the past, my solution to this problem was to build a directory for each post and the directory contained both the post content as well as any associated images and files.

This is, in my opinion, a pretty reasonable solution because now the entire post is contained in a single location. If my crazy new idea doesn't work, I'll probably revert to this tried and true solution.

# Directly embedding images
So here's my crazy idea: what if I embed images directly into their source Markdown files using [Base64-encoded](https://en.wikipedia.org/wiki/Base64) [Data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)?

Data URLs are only recommended for small files (ideally < 1 KB), but my research indicates that this recommendation is based on:

1. Separating essential HTML/text content from slightly less important image content
1. Some HTML/XML implementations arbitrarily limiting the size of an element and its attributes

I happen to agree with #1, so when compiling my site I do plan to split out images into their own files. But #2 feels like a vestigial limitation from the days of allocating fixed size buffers on the stack in C code. That's not to say #2 won't cause me trouble--I just don't think it's a good enough reason on its own to discard my idea.

## Prototype encoder
Here's the code for my prototype encoder (side note: I don't know why Node refused to accept the clearly documented "base64url" encoding):

```
const path = require("path");
const fs = require("fs/promises");

// TODO: Use a more comprehensive library
const fileExtensionToMimeType = {
    ".jpg": "image/jpeg",
    ".png": "image/png",
};

(async () => {
    try
    {
        const filePath = process.argv[2];
        if (!filePath) throw "No path specified!";
    
        const fileExtension = path.extname(filePath);
        const mimeType = fileExtensionToMimeType[fileExtension];
        if (!mimeType) throw `Could not determine MIME type for extension "${fileExtension}"!`;
    
        const buffer = await fs.readFile(filePath);
        const base64UrlEncoded = encodeURI(buffer.toString("base64"));
    
        const dataUrl = `data:${mimeType};base64,${base64UrlEncoded}`;
        console.log(dataUrl);
    }
    catch (err) {
        console.error(`ERROR: ${err}`);
    }
})();
```

## Exhibit A
Here's a very small (in terms of number of bytes) PNG file that's been directly embedded (this is the ~600 byte [Favicon](https://en.wikipedia.org/wiki/Favicon) for my site):

![Small embedded PNG file](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSpVByuKOGSoThbELxylikWwUNoKrTqYXD+hSUOS4uIouBYc/FisOrg46+rgKgiCHyBubk6KLlLi/5JCixgPjvvx7t7j7h0g1EpMMdrGAUU19XgkLKbSq6LvFZ3oxwB6MC0xQ4smFpNwHV/38PD1LsSz3M/9ObozWYMBHpF4jmm6SbxBPLNpapz3iQOsIGWIz4nHdLog8SPXZYffOOdtFnhmQE/G54kDxGK+heUWZgVdIZ4iDmYUlfKFlMMZzluclVKFNe7JX+jPqisJrtMcRgRLiCIGETIqKKIEEyFaVVIMxGk/7OIfsv0xcsnkKoKRYwFlKJBsP/gf/O7WyE1OOEn+MND+YlkfI4BvF6hXLev72LLqJ4D3GbhSm/5yDZj9JL3a1IJHQO82cHHd1OQ94HIHGHzSJF2yJS9NIZcD3s/om9JA3y3Qteb01tjH6QOQpK6Wb4CDQ2A0T9nrLu/uaO3t3zON/n4AuI1yw2D/uDMAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQflCRUXDwx3zQBcAAAAbElEQVQ4y81TMRLAIAgTjzH8/6E8wE52oBDbY2kmz2gSEQTAGg3oXrj7gzSzIycAlrvfG2+x72hGsATRSDPVKm52ZrKIrD5UILqYWSkyRxM/FYhvZn1SJohFPLZy5vy5kSo3lkD2NLaGqfMLF2xqO0/W9QaIAAAAAElFTkSuQmCC)

Here's what the Markdown input looks like, for reference:

```
![Small embedded PNG file](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSpVByuKOGSoThbELxylikWwUNoKrTqYXD+hSUOS4uIouBYc/FisOrg46+rgKgiCHyBubk6KLlLi/5JCixgPjvvx7t7j7h0g1EpMMdrGAUU19XgkLKbSq6LvFZ3oxwB6MC0xQ4smFpNwHV/38PD1LsSz3M/9ObozWYMBHpF4jmm6SbxBPLNpapz3iQOsIGWIz4nHdLog8SPXZYffOOdtFnhmQE/G54kDxGK+heUWZgVdIZ4iDmYUlfKFlMMZzluclVKFNe7JX+jPqisJrtMcRgRLiCIGETIqKKIEEyFaVVIMxGk/7OIfsv0xcsnkKoKRYwFlKJBsP/gf/O7WyE1OOEn+MND+YlkfI4BvF6hXLev72LLqJ4D3GbhSm/5yDZj9JL3a1IJHQO82cHHd1OQ94HIHGHzSJF2yJS9NIZcD3s/om9JA3y3Qteb01tjH6QOQpK6Wb4CDQ2A0T9nrLu/uaO3t3zON/n4AuI1yw2D/uDMAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQflCRUXDwx3zQBcAAAAbElEQVQ4y81TMRLAIAgTjzH8/6E8wE52oBDbY2kmz2gSEQTAGg3oXrj7gzSzIycAlrvfG2+x72hGsATRSDPVKm52ZrKIrD5UILqYWSkyRxM/FYhvZn1SJohFPLZy5vy5kSo3lkD2NLaGqfMLF2xqO0/W9QaIAAAAAElFTkSuQmCC)
```

I also tested a much larger image file and it worked just as well, but I decided to omit that file from this post because I didn't want to bloat up this file (and repository) for no good reason.

## Observations in VS Code
Well, the images render fine in Visual Studio Code's Markdown Preview window. Syntax highlighting in the Markdown file I'm editing is ok, too. But there is one problem.

I've been happily using word-wrapping when editing Markdown files and, unsurprisingly, these enormous strings make word-wrapping pretty much impossible to use. This could end up being fairly annoying. I'll let this issue marinate in the back of my mind for a bit.

## Observations in GitHub's Markdown viewer
To my surprise, the image did not display at all in GitHub's Markdown viewer--it just showed a "broken image link" icon. That's unfortunate because I'd like my site to be as functional as possible when viewed directly on GitHub.

## Observations compiling with Marked
The Markdown appears to have compiled fine using [Marked](https://marked.js.org/) (via [Metalsmith](https://metalsmith.io/)). It wasn't noticeably slow or anything either. Great!

## Observations viewing the resulting HTML in Chromium-based Edge
Note: as I noted earlier, I'm not normally planning on uploading my static site in this format, but out of sheer curiosity, would this work unmodified?

The images display just fine in my site on Chromium-based Edge. Good to know!

# Conclusion
Overall, while I like the idea of having completely self-contained Markdown files, the fact that the images don't work on GitHub's Markdown viewer and that the incredibly long text blobs effectively break word-wrapping in VS Code lead me to believe that this was a failed experiment. I don't think I'll pursue this method any further.

I'm still happy that I gave it a shot. You never really know until you try!