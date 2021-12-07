---
title: One month with Deno (part 2)
description: I made the switch from Node to Deno recently. Here are the problems with Deno I've encountered.
date: 2021-12-07
keywords: [deno]
draft: true
---
In [part 1](one-month-with-deno.md), I gushed over Deno's benefits, including sand-boxing, native TypeScript support, a simple module registry, and more. Here's part 2 (which paints a less rosy picture).

# Problems with Deno
Using Deno has come with some significant challenges. Here are the top issues I've faced using Deno for the last month.

## Existing TypeScript modules don't work
Wait, I thought Deno had native TypeScript support. What do you mean TypeScript modules don't work?

What I mean is that most TypeScript code that wasn't written specifically for Deno will not run unmodified in Deno. This is an unfortunate situation because it means that leveraging existing libraries written in TypeScript is nontrivial. The problem arises from two incompatible stances:

* Deno imports file by full name (or URL), with [no magical resolution](https://deno.land/manual@v1.16.4/typescript/faqs), so file extensions are required
* TypeScript [doesn't change import specifiers](https://github.com/Microsoft/TypeScript/issues/27481), so it insists that file extensions be omitted (so the runtime can find and load the resulting `.js` files)

Regardless of which stance is more righteous, the fact is that existing TypeScript code doesn't work in Deno unless you do work (e.g. adding `.ts` to imports or creating an [import map](https://deno.land/manual@v1.16.4/linking_to_external_code/import_maps)). There isn't even any agreement on the best way to work around this annoyance. The trend to Deno-ify TypeScript modules from NPMand publish them on deno.land/x is a symptom of this disaster.

It's a bit sad because, other than this issue, Deno provides the best tooling for TypeScript I've encountered.

## Node packages generally require third party code
Ok, so non-Deno TypeScript libraries are out, what about non-Node-specific JavaScript packages on NPM?

First of all, Deno only support ES modules (instead of CommonJS), so first you'll need to restrict yourself to packages that publish an ES module.

Additionally, if you're planning to publish a Deno module you don't have the luxury of using Deno's [Node compatibility mode](https://deno.land/manual@v1.16.4/npm_nodejs/compatibility_mode) or using import maps to support dependencies, so you're once again stuck trying to bridge the gap between Deno's "no magic" module resolution algorithm and Node's "nothing *but* magic" approach.

Once again, I didn't see a great option for handling this, especially if you want to leverage [Definitely Typed](https://definitelytyped.org/) declarations. I won't describe the approach I ended up using to work around this problem because it is, frankly, a terrible hack.

## Standard library licenses
Deno has a standard library! Hooray! Now we can all use the code in whatever project we want as long as we include Deno's copyright notice...

...except that the library wasn't entirely written by the Deno authors, so many of the modules have different copyright notices (e.g. [std/encoding/yaml.ts](https://deno.land/std@0.117.0/encoding/yaml.ts)).

This means that you have to track down all of your dependencies and diligently duplicate their copyright notices in tools created with `deno compile`. At least Deno restricts contributions to the permissive MIT, BSD, and Apache licenses!

## Dependency Hell reimagined
## Bundling only emits JavaScript
## Long command lines with no task runner
## The uglifier, er "formatter"
## Bugs, bugs, bugs