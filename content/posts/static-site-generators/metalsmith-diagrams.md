---
title: Generating SVG diagrams automatically with Metalsmith
description: Metalsmith is used to build this static site. Here's how Graphviz was integrated to automatically generate diagrams.
keywords: [metalsmith,graphviz,webassembly]
date: 2021-10-10
---
Now that I've [compiled Graphviz to a WebAssembly module](../webassembly/compiling-graphviz-to-webassembly.md), I'm going to use it to automatically generate SVG diagrams when I build my static site using Metalsmith.

# The plan
Here's a flow chart of my general plan:

```dot2svg
digraph {
    "Compile Graphviz to WebAssembly" -> "Generate diagrams at build time" -> "???" -> "Profit!";
}
```

That diagram was generated using the following Markdown:

````md
```dot2svg
digraph {
    "Compile Graphviz to WebAssembly" -> "Generate diagrams at build time" -> "???" -> "Profit!";
}
```
````

# Metalsmith is synchronous
First, I need to read my module from disk and instantiate it. In Node, file system operations are generally asynchronous, but ([at least for now](https://github.com/segmentio/metalsmith/issues/303)), so I need to wrap everything in an `async` lambda (fortunately, everything *except initialization* in my module is synchronous):

```javascript
import { createAsync as createDOTToSVGAsync } from "dot2svg-wasm";

(async () => {
    const dotConverter = await createDOTToSVGAsync();

    // Other initialization
    ...

    Metalsmith(__dirname)
    ...
        .use(markdown({
            renderer: markdownRenderer,
    ...
        }))
    ...
        .build(err => { if (err) throw err; });
})();
```

Note that I'm already using a [custom Marked renderer](https://marked.js.org/using_pro#renderer).

# Extending the Marked renderer
As shown in the example near the top of this post, my plan is to piggyback on Markdown code blocks, using a special language tag `dot2svg`. For all other code blocks (and on error), I simply defer to the default code block rendering function:

```javascript
// Generate diagrams with dot2svg
const baseCodeRenderer = markdownRenderer.code;
const dotConverter = await createDOTToSVGAsync();
markdownRenderer.code = function (code, language, escaped) {
    if (language === "dot2svg") {
        const svg = dotConverter.dotToSVG(code);
        if (svg) {
            return svg;
        } else {
            // On error, just treat the code block like normal
            language = "";
        }
    }
    return baseCodeRenderer.call(this, code, language, escaped);
};
```

# Styling
The above rendering code worked (and didn't break my [syntax highlighting](metalsmith-syntax-highlighting.md)), but there were a few tweaks I had in mind:

* Remove the [XML prolog and document type declaration](https://www.w3.org/TR/xml/#sec-prolog-dtd)
  * Since I'm inlining my SVG in HTML, this information is redundant
* Replace Graphviz's default styling (annoyingly hard-coded via `fill` and `stroke` attributes on each element) with CSS classes
  * This allows me to style the graphs using my CSS stylesheet
  * In my case, I'm replacing the `fill="white" stroke="black"` attributes with a single CSS class: `class="diagram-black-white"`

Fortunately, both of these transformations can be done with regular expression replacements:

```javascript
...
if (svg) {
    // Remove XML prolog, since we're inlining
    // Also convert default styles to CSS classes, for custom styling
    return svg
        .replace(/^.*?<svg /s, "<svg ")
        .replace(/fill="([^"]+)" stroke="([^"]+)"/g, "class=\"diagram-$2-$1\"");
} else {
...
```

Now, I can just style everything with CSS:

```css
/* Diagrams */
svg text { fill: #eee; }
.diagram-transparent-white { stroke: none; fill: none; }
ellipse.diagram-black-none { stroke: #ccc; fill: #444; }
.diagram-black-none { stroke: #999; fill:none; }
.diagram-black-black { stroke: #999; fill: #333; }
```

# That's it!
To my surprise, this entire integration went smoothly, and only took an hour or so. It remains to be seen how useful these diagrams will be, but at least now if I ever feel the need to insert a superfluous diagram, the functionality will be there.

For reference, all of the code used to generate this site (along with the content) is in [this repository](https://github.com/jaredkrinke/log).
