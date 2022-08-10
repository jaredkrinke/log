---
title: Porting a browser-based game to Steam
description: I'm researching options for porting a browser-based game to Steam.
date: 2022-08-10
---
Browser-based games are great because players can pick them up and start playing without having to install anything (assuming reasonable cross-browser compatibility). HTML can also be convenient for UI, especially for laying out text (although handling CSS and rendering quirks can be frustrating).

Despite the benefits, I'd like to port my most popular browser-based game to Steam, for the following reasons:

* I want players to be able to sync their data across devices, without forcing them to create a new account (and without me having to host everything)
* I want Steam's huge user base to be able to access my game (more for convenience than for exposure)
* I might want to build on this experience in the future, for example, if I'd like to sell a game

# Open questions
I have no experience developing for or publishing on Steam, so I have a lot of questions:

* Which browser-to-native framework should I use (Electron, Tauri, WebView2, etc.)?
* Does Steam have built-in support for browser-based titles? Are any of the above frameworks in the Steamworks Common Redistributables package?
* Which platforms should I support?
* What's required to take advantage of Steam's support for cloud saves/syncing?
* How do I test Steam Cloud saves?
* Is there any way to transition user information from the current web site to the Steam release?
* Will it end up costing more than the advertised $100? Is there any way to bring that cost down?
* Is it permissible to promote the Steam version of the game from its current web-based host?
* What sort of analytics does Steam provide for game publishers?

Answering these questions will take some time, but honestly I think I'd regret not ever trying to port my game to Steam.