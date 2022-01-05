---
title: Is anybody out there?
description: Solely for vanity, I'm curious if anyone reads this blog or uses any of the tools I've built, but I don't want to add invasive trackers. What are some other options?
date: 2022-01-03
draft: true
---
I maintain this site primarily for my own personal reference, but my hope is that other people find it useful and/or entertaining.

Having said that, if *literally no one else* derives any benefit from this site, I'd like to know if that's the case (because then I could save time by skipping things like proofreading and writing coherent sentences).

Here are some ideas on how to determine if anyone uses this site:

# Delete the entire site and see if anyone complains
I'm not sure how I'd detect complaints, but if I had some reliable way (aggregating social media sites?), this would certainly be a great way to determine if anyone *really* liked this site. I'm fairly certain no one would miss this, the 100,000,000,001st site on The Web, but maybe someday it would be a fun experiment.

Moving on to some more practical ideas...

# Use Google Analytics or a similar service
My static site generator [doesn't currently provide a way to insert the Google Analytics tracking script](https://jaredkrinke.github.io/md2blog/posts/faq/tracking.html), but even if it did, I don't like the idea of trading readers' information to a hugely profitable advertising company in exchange for some simple analytics.

# Use a privacy-friendly tracker
There are privacy-friendly trackers out there, such as [GoatCounter](https://www.goatcounter.com/), that could provide similar insights to Google Analytics without the creepy feeling of having Big Brother following readers around. Given that GoatCounter is free up to 100,000 page views per month, I'm very tempted to sign up and give it a whirl.

But do I really need a tracker at all?

# Use HTTP logs
With HTTP logs, I'm intrigued by the possibility of getting some simple analytics without requiring readers' browsers to send or receive a single additional byte of data. Assuming privacy-friendly aggregation, this really feels like the most respectful way to monitor readers without inconveniencing them (or running afoul of ad-blockers).

There are, of course, problems with this approach:

* HTTP requests are *not* page views!
  * Requests could come from bots, web crawlers, etc. (resulting in over-counting page views)
  * Static content can (and should) be cached to save bandwidth (resulting in under-counting page views)
* [GitHub Pages](https://pages.github.com/) doesn't provide HTTP logs, so I'd have to host this site elsewhere
* Some web servers (e.g. [NGINX](https://nginx.org/en/docs/http/ngx_http_log_module.html#log_format)) log personal information (namely IP addresses) by default
  * I'd like to avoid recording any personal information whatsoever just on principle (not to mention [GDPR](https://en.wikipedia.org/wiki/General_Data_Protection_Regulation))

That first bullet is a serious problem (and presumably one of the reasons that trackers are generally implemented in JavaScript), but it's not like I'm trying to track conversions or sell ads. I just want to know if anyone accesses my site, for my own selfish reasons.

# A path forward
This might end up being a terrible idea, but I'm tempted to try hosting this site myself on a free or cheap virtual private server.
