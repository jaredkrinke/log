---
title: Minimal IRC server from scratch in Python
description: The obvious alternative to using Discord is to write and host my own IRC server!
date: 2025-02-17
keywords: [python]
---
This is the story of me prototyping a [minimal IRC server in Python](https://github.com/jaredkrinke/pirc).

The server is currently running (unencrypted/`-notls`) on `irc.schemescape.com` port 6667 (make sure to `/join #general`).

# Discord
Discord is the Electron of chat:

* It has the features people want
* It just works
* (Almost) Everyone uses it
* ...and **it's completely unusable on the [old](../programming-languages/minimal-dev-env-4.md), [slow](../programming-languages/minimal-dev-env-3.md) computers I toy with**

There are several open source alternatives to Discord, including [Revolt](https://revolt.chat/) and [Gitter](https://gitter.im/). Their flagship clients look heavyweight, but **the beauty of open source is that there's almost always an alternative terminal client**. I'll investigate those in time. There's also a decentralized option, [Matrix](https://matrix.org/), which apparently has more than 100 million users. Uh, wow. **I should probably try Matrix!**

But I didn't realize Matrix had so many users at the time, so I decided to instead try a chat protocol that was *designed* for old computers.

# Internet Relay Chat
[Wikipedia says IRC was created in 1988](https://en.wikipedia.org/wiki/IRC). I haven't used IRC much and, when I have, I found it to be unapproachable.

## Problems with IRC
* There are **commands you have to remember** (and any typo might send your flawed command line straight into the chat window for all to see)
* **All IRC servers I've used broadcast your hostname when you connect**, unless you setup an account (*this guy uses Comcast!!!*)
* With IRC, **you generally only receive messages while online**, so you have to stay connected (or use a "bouncer") if you want to actually see responses
* There isn't a convenient, free iOS app for IRC, so IRC basically doesn't exist for many people

I feel like most of these limitations could be easily overcome.

## Solving IRC's problems
Obvious solutions:

* **Have actual UI for commands**, instead of relying on perfectly-entered text commands
* **Hide hostnames by default** (at least from non-operators)
* **Store past messages** in a sequential database and allow clients to request old messages -- note: this seems ripe for AI scraper abuse, and it would require opt-in protocol changes
* Build a simple web client, optionally create native phone apps, and, of course, supply a lightweight TUI!

Once you throw in account management and privacy controls, this could get out of hand quickly. And **Matrix already exists and has probably solved these problems**.

## *Not* solving IRC's problems
My original motivation for investigating chat apps was to see what it would take to setup my own little chat room. I'm still not convinced I *need* a chat room, and I'm almost certain it wouldn't get much use, so let's cut some corners:

* Bridging multiple servers? Who cares!
* Encryption and user accounts? Not needed, since it's just for fun!
* Tracking and querying old messages? Maybe just cache the last 10!
* Instead of building any apps, just reuse existing IRC clients!
* Operators? Probably a good idea, but not implemented

I don't know if worse is *better*, but it's certainly *easier*!

And thus, **[pirc](https://github.com/jaredkrinke/pirc)** was born.

## pirc
**[pirc](https://github.com/jaredkrinke/pirc)** is basically a learning experiment to see how simple an IRC server can be. **The entire server is in a single ~350 line Python file, with no dependencies beyond the Python standard library**. The code uses a minimum of abstraction (most of the server is one big `match` statement). It is almost certainly *not* spec-compliant (since I couldn't actually determine *which* IRC spec to work off of--IRC has evolved organically, for better or worse), but it seems to work with [HexChat](https://hexchat.github.io/), [Irssi](https://irssi.org/), and [WeeChat](https://weechat.org/).

The code is rough, but should be readable, so I won't attempt to explain it here. Here are some things I learned along the way:

* Python's `socketserver` module doesn't seem to have a simple way to detect when clients disconnect (so I switched to the `selectors` module instead)
* In Python, `textwrap.wrap("")` returns `[]` instead of `[""]`
* I still think IRC should *not* broadcast hostnames by default (at least to non-operators)
* IRC clients send all commands in CAPITAL letters (e.g. `JOIN`), *except* the "message of the day" command (`motd`), which is sent in lowercase (why!?)
* To my surprise, private messages and messages sent to channels are both `PRIVMSG` commands (just directed to a channel instead of a nickname)

# Test server
A test server is currently running (unencrypted/`-notls`) on `irc.schemescape.com` port 6667 (make sure to `/join #general`).
