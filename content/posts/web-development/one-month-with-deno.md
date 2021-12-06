---
title: One month with Deno
description: I made the switch from Node to Deno recently. Here are my impressions after a month of using Deno.
date: 2021-12-05
keywords: [deno]
draft: true
---
# Background
After [souring on NPM](souring-on-npm.md) (due to unnecessarily huge dependency trees and security concerns), I decided to give [Deno](https://deno.land/) a try. Deno supports sand-boxing, TypeScript, and ES modules out of the box. Deno has a standard library, along with a simple and transparent module registry, and also comes with with handy tools for bundling and static analysis.

# What I've liked about Deno
## Sand-boxing
Deno disallows file system access, network access, and other privileges by default. You can provide fine-grained permissions on the command line, e.g. `--allow-read=file.txt` will let the script read `file.txt` in the current directory.

In an ideal world this wouldn't be necessary, but given that hackers have been targeting package registries such as NPM, this is reassuring. As an example, say that I want to find a quick tool to convert a file from one format to another. Here are some options for doing this:

* In the past, you might just try to find a tool for this purpose, download it, and run it.
  * Today, that would be a terrible idea because the tool runs as your user and could, in an extreme example, contain ransomware.
* In the recent past, you might do essentially the same as above, just running in NPM.
  * Again, very risky.
* Without Deno, you could run the tool in a container or VM.
  * This can be safe, but inconvenient.
* With Deno, you might just run the tool with no extra privileges.
  * If the tool just reads from standard input and writes to standard output, great!
  * If the tool has malware that tries to write to the file system or access the network, Deno will block it.
  * Of course, this isn't 100% safe ([Spectre](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability)) worked from inside the web browser's sand box), but it's much better than nothing!

Full details on Deno's permissions are [here](https://deno.land/manual@v1.16.4/getting_started/permissions).

## Audited standard library
One of the reasons that NPM projects tend to have gigantic dependency trees is that JavaScript (unlike most popular programming languages of today) doesn't really come with a standard library. This meant that common tasks such as parsing command line arguments are farmed out to dependencies, which then of course pull in whatever dependencies those authors felt like using, and so on until you have hundreds of dependencies (yes, that happened to me pretty quickly).

Deno brings JavaScript (and TypeScript) into the modern era by providing a standard library containing code that has been audited by the Deno authors. The library is not yet comprehensive and navigating the documentation is currently unpleasant, but having a set of trusted dependencies that you can rely on being maintained a few years down the line is a relief after coming from the Node/NPM ecosystem.

## Native TypeScript support
I like JavaScript for prototyping, but I like TypeScript and its tooling more. Honestly, if you know what you're doing, the compiler should be your friend, helpfully pointing out when you've made a typo or not quite lined up types across a function or module boundary. The problem with TypeScript for me has always been setting up a development environment and build scripts.

With Deno, you get the benefits of TypeScript without having to do any special setup. Just have your file end with `.ts`, and Deno will automatically type-check, compile, and run your code. You can even publish your module as TypeScript and Deno scripts can consume it without doing anything special.

If you're interested in TypeScript, but struggled with Node and NPM (and `ts-node`, etc.), give Deno a try!

## Web standard APIs
One of the dreams of Node is to write "isomorphic" code that runs both in Node and the browser. Deno brings this one step closer to reality by embracing browser APIs (e.g. [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)). This is helpful because you can learn about the browser while writing code for Deno and vice versa.

## Simple, transparent module registry

## Bundler/compiler, script installer

## Dependency inspector/library

## Built-in support for testing and code coverage