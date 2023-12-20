---
title: SIC-1 is going open source
description: Which open source licenses make the most sense for my game?
date: 2023-12-19
keywords: [sic1]
---
In [my original retrospective on releasing SIC-1](sic-1-retrospective.md) (a single-instruction zachlike programming game), there were two open questions about the future:

1. Should I port the game to Linux (on Steam)?
1. Should I release the game under an open source license?

The first question has been answered: [SIC-1 has been ported to Linux (on Steam)](web-game-on-steam-for-linux-2.md), but the second had not (until now).

I've finally decided to release the game under an open source license. **Which license? Good question!**

# Motivation
Why release SIC-1 as open source? Up until now, the game has been my baby and there have been no substantial contributions by anyone else.

If I was naive, I'd hope that releasing the game as open source would lead to a revival, driven by contributions from excited new authors. But I'm *not* naive, and I fully expect that no one else will take the time to read, understand, and modify the code in any significant way.

But games are more than just code! There are also assets. Specifically, SIC-1 contains a bunch of English text, both in the form of documentation and narrative. While I don't expect the characters I've developed to get their own spin-off TV series, there is at least *one* area where I am hopelessly under-qualified *and* multiple people have expressed an actual interest in contributing:

**Translating SIC-1 into additional languages**.

I feel it would be unfair to ask for translations from *volunteers* in the case that I retained ownership over the entire game (even though the game is available for free already). Instead, I think it makes sense to open up ownership of the game to *everyone*, i.e. release the game as open source.

# Hypothetical concerns
Given that SIC-1 is free, with source already available, why wasn't the game already open source? Here was my [original rationale](sic-1-retrospective.md#should-i-open-source-sic-1):

> * I don't want someone else to turn around and sell my game (that I released for free)
> * I'm proud of the music and characters/narrative, and I don't want other people to be able to profit off of them

Now that the game has been out on Steam for over a year and I think it's already past its popularity peak, I feel less concerned about someone else profiting off of the game. The zachlike genre is just not that popular. Even excellent zachlikes *from Zachtronics* don't sell that many copies. And SIC-1 isn't nearly as good! **No one's going to get rich off this game.**

As far as the characters and narrative, I can't imagine anyone repurposing them. And I can just use a copyleft/share-alike license anyway.

Having said all of that, I don't think I'm quite ready to let *just anyone* use the music from the [SIC-1 Original Soundtrack](https://soundcloud.com/schemescape/sets/sic-1-original-soundtrack). Unlike code and documentation, background music could fit right into completely unrelated projects--or even *events*. **What if 80s-inspired puzzlewave suddenly breaks into the mainstream and then I'm hearing the SIC-1 soundtrack at political rallies?** Maybe that's taking this hypothetical situation a bit too far, but, regardless, I'll probably continue to retain sole ownership over the soundtrack.

# Copyleft or permissive license?
The main decision I need to make around licensing is between choosing a [copyleft](https://en.wikipedia.org/wiki/Copyleft) vs. permissive license (e.g. [GPL](https://en.wikipedia.org/wiki/GNU_General_Public_License) vs. [MIT](https://en.wikipedia.org/wiki/MIT_license)).

I like the idea of using a copyleft license because it (roughly) requires anyone distributing derivative works release their modifications back to the community. There is one sticking point with the GPL, however: it doesn't allow linking with closed source code--in my case, this means I couldn't link with the Steamworks SDK (which provides achievements and friend leaderboards on Steam) without jumping through some hoops (e.g. [moving Steam interactions out of process](https://github.com/icculus/steamshim) or requiring contributors sign a "contributor license agreement" allowing distribution on Steam). The [LGPL license ](https://en.wikipedia.org/wiki/GNU_Lesser_General_Public_License) would avoid this problem.

There's another issue with copyleft: what if I want to later use my code in a new game? Of course I can use *my* code, but I wouldn't be able to use any improvements that have been contributed by others. Honestly, however, this seems unfair to those contributors--I'd be (potentially) profiting off of their work.

After writing these thoughts down, I think the answer is clear: **I'd prefer to use a copyleft license to protect both my contributions *and the contributions of others***.

# The plan
Given all of the above, here's my plan for licensing the various categories of SIC-1 content:

* **Source code**: [GNU Lesser General Public License](https://www.gnu.org/licenses/lgpl-3.0.en.html) (at least until I have time to incorporate a GPL shim for the Steamworks SDK)
* **Documentation/narrative**: [Creative Commons Attribution, Share-Alike](https://creativecommons.org/licenses/by-sa/4.0/)
* **Music**: "all rights reserved"