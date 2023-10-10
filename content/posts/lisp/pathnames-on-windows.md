---
title: Creating Windows-style paths (backslash-separated) from pathnames in Common Lisp
description: I spent far too long trying to figure out how to do this, so I'm documenting it here, in case anyone else has trouble finding the answer.
date: 2023-10-04
keywords: [lisp]
---
Use `uiop/filesystem:native-namestring`. That's the answer.

The rest of this post is just additional context/whining.

# Background
Common Lisp was born in an era of surprising file system diversity. Nowadays, Windows is mocked for using something other than a forward slash as a path separator, but old Macs used colons and I've seen references to `>` being used on more exotic platforms.

Common Lisp handles this difference (and many other differences that never even occurred to me, such as types and versions) by abstracting everything into a platform-independent concept called a [pathname](http://www.ai.mit.edu/projects/iiip/doc/CommonLISP/HyperSpec/Body/glo_p.html#pathname).

## Example pathname
Here's how to create a (relative) pathname for "the directory 'foo', which is located in the parent directory":

```lisp
 (make-pathname :directory '(:relative :up "foo"))
```

## The problem
While working on a tiny Common Lisp project, my program needed to run a command in a subprocess (using `uiop:run-program`) with a directory passed as an argument. **I had assumed that `format`-ing a pathname on Windows would result in a Windows-compatible string** (or at least that `namestring` would), e.g. "..\\foo\\" for the example code above.

For reasons I won't yet understand, **this is *not* how things work on SBCL**! Instead, forward slashes are used: "../foo/". This works fine for some programs (including Git, apparently), but I doubt it's robust in general, considering some (mostly old) Windows programs use the forward slash to indicate command-line flags (instead of using a hyphen).

## But why?
I thought the point of pathnames was to support a platform-independent notion of a file path/name, so it's not clear to me why they don't `format` by default into a form that's compatible with the host environment.

Even more surprising, after spending way too much time browsing the [Common Lisp HyperSpec](http://www.ai.mit.edu/projects/iiip/doc/CommonLISP/HyperSpec/FrontMatter/index.html), I couldn't even find anything in Common Lisp's standard library for this scenario. Why can I create and manipulate pathnames but not actually pass them to the operating system? That's a serious question--if you know the answer, please tell me!

# UIOP to the rescue
Given that (ANSI) Common Lisp hasn't been updated since 1994, I don't see this situation changing, but the good news is that Common Lisp implementations fill in this gap and [UIOP](https://asdf.common-lisp.dev/uiop.html) abstracts away the implementations' different approaches/naming schemes.

So that leads us to the solution: `uiop/filesystem:native-namestring`. Example:

```lisp
 (uiop/filesystem:native-namestring (make-pathname :directory '(:relative :up "foo")))
```

Result:

```
"..\\foo\\"
```

Problem solved!

The only lingering question for me is: why is `native-namestring` in `uiop/filesystem` instead of `uiop/pathname`?