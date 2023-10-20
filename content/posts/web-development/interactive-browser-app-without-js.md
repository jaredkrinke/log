---
title: Building a browser-based app without JavaScript
description: Can I build an interactive (and ideally real-time) browser-based app without using JavaScript?
date: 2023-10-19
---
For [Lisp Game Jam (Spring 2023)](lisp-game-jam-2.md), I built a browser-based word scramble game without (technically) writing a single line of JavaScript. But that's a little bit misleading since [Parenscript](https://parenscript.common-lisp.dev/) transpiled my Common Lisp code into JavaScript at build time, so JavaScript was still used at run-time.

Lately, I've gotten to wondering: **how interactive of an application can be built for the browser *without any JavaScript whatsoever*?** (N.B. WebAssembly doesn't help since WebAssembly modules are loaded using JavaScript.)

For the record, my motivation is two-part:

1. Mostly, I'm just curious if such a thing is possible
2. But additionally, I find it slightly horrifying that browsing the web today requires multiple gigabytes of RAM--and I attribute much of that bloat to the operating system-sized browser runtime (and associated sandboxing) that supports ~~ad delivery~~ JavaScript

## Aside
Unrelated to this project, I'd like to mention a service I ran across recently: [SourceHut](https://sourcehut.org/). It provides project hosting with two notable (and tangentially related to this article) features:

* All features work without JavaScript
* Many features work without an *account*

I'll admit I'm a little jealous that I didn't come up with this idea myself. It seems like the sort of thing the software development world needs these days.

But back to the task at hand...

# HTML forms ~~to the rescue!~~
The World Wide Web worked fine prior to JavaScript. I'm not sure when HTML forms were added to the HTML "standard", but for the sake of argument, I'm assuming that forms existed prior to JavaScript being widely supported. Using form submission, it's possible for browsers to have a two-way communication channel with a web site, so interactive web applications clearly don't *require* JavaScript.

Having said that, form submission reloads the entire web page, so the experience is decidedly seamful. Additionally, form submission is user-initiated, so there's no way for the application to update its UI in the absence of user input.

Can we do better?

# Potential solution: chunked transfer encoding and frames
I'm not sure where I first heard the story, but there are tales of browser-based, JavaScript-free chat apps that use [chunked transfer encoding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding) to append to an HTML page, along with an [HTML frame element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/frame) that uses form submission to trigger the transfer to said ~~appendages~~ chunks that are appended to the page.

It's unclear to me what the motivation was behind these apps. Did they predate JavaScript? Did they need to support unscriptable browsers? Did their users frequently have JavaScript disabled (perhaps for privacy or security reasons)?

Regardless, I see no obvious reason why this approach wouldn't work for building an interactive web app without JavaScript. Who knows, it might even be possible to use some fancy CSS rules to make it appear as though part of a page is being updated instead of just appended to.

# So does it work?
I don't know! But I'm planning to find out, so stay tuned...