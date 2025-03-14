---
title: One month with Deno (the good parts)
description: I made the switch from Node to Deno recently. Here's what I've liked after a month of using Deno.
date: 2021-12-06
keywords: [deno,security]
---
# Background
After [souring on NPM](souring-on-npm.md) (due to unnecessarily huge dependency trees and security concerns), I decided to give [Deno](https://deno.land/) a try. Deno supports sand-boxing, TypeScript, and ES modules out of the box. Deno has a standard library, along with a simple and transparent module registry, and also comes with with handy tools for bundling and static analysis.

# What I've liked about Deno
## Sand-boxing
Deno disallows file system access, network access, and other privileges by default. You can provide fine-grained permissions on the command line, e.g. `--allow-read=file.txt` will let the script read `file.txt` in the current directory.

In an ideal world this wouldn't be necessary, but given that hackers have been targeting package registries such as NPM, this is a step in the right direction. As an example, say that I want to find a quick tool to convert a file from one format to another. Here are some options for doing this:

* In the past, you might just try to find a tool for this purpose, download it, and run it.
  * Today, that would be a terrible idea because the tool runs as your user and could, in an extreme example, contain ransomware.
* In the recent past, you might do essentially the same as above, just downloading from NPM and running in Node.
  * Again, very risky.
* Without Deno, you could run the tool in a container or VM (or restricted user).
  * This can be safe, but inconvenient.
* With Deno, you might just run the tool with no extra privileges.
  * If the tool just reads from standard input and writes to standard output, great!
  * If the tool has malware that tries to write to the file system or access the network, Deno will block it.
  * Of course, this isn't 100% safe ([Spectre](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability)) worked from inside the web browser's sand box, after all), but it's much better than nothing!)

Full details on Deno's permissions are [here](https://deno.land/manual@v1.16.4/getting_started/permissions).

## Audited standard library
One of the reasons that NPM projects tend to have gigantic dependency trees is that JavaScript (unlike most popular programming languages of today) doesn't really come with a standard library. This meant that common tasks such as parsing command line arguments are farmed out to dependencies, which then of course pull in whatever dependencies those authors felt like using, and so on until you have hundreds of dependencies (yes, that happened to me pretty quickly).

Deno brings JavaScript (and TypeScript) into the modern era by [providing a standard library](https://deno.land/std@0.117.0) containing code that has been audited by the Deno authors. The library is not yet comprehensive and navigating the documentation is currently unpleasant, but having a set of trusted dependencies that will be maintained by the Deno authors is a relief after coming from the Node/NPM ecosystem.

## Native TypeScript support
I like JavaScript for prototyping, but I like TypeScript and its tooling more. Honestly, if you know what you're doing, the compiler should be your friend, helpfully pointing out when you've made a typo or not quite lined up types across a function or module boundary. The problem with TypeScript for me has always been setting up a development environment and build scripts.

With Deno, you get the benefits of TypeScript without having to do any special setup. Just use the `.ts` file extension, and Deno will automatically type-check, compile, and run your code. You can even publish your module as TypeScript and Deno scripts can consume it without doing anything special.

If you're interested in TypeScript, but struggled with Node and NPM (and `ts-node`, etc.), give Deno a try!

## Web standard APIs
One of the dreams of Node was to write "isomorphic" code that runs both in Node and the browser. Deno brings this one step closer to reality by embracing browser APIs (e.g. [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)). This is helpful because you can learn about the browser while writing code for Deno and vice versa.

## Simple, transparent module registry
A major complaint I have with most package managers and package registries is that they don't make it easy to see what is inside a package before downloading it. NPM is especially bad here because, by default, installing a package can run arbitrary scripts, so you might get malware just by trying to check and see if a package contains malware (this is your reminder to enable NPM's [ignore-scripts](https://docs.npmjs.com/cli/v7/commands/npm-install#ignore-scripts) setting).

Deno's module registry is [https://deno.land/x/](https://deno.land/x/) and all it does is mirror code from GitHub when tags are pushed. This means that you can browse the *exact* code you'll be downloading prior to actually downloading anything. It also automatically generates documentation from JSDoc comments and helpfully displays the list of (static) external dependencies for a given file.

I do have concerns about tying the module registry so intimately to GitHub, but for now I just like having a transparent registry that takes the guesswork out of auditing dependencies.

## Bundler/compiler, script installer
One theme with Deno is that it has a focus on the entire development experience. Sometimes this is called having "batteries included". For example, one common problem with scripting languages is that sharing a tool usually requires also sharing the entire runtime environment. E.g. if I want to run a Python script, I need a Python environment (in Python's case, this is probably even true if I already have Python installed, thanks to frequent breaking changes).

Deno simplifies this by including a [built in bundler and compiler](https://deno.land/manual@v1.16.4/tools/compiler) that packages up a script, its dependencies, and the Deno runtime into a single (~30 MB) download. Obviously, this isn't efficient if you're using a lot of Deno tools, but it's indispensible if you don't care about Deno and just want to use one specific Deno-based tool.

For a more efficient option, Deno also includes a [script installer](https://deno.land/manual@v1.16.4/tools/script_installer) that allows you to just download and install a specific script (and its dependencies), relying on the version of Deno you already have.

Together, these mean that if someone wants to use your tool, they have two great options (both of which can be supported without third party tools/plugins):

1. Just download the self-contained executable and run it,
1. Or just install your script with `deno install` and run it

## Built-in support for testing and code coverage
While [Deno's testing framework](https://deno.land/manual@v1.16.4/testing) isn't as mature or featureful as some of the Node testing frameworks (although [integrations with other libraries exist](https://deno.land/manual@v1.16.4/testing#integration-with-testing-libraries)), there is one advantage: there's no install or setup required (no more fiddling with dependencies or test scripts!).

For example, if I want to write some quick unit tests for `foo.ts`, I can just create `foo.test.ts`, write some tests (see the previous link for example code), and then run `deno test`. It will find my test file, run the tests, and print out the results.

I love it when tools just do what I want without any effort!

# But it's not all good...
Although I've found a lot to like about Deno, not everything has been great (or even good... or even acceptable). Stay tuned for part 2: the gripe session.
