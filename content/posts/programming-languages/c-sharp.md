---
title: Testing out C# in 2022
description: In my quest to find a future-proof programming language, I'm investigating C#.
date: 2022-02-13
---
In [a previous article](future-proof-languages.md), I enumerated a bunch of popular programming languages and tried to quickly determine which ones seemed like they'd still be useful in another decade.

Now, I'm drilling into the most promising candidates. First up is C#.

**Update**: Note that this post is probably woefully out of date. I believe it is now possible to install a smaller toolchain, but I have yet to give it a try. If I do, I will come back and update this post (hopefully with a more positive experience!).

# Setting up a C# development environment
To my surprise, the [C# compiler](https://github.com/dotnet/roslyn) and [.NET runtime](https://github.com/dotnet/runtime) are both now open source (MIT license). Even more surprising, you can now apparently [deploy self-contained .NET executables to a Raspberry Pi](https://docs.microsoft.com/en-us/dotnet/iot/deployment).

C# is a great language and the .NET standard library is probably the most thoughtfully crafted standard library I've ever used. So is my search over? Is C# the answer?

First, I need to setup a C# development environment. After selecting the .NET runtime and SDK in the Visual Studio installer, I am appalled to see that it requires *5 GB* of disk space! There's probably a bunch of extraneous junk I don't need, but for comparison: Visual Studio Code is ~300 MB and Deno's TypeScript runtime is ~60 MB.

Even after installing all that software, I tried opening a C# project that I created with the `dotnet new` command line interface and it told me I needed to install 3.5 GB of software. I think this might be because ASP.NET Core wants to use an older version of .NET. Regardless, as far as I can tell, this is in addition to the 5 GB I already installed, so we're up to something like 8.5 GB just to run a "hello world" web server.

Fighting my instinct to run away from such a massive disk footprint, I went ahead and installed everything. At least if I test out C# and find it's not a good fit for me, I'll be able to easily recover a large amount of disk space without hesitation.

# Putting C# and .NET through its paces (or not)
As an initial test, I'd like to build a self-contained "hello world" web server, running on Windows (32-bit and 64-bit), Linux (x64 Debian and Alpine), and a Raspberry Pi.

Unfortunately, even with multiple .NET frameworks and SDKs installed and running Visual Studio, I was not able to successfully build a self-contained executable (it seemed to think I was using .NET Core, which I don't think I ever installed). After uninstalling the .NET 5.0 SDK, it seems that .NET 4.7.2 was also uninstalled, along with the .NET command line interface (`dotnet`). Reloading my test project prompted me to retarget to a previous .NET version, but then the project wouldn't build at all (even "framework-dependent"). Keep in mind this was a trivial "hello world" *command line* app, as in just `Console.WriteLine("Hello, world!")` inside a class's `Main` function.

# That's unfortunate...
Despite my concerns around C# being closed source, I found that a lot of the C# tooling is actually open source now. Unfortunately, it still seems to be inextricably tied to Visual Studio and its massive, opaque installation process.

I feel a bit bad about giving up so quickly, but my experience with C# thus far has been the polar opposite of "convenient". I want a programming language that is future-proof, convenient, and comfortable. C# is comfortable. I don't know if it's future-proof (or portable). But it is most definitely *not* convenient.
