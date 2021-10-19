---
title: Finding the cheapest hosting for my hobby projects
description: Hosting services for hobby projects shouldn't be expensive. Here's how I ended up with free hosting.
date: 2021-09-22
---

I like playing around with software, so I frequently have hobby projects in development or "production" (scare quotes because they're hobbies after all). Since I don't like wasting money, I'm always on the lookout for cheap project hosting.

Here's how I went from cheap hosting to free hosting.

# Background
Just for fun, I made a couple of computer games (best played on a desktop/laptop):

* [SIC-1](https://jaredkrinke.itch.io/sic-1): A single-instruction ([subleq](https://esolangs.org/wiki/Subleq)) programming game, with a global leader board
* [Falling Block Game](https://jaredkrinke.itch.io/fbgp8): Block-stacking game for [PICO-8](https://www.lexaloffle.com/pico-8.php) with a global high scores list

Both of these require services with a small amount of storage. Since there are no ads or monetization, I'd like to run the services as cheaply as possible.

# First attempt: $1.20/month
I inherited a first generation [Raspberry Pi](https://www.raspberrypi.org/) and already had a $10/year domain, so why not just host my site locally?

Because I was curious about Node, I decided to use the following very simple tech stack:

* Software
  * [Node](https://nodejs.org/en/) JavaScript environment
  * [Express](http://expressjs.com/) web server framework
  * [SQLite](https://sqlite.org/index.html) (via [sqlite3](https://www.npmjs.com/package/sqlite3)) in-process, single file-based database
  * [forever-service](https://github.com/zapty/forever-service) service monitoring
  * [Let's Encrypt](https://letsencrypt.org/) certificate service
* Hardware/connectivity
  * Raspberry Pi (first generation), running [Raspbian](https://www.raspbian.org/)
  * My home Internet connection and router, with appropriate holes in the firewall
  * $10/year .com domain name

There was very little traffic, so the Raspberry Pi could service requests fine and my (cheapest tier) cable Internet was sufficient.

## Cost
The Raspberry Pi drew roughly 3 watts, so the electricity plus domain meant I was hosting a service for roughly $1.20 per month. Very affordable! Additionally, as long as I didn't have a lot of traffic, I could run multiple services without increasing the cost.

## Concerns
I was a bit wary of poking a hole in my firewall and, within a few days, I decided that my concern was justified.

The log for my web server was almost immediately flooded by TCP scanning requests from [masscan](https://github.com/robertdavidgraham/masscan). I also saw 404 errors to common vulnerable paths (namely phpMyAdmin- and WordPress-related paths).

I know there are a lot of people who enjoy having their own "[home lab](https://haydenjames.io/home-lab-beginners-guide-hardware/)", and I'm sure many of these people keep up on the latest security recommendations, but I was more interested in hosting a service than attracting unwanted attention to my home network's external IP address.

I would strongly advise against hosting any site this way, especially since it turns out to not even be the cheapest option!

# Second attempt: $4.33/month
Wait, my hosting cost went up!? Yes, and it was money well spent.

After getting slightly alarmed at all of the nefarious traffic flowing through my router, I was happy to pay for a virtual private server. This way it's at least not my own personal network that's at risk when something goes wrong.

I selected [Vultr](https://www.vultr.com/) as the host because they [offered a decent server for $2.50/month](https://www.vultr.com/products/cloud-compute/#pricing)... except that server is [IPv6](https://en.wikipedia.org/wiki/IPv6) only, and it turns out that much of the Internet is stuck in the address-constrained dark age of IPv4. So I had to pay a $1/month premium for an IPv4 address.

The tech stack was the same except for the host. Both the VPS's Internet connection and CPU were light years beyond what I had with my Raspberry Pi on "cheap" cable Internet.

## Cost
Adding in the domain name, my total cost was $4.33/month. A little more than I'd like to spend on silly hobby projects, but this setup came with the peace of mind of not broadcasting my home IP address everywhere. Again, I could add more services to my server at no additional cost to me.

## Concerns
Other than costing me roughly $50/year, this setup worked great. But it wasn't as robust as I'd like:

* The database was a single file sitting on the server's drive, with no backup, so I could theoretically lose it due to hardware failure
* Configuring the server was a manual process, so if there was a crash, I'd have to spend time setting a new server up

At the time, I wasn't aware, but there are solutions to both of these problems:

* Use [Litestream](https://litestream.io/) to continuously backup the SQLite database to cloud storage
* Use [Docker](https://www.docker.com/) to package everything up, enabling rapid recreation of the server
  
There are actually many other solutions, but these are two simple approaches I plan on testing out in the future.

# Third attempt: FREE!
While chatting with a friend who does web development for a living, he told me that I could probably host my site for free. That magic phrase led to several follow-up questions from me, and a lot more information from him.

It turns out that many cloud providers have free tiers to try and hook you into their ecosystems, in hopes that you'll eventually become a paying customer. I'm pretty sure all the major cloud providers have free tiers, and some of them are quite generous. My uninformed opinion is that it seems like the less popular the platform, the more generous the free tier.

The annoying part of all of this is that the best free offers vary substantially, so you'll likely end up having to use multiple different providers. In my case, the tech stack looks like this:

* Node JavaScript environment
* [Koa](https://koajs.com/) web framework
* [Firestore](https://cloud.google.com/firestore/) document database
* [Netlify Functions](https://www.netlify.com/products/functions/) "[serverless](https://en.wikipedia.org/wiki/Serverless_computing)" end point
  * Hosted on the (free) "netlify.app" domain

Since everything is in the cloud, I'm also less concerned about hardware failure. I haven't thoroughly investigated whether I should backup my Firestore data or if their architecture seems robust enough for my needs.

## Cost
Zero cost, since I didn't need to use a custom domain. I didn't even have to provide a credit card.

## Concerns
This setup is free, which is great, but when I last checked, both of the free offerings I'm using were actually fairly expensive if you end up with enough traffic to need to start paying. You're also locked into their systems unless you want to start rewriting code.

I also found that Firestore wasn't a great fit for my needs, since it's a "[NoSQL](https://en.wikipedia.org/wiki/NoSQL)" document database that basically requires me to build and maintain my own aggregations. But I'm not paying anything, so I shouldn't complain.

# What about the future?
I succeeded in finding free hosting for my hobby projects. Great! But I'm not perfectly happy being locked into specific vendors and libraries.

Cloud services are great, but I'd really like something more portable, in case I ever create a project that ends up getting a significant amount of traffic. There may be better approaches, but I think I'd like to use containers hosted on a VPS (with backup to commodity cloud storage), just for portability reasons.

I have heard that Oracle's cloud has a [free tier that even includes your own virtual private servers](https://www.oracle.com/cloud/free/#always-free), so I may look into that eventually. Planning to use Oracle is something I never thought I'd be doing as a hobbyist, but these are interesting times.

The future might look like this:

* Node environment
* Koa web framework
* SQLite database
  * Backed up to commodity store (e.g. [Backblaze](https://www.backblaze.com/)) via Litestream
* Forever-service monitoring
* Let's encrypt certificate
* All in a Docker container
* Hosed on Oracle's free compute VM