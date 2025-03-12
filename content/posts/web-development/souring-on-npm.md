---
title: Why I'm starting to sour on Node and NPM
description: Node made programming fun for me again, but security concerns might drive me away.
date: 2021-11-05
keywords: [deno,security]
---
# Node
When I first heard about [Node](https://nodejs.org/en/) back in 2013, I thought it was a silly idea.

> Build a performant web server *based on JavaScript*? Just use C++ instead of throwing all your performance gains at an interpreted language!

Of course, my initial reaction ignored some pertinent factors:

* JavaScript is already used on clients (web browsers), so sharing code between client and server would be easier
* There are *a lot* of JavaScript developers out there (because it's basically the only native option for scripting on the web)
* JavaScript is actually surprisingly fast because the demand for fast web browsers is huge

After giving it a try, I found that Node, and the [NPM](https://www.npmjs.com/) ecosystem, were pretty enjoyable to work with. And things only improved from there, not least because most of the annoying problems of JavaScript had already been solved in one way or another (NPM for managing dependencies, TypeScript for statically checking types, `async` and `await` for asynchronous programming, etc.).

# Fast-forward to today
Recently, I've been happily building my static site generator on top of [Metalsmith](https://metalsmith.io/), although one thing always troubled me. Every time I saw a problem that needed solving, I checked NPM to see if someone had already solved that problem with an (MIT-licensed) package--usually someone had.

But when I went to install that package, NPM would happily report that it had downloaded quite a few transitive dependencies from some large pool of contributors.

## Example: yargs
For example, I wanted to parse command line arguments, and I had noticed that [yargs](https://www.npmjs.com/package/yargs) was a popular package, so I installed it. According to the previously-linked NPM page, it has 7 dependencies. That's more than I'd like, but let's give it a try:

```txt
$ npm install yargs

+ yargs@17.2.1
added 16 packages from 10 contributors and audited 16 packages in 1.326s

2 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Wait, *sixteen* packages? Apparently NPM only counts direct dependencies on package pages. What all got installed?

```txt
$ npm ls
...
`-- yargs@17.2.1
  +-- cliui@7.0.4
  | +-- string-width@4.2.3 deduped
  | +-- strip-ansi@6.0.1
  | | `-- ansi-regex@5.0.1
  | `-- wrap-ansi@7.0.0
  |   +-- ansi-styles@4.3.0
  |   | `-- color-convert@2.0.1
  |   |   `-- color-name@1.1.4
  |   +-- string-width@4.2.3 deduped
  |   `-- strip-ansi@6.0.1 deduped
  +-- escalade@3.1.1
  +-- get-caller-file@2.0.5
  +-- require-directory@2.1.1
  +-- string-width@4.2.3
  | +-- emoji-regex@8.0.0
  | +-- is-fullwidth-code-point@3.0.0
  | `-- strip-ansi@6.0.1 deduped
  +-- y18n@5.0.8
  `-- yargs-parser@20.2.9
```

What's `escalade`? Why do I need `emoji-regex` if I'm not planning on using emoji? What do the 18 missing characters in `y18n` stand for?

Well, I'd better get busy reviewing all that JavaScript code. How much code are we talking?

```txt
$ find -name *.js|xargs wc -l
    10 ./node_modules/ansi-regex/index.js
   163 ./node_modules/ansi-styles/index.js
   287 ./node_modules/cliui/build/lib/index.js
    27 ./node_modules/cliui/build/lib/string-utils.js
   839 ./node_modules/color-convert/conversions.js
    81 ./node_modules/color-convert/index.js
    97 ./node_modules/color-convert/route.js
   152 ./node_modules/color-name/index.js
     6 ./node_modules/emoji-regex/es2015/index.js
     6 ./node_modules/emoji-regex/es2015/text.js
     6 ./node_modules/emoji-regex/index.js
     6 ./node_modules/emoji-regex/text.js
    22 ./node_modules/escalade/dist/index.js
    18 ./node_modules/escalade/sync/index.js
    21 ./node_modules/get-caller-file/index.js
    50 ./node_modules/is-fullwidth-code-point/index.js
    86 ./node_modules/require-directory/index.js
    47 ./node_modules/string-width/index.js
     4 ./node_modules/strip-ansi/index.js
   216 ./node_modules/wrap-ansi/index.js
     6 ./node_modules/y18n/build/lib/cjs.js
   174 ./node_modules/y18n/build/lib/index.js
    19 ./node_modules/y18n/build/lib/platform-shims/node.js
    62 ./node_modules/yargs/build/lib/argsert.js
   432 ./node_modules/yargs/build/lib/command.js
    48 ./node_modules/yargs/build/lib/completion-templates.js
   200 ./node_modules/yargs/build/lib/completion.js
    91 ./node_modules/yargs/build/lib/middleware.js
    32 ./node_modules/yargs/build/lib/parse-command.js
     9 ./node_modules/yargs/build/lib/typings/common-types.js
     1 ./node_modules/yargs/build/lib/typings/yargs-parser-types.js
   568 ./node_modules/yargs/build/lib/usage.js
    59 ./node_modules/yargs/build/lib/utils/apply-extends.js
     5 ./node_modules/yargs/build/lib/utils/is-promise.js
    34 ./node_modules/yargs/build/lib/utils/levenshtein.js
    17 ./node_modules/yargs/build/lib/utils/maybe-async-result.js
    10 ./node_modules/yargs/build/lib/utils/obj-filter.js
    17 ./node_modules/yargs/build/lib/utils/process-argv.js
    12 ./node_modules/yargs/build/lib/utils/set-blocking.js
    10 ./node_modules/yargs/build/lib/utils/which-module.js
   305 ./node_modules/yargs/build/lib/validation.js
  1483 ./node_modules/yargs/build/lib/yargs-factory.js
     7 ./node_modules/yargs/build/lib/yerror.js
    14 ./node_modules/yargs/helpers/index.js
    29 ./node_modules/yargs-parser/browser.js
    59 ./node_modules/yargs-parser/build/lib/index.js
    65 ./node_modules/yargs-parser/build/lib/string-utils.js
    40 ./node_modules/yargs-parser/build/lib/tokenize-arg-string.js
    12 ./node_modules/yargs-parser/build/lib/yargs-parser-types.js
  1037 ./node_modules/yargs-parser/build/lib/yargs-parser.js
  7001 total
```

Wow. **Roughly 7,000 lines of code just for parsing arguments**. And it could be worse!

## Malware
As I read in [an article](https://therecord.media/malware-found-in-coa-and-rc-two-npm-packages-with-23m-weekly-downloads/) today (and similar articles in the recent past), NPM has the questionable default behavior of allowing packages to run arbitrary scripts at install time. Ideally, this would be for life cycle management operations such as building caches or compiling native code, but this is also an easy target for hackers to hijack a commonly-installed package's maintainer's account and push out an update with malware that is triggered on install.

Obviously, there's no perfect solution for NPM to stop such attacks, but right now the default behavior of NPM (no version specification required, running scripts on install, not making it easy to inspect the contents of a package before downloading) means that if you want to install a package that solves a problem, now you need to:

* Vet the maintainers of the package *and all its dependencies*
* Install the package with `--ignore-scripts` to download the code
* Inspect the code of the package *and all dependencies* for stowaway malware
* Use `package-lock.json` in the project to keep versions identical
  * And also pin that version when you use the same package elsewhere

And, of course, this should ideally be done with each update to any of the packages, especially when security updates are made.

# Now what?
At this point, you should be able to picture the joy of programming in 2021 rapidly fading from my face. What can be done about this?

I'm not holding out hope for NPM to make a breaking change that turns install scripts from *opt out* to *opt in* (not that this would solve the problem anyway, although I'd consider it a welcome concession to security). I'm also not expecting all the packages on NPM to start weeding out unnecessary dependencies just to make my life easier (although kudos to the author of Chokidar for [reducing that package's dependencies down to just the essentials](https://paulmillr.com/posts/chokidar-3-save-32tb-of-traffic/)).

Honestly, I think the solution is probably going to be for me to move to a more security-focused ecosystem.

## Deno
An alternative (an arguably a successor) to Node is [Deno](https://deno.land/) (initiated by the same person who created Node, Ryan Dahl). Deno appears to be aimed at all of the problems I'm running into with Node/NPM (copy-pasted from the Deno home page):

* Secure by default. No file, network, or environment access, unless explicitly enabled.
* Supports TypeScript out of the box.
* Ships only a single executable file.
* Has built-in utilities like a dependency inspector (deno info) and a code formatter (deno fmt).
* Has a set of reviewed (audited) standard modules that are guaranteed to work with Deno: deno.land/std

I'm especially excited about how granular the [permissions flags](https://deno.land/manual@v1.15.3/getting_started/permissions) are, for example:

> `--allow-read=<allow-read>` Allow file system read access. You can specify an optional, comma-separated list of directories or files to provide an allow-list of allowed file system access.

Deno also has support for [building a self-contained executable](https://deno.land/manual@v1.15.3/tools/compiler), which would be handy for conveniently distributing binaries (although such binaries would have to be trusted by the people downloading them for now).

# What does this mean for my current project?
I was getting close to publishing my first sizable package to NPM, possibly even today, but now that I've stepped back and let the reality of its long list of dependencies sink in, I'm not sure if publishing my project is even a good idea. I originally picked up Node and Metalsmith to speed up the development process (with no plan to eventually release the tool), but along the way I thought it might be a useful thing to share.

I'll think it over a bit more and decide if I want to be a hypocrite and push out a package with 18 direct dependencies and (ahem) *200+ transitive dependencies*, or if I should start over (or abandon the idea of releasing the tool entirely).