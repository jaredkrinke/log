---
title: Syntax highlighting for a static site built with Metalsmith
description: I'm using Metalsmith to build my static site. Here's how I integrated syntax highlighting using highlight.js.
keywords: [metalsmith]
date: 2021-10-01
---
As [described previously](metalsmith.md), I'm using [Metalsmith](https://metalsmith.io/) to build my static site because I like its modular, easy to extend design (even though it required more effort to setup initially).

Here's how I integrated [highlight.js](https://highlightjs.org/) syntax highlighting into my static builds.

# Marked
Metalsmith's official Markdown plug, [metalsmith-markdown](https://github.com/segmentio/metalsmith-markdown) uses [Marked](https://marked.js.org/) for converting Markdown into HTML. Note that the plugin uses a fairly old version of Marked: 0.7.0. Fortunately, Marked has [convenient support for integrating syntax highlighting](https://marked.js.org/using_advanced#highlight).

# highlight.js
Since I'm working within the Node/NPM ecosystem, I decided to try [highlight.js](https://highlightjs.org/), because it's conveniently implemented in JavaScript (no manual compilation required). I suspect a native highlighting library would be faster, but I'd rather optimize later, if needed, than waste time upfront.

# Build script integration
First step (after installing highlight.js via NPM: `npm install --save highlight.js`) is to use the documentation above to integrate highlight.js into my build script. This turned out to be fairly easy:

```javascript
import highlight from "highlight.js";
...
// Configure syntax highlighting aliases
highlight.registerAliases("wasm", { languageName: "lisp" });
...
Metalsmith(__dirname)
...
    .use(markdown({
        highlight: (code, language) => {
            if (language) {
                return highlight.highlight(code, { language }).value;
            } else {
                return highlight.highlightAuto(code).value;
            }
        },
    }))
...
```

Notes:

* I'm using `import` instead of `require` to experiment with ES modules ([Node supports loading CommonJS modules with `import`](../web-development/using-commonjs-modules-from-es-modules.md))
* highlight.js [supports a lot of languages](https://highlightjs.org/static/demo/), but not WebAssembly, so I set up an alias that let's me mark code blocks as "wasm" and they'll be highlighted using Lisp s-expression syntax
* highlight.js can auto-detect languages, so I use `highlightAuto` in cases where no programming language is explicitly specified

So far, so good.

# Theming
Now, on to the annoying part: theming!

I kind of expected this, but [creating a theme](https://highlightjs.readthedocs.io/en/latest/theme-guide.html#) (mostly from scratch) for highlight.js is fairly tedious. The [list of "scopes"](https://highlightjs.readthedocs.io/en/latest/css-classes-reference.html) (i.e. classes of tokens) is long, and some are even nested. For example, the name of a function gets the following CSS classes applied: "hljs-title function_".

To tweak a theme, the best approach I can recommend here is:
1. Run highlight.js on some code
1. Inspect the output HTML (specifically the CSS classes)
1. Add/update your CSS rules
1. Repeat

I had hoped that I could just take an existing theme and modify it slightly, but I couldn't find a theme that didn't group scopes in unappealing ways (e.g. grouping macros/templates with literals).

# My "final" CSS
After a lot of trial and error, below is the CSS I came up with, using colors that are mostly already present on my site. I grouped the rules by color.

I'm sure this theme doesn't cover all languages well, so I'll likely need to tweak it a few times in the future, but it seems adequate for all the code I've thrown at it thus far.

```css
/* Syntax highlighting */
.hljs-comment { color: #5a8c3f; }

.hljs-tag,
.hljs-punctuation { color: #ccc; }

.hljs-literal { color: #66c9fe; }

.hljs-title.class_,
.hljs-tag .hljs-name,
.hljs-tag .hljs-attr { color: #7bbf56; }

.hljs-attr,
.hljs-symbol,
.hljs-variable,
.hljs-template-variable,
.hljs-link,
.hljs-selector-attr,
.hljs-selector-pseudo { color: #59c5ff; }

.hljs-keyword,
.hljs-attribute,
.hljs-selector-tag,
.hljs-meta .hljs-keyword,
.hljs-doctag,
.hljs-name { color: #51a1cc; }

.hljs-type,
.hljs-string,
.hljs-number,
.hljs-quote,
.hljs-template-tag,
.hljs-deletion,
.hljs-title,
.hljs-section,
.hljs-meta { color: #d97c57; }

.hljs-regexp,
.hljs-meta .hljs-string { color: #b25947; }

.hljs-title.function_,
.hljs-built_in,
.hljs-bullet,
.hljs-code,
.hljs-addition,
.hljs-selector-id,
.hljs-selector-class { color: #e6b95c; }
```

# Performance
On my code-heavy, but tiny, site, I measured the following build times with and without syntax highlighting:

| Scenario | Build time (s) | Avg. time per page (ms) |
| :--- | ---: | ---: |
| Without highlighting | 1.4 | 67 |
| With highlighting | 2.2 | 105 |

For me, on this machine, the overhead of syntax highlighting is roughly 40ms/page. This is certainly tolerable for my small site. I'll revisit the decision to use a JavaScript-based highlighter in the future, if needed. But for now, this is sufficient.

# The end
Despite griping about theming, I'm impressed with how smoothly everything integrated. Adding working syntax highlighting to a static site in a single sitting shows how productive modern software stacks can be.

I'll end the post with some examples of syntax highlighting in a few languages I've already used on this site.

## Syntax highlighting examples
### JavaScript
```javascript
const fs = require('fs');
(async () => {
    const module = await WebAssembly.instantiate(await fs.promises.readFile("./add.wasm"));
    const add = module.instance.exports.add;
    console.log(add(2, 2));
})();
```

### C
```c
#define WASM_EXPORT_AS(name) __attribute__((export_name(name)))
#define WASM_EXPORT(symbol) WASM_EXPORT_AS(#symbol) symbol

int WASM_EXPORT(add)(int a, int b) {
    return a + b;
}
```

### WebAssembly
```wasm
(module
  (type (;0;) (func (param i32 i32) (result i32)))
  (import "env" "__linear_memory" (memory (;0;) 0))
  (func $add (type 0) (param i32 i32) (result i32)
    local.get 1
    local.get 0
    i32.add))
```

### HTML
```html
<html>
    <body>
        <p>The value of 2 + 2 is <span id="result">?</span></p>

        <script>
            (async () => {
                const module = await WebAssembly.instantiateStreaming(fetch("./add.wasm"));
                const add = module.instance.exports.add;
                document.getElementById("result").innerText = add(2, 2);
            })();
        </script>
    </body>
</html>
```
