---
title: "Retrospective: Lisp Game Jam (Spring 2023)"
description: I managed to implement a multiplayer browser-based game in Common Lisp!
date: 2023-06-13
keywords: [lisp]
---
This is a follow-up to [my previous post about discovering Lisp Game Jame (Spring 2023)](lisp-game-jam.md). In the previous post, I described my word game and implementation approach. This post covers how it all went, along with some lessons learned and general thoughts about Common Lisp.

Source code is [on GitHub](https://github.com/jaredkrinke/thirteen-letters/).

**Update**: The game is no longer online/running, but you can see [feedback from players who tried the game](https://itch.io/jam/spring-lisp-game-jam-2023/rate/2103016).

# Recap
I've been [learning Common Lisp](../programming-languages/learning-lisp-in-2023.md) and [Lisp Game Jam (Spring 2023)](https://itch.io/jam/spring-lisp-game-jam-2023) was an appropriate motivator. I wanted to make a simple word scramble game that was played in real time against other players, inside the browser.

# The challenge
I set a challenge for myself to write *the entire game* in Common Lisp. Specifically, I was going to use various domain-specific/template languages to produce HTML, CSS, and JavaScript for use in the browser. (Running Common Lisp on the back end was, and is, trivial.)

After some searching, I settled on the following tools/libraries:

## Front end
* [Parenscript](https://parenscript.common-lisp.dev/) for translating Common Lisp to JavaScript
* [Spinneret](https://github.com/ruricolist/spinneret) for creating HTML from s-expressions and CL code
* [cl-css](https://github.com/Inaimathi/cl-css) for creating CSS

## Back end
* [Hunchentoot](https://edicl.github.io/hunchentoot/) as a base web server
* [Hunchensocket](https://github.com/joaotavora/hunchensocket) for handling WebSockets on the server side
* ~~[cl-json](https://github.com/hankhero/cl-json) for encoding/decoding JSON~~
* [YASON](https://phmarek.github.io/yason/) for encoding/decoding JSON (cl-json doesn't support non-BMP Unicode)
* [SBCL](https://www.sbcl.org/) for running the server (sitting behind nginx for TLS support)  and compiling everything

# Day-by-day progress
* May 26: Generated a word list (most frequent words from the YAWL corpus)
* May 27: Implemented command line game loop
* May 28: Investigated binary distribution options (static SBCL/ECL builds, AppImages), eventually giving up
* May 29: Prepared backup submission (the command line version)
* May 30: Investigated libraries for browser-based version (Hunchensocket, Lisp in Parallel, Parenscript, Spinneret, cl-json, cl-css)
* May 31: Partially implemented WebSocket-based server
* June 1: Completed server (mostly)
* June 2: Discovered ngrok free tier couldn't support public WebSockets, settling on standing up a simple VPS instead
* June 3: Implemented basic HTML+JavaScript front end
* June 4: Added a countdown timer, hall of fame, and mobile formatting

(After the jam ended: bug fixes, WebSocket reconnecting, input validation, code cleanup.)

# Results
Playing the completed entry myself confirmed my original suspicion that the game is really only fun when there's someone else to compete against.

I had hoped that the time-limited nature of the voting period would mean that people would end up connecting at the same time as others, but that ended up being wishful thinking. With 30 submissions, each game probably only got a few minutes of playing time, so there were only a handful of times when players overlapped and actually got to compete (often against me, since I connected very frequently). It *did* sound like those players had fun, though!

Even worse, when someone was streaming their playthroughs of all the submissions, I was sitting and waiting to hop in and give the streamer some competition, but they ended up breezing through my game in the 5 minutes I happened to be away from my computer! Very poor timing on my part...

Despite the lack of ideal (multiplayer) conditions, my entry had generally positive feedback, with most praise being related to:

* Making a real-time multiplayer game that runs in the browser
* Using Common Lisp everywhere

I was going to be happy with an overall placement in the middle, but Thirteen Letters actually managed to end up in the top third. Not too bad!

# Lessons learned
## Multiplayer games need multiple players
I knew this intuitively going into the jam. I even had a plan to pop up a notification on my phone whenever someone connected, so that I could hop in and play against them, but I wasn't able to implement it in time.

In retrospect, implementing notifications should have been my top priority after getting the game working. Instead, I focused on creating a "hall of fame" so that players could compete asynchronously on the leaderboard, but this wasn't actually interesting because it was just about play time (how many rounds they sat through by themself) and not skill.

If I ever make another multiplayer game jam entry, I'll focus on ensuring people are able to actually play against an opponent (even if I have to secretly create a bot or just play the game *all day long*).

## REPL-driven development/developing in production
Given that my entire motivation to learn Common Lisp was to experiment with REPL-driven development, I decided to try and develop and test as much as possible using Emacs SLIME (over a Swank connection).

Overall, having a direct connection to the server was helpful for monitoring activity, enabling/disabling logging, and making small tweaks (e.g. changing formatting or adding alerts).

Notably, as the deadline for the jam approached, I decided to take advantage of the client-server architecture and make it possible to "cheat" the deadline a bit: I added a channel for pushing raw HTML from the server to the client. Since the server could be modified at any time, this would theoretically allow for updating part of the game post-deadline. I didn't end up needing to use this facility, but it *did* end up becoming the "hall of fame" section at the bottom of the page. (I also planned to use it as an easter egg while someone was streaming the game, but as noted above, I missed that opportunity.)

Unfortunately, I also hit a couple of snags with REPL-driven development:

1. Obviously, you have to *plan* if you want to keep your code and your live service in sync
  * Sometimes I'd modify a function or add a parameter and then forget to send it to the live service, leading to errors in the production service
1. Even worse, one time I connected to the live service via Swank, modified a few things, and then suspended my laptop--this then caused *every* HTTP request to hang while Swank was trying to log to my unresponsive laptop--oops!

On the whole, "developing in production" isn't generally a good idea, but just having the ability to connect and inspect things every now and then was invaluable. This was my first time having deep, read/write access to a running service, and it's something I'd like to use again in the future--at least for hobby projects! Connecting a REPL to an important/income-generating service would require careful planning.

## ngrok for WebSockets (or not)
Despite ngrok (a service for exposing local endpoints publicly) officially supporting WebSockets, I've come to the conclusion that their *free tier* has no such support. The reason for this is that it appears to sniff the browser user agent string and then add an interstitial HTML page to the HTTP Upgrade request. Obviously, the WebSocket client doesn't understand HTML, and just bails out with an error.

ngrok is great, but in this case I ended up having to spin up a VPS in short order to get my WebSocket server working properly (an unwelcome surprise during a short game jam!).

## Parenscript
Parenscript seems like a great tool for:

1. People who are very familiar with Common Lisp and want to translate idioms/code into JavaScript
1. People targeting very old versions of JavaScript (back before `let` was added, for instance)

Given that I'm new to Common Lisp and have a lot of experience with JavaScript and TypeScript, I wasn't really the target market for Parenscript. I was able to stumble through it, but the resulting code make it obvious I was thinking in JavaScript and writing in Parenscript.

The most interesting part of Parenscript for me was the ability to define macros. For instance, I added a macro to wrap code in a try-catch that logged to HTML (so I could find errors even when no JavaScript debugger was available). (Note that `@` in function position is used for accessing object properties in Parenscript, e.g. `(@ window onerror)` would translate to `window.onerror`.)

```lisp
(ps:defpsmacro watch (&body body)
  `(ps:try (progn ,@body) (:catch (e) (error (+ (@ e message) " (" (@ e line-number) ")")))))
```

Obviously, this could be done in plain JavaScript with a regular function that takes an anonymous function for the body, but I might as well use macros while they're available!

## Generating HTML and CSS
Being able to use concise s-expressions for generating HTML and CSS felt comfortable (and much more productive than writing HTML in Notepad, as I'd done 20 years prior). But HTML and CSS tooling have come a *long* way and these days I pretty much expect context-sensitive auto-complete.

In the end, I like the look of s-expressions, but I don't think they actually made me more productive than I'd be in, say VS Code.

# Final thoughts
The recurring theme I'm noticing with Common Lisp is that it's easy to mold into new workflows, and these workflows would have been life-changing 20 years ago (and arguably still are notable for their simplicity), but some of the non-Lisp tooling has caught up to (and sometimes surpassed) Common Lisp in the last 5 - 10 years. Not in all cases or in all aspects, but in most of the ones that are important to me (auto-complete, documentation, static checks, debugging).

Of course, modern tools come with "modern" system requirements (i.e. unbelievable bloat), so it's possible that Common Lisp with SLIME is a happy middle ground, with powerful features, and minimal bloat. It doesn't matter if VS Code can do everything I need with TypeScript if I can't even get VS Code to run on my laptop!

Regardless, I'm still having fun learning Common Lisp and have no plans to abandon it, so I guess in that sense this experiment has been a success.

