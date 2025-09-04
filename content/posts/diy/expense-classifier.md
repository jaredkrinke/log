---
title: Writing a financial tracker for fun and paranoia
description: I wrote both a QFX parser and a naive Bayes classifier from scratch because I have stopped trusting third-party dependencies.
date: 2025-09-03
keywords: [python]
---
Sometimes I write software for fun (e.g. [SIC-1, a single-instruction (subleq) programming game](https://jaredkrinke.itch.io/sic-1)). Sometimes I write software because I have unreasonably specific requirements that existing tools can't satisfy (e.g. [luasmith, a 450 KB static site generator](https://github.com/jaredkrinke/luasmith)). Even though it's for my own benefit, I usually hope someone else will find it interesting or useful, so I share the code and maybe write about it.

**It's rare that I write (non-work-related) software, fully expecting no one else to ever see or use it,** but this is one of those times.

Read on to see how paranoia prompted me to write a financial transaction parser and ~~an AI~~ a statistical classifier from scratch, in Python ([yes, Python](../programming-languages/python-as-a-modern-basic.md)).

# Goal
**I want to know where my hard-earned money is going.**

# Background
For more years than I care to admit, my workflow involved manually reviewing transactions, mentally classifying them, and entering everything into an Excel spreadsheet. Eventually, as a software developer, I realized that **this is one of the few times in my life where I can actually apply my marketable skills directly to my daily existence**. Why did I not automate this sooner!?

# Implementation
What did I actually end up building?

* First, I needed a way to parse lists of transactions from my bank, credit cards, etc.
* Second, I wanted some sort of statistical classifier for transactions, for convenience
* Third, it needed to never leak my financial details

That last bullet is why I chose to write everything from scratch. **There are numerous tools for downloading and processing financial transactions, but I don't trust any of them**. There's no way I'd ever share my bank password with anything other than my bank's login form (in an up-to-date browser). Frankly, I'm surprised tools even exist that ask to store bank passwords--that's basically painting a huge target on your back for hackers. Users' financial credentials should be treated like radioactive waste!

In the end, I wrote (from scratch, using only Python's standard library--to avoid any credential-stealing package install scripts):

* A QFX/OFX parser
* A naive Bayes classifier
* A text interface that dumps everything into a comma-separated value (CSV) file (for Excel import)

## QFX Parser
QFX is a file format for financial transactions that is the same as OFX ([Open Financial Exchange](https://en.wikipedia.org/wiki/Open_Financial_Exchange)), but digitally signed by Intuit (cue eyeroll). The [ofxtools](https://pypi.org/project/ofxtools/) Python package can parse OFX files, but, as noted previously, I'm paranoid, so I decided to write my own parser from scratch.

Newer revisions of OFX are based on XML, but sadly I needed to be able to parse older, SGML-based versions of OFX. I have come to dislike SGML because, it seems, you can't just parse any old SGML file since **SGML doesn't always require closing tags**. People like to dunk on XML's verbose syntax, but SGML reveals an even worse world where you require the schema for each file in order to know whether or not closing tags are required. This might not be a big deal for an event-based parser, but I wanted a simpler programming interface, using XPath or something like it (because I'm lazy).

Aggravatingly, **OFX has a lot of "self-closing" tags**. In the end, I got a copy of the [OFX 1.6 schema (DTD)](https://github.com/libofx/libofx/blob/master/dtd/ofx160.dtd), parsed it, and produced a gigantic list of self-closing tags, then I wrote some code to insert the "missing" closing tags, so that I could parse the resulting file as XML, using Python's built-in `xml.etree.ElementTree` XML parser. By the way, SGML DTDs identify self-closing elements using this un-self-explanatory string: `- O` -- good luck searching for that!

Here's the fragile (i.e. it only works on this particular DTD) AWK script for finding self-closing tags:

```awk
/^<!ELEMENT [A-Z]+.*[ \t][Oo][ \t].*/ { printf "\"%s\", ", $2 }
```

The good news is, armed with "XML-ified" (all tags explicitly closed) QFX/OFX, Python can easily parse all the transactions (`<stmttrn>`'s, as they are called):

```python
def parseTransactions(str):
    # Remove header and convert to XML tree
    str = re.sub("^.*?<", "<", str, count=1, flags=re.DOTALL)
    str = sgml2xml(str)
    tree = ElementTree.fromstring(str)

    return [parseTransaction(transaction) for transaction in tree.findall(".//stmttrn")]
```

## Bayes classifier
Once I had a list of transactions, including their date, amount, and a terse description, I needed some way to classify transactions as e.g. "food", "gas", "entertainment", etc. Previously, I was just mentally assigning them to groups and typing a corresponding prefix into an Excel sheet. It was very tedious.

This time, **I'm automatically classifying transactions**, keeping a few aspects in mind:

* I wanted to be able to double-check classifications--and fix them, if needed
* I wanted the classifications to become more accurate over time

Armed with Wikipedia's description of a [naive Bayes classifier](https://en.wikipedia.org/wiki/Naive_Bayes_classifier), I was able to implement something that worked... at first. Other than an unfortunate typo in one equation, I spent most of my time debugging an issue where it kept misclassifying "food" and "gas" items.

### Where I buy food and gas
I feel comfortable disclosing that I often buy both food and gas from the same store (in separate transactions). The transactions' description fields look like this:

* Food transaction: `<store> <city> ...`
* Gas transaction: `<store> fuel <city> ...`.

As a human, the obvious rule for transactions at that store is "`fuel` implies 'gas', otherwise 'food'". But this is cutting-edge AI, so I'm not planning to write any prescriptive rules (also: [The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)).

### Multinomial naive Bayes
**I didn't realize the implications of it at the time**, but I initially wrote a regularized [multinomial naive Bayes model](https://en.wikipedia.org/wiki/Naive_Bayes_classifier#Multinomial_naive_Bayes) where the input is pairs of words and their frequencies (allegedly often used for document classification). For each pair, the probability that word implies a given class is computed, and then those probabilities are multiplied. I won't explain the "regularization" part because it's not relevant here.

**The problem is that the multinomial model doesn't explicitly account for "absent" words**. My training data included tons of instances of the store's name, but they were split between "food" and "gas" (more "food" than "gas"). The word "fuel" only appeared on "gas" training data, but its effect wasn't strong enough to overpower the "store name implies 'food'!" rule that the classifier learned.

(I might also argue that the real root of this issue was the "naive" part of "naive Bayes classifier" -- clearly, the rule I, as a human, devised shows that each word is *not* independent. But I wanted to stick with the simple and well-trodden path of a naive Bayes classifier, since, you know, it seemed popular.)

### Bernoulli naive Bayes
I had figured out the problem, but I didn't have a solution: how do I ensure that the *absence* of "fuel" implies "food" and the presence of "fuel" implies "gas"? Back on Wikipedia, I found the answer: **for short texts like this, don't worry about frequencies and instead compute a probability for the *presence or absence* of *every* word (absence is `1 - P(present)`)**. This is the [Bernoulli naive Bayes model](https://en.wikipedia.org/wiki/Naive_Bayes_classifier#Bernoulli_naive_Bayes), and it has worked great for my purposes because it provides a clear signal that "fuel" implies a "gas" classification and lack of "fuel" implies something else.

### Learning and persisting
With a working classifier, I needed to persist its "learnings" across runs. Python's large standard library is convenient (other than everything having weird names). **Python has a built-in [shelve](https://docs.python.org/3/library/shelve.html) library the can serialize and deserialize Python objects to/from a file**. This made persisting and updating my classifier trivial:

```python
import shelve
from classifier import Classifier, parse

with shelve.open("data") as shelf:
    classifier = shelf.get("classifier", Classifier())

    # Automaticaly classify transactions
    # Allow mis-classifications to be fixed

    # Persist classifier
    shelf["classifier"] = classifier
```

This part of the project took much *less* time than I anticipated. Thanks, Python!

## User interface
To keep things simple, I implemented a text-based interface, mostly based on Python's `prompt()` function. All the classified data was written out to a CSV file using Python's `csv.writer` class, for easy import into Excel (although, annoyingly, I had to deal with line ending nonsense--how is that not handled by default!?).

# Result
It took longer than I had expected (or hoped), but the final result has been great. I've mostly automated the tedious parts of tracking my expenses, while only trusting Python's standard library.

In summary, what did I learn?

* I prefer XML over SGML because XML is regular and generally has broader support
* The Bernoulli naive Bayes model works better than multinomial on very short text, especially when some words show up in multiple classes
* Python's `shelve` library is unbelievably convenient
* The best way to avoid wasting time choosing a GUI framework is to just punt and use a line-based text interface (like the good old days)

(But mostly this was an excuse to write a piece of software that actually improves my life--while also giving Python another try.)
