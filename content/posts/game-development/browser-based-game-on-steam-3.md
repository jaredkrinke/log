---
title: Porting a browser-based game to Steam (part 3)
description: I ported a browser-based game to Steam using WebView2. This is an overview of what I learned in the process.
date: 2022-11-17
keywords: [steam]
---
In [part 2](browser-based-game-on-steam-2.md), I decided to try using [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) to port my browser-based game to Steam (in order to avoid having to ship an entire Chrome/Electron runtime with my game).

The good news is that it is indeed possible to ship an HTML/CSS/JavaScript-based game on Steam using WebView2. The bad news is that I ended up having to write a lot of integration code. I'll probably never know how much time using [Electron](https://www.electronjs.org/)+[Greenworks](https://github.com/greenheartgames/greenworks) would have saved me, but I try not to dwell on sunk costs.

# Finally, some (brief) answers
Below is a categorized overview of the questions I had to answer on my journey to a (hopefully!) final Steam build of my WebView2-based game, along with brief answers.

I'm planning to write more in-depth answers in the future. For now, if you're interested in more detail, send an email to any name at this domain.

## Installation, environment
* **Does WebView2 support Windows 7? What about 32-bit Windows?**
  * Yes to both (use [Win7 VMs](https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/) for testing).
* **Can a Steam [InstallScript](https://partner.steamgames.com/doc/sdk/installscripts) install the WebView2 runtime successfully?**
  * Yes: [example](https://github.com/jaredkrinke/sic1/blob/master/sic1/client/windows/webview2.vdf) (note: use your own app id!).
* **How do you disable F12 dev tools, context menus, etc.?**
  * [ICoreWebView2Settings::put_AreDevToolsEnabled](https://learn.microsoft.com/en-us/windows/windows-app-sdk/api/win32/webview2/nf-webview2-icorewebview2settings-put_aredevtoolsenabled)
* **How do you debug JavaScript code running in the WebView2 app?**
  * Use VS Code's path mapping option: [example](https://github.com/jaredkrinke/sic1/blob/master/.vscode/launch.json).
* **How do you monitor your game for errors (both JavaScript and native)?**
  * Use [Sentry](https://sentry.io/welcome/) or [Backtrace](https://backtrace.io/).

## Integrating C++ and JavaScript
* **What is WebView2's threading model? What happens if the network connection is slow?**
  * All host object calls come in on your main thread, so you may want to move slow operations to a background (or thread pool) thread, and use the promise-wrapping technique mentioned below for providing asynchronous results.
* **How do I integrate native code and JavaScript?**
  * Use [ICoreWebView2::AddHostObjectToScript](https://learn.microsoft.com/en-us/microsoft-edge/webview2/how-to/hostobject?tabs=win32cpp), [implement IDispatch](https://github.com/jaredkrinke/sic1/blob/master/sic1/client/windows/dispatchable.h), and [embed your type library](https://github.com/jaredkrinke/sic1/blob/master/sic1/client/windows/sic1.rc).
* **How can you run save code when the user clicks the close button?**
  * Put code in your WM_CLOSE handler.
* **How do you return a promise from a host object interface?**
  * Not directly supported, but you can marshal the `resolve` and `reject` IDispatch interfaces from the `Promise` constructor to your native code instead ([and even to another thread](https://devblogs.microsoft.com/oldnewthing/20151021-00/?p=91311)): [example](https://github.com/jaredkrinke/sic1/blob/master/sic1/client/windows/promisehandler.cpp).
* **How do you marshal complex types between JavaScript and native code (e.g. for Steam Leaderboards)?**
  * Pack them into flat arrays of values that are represented in native code as [SAFEARRAY](https://learn.microsoft.com/en-us/windows/win32/api/oaidl/ns-oaidl-safearray) of [VARIANT](https://learn.microsoft.com/en-us/windows/win32/winauto/variant-structure).

## Steam integration
* **Is it trivial to take advantage of Steam's support for cloud saves/syncing?**
  * Nope. I periodically write localStorage to a file that Steam auto-cloud synchronizes.
* **How do I test Steam Cloud saves?**
  * Just delete the local save and let Steam restore it on launch.
* **How do you integrate Steam's Callback and CallResult APIs with JavaScript?**
  * I did this using very careful multi-threaded code and the promise-wrapping idea from the previous bullet. I hope there's a better way that I just haven't found yet!
* **How do you deal with Steam API rate-limiting?**
  * With a [coalescing, rate-limited, serializable/deserializable task queue](https://github.com/jaredkrinke/crs_queue).
* **Does the Steam Overlay work for WebView2-based games?**
  * No.

## Miscellaneous
* **How should fullscreen support work?**
  * Must be handled by native code (otherwise "Esc" will always exit fullscreen).
* **How do you ensure your game can immediately start playing music, even before the user interacts with any HTML elements?**
  * [ICoreWebView2EnvironmentOptions::put_AdditionalBrowserArguments](https://learn.microsoft.com/en-us/windows/windows-app-sdk/api/win32/webview2/nf-webview2-icorewebview2environmentoptions-put_additionalbrowserarguments) with `L"--autoplay-policy=no-user-gesture-required"`.
* **Do you need to explicitly move focus to the web view on launch?**
  * Yes: [ICoreWebView2Controller::MoveFocus](https://learn.microsoft.com/en-us/windows/windows-app-sdk/api/win32/webview2/nf-webview2-icorewebview2controller-movefocus).
* **How do you ensure your game is not blurry on high DPI screens?**
  * Project properties -> Configuration Properties -> Manifest Tool -> Input and Output -> DPI Awareness -> Per Monitor High DPI Aware.
