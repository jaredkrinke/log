---
title: Generating SVG diagrams automatically with Metalsmith
description: Metalsmith is used to build this static site. Here's how Graphviz was integrated to automatically generate diagrams.
keywords: [metalsmith,diagrams]
date: 2021-10-10
---
Now that I've [compiled Graphviz to a WebAssembly module](../webassembly/compiling-graphviz-to-webassembly.md), I'm going to use it to automatically generate SVG diagrams when I build my static site using Metalsmith.

# The plan
Here's a flow chart of my general plan:

<div>
<svg width="312pt" height="260pt"
 viewBox="0.00 0.00 311.67 260.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(4 256)">
<polygon class="diagram-transparent-white" points="-4,4 -4,-256 307.67,-256 307.67,4 -4,4"/>
<g id="node1" class="node">
<title>Compile Graphviz to WebAssembly</title>
<ellipse class="diagram-black-none" cx="151.84" cy="-234" rx="151.67" ry="18"/>
<text text-anchor="middle" x="151.84" y="-229.8" font-size="14.00">Compile Graphviz to WebAssembly</text>
</g>
<g id="node2" class="node">
<title>Generate diagrams at build time</title>
<ellipse class="diagram-black-none" cx="151.84" cy="-162" rx="134.85" ry="18"/>
<text text-anchor="middle" x="151.84" y="-157.8" font-size="14.00">Generate diagrams at build time</text>
</g>
<g id="edge1" class="edge">
<title>Compile Graphviz to WebAssembly&#45;&gt;Generate diagrams at build time</title>
<path class="diagram-black-none" d="M151.84,-215.7C151.84,-207.98 151.84,-198.71 151.84,-190.11"/>
<polygon class="diagram-black-black" points="155.34,-190.1 151.84,-180.1 148.34,-190.1 155.34,-190.1"/>
</g>
<g id="node3" class="node">
<title>???</title>
<ellipse class="diagram-black-none" cx="151.84" cy="-90" rx="27" ry="18"/>
<text text-anchor="middle" x="151.84" y="-85.8" font-size="14.00">???</text>
</g>
<g id="edge2" class="edge">
<title>Generate diagrams at build time&#45;&gt;???</title>
<path class="diagram-black-none" d="M151.84,-143.7C151.84,-135.98 151.84,-126.71 151.84,-118.11"/>
<polygon class="diagram-black-black" points="155.34,-118.1 151.84,-108.1 148.34,-118.1 155.34,-118.1"/>
</g>
<g id="node4" class="node">
<title>Profit!</title>
<ellipse class="diagram-black-none" cx="151.84" cy="-18" rx="36.49" ry="18"/>
<text text-anchor="middle" x="151.84" y="-13.8" font-size="14.00">Profit!</text>
</g>
<g id="edge3" class="edge">
<title>???&#45;&gt;Profit!</title>
<path class="diagram-black-none" d="M151.84,-71.7C151.84,-63.98 151.84,-54.71 151.84,-46.11"/>
<polygon class="diagram-black-black" points="155.34,-46.1 151.84,-36.1 148.34,-46.1 155.34,-46.1"/>
</g>
</g>
</svg>
</div>

That diagram was generated using the following Markdown:

````md
```dot2svg
digraph {
    "Compile Graphviz to WebAssembly" -> "Generate diagrams at build time" -> "???" -> "Profit!";
}
```
````

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

For reference, all of the code used to generate this site (along with the content) is in [this repository](https://github.com/jaredkrinke/md2blog).

**Update**: I've removed this feature from my static site generator for the time being because it's unclear what license covers Graphviz (the web site and source code are not in sync).
