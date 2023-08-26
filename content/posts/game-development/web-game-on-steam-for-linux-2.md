---
title: Porting a browser-based game to Steam, on Linux (part 2)
description: I finally ported my browser-based Steam game to Linux. It was mostly straight-forward.
date: 2023-08-26
keywords: [steam,linux,sic1]
---
In [a previous post](web-game-on-steam-for-linux.md) I outlined a plan to (finally) port [my browser-based Steam game](../game-development/sic-1.md) to Linux. (The original Windows-only release used WebView2.) The port mostly went according to plan and only took a week or two, working in my spare time.

# Original plan
The simplest way to run a browser-based game using Steam on Linux was to use Electron, but there was one problem: [Greenworks](https://github.com/greenheartgames/greenworks) (a Steam integration library) didn't support friend leaderboards (an important feature of my game). My plan (which optimized for having to learn the fewest new libraries/concepts) was to:

1. Port the Steam release to Electron
1. Refactor Steam integration code into a flat C interface
1. Consume the Steam integration code using one of Node's FFI libraries
1. *Hope* that this new version works acceptably via Proton

# Porting to Electron
Porting to Electron was fairly straightforward. I was able to use Electron's tutorials to get a mostly working game pretty quickly. There were a few issues I had to iron out:

* Electron Forge doesn't have an easy way to add binaries (e.g. the Steamworks binary) to the root of the output folder, so I had to [hack in an `afterExtract` callback to copy the files](https://github.com/jaredkrinke/sic1/commit/c953e7adb63a43022102dbf434123c400ac507a2#diff-4c2d32d0a0906dd3108b9ce9d29178bc2e8e3eae8d82f0b735a73e1f2b23ee5e) and switch from using `electron-forge start` (which *doesn't* run `afterExtract`) to `electron-forge package` (which does) for testing
* Electron allows "Ctrl+R" to reload the page by default (fix: [remove the menu](https://github.com/jaredkrinke/sic1/commit/0459f8c1bd7efd55095936fd1d5350bd27b6eab8))

Fortunately, [adding crash reporting](https://github.com/jaredkrinke/sic1/commit/ef4d99f517f227ba7755bb67cb7abf962d18be0b) was trivially easy.

# Refactoring Steam integration for Electron and/or Linux
My original Steam integration code used the Win32 API, so I had to rewrite it using only the C++11 standard library. I then exposed that code in a flat, synchronous C interface (which I dubbed [ez-steam-api](https://github.com/jaredkrinke/ez-steam-api)).

To support calling the C API from Electron, I used [Koffi](https://koffi.dev/) (which was great, other than one bug I hit--which has since been fixed). The wrapper is documented [here](https://github.com/jaredkrinke/ez-steam-api/tree/main/js).

# *Hoping* that Electron runs on Proton
In the previous post, I acknowledged that *hoping* Electron ran acceptably on Proton was a risk. It turns out this risk was well founded.

In addition to [wasting a lot of time testing out different Electron and Proton combinations](https://github.com/jaredkrinke/sic1/issues/270#issuecomment-1636918488), I ran into one insurmountable bug that was only *just annoying enough* to make me give up: the mouse cursor is off by about 25 pixels on Ubuntu, when windowed (no idea why or how to investigate it, although I wonder if it's related to the system bar at the top of the screen). In fullscreen, Electron-on-Proton worked great! But having windowed mode be broken was unacceptable for my programming game (for other genres, this bug might be acceptable).

So I ended up having to do a native Linux port anyway.

# Native Linux port on Steam
Building an Electron app for Linux is trivial. Getting it to run on Steam was a bit frustrating, however, because the game would fail to launch. But *only* when run from Steam! Even [Steam's test script](https://gitlab.steamos.cloud/steamrt/scout/sdk/-/blob/steamrt/scout/README.md#testing-software-that-runs-in-scout) launched the game fine.

I don't recall how I discovered the solution, but the issue was related to Electron's sandboxing. Given my game only loads its own code (and not anything from the web), the workaround was just to [add `--no-sandbox` to the list of command line arguments](https://steamcommunity.com/groups/steamworks/discussions/13/3801651941320989565/#c3801651941326097085).

And just like that, I had a working Linux port!

# Summary and statistics
I've said it before, but I'll say it again: I should have just used Electron from the beginning. It's inefficient, but it's known to work fine on Steam, across platforms (cf. Vampire Survivors). If I had just used Electron originally, porting to Linux would have been trivial. Fortunately, porting to Electron and then Linux wasn't too onerous.

This Linux port also resolved [one of my open questions](sic-1-retrospective.md#should-i-port-the-steam-version-of-the-game-to-linux) around what to do with SIC-1. And, of course, now people on a free OS can play my game, *with friend leaderboards*. I think the peak number of concurrent Linux players was roughly 3, which is pretty high for a game that only ever peaked at 10 concurrent players on Windows.

# Up next...
That's all for the Linux port! Next, I'm planning to provide an update on how SIC-1's release has been going. Spoiler: it finally met my own internal bar for success!