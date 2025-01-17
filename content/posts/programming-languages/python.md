---
title: First impressions of Python
description: Next on my list of programming languages to investigate is Python.
date: 2022-02-21
keywords: [python]
---
In [a previous article](future-proof-languages.md), I enumerated a bunch of popular programming languages and tried to quickly determine which ones seemed like they'd still be useful in another decade.

Now, I'm drilling more deeply into Python.

# Setting up a Python development environment
Python is consistently one of the most popular programming languages, but I've mostly avoided it. What am I missing?

While setting up Python, I noticed that typing "python" into my Windows command prompt launches the Microsoft Store app (compliments of `%LocalAppData%\Microsoft\WindowsApps\python.exe`). I'll give the installer a try since it's a surprisingly reasonable ~100 MB download. Apparently, Microsoft decided to [insert this Python shim into Windows itself](https://devblogs.microsoft.com/python/python-in-the-windows-10-may-2019-update/) just to make it easier for people to find Python. Interesting.

# Going through the tutorial
While going through [Python's official tutorial](https://docs.python.org/3/tutorial/), there are some things I don't like:

Syntax gripes:

* There are `else` blocks on *loops*
* `pass` is needed to denote empty blocks
* There are abbreviations that are easy to forget, such as `elif`
* `*`, `**`, and `/` are overused in Python's syntax
* The syntax for both tuples and sets tries to be pretty, but just ends up creating weird edge cases, such as `item,` (requiring a trailing comma) for a single-item tuple and `{}` being an empty dictionary and not an empty set
* "f-strings" can't be arbitrarily nested (i.e. you can't use quotation marks inside an f-string that is delimited by quotation marks)

Module woes:

* The module loading system seems needlessly complicated (`__init__.py`, `__all__`, `import *`, etc.)
  * It even *prepends* the main module's path to the search path, so local modules are loaded in preference to standard library modules of the same name (pro tip: never create a file named `random.py`)
* The default global scope has too many members
* Virtual environments are *definitely* not my preferred solution to managing conflicting dependencies

Scoping complaints:

* Variables introduced in a `for` loop go into the enclosing scope (making it easy to accidentally change variables in the enclosing scope)
* `global` seems dangerous

# Overall first impressions
Here are my impressions after going through the Python tutorial and playing with Python for a few days:

* I don't like the syntax, but I also don't dislike it as much as I expected to
* There are some handy syntactical conveniences (e.g. list comprehensions)
* I am strongly in favor of its "batteries included" approach that yields a robust standard library (it even has SQLite out of the box!)

Ultimately, Python's biggest advantages are its standard library and its popularity.

# Next steps
Now that I've read up on Python and written some basic scripts (mostly to solve [Project Euler](https://projecteuler.net/) problems), I'm going to play around with machine learning using Python and NumPy.
