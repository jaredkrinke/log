---
title: Frameworks for porting web apps to the desktop
description: This is my initial research on porting a browser-based app to a full-fledged desktop app.
date: 2022-01-05
draft: true
---
I have a browser-based application that I'd like to transform into a "normal" desktop application.

# Why?
My situation is fairly unique, but here's my motivation:

* My app is already web-based (using HTML, CSS, TypeScript, with a corresponding HTTP API that's deployed to [Netlify Functions](https://functions.netlify.com/)), and I don't want to rewrite any of my code
* I'm planning to use a distribution service that's based on plain old desktop executables (this is probably an unusual requirement)

Some more typical reasons for porting from web to desktop might be:

* Wanting to take advantage of libraries, devices, or system APIs that aren't available in the browser
* Wanting to integrate with native code that (probably due to performance) won't be ported to WebAssembly

# Why not?
Some downsides:

* Electron (the most popular desktop framework for web technologies) produces large binaries (100+ MB) that use a lot of memory (due to bundling an entire browser engine within each application, to ensure consistency across devices)
  * This also means that copyright notices for a huge number of open source libraries Chromium uses must be included
* These frameworks typically have their own unique build processes, which adds additional complexity as compared to building a desktop app "the normal way"

# Options
My research turned up the following relevant frameworks:

* [Electron](https://github.com/electron/electron)
* [NW.js](https://nwjs.io/) (formerly node-webkit)
* [Tauri](https://github.com/tauri-apps/tauri)
* [Neutralinojs](https://github.com/neutralinojs/neutralinojs)

And here is my uneducated, subjective comparison (all of these frameworks currently support Windows, Linux, and macOS, with Tauri planning to eventually support iOS and Android):

| Framework | Engine | Maturity | License | Examples |
| --- | --- | --- | --- | --- |
| Electron | Chromium | Stable | Many (via Chromium) | VS Code, Slack, Discord |
| NW.js | Chromium | ? | Many (via Chromium) | ? |
| Tauri | Chromium (Windows)<br/>WebKit (Linux/macOS) | In development | Apache | ? |
| Neutralinojs | ? | In development | [Many](https://github.com/neutralinojs/neutralinojs/blob/main/LICENSE) | ? |

Note that I'm ignoring native code interop because it's not relevant to me, but I believe NW.js uses Node and Tauri uses Rust.

# My plan
For my purposes:

* I only *need* to support Windows (at least initially)
* I don't need desktop integration or native code
* I'd like to produce a minimal binary package (i.e. I don't want to bundle an entire browser runtime if I don't have to)

Based on these requirements, Tauri (or maybe Neutralinojs) seems like the best match, so I'm planning to try Tauri first.

I'm a little concerned that if I want to later expand to Linux and/or macOS (where Tauri uses WebKit) I might run into incompatibilities, but I haven't had any complaints about my web app working on other platforms, so this is a risk I'm willing to take, for a hobby project anyway.