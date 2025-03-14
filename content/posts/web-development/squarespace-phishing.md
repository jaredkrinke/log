---
title: Did the Google Domains sale to Squarespace open my domain up to phishers?
description: That time I got phishing mail from my own domain.
date: 2025-03-14
keywords: [security]
---
About 5 weeks ago, I randomly checked my spam mail folder and saw a phishing mail *sent from my own domain*, schemescape.com. I assumed it was marked as spam because it couldn't be validated.

To my surprise, **the mail was verified (via [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework) and [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail)) as being from schemescape.com.**

I'm pretty sure I hadn't tried to phish myself, so... **what happened?**

# Background
I originally registered schemescape.com using Google Domains and I set up *in-bound* email forwarding, so I could receive mail at my domain (but not send it).

On June 15th, 2023, [Google announced it was selling its Google Domains business to Squarespace](https://domains.google/). By July 2024, all domains had been migrated to Squarespace.

With that context in mind, let's travel back (forward?) to a few weeks ago.

# Investigation
## Mailgun
To confirm that I didn't have a "Jekyll and Hyde" self-phishing situation, I checked the email headers and observed that **the mail was sent from a sever I'd never heard of**: `a168.a94b46b0.use4.send.mailgun.net` (198.244.55.168). So what is Mailgun, and how are they sending mail from *my* domain?

Mailgun advertises itself as a "transactional email API service for developers". I think it's a legitimate business, so I'm assuming some bad actor is abusing their service. I reported the activity to Mailgun, but that only explains that Mailgun is involved.

## SPF/DKIM
I don't know much about email security, but skimming the Wikipedia articles above indicates:

* SPF ensures the sending mail server is authorized to send mail for the domain
* DKIM is used to sign (and authenticate) each email from the domain

Poking around my DNS records, **there are two suspicious TXT records**:

* SPF (on schemescape.com): `v=spf1 include:mailgun.org ~all`
* DKIM (on k1._domainkey.schemescape.com): ` k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDXlrH338T643ulCW/ROaqdFhTlU332Av6qpMN69oMhKJeUgPp9RFHIMnRecVJAdLVDM3R6RpAsgNdB8EGv1Xhu3/vPA83H/KtGv8p6s03oVLhDaN3emmPZRi8WHlyDWM/W9VPE0aOvfWB/3ONXLaQrJOT2 /JUZIAnQ7ocfZl74kwIDAQAB`

**Where did those come from?** I certainly never authored those DNS records--I didn't even know about the `_domainkey` part of DKIM! Who created those records?

## Mailgun
Both records match [Mailgun's Domain Verification Setup Guide](https://help.mailgun.com/hc/en-us/articles/32884702360603-Domain-Verification-Setup-Guide#01GCQE107VSXRWCKSVCHX0XXQQ), so my domain is setup for Mailgun. **But who set this up?**

Aside: why isn't Mailgun's setup unique to each domain?

## Squarespace?
At first, I wasn't sure if it was Google or Squarespace that created these records on my behalf. [A thread on the Squarespace forum](https://forum.squarespace.com/topic/296578-squarespace-email-forwarding-defaults-for-ex-google-domains-mailgun/) had at least one person noting that their mail forwarding records were modified during the Google Domains -> Squarespace transition, which suggesed it might be Squarespace's doing.

## Squarespace!
Fortunately, DNS records are public, and at least one site has been tracking records over time: [DNS History (dnshistory.org)](https://dnshistory.org/). Looking at their history for my domain, I see that **the SPF record from above was added sometime around May 13th, 2024, right around when Squarespace notified me that my domain had been migrated to their service**.

Given the info above, my best guess is that the Google Domains -> Squarespace transition (or the subsequent Squarespace flow for enabling email forwarding) somehow caused these records to be added, as some sort of (unnecessary, in my case) Mailgun integration. **At that point, a malicious actor just had to claim ("[verify](https://help.mailgun.com/hc/en-us/articles/32884702360603-Domain-Verification-Setup-Guide#01GCQE107WHJR205TAGQAERRAG)") my domain on Mailgun, and then they could start phishing**, using SPF- and DKIM-verified, legitimate-looking mail.

## Squarespace!!!
Annoyingly, **Squarespace seems to *require* the Mailgun records for any kind of mail forwarding**. I don't see an option for in-bound-only forwarding (like I had on Google Domains). So... I don't see a way to avoid this problem other than creating a Mailgun account and claiming your domain there.

# Security response... or not
I documented my understanding of the issue and reported it to Squarespace, via their Hackerone-based security funnel. Either fortunately (because I misunderstood) or unfortunately (because Squarespace misunderstood), **Squarespace closed my report because it was not a "significant" security issue**. Obviously, I disagree. I received a "valid" (as far as email security is concerned) phishing mail from my own domain! There's definitely a problem somewhere!

**My requests for clarification on how email domain hijacking is not a "significant" security issue have, to date, received no response (after roughly 5 weeks)**. To be fair, I did not attempt to replicate the process outlined above (because everyone I know who used Google Domains had already left Squarespace and hijacking some random person's domain sounds like actual, illegal hacking).

# Conclusion
Disclaimer: I'm not an email security expert (or even any kind of security researcher) and I don't know how Squarespace and Mailgun are integrated.

But **I think any Squarespace domain with email forwarding *that is not linked to a Mailgun account* could be ripe for phishing**. I even found that [someone else came to the same conclusion on Reddit six months ago](https://www.reddit.com/r/gsuite/comments/1fcya1x/google_domains_squarespace_and_email_forwarding/). Squarespace assured me there is no problem, but provided no detail.

Regardless, I moved my domain away from Squarespace (to Porkbun). It's not like I *chose* to use Squarespace in the first place--Google chose for me.

# Corrections?
**If you *are* an email security expert and notice any mistakes in my understanding or logic above, *please* email me at log@schemescape.com!** I would love both to be wrong (because then there's not a problem) and to be corrected (so I can learn).
