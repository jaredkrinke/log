---
title: One month with Deno (part 2)
description: I made the switch from Node to Deno recently. Here are the problems with Deno I've encountered.
date: 2021-12-13
keywords: [deno]
---
In [part 1](one-month-with-deno.md), I gushed over Deno's benefits, including sand-boxing, native TypeScript support, a simple module registry, and more. Here's part 2 (which paints a less rosy picture).

# Problems with Deno
Using Deno has come with some significant challenges. Here are the top issues I've faced using Deno for the last month. The good news is that people are working on addressing most of these.

## Existing TypeScript modules don't work
Wait, I thought Deno had native TypeScript support. What do you mean TypeScript modules don't work?

What I mean is that most TypeScript code that wasn't written specifically for Deno will (generally) not run unmodified in Deno. This is an unfortunate situation because it means that leveraging existing libraries written in TypeScript is nontrivial. The problem arises from two incompatible stances:

* Deno imports modules by full name (or URL), with [no magical resolution](https://deno.land/manual@v1.16.4/typescript/faqs), so file extensions (or special HTTP headers) are required
* TypeScript [doesn't change import specifiers](https://github.com/Microsoft/TypeScript/issues/27481), so it insists (or rather it used to insist) that file extensions be omitted (so the runtime can find and load the resulting `.js` files)

Regardless of which stance is more righteous, the fact is that existing TypeScript code doesn't work in Deno unless you do work (e.g. adding `.ts` to imports or creating an [import map](https://deno.land/manual@v1.16.4/linking_to_external_code/import_maps)). There isn't even any agreement on the best way to work around this annoyance. The trend to Deno-ify TypeScript modules from NPM and publish them on deno.land/x is not encouraging.

It's a bit sad because, other than this issue, Deno provides the best tooling for TypeScript I've encountered.

## Node packages generally require third party code
Ok, so non-Deno TypeScript libraries are out, what about non-Node-specific JavaScript packages on NPM?

First of all, Deno only supports ES modules (instead of CommonJS), so only packages that are shipped as modules could possibly work unmodified.

Additionally, if you're planning to publish a Deno module you don't have the luxury of using Deno's [Node compatibility mode](https://deno.land/manual@v1.16.4/npm_nodejs/compatibility_mode) or using import maps to support dependencies, so you're stuck trying to bridge the gap between Deno's "no magic" module resolution algorithm and Node's "nothing *but* magic" approach.

Once again, I didn't see a great option for handling this, especially if you want to leverage [Definitely Typed](https://definitelytyped.org/) declarations. The Deno documentation recommends using third party content delivery services, but I currently have no way to vet these CDNs.

I won't describe the approach I ended up using to work around this problem because it is, frankly, a terrible (and manual) hack.

## Standard library licenses aren't uniform
Deno has a standard library! Hooray! Now we can all use the code in whatever project we want as long as we include Deno's copyright notice...

...except that the library wasn't entirely written by the Deno authors, so many of the modules have different copyright notices (e.g. [std/encoding/yaml.ts](https://deno.land/std@0.117.0/encoding/yaml.ts)).

This means that you have to track down all of your dependencies and diligently duplicate their copyright notices in tools created with `deno compile`. At least Deno restricts contributions to the permissive MIT, BSD, and Apache licenses!

## WebAssembly isn't seamless
Deno currently loads WebAssembly using `fetch` (just like in the browser). This sounds like a great idea except for the fact that it requires network and/or file system access. Unfortunately, this means that if you want to use WebAssembly in a library, you have two unappealing options:

* Tell consumers that they need to pass `--allow-read` or `--allow-net` in when using your library (negating some of the security benefits of Deno)
* Or Base64-encode your module into an obnoxiously huge TypeScript file

Deno used to support statically importing WebAssembly (without requiring additional privileges), but that support was removed on the assumption that a forthcoming web standard will eventually solve this problem. Last I read, this is still an open problem.

## Bundling only emits JavaScript
Deno [comes with a simple bundler](https://deno.land/manual@v1.16.4/tools/bundler)! Unfortunately, it only emits JavaScript, so you can't use it for packaging a TypeScript module into a single file (because you'd lose all your type information).

I have yet to find a bundler for TypeScript. I really hope I won't have to write one myself!

## There's no standard way to specify long command lines
I applaud Deno for forcing users to provide permissions on the command line, but those command lines can get pretty long. Additionally, Deno seems to be allergic to configuration files, so instead of putting commands into a configuration file, we just have no standard, cross-platform way to specify how to run code.

## The formatter produces ugly code
I like the idea of Deno having a built-in formatter, but I don't actually like the output. For example, the default is to use 2 spaces for indentation. I don't know anyone (outside of Deno) who prefers 2 spaces over 4 spaces. I find it makes code harder to read. Additionally, the formatter inserts spaces and newlines in surprising places (again, making the code harder to read).

I appreciate that automatic code formatting is a difficult problem and that style is usually personal preference, but this is the first formatter I've seen that I don't like.

## Bugs, bugs, bugs
Deno is a remarkable project and I really enjoy it, but I have encountered several critical bugs, just in my first month of use. My favorite two examples:

* *Correct* code *failing* type checking (due to a caching issue)
* *Incorrect* code *successfully* type checking (due to type checking being unexpectedly skipped)

# So will I keep using Deno?
More than once, I've wondered if working around the limitations of Deno is costing me more time than I'm saving by using Deno. It very well might.

In the end, however, I plan to continue using Deno because it provides the best TypeScript runtime I've seen, and it's features (and most of its goals) align with my needs and preferences.