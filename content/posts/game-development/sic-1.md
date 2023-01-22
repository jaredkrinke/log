---
title: "SIC-1: A single-instruction programming game"
description: SIC-1 is a single-instruction (subleq) programming game that can be played via Steam or the browser.
date: 2022-12-06
keywords: [steam,sic1]
---
**SIC-1** is a single-instruction ([subleq](https://esolangs.org/wiki/Subleq)) programming game with "zachlike" optimization leaderboards. It can be played here:

* [SIC-1 on Steam (Windows)](https://store.steampowered.com/app/2124440/SIC1/)
* [SIC-1 on itch.io (browser)](https://jaredkrinke.itch.io/sic-1)

# Background
This game originally started as an experiment to write a subleq assembler that supported labels. After creating the initial assembler, I was inspired by the [Zachtronics](https://www.zachtronics.com/index.html) game [TIS-100](https://www.zachtronics.com/tis-100/) to create a series of programming puzzles involving subleq.

I mostly just wanted to learn for myself how to implement variables and functions in a subleq computer.

## Prototype and initial release
After getting thoroughly carried away, I ended up creating a service (initially using [SQLite](https://www.sqlite.org/index.html), then later [Firestore](https://firebase.google.com/docs/firestore/) + [Netlify Functions](https://functions.netlify.com/)) for storing players' scores so that people could compete against one another to find the most efficient programs.

I released the game (for free) in late 2019 on [itch.io](https://itch.io/) and it eventually took the top free spot on itch.io for the search term "zachlike". Over the ensuing two years, the game was played thousands of times (although only roughly 1,000 people completed nontrivial puzzles). I was thrilled to hear from people I'd never met before that they loved the game.

## Preparing for a release on Steam
In the fall of 2022, after putting it off for far too long, I decided to start porting SIC-1 to Steam. I'd always wanted to release a game on Steam, and I thought Steam might provide a new audience for the game.

Although Steam allows anyone to release a game (after paying the $100 Steam Direct fee), I wanted to improve the quality of the game so that it looked more like a real game instead of a prototype. This plan snowballed into multi-month effort that included learning many new skills and tools to add game features such as:

* Music
* Sound effects
* Achievements
* A new narrative

Despite being tedious at times, experimenting with things like creating music using the [Yamaha DX7](https://en.wikipedia.org/wiki/Yamaha_DX7)-inspired [dexed synth](https://asb2m10.github.io/dexed/) turned out to be surprisingly enjoyable. Having a goal in mind and a rough schedule motivated me to produce several tracks of music--something I'd never really done before.

The most difficult decision I had to make was whether or not to try and charge for the game. In the end, I decided to keep the game free for a couple of reasons:

1. It seemed unlikely I would sell enough copies to have a meaningful financial impact on my life
1. I wanted as many people to play the game as possible, partly to ensure the leaderboards would have enough scores to spur competition

# Steam release
Last Friday, I released SIC-1 on Steam.

Although marketing is not my strong suit, I created a marketing plan with a list of ideas and a rough schedule. Unfortunately, my most promising marketing idea (sharing the game on a web site where esoteric programming languages are popular) garnered very little attention. In the end, the most impactful marketing for the game has simply been pushing the "release" button on Steam. In other words, my marketing efforts had negligible impact.

# Near-term goals
I've never been clear on what my goal was with developing this game. It's morphed over time and included thoughts such as:

* I just want to see if I can make a good game
* I'd like to see if there's an audience for my work
* I'd like to have the experience of releasing a game, specifically on Steam
* I want people to enjoy something I've created

For now, my only concrete goal is to **get 10 reviews on Steam by the end of 2022**. I'm not sure if this threshold is used for free games, but I've heard that games need 10 reviews on Steam before they're marked with "positive" (or "mixed" or "negative") reviews.

**Update**: SIC-1 ended the month (and calendar year) with 8 reviews on Steam. That's within striking distance of my goal of 10 reviews, so I'll consider this goal to be *almost* achieved.

**Second Update**: SIC-1 hit 10 Steam reviews on January 18th! The amount of traffic to the Steam page has increased roughly 10x (the number of people *playing* SIC-1 has not increased nearly as dramatically--but that's ok, given that it's a niche game).

# One last note
That's all for now. Wish me luck! And if you like programming games or are interested in subleq, please give SIC-1 a try on Steam:

https://store.steampowered.com/app/2124440/SIC1/
