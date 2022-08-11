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

# First steps
Steam publishes documentation for Steamworks here:

https://partner.steamgames.com/doc/home

## Common redistributables
There is [a page about common redistributables](https://partner.steamgames.com/doc/features/common_redist) that says it includes "Microsoft Visual C++, .NET, DirectX 9, OpenAL, XNA, and PhysX", but it says the complete, up to date list is on a page that appears to only be visible to developers who have already paid a $100 fee. I had planned to pay the fee regardless, but I'd hoped I could at least answer some of my questions before handing over money.

## Platforms
It's now possible to download the Steamworks SDK *before* paying the Steam Direct fee, which is helpful. Within that zip file, it has binaries for 32- and 64-bit Linux and Windows, and macOS. I'm interpreting that list to be the definitive list of supported platforms.

Note that GPL-licensed libraries can't be linked with the Steamworks SDK (or probably distributed via Steam period).

## Cloud saves
The Steam SDK [provides a C++ interface](https://partner.steamgames.com/doc/sdk/api) for enumerating/reading/writing files to the Steam Cloud. There is also an [auto-cloud](https://partner.steamgames.com/doc/features/cloud#steam_auto-cloud) feature that just synchronizes files based on path.

As far as transitioning data from the browser version to the Steam version, I doubt there is a reliable and automatic way to do so.

### One note on Itch
Note: in the past, I investigated using [Itch](https://itch.io/)'s launcher to sync user data, but there were many issues:

* Obtaining the user identity isn't possible due to known bugs
* Storing data is up to the game developer, because Itch (reasonably, in my opinion) does not offer cloud storage for games

## Cost
As far as I can tell, Steam's $100 fee (plus tax) is a one-time fee. Obviously, I'd prefer not to have to shell out this much money, but, luckily, $100 is not going to make or break my financial situation.

## Advertising Steam release within browser-based version
It seems that there is precedent (e.g. [Mindustry on Itch](https://anuke.itch.io/mindustry)) for advertising that the same game is available on Steam, when the Steam version has additional features. I didn't see anything Itch's terms of service that prohibit this (nor do I think it *should* be prohibited).

# Marketing and analytics
Steam has [guidance for marketing games on the platform](https://partner.steamgames.com/doc/marketing). It looks like there is support for Google Analytics and some link tracking. For now, I'm just going to put off thinking about marketing because my goal is to share my game, not to get rich off of it.