---
title: Lisp Game Jam (Spring 2023)
description: Might as well try and make a game in Common Lisp, right?
date: 2023-05-26
keywords: [lisp]
---
Recently, I've been [learning Common Lisp](../programming-languages/learning-lisp-in-2023.md) and so I've been keeping an eye out for practice projects. Fortunately, as I'm writing this, the [Lisp Game Jam (Spring 2023)](https://itch.io/jam/spring-lisp-game-jam-2023) is just about to start, so I guess I'm doing that now.

For the time being, I'll just describe the (tiny) game I have in mind.  I'm not terribly confident that I'll be able to complete anything within the next ten days, but I'll give it a try anyway!

# A word game
The goal of the game is to look at a bunch of letters and then, as quickly as possible, find the longest word that can be constructed by drawing from the given set of letters (without replacement). Ideally, this would be a real-time, global competition, but I doubt I'll be able to get anywhere close to that within 10 days (of roughly 1 - 2 hours per day, at best, of development time).

When I originally had this idea, I gave it the intentionally terrible name of **Longle** ("long" + "Boggle"). Today, I'm thinking I'll call it **Thirteen Letters** (actual number subject to change).

# Plan
Here's my rough plan for implementing this game:

1. Find or create a word list
2. Consider reducing that list (based on observed word frequencies) to a set of difficult, but reasonable, puzzles
3. Implement a simple terminal version of the game that just records how long it takes for the player to identify the longest word
4. If time permits, create a service to distribute puzzles and record the *actual* time taken to get a response
5. If time is abundant, create a service to host global competitions with 30 - 60 second rounds and resulting scoreboards

# Progress
As of right now (May 26th, at least as far as UTC is concerned), I'm struggling with the first item. The best word lists I've found so far have been copyrighted works related to Scrabble. Other than obvious legal risks, these lists also have a cap on the length of words. Most of the other word lists I've found contain proper nouns, lack inflected nouns/verbs, or contain huge amounts of questionable "words" (for example: "zzzs").

For now, I think my best bet is to use the public domain [YAWL](https://github.com/elasticdog/yawl) word list, possibly filtered by some arbitrary frequency cutoff based on the Google Trillion Word Corpus via [Peter Norvig's web site](http://norvig.com/ngrams/). After exploring this a bit, it looks like just ensuring the word is in the top ~300,000 most frequent words may be sufficient to get a set of words that I consider to be legitimate.

**Update**: I did [complete the game](lisp-game-jam-2.md), but the server that ran the game has since been taken offline.
