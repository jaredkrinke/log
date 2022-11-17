---
title: Porting a browser-based game to Steam (part 2)
description: I'm continuing my research on porting a browser-based game to Steam. My plan is to directly use WebView2 on Windows.
date: 2022-08-29
keywords: [steam]
---
In [part 1](browser-based-game-on-steam.md), I did some initial research into Steam's support for hosting games that were originally browser-based. Now, I'm diving into the next level of detail.

# Choosing a framework
First, I needed to choose a framework for hosting my HTML and JavaScript. My criteria for choosing (roughly in priority order) were as follows:

* Supports Windows (because that is my initial target platform)
* Can interface with C++ APIs (namely the Steamworks API)
* Ships without a runtime *or* the runtime is easy to install (via Steam)
* Lightweight (the web version is under 30 KB, compressed)
* As few dependencies as possible
* Uses a programming language I'm familiar with (or want to learn)
* Requires as few changes to the web app as possible
* Supports 32-bit Windows (my laptop--which I occasionally use--doesn't support 64-bit Windows)
* Supports Linux and/or macOS (in case I decide to port the game to those platforms in the future)

Here are the frameworks I evaluated, along with some notes:

* [Electron](https://www.electronjs.org/)
  * ✔ Broadly used and supported
  * ✔ No runtime required
  * ✖ Bloated
* [Tauri](https://tauri.app/)
  * ✔ Lightweight
  * ✖ No out-of-the-box C++ support
  * ✖ Many, many dependencies, [with no official copyright notice](https://tauri.app/about/architecture/#license)
  * ✖ Requires WebView2 runtime on Windows
* [Neutralinojs](https://neutralino.js.org/)
  * ✔ Lightweight
  * ✖ No out-of-the-box C++ support (I think)
  * ✖ Requires WebView2 runtime on Windows
  * ✖ Doesn't appear to support e.g. `localStorage`
  * ✖ [No support for 32-bit Windows](https://neutralino.js.org/docs/distribution/overview)
* [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
  * ✔ Natively supports C++
  * ✔ Lightweight
  * ✔ No other dependencies
  * ✔ Supports 32-bit Windows
  * ✖ Requires WebView2 runtime
  * ✖ Only supports Windows

After my initial research, I decided that I'd like to avoid Electron, if possible, due to its large disk and memory footprint. All the remaining options use WebView2 on Windows, and a cursory glance made me think the WebView2 runtime could be installed via Steam without too much difficulty.

## Tauri it is... right?
Given its impressive list of features (and supported platforms) and light weight, I decided to use Tauri... until I saw that [Tauri had over 1,200 dependencies](https://app.fossa.com/projects/git%2Bgithub.com%2Ftauri-apps%2Ftauri/refs/branch/dev/0668dd42204b163f11aaf31f45106c8551f15942/preview). If Tauri provided a "third party copyright notice" file I could just paste into my app, I might have continued on, but the [Tauri license page](https://tauri.app/about/architecture/#license) only has this unhelpful notice: "it is your responsibility to verify that you are complying with all upstream licenses." I feel like I'm becoming more disillusioned with open source ecosystems by the day, but if I can't even enumerate the correct licenses for a library (let alone audit any of the code!), I probably shouldn't be using it (especially if I want to keep the door open to selling my game in the future).

## WebView2 it is... hopefully
After dismissing Electron and Tauri, I decided to just go with the simplest solution for Windows, which is to just use WebView2 directly.

The biggest downside of this approach is that I likely won't be able to port the game to Linux or macOS. This isn't a justification for only supporting Windows, but I don't have a Linux machine handy to see if Wine or Proton can handle WebView2 (unlikely, but who knows), and the last Mac I owned was a Macintosh Plus, so I've never actually done any development on macOS. At least players on those platforms can just play the browser-based version of the game!

# Answering some questions
I enumerated some [open questions in the last post](browser-based-game-on-steam.md#open-questions), and I can start answering some of them now:

* Which browser-to-native framework should I use (Electron, Tauri, WebView2, etc.)?
  * **Answer**: WebView2
* Does Steam have built-in support for browser-based titles? Are any of the above frameworks in the Steamworks Common Redistributables package?
  * **Answer**: There is no built-in support for WebView2
* Which platforms should I support?
  * **Answer**: Just Windows for now, ideally 32-bit and 64-bit
* What's required to take advantage of Steam's support for cloud saves/syncing?
  * **Educated guess**: [Steam auto-cloud](https://partner.steamgames.com/doc/features/cloud#steam_auto-cloud) along with a [custom WebView2 user data folder](https://docs.microsoft.com/en-us/microsoft-edge/webview2/concepts/user-data-folder?tabs=win32) look promising
* How do I test Steam Cloud saves?
  * **Educated guess**: Steamworks provides [pre-release testing guidance for Steam Cloud](https://partner.steamgames.com/doc/features/cloud)

There are also some new questions to add to the list:

* Can a Steam [InstallScript](https://partner.steamgames.com/doc/sdk/installscripts) install the WebView2 runtime successfully?
* How should fullscreen support work?
* How can Steam and browser-based leaderboards be shared/merged?

# Next steps
I have a working proof-of-concept app based on WebView2, but my biggest concern is whether or not Steam's [InstallScript](https://partner.steamgames.com/doc/sdk/installscripts) functionality can successfully install the WebView2 runtime. I don't see any obvious reason this shouldn't work, but given that deployment and configuration files have bitten me many times in the past, I'm eager to prototype this as soon as possible. If there's a roadblock to using WebView2, I'd rather find it sooner than later.