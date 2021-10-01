---
draft: true
title: Syntax highlighting for a static site built with Metalsmith
description: I'm using Metalsmith to build my static site. Here's how I integrated syntax highlighting using highlight.js.
keywords: [metalsmith,highlight.js]
date: 2021-10-01
---
As [described previously](metalsmith.md), I'm using [Metalsmith](https://metalsmith.io/) to build my static site because I like its modular, easy to extend design (even thought it required more effort to setup initially).

Here's how I integrated [highlight.js](https://highlightjs.org/) syntax highlighting into my static builds.

# Syntax highlighting examples
## JavaScript
```javascript
const fs = require('fs');
(async () => {
    const module = await WebAssembly.instantiate(await fs.promises.readFile("./add.wasm"));
    const add = module.instance.exports.add;
    console.log(add(2, 2));
})();
```

## C
```c
#define WASM_EXPORT_AS(name) __attribute__((export_name(name)))
#define WASM_EXPORT(symbol) WASM_EXPORT_AS(#symbol) symbol

int WASM_EXPORT(add)(int a, int b) {
    return a + b;
}
```

## WebAssembly
```wasm
(module
  (type (;0;) (func (param i32 i32) (result i32)))
  (import "env" "__linear_memory" (memory (;0;) 0))
  (func $add (type 0) (param i32 i32) (result i32)
    local.get 1
    local.get 0
    i32.add))
```
