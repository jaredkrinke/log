---
title: Porting a browser-based game to Steam... on Linux
description: I ported a web game to Steam, but it only works on Windows. Can I get it to run on Linux?
date: 2023-07-10
keywords: [steam,linux,sic1]
---
Last year, I [ported my single-instruction programming game to Steam](sic-1-retrospective.md), but I [felt bad that it didn't run on Linux](sic-1-retrospective.md#should-i-port-the-steam-version-of-the-game-to-linux) (because I chose to use Windows-only [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) to avoid using Electron). I'd like to rectify this situation, but it's testing my patience.

# Original plan
From the beginning, I wanted to avoid using Electron because it's inherently inefficient (it basically ships an entire Node+Chromium browser runtime alongside the app)... but for games it's probably fine. No one is going to notice or care that a game on Steam is 100 MB instead of 10 MB.

So my original plan was to port my game to Electron, add [Greenworks](https://github.com/greenheartgames/greenworks) (a Steam integration library), and release a native Linux version on Steam.

# But...
Unfortunately, it turns out that Greenworks is no longer maintained and (more importantly) it doesn't support friend leaderboards. Given that friend leaderboards are arguably the most enticing integration point with Steam for a zachlike, this is a big problem.

I'm not opposed to learning new technologies for educational purposes, but learning about [Node native addons](https://nodejs.org/api/addons.html) (which version of the API? I have no idea) and [rebuilding them for Electron's incompatible ABI](https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules) does not sound *at all* enjoyable to me at the moment. If I have to patch Greenworks, I'll do it, but I'd prefer a solution that is better aligned with my current interests.

# Options
Speaking of solutions, what other options do I have to bring SIC-1 to Linux on Steam? The game is implemented in TypeScript, using HTML+CSS for the UI, all bundled using Parcel.

A few potential approaches and some commentary follow.

## Electron
Electron is nice because it works consistently across operating systems (and Linux distributions). Some initial testing also indicates that Electron-based games on Windows can run on Linux via Proton.

The biggest downside to Electron (other than its immense size) is that it's completely unnecessary (all Steam-supported operating systems already contain a native browser). I also suspect that as Electron adds more script isolation features it will become even more unwieldy for simple web games.

As far as interfacing with Steam's API, there are a few options:

1. Extend Greenworks to support friend leaderboards (pros: probably the least new code; cons: requires learning about a new platform I don't have any interest in, Node native addons)
1. Create a shared library that exposes necessary Steam API functionality as simple C functions and then use one of Node's foreign function interfaces to call those functions from the Windows build, using Proton on Linux (pros: might be able to reuse existing C++ code from the WebView2 version; cons: translating WebView2's Windows Runtime/VARIANT structure-based API into plain C functions could get tricky)
1. Implement the existing Steam integration code on Linux, ideally using a unifying cross-platform synchronization library (pros: native Linux binaries; cons: requires rewriting the entire Steam integration library)

## Native WebView
I could shrink the disk and memory footprint by using native WebViews, of course (via [Tauri](https://tauri.app/), [Neutralino.js](https://neutralino.js.org/), or [webview](https://github.com/webview/webview)). Steam integration would likely require a full rewrite, however.

This feels like The Right Thing To Do because it removes Electron-related bloat, but then I'm just trading efficiency for limited functionality and a compatibility can of worms. Notably, Steam's Linux Runtime doesn't include a native WebView library, so I'd have to package one with the game, which defeats the entire purpose of using a native library.

In the long term, I like this approach because it would enable efficiently shipping the game in downloadable form on other operating systems (outside of Steam).

Overall, this approach aligns with my interests better, but it isn't a great fit for my immediate goal of supporting Steam on Linux.

## New UI framework
Originally, I created SIC-1 to run in the browser because it's convenient and doesn't require downloading anything. Since it's web-native, it also starts up pretty much instantly. However, as I fleshed out the game (adding music, save data, etc.), the browser became more of a hassle than a convenience (Local Storage is unreliable, looping music basically doesn't work correctly on most browsers, styling native UI elements is tricky). I absolutely want to support playing in the browser, but playing outside the browser might produce a more reliable experience.

Here are a few approaches I'm considering:

1. Refactor into [React Native](https://reactnative.dev/) (shared across desktop and web versions)
1. Rewrite for a real game engine that supports web export (e.g. [Godot 3](https://godotengine.org/))
1. Rewrite as a terminal game, just because it sounds fun

All of these would solve portability and Steam-related issues, but they're also all a lot of work. Maybe I'll tackle them *someday*, but I don't think I want to rewrite my game *today*.

# Current plan
Unfortunately, there's no clear winner amongst all these options. The shortest path to Linux support on Steam probably involves Electron and either extending Greenworks or repackaging my existing Steam integration code.

I'm still trying to decide how important it is to me to leave the door open to non-Steam downloadable releases (on various platforms). I've always had a dream of getting a piece of software incorporated into a popular Linux distribution, and I assume using Electron would make that very unlikely (because bloat).

For now, I will likely pursue the following:

1. Port the Steam release to Electron
1. Refactor Steam integration code into a flat C interface
1. Consume the Steam integration code using one of Node's FFI libraries
1. *Hope* that this new version works acceptably via Proton
1. Consider porting (again) to a native WebView library, for use in downloadable releases on Windows, Linux, and maybe even elsewhere

That's more work than I had anticipated and the next to last step ("hoping" Proton supports it) is questionable, but I think it's the simplest option that is best aligned with my interests.

Hopefully I don't regret this decision!

**Update**: the plan [mostly worked](web-game-on-steam-for-linux-2.md)!
