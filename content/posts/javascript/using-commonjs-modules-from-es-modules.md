---
title: Can you use CommonJS modules from within an ES module?
description: Is it possible to import a CommonJS module from within an ES module? Only in Node.
keywords: [commonjs,es-modules,node]
date: 2021-09-29
---
# Question
Is it possible to import a CommonJS module from within an ES module (using `import` syntax)?

I thought a quick web search would answer this question, but instead most of the resources I found were about trying to `require()` ES modules (which you definitely can't do).

# Background
JavaScript didn't originally have a module system, so various groups have created their own systems, e.g. [CommonJS](http://www.commonjs.org/), [Asynchronous Module Definition (AMD)](https://github.com/amdjs/amdjs-api), and the ironically named [Universal Module Definition (UMD)](https://github.com/umdjs/umd).

Predictably, there's now an official [ECMAScript Modules](https://tc39.es/ecma262/#sec-modules) format that ~~everyone uses~~ ~~everyone should use~~ some people have started using (~~because it's incompatible and they have no choice~~ because it's part of the official JavaScript/ECMAScript specification). And I won't even dig into the ES module file extension dumpster fire.

Anyway, back to the question: can I import a CommonJS module into my ES module?

# Let's just try it...
Here's a CommonJS module:

```
exports.test = "works!";
```

## Proof that it works from CommonJS (in Node) ✔
```
const { test } = require("./test.js");
console.log(test);
```

Output: `works!`

## How about from an ES module in Node? ✔
```
import { test } from "./test.js";
console.log(test);
```

Output: `works!`

## How about from an ES module in a web page? ✖
```
<html>
    <body>
        <p>Output: <span id="result">?</span></p>
        <script type="module">
            import { test } from "./test.js";
            
            document.getElementById("result").innerText = test;
        </script>
    </body>
</html>
```

Doesn't work (error: "The requested module './test.js' does not provide an export named 'test'").

# Final answer
You can use `import` to include a CommonJS module *when running in Node*, but *not* when running in a web page.