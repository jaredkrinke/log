---
title: Embedding VS Code's Monaco Editor using a CDN
description: Here's how to load VS Code's Monaco Editor from a CDN and embed it in a regular web page
date: 2021-11-02
---
# Monaco Editor
[Visual Studio Code](https://code.visualstudio.com/) unseated [Vim](https://www.vim.org/) as my favorite text editor a few years ago.

Surprisingly, VS Code manages to have acceptable performance (even on my very old laptop) despite being built on JavaScript. The (MIT-licensed) editor component is called [Monaco Editor](https://microsoft.github.io/monaco-editor/index.html), and it runs in most desktop browsers.

# Samples
So what's the easiest way to embed Monaco Editor in a web page for building simple tools?

There's an official repository for [Monaco Editor samples](https://github.com/Microsoft/monaco-editor-samples/), but they all seem to assume you're using NPM, WebPack, etc., and hosting the scripts yourself. **What if you just want to throw together a quick web page with an editor component, hosted as a single static HTML page?**

# Loading from a CDN
Fortunately, there is a (very well hidden) page discussing [integrating the AMD version of the Monaco Editor in a cross-domain setup](https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-amd-cross.md):

> If you are hosting your .js on a different domain **(e.g. on a CDN)** than the HTML, you should know that the Monaco Editor creates web workers for smart language features. Cross-domain web workers are not allowed, but here is how you can proxy their loading and get them to work

That sounds like what I'm looking for!

Specifically, I'm going to combine one of the [browser-amd-editor](https://github.com/microsoft/monaco-editor-samples/blob/main/browser-amd-editor/index.html) official samples with [Option 1](https://github.com/microsoft/monaco-editor-samples/blob/main/browser-amd-editor/index.html) from the page above.

# Automatic resizing
There's one line in the sample I find irritating:

```html
<div id="container" style="width: 800px; height: 600px; border: 1px solid grey"></div>
```

**Why is the size being manually specified in pixels?** Is that necessary?

There's a [long thread in a Monaco Editor issue](https://github.com/Microsoft/monaco-editor/issues/28) that goes into the details, but basically the editor component needs to be notified of size changes (no idea why) and, at least in 2016, there was no way for the editor to subscribe to size updates.

But it's 2021 as of this post, so can we use [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) (global support is at [92%](https://caniuse.com/resizeobserver) as of this post)? Apparently not, because the implementations of ResizeObserver use inconsistent property names (insert facepalm here).

Fortunately, the trusty old [resize](https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event) event is sufficient for my purposes:

```html
const editorElement = document.getElementById("editor");
window.addEventListener("resize", () => editor.layout({
    width: editorElement.offsetWidth,
    height: editorElement.offsetHeight
}));
```

# Complete example
The full code is in this repository: [monaco-editor-from-cdn](https://github.com/jaredkrinke/monaco-editor-from-cdn).

Here's a copy-paste of the code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Monaco Editor from CDN example, with automatic resizing</title>
<style>
/* Flex column layout, with the editor taking up all available screen space */
html, body {
    height: 100%;
    margin: 0;
    overflow: hidden;
}

body {
    display: flex;
    flex-direction: column;
}

#editor {
    flex-grow: 1;
    border: solid 1px gray;
    overflow: hidden;
}
</style>
</head>
<body>
<h1>Monaco Editor, loaded via CDN</h1>

<div id="editor"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.1/min/vs/loader.min.js"></script>
<script>
// Proxy Monaco Editor workers using a data URL (adapted from: https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-amd-cross.md)
require.config({ paths: { "vs": "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.1/min/vs/" }});

window.MonacoEnvironment = {
    getWorkerUrl: function(workerId, label) {
        return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
            self.MonacoEnvironment = { baseUrl: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.1/min/" };
            importScripts("https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.1/min/vs/base/worker/workerMain.min.js");`
        )}`;
    }
};

require(["vs/editor/editor.main"], function () {
    // Create the editor with some sample JavaScript code
    var editor = monaco.editor.create(document.getElementById("editor"), {
        value: "// code goes here\n",
        language: "javascript"
    });

    // Resize the editor when the window size changes
    const editorElement = document.getElementById("editor");
    window.addEventListener("resize", () => editor.layout({
        width: editorElement.offsetWidth,
        height: editorElement.offsetHeight
    }));
});
</script>
</body>
</html>
```
