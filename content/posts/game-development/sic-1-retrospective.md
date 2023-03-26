---
title: Reflecting on my first release on Steam, SIC-1
description: This is a retrospective on my first game I've released on Steam, along with some thoughts about the future.
date: 2023-03-25
keywords: [steam,sic1]
---
It's been almost four months since I released [SIC-1](sic-1.md) (a single-instruction programming game) for free on Steam (and re-released it [on itch.io](https://jaredkrinke.itch.io/sic-1)). This is an update on how the release went, and my plans for the future.

# Financial summary
* Revenue: $0
* Expenses: $134.07

SIC-1 can be played by anyone for free (with no ads), so it's earned a grand total of $0 in revenue. Expenses include a $100 Steam direct fee, and roughly $34 for a year of (completely optional) web hosting.

## Do I regret releasing SIC-1 for free?
I released SIC-1 for free because:

* Free games attract more players, and I wanted as many players as possible to fill up the charts/leaderboards
* I strongly doubted I would ever earn enough money from SIC-1 to make a meaningful financial difference in my life

In the absolute best case scenario, let's assume that all 1,800 players on Steam bought the game for my hypothetical full price of $10. Taking out Steam's 30% fee and another 15% for taxes, that would be a little under $11,000 in my theoretical pocket. An extra $11k actually sounds pretty great! Realistically, however, [most indie games make less than $4,000 (lifetime)](https://vginsights.com/insights/article/infographic-indie-game-revenues-on-steam), and SIC-1 probably would have ended up even lower (on a couple hundred sales, at less than $4 net profit per sale).

Additionally, if I had wanted to charge for the game on Steam, I would have had to either start charging for the previously free game on itch.io or take that version down entirely. That would feel like a betrayal of existing players. On the flip side, if I had charged for the game, I would have felt like I couldn't eventually make the game free (or open source) because that might annoy my biggest fans (the ones who actually gave me money). A freemium model might have resolved these problems, but I didn't want to fragment the player base over a small amount of money.

In the end, earning some extra money would have been nice from a motivational standpoint, but I think I made the right decision to release the game for free.

# Statistics
## Steam+itch.io statistics
* 3,500 people started in the in-game tutorial
* 1,700 completed the first puzzle
* 500 completed the most difficult arithmetic task
* 230 completed the first sequence task
* 50 completed (correctly) the entire set of sequence puzzles
* 30 completed the original set of 30 puzzles
* 11 have completed the (new) final puzzle

## Steam-specific statistics
* 13,000 free licenses granted
* 1,800 lifetime unique users
* 20 positive reviews
* Peak concurrent players: 10
* Daily active users peaked at 65 in January and trended down to 10 as of late March

## Statistics summary
I made SIC-1 for fun. I knew that the market for programming games was probably pretty small. But I guess I didn't quite realize *how small* that market actually is. Even [Last Call BBS](https://www.zachtronics.com/last-call-bbs/), the most recent (and final) game from [Zachtronics](https://www.zachtronics.com/) only has roughly 700 positive reviews (and approximately 22k sales).

SIC-1 was able to reach 20 positive reviews in four months (with no negative reviews) and [Video Game Insights estimates that SIC-1 is in the top 45% for positive reviews and units "sold"](https://vginsights.com/game/2124440). Given the niche audience and punishing nature of single-instruction programming, that actually sounds pretty good!

Unfortunately, I didn't really do any market research before diving into the Steam release for SIC-1, so I'd been hoping for a small single digit multiple of all the numbers above. Oh well, next time I'll mentally set the bar lower.

# Marketing
As SIC-1's Steam debut approached, I cobbled together a long list of potential marketing activities. For example, sharing the game on sites that are popular with programmers, esolang enthusiasts, and zachlike players. As [noted in the previous post](sic-1.md#steam-release), none of my marketing activities were terribly fruitful, but I was at least heartened to eventually see *someone else* organically share my game on the unofficial Zachtronics Discord server (someone even streamed it on Twitch!). Regardless, until late December 2022, just relying on Steam was my best marketing activity (and, spoiler alert, not much has changed).

## December 2022 traffic spike
After the first few disappointing weeks on Steam, I seriously started to consider shelving the entire project. But one day I saw a large spike in traffic coming from (of all places) GitHub. It took a little bit of searching to find out that [SIC-1's GitHub repository](https://github.com/jaredkrinke/sic1) had been shared on Twitter... by someone will millions of followers!

Specifically, [the original creator of Minecraft, Notch, shared my game](https://twitter.com/notch/status/1604998134354137099):

> Zachlike subleq "game" ... I'm going to lose a lot of braincells to this one ... ie, highly recommended.

Given that Notch had 3.5 million followers, I thought this might be my big break, and I did get quite a few new players at the time, but the total impact was probably only in the (very) low hundreds of new players. Regardless, it was fairly surreal to see a billionaire live-tweeting about playing my game (during the winter holiday season, no less).

## "Positive" rating on Steam
But it turns out the best marketing for SIC-1 was, again, just to let Steam provide some visibility. Once SIC-1 hit 10 reviews, it got a "Positive" rating and a very large spike in traffic (over 5,000 visitors in one day). The spike has been receding, but I'm still seeing over 100 unique visitors to the Steam page per day.

## Marketing summary
All things considered, I should probably be content with where SIC-1 ended up, given the small audience and my apparent lack of marketing prowess, but I can't shake the feeling that the game didn't attract as many players as I'd hoped.

# Overall
Obviously, I learned a lot producing and launching a small (but complete) game on Steam, not limited to:

* How Steam works behind the scenes
* How to make a trailer for a game
* How to create Yamaha DX7 music (without owning any synthesizers or spending any money)
* How to write a narrative for a game
* How to run asynchronous operations with WebView2

Of the list above, creating original music was definitely the most enjoyable activity, so it's good that SIC-1 provided motivation to learn more about that process.

Releasing a game on Steam was a bucket list item for me, and I'm glad I did it. It remains to be seen if I'll make any more games in the future.

# The future
Speaking of the future, SIC-1 is mostly complete. I'd like to add an interactive tutorial and support for custom puzzles, but given the lower player count I'm not convinced that would be a good use of my (limited) free time.

Here are the biggest remaining open questions for me

## Should I open-source SIC-1?
Currently the game is free and source is available, but it's not [Open Source](https://opensource.org/osd/) because I don't allow redistribution/resale/modifications. I love open source software, but there are two reasons I'm hesitant to release my game as open source:

* I don't want someone else to turn around and sell my game (that I released for free)
* I'm proud of the music and characters/narrative, and I don't want other people to be able to profit off of them

An obvious solution would be to release everything except the narrative and music as open source, but I'm not sure that's worth the effort.

## Should I port the Steam version of the game to Linux?
I feel bad for only supporting Windows for the Steam release. My original reasoning was:

* The web version already works on Linux/macOS/whatever
* By using WebView2 (instead of Electron), I could keep the download size reasonable (less than 30 MB)

In retrospect, I should have just used Electron from the beginning. Not only would it have been easier to implement, but then I could have easily supported Steam on Linux (and maybe even macOS), allowing those players to sync save data across devices and compare achievement statistics. The only downside is that the download would be roughly 5 times as large (which *does* seem excessive for a mostly text-based game).

But once again, I'm just not sure that the game is popular enough to warrant porting to Linux. It might please a handful of people (and make me feel better), but I should probably focus on more impactful projects.

# That's all, for now
Thus concludes my brain dump. Feel free to send questions or comments to log@schemescape.com. If you enjoyed the game, I'd love to hear from you!
