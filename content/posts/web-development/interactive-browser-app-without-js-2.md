---
title: Building a browser-based app without JavaScript, part 2
description: Yes, you can build real-time, interactive browser-based apps without JavaScript. But I wouldn't suggest using this particular approach.
date: 2023-10-26
---
In the [last post](interactive-browser-app-without-js.md), I brainstormed ideas for creating a real-time, interactive browser-based app without using JavaScript (or WebAssembly).

In this post, I'll describe a proof-of-concept that I created for [Lisp Game Jam (Autumn 2023)](https://itch.io/jam/autumn-lisp-game-jam-2023).

**You can play the game here: [https://foo.schemescape.com/](https://foo.schemescape.com/)**

Source code is here: [https://github.com/jaredkrinke/cl-stuff/tree/main/foolander](https://github.com/jaredkrinke/cl-stuff/tree/main/foolander)

# Recap
The most difficult adjective to support without JavaScript is "real-time". In some cases, [CSS itself might be enough](https://speckyboy.com/pure-css-games/) (although I truly hope CSS is not bloated enough for implementing a snake game!).

If you don't need real-time feedback, you can probably get by with regular [HTML forms](https://developer.mozilla.org/en-US/docs/Learn/Forms/Your_first_form), [long-polling](https://en.wikipedia.org/wiki/Push_technology#Long_polling), or even [meta refresh](https://en.wikipedia.org/wiki/Meta_refresh). But if you need immediate feedback for both user input and server state updates, avoiding JavaScript can be tricky.

Here's what I came up with:

* [HTTP 1.1 chunked transfer encoding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding), for progressively appending HTML/CSS
* HTML forms (inside an `<iframe>`), for providing input (without reloading the main page)

I don't know if this is the best approach (in fact, I doubt it), but it is *an* approach that is "good enough" for my terrible game.

# Architecture
The architecture for my game is pretty simple:

* There's a table of cells for the game board, each addressable via CSS (I used a class, but probably should have used an id)
* This is all pushed as an initial chunk, with the stream kept open (and without closing the `<body>` and `<html>` tags)
* As the game runs, I modify the color of the table cells by pushing additional CSS rules in additional `<style>` chunks
* I also "overwrite" some HTML by defaulting one class to not being shown, with a [`:last-of-type`](https://developer.mozilla.org/en-US/docs/Web/CSS/:last-of-type) override to show the most recently written element only
* Input is handled via HTTP post (with a "session id" string) using an HTML form inside an `<iframe>` (relegating the "entire page reloads" problem to a frame)
* The form's submission button has an "[access key](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey)" for keyboard-only control--this could be useful for games with multiple buttons, although it requires holding down modifier keys (which vary widely based on operating system and browser)

# Examples
## Table
```html
<table><tbody>
<tr>
<td class="s29_0">&nbsp;</td> <!-- Row 29, column 0 -->
<td class="s29_1">&nbsp;</td> <!-- Row 29, column 1 -->
<td class="s29_2">&nbsp;</td> <!-- etc. -->
<td class="s29_3">&nbsp;</td>
...
</tr>
</tbody></table>
```

## Game board visual updates
```html
<style>.s9_12 { background-color: yellow }</style> <!-- Change row 9, col 12 to yellow -->
<style>.s6_12 { background-color: blue }</style>
```

Note: I should have used ids instead of classes (since they're unique elements). Also, I could have consolidated multiple same-frame updates into a single `<style>` tag.

## "Overwriting" the last bit of HTML (the score)
```css
.score { display: none }
.score:last-of-type { display: block }
```

```html
<p class="score">Score: 0</p> <!-- Initial score -->
...
<p class="score">Score: 1</p> <!-- Later, this score is shown instead -->
```

## Input frame
My game only uses a single button, but multiple buttons are easy to support using distinct forms with hidden inputs. In fact, I used multiple buttons until I decided to simplify at the very end.

Parent page:

```html
<iframe src="controls?id=cbecixentpsc"></iframe>
```

Frame body:

```html
<form action="action" method="post">
<!-- This id links input to an active instance of the game -->
<input type="hidden" name="id" cbecixentpsc="" value="cbecixentpsc">

<!-- This was for supporting multiple buttons -->
<input type="hidden" name="action" value="clockwise">

<!-- The actual submit button that is shown in-game -->
<input type="submit" value="↻" accesskey="e">
</form>
```

The `id` parameter is tracked on the server to link input to a particular HTTP request (which runs an entire round of the game).

# Analysis
Give the game a try! If your latency isn't too high, then it's somewhat playable.

Of course, I wouldn't recommend this approach because it has a number of drawbacks:

* As noted, latency is a problem because *every user input event* is a new HTTP post -- this is a nontrivial amount of overhead
* Also, successive button presses are slow because the entire input frame has to be reloaded
* The server can't handle too many concurrent players because each game holds an HTTP request open for the entire length of the game (I'm using a web server that dedicates a thread to each request, although many web servers don't do this anymore)
* Updating the game board requires evaluating CSS rules, which is obviously less efficient than just drawing, say, a canvas square
* "Normal" keyboard input doesn't really work since HTML can only use access keys (which require holding down some combination of Ctrl/Shift/Alt/Meta/Command)

But it *does* (mostly) work! And it gave me an excuse to mess around with Lisp and participate in a game jam.

Overall, I'm calling this a success since it answered my original question... even if it's not a technique I'd recommend.

# Addendum
## Achievement *not* unlocked
Unfortunately, I wasn't able to achieve one secret goal I had in mind: getting the game to run in a minimalist, no-JavaScript browser, like [Dillo](https://dillo.org/). Apparently Dillo doesn't support inline frames, so the control scheme doesn't really work (unless you have another window open to the frame). Additionally, Dillo didn't seem to like my "streaming CSS" approach--the entire game board just remained its initial blue color.

Oh well. At least I tried.

## nginx
In order to support HTTPS using nginx, I had to tweak a couple of nginx settings. I'm noting them down here for reference:

```
proxy_http_version 1.1; # nginx default is 1.0, but chunking is a 1.1 feature
proxy_buffering off; # Necessary to ensure chunks are forwarded as soon as received
gzip off; # This is actually the default, chunking only worked with gzip disabled
```
