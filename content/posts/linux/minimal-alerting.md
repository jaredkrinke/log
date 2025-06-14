---
title: Minimal alerting on Linux for hobby projects
description: Hacking together the simplest real-time notifications for hobby projects.
date: 2025-02-10
---
Occasionally, I have a need for real-time notifications for hobby projects. For example, one time I made a multi-player word scramble game for a game jam, and I wanted to be notified when people connected to the game (so that I could ensure there was at least one worthy opponent).

This post covers a (terrible) minimal scheme for setting up these notifications.

# Overview
At a high level, here are the things that need to be built:

1. Some way to detect relevant events
2. Some way to configure/filter events
3. Some way to "debounce" events (so I don't get a million notifications)
4. Some way to deliver the notification

The simplest approach is to just base everything on text files. Let's get started!

# Detecting relevant events
There's no shortcut here. Since I'd like everything to be text-based, I need to instrument my project with text logging. For the game example, I needed to log a message when someone connected to the game server.

For my current (unannounced) project, I'm using Python's built-in logging library, with an obvious string ("ERROR").

Redirecting to a file is sufficient:

```
python app.py 2>&1 |tee log.txt
```

 * `2>&1` ensures I get both "standard output" and "standard error"
 * `tee` writes output to a file ("log.txt" in this case) and also displays it (for convenience)

# Configuring/filtering events
Since everything is text, we can just match the live log file for a specific string using `tail -c 0 -f` (`-f` to follow the file and `-c 0` to only track new additions to the file) and `grep` (for string searching). Note that there is one trick: **grep needs to search one line at a time, as input arrives**, using the `--line-buffered` flag:

```
tail -c 0 -f log.txt |grep --line-buffered -i error > errors.txt
```

Note that I redirect the matches to "errors.txt".

# Debouncing events
Now comes the secret sauce.

One issue with alerts is that they often arrive in bursts. Rather than get hit with an avalanche of alerts, it's helpful to "debounce" alerts by limiting the alerts to, say, at most one every 15 minutes (or probably even less frequent).

My original solution to this relied on a bunch of custom code, but it turns out that you can build a really simple solution using `inotifywait` (from `inotify-tools` on Debian) and a trivial shell script. I named the script "ow.sh" (for "on write"):

```bash
#!/usr/bin/env bash

# ow.sh ("on write")
#
# This is a script to "debounce" commands that run when a file/directory is
# modified. The command is only run at most every TIMESPAN amount of time
# (TIMESPAN format is the same as the sleep command, e.g. 10s, 1m).

if [ $# -le 3 ]; then
	echo USAGE: $0 TARGET TIMESPAN COMMAND
	echo
	echo "Example: $0 foo.log 15m wall 'Alert!!!'"
	exit 1
fi

target=$1
delay=$2
shift 2

while inotifywait -qq "$target"; do
	"$@"
	sleep "$delay"
done
```

All this script does is wait for a file or directory to be modified, run the command, and then sleep the specified amount of time.

Example usage:

```bash
ow.sh errors.txt 1m echo "Oh no! An alert!"
```

This will:

* Watch "errors.txt"
* Debounce to at most every 1 minute (`1m`)
* And run the rest of the command line (`echo "Oh no! An alert!"`)

# Delivering notifications
The last step is to actually deliver notifications. How this is done depends heavily on the environment where the monitoring is happening and where the notifications need to be received.

## Local desktop
If monitoring is happening locally on a full-blown Linux desktop computer, this could be as simple as using `notify-send`:

```bash
ow.sh errors.txt 15m notify-send "Oh no, an alert!"
```

## Remote server
If monitoring is happening on a remote server, then it's mostly a matter of pulling in the remote output somehow. This can be done using SSH, `netcat`, etc.

The simplest approach I've found is to just tail the remote file locally. So I run the same command **on the server**, same as above:

```bash
tail -c 0 -f log.txt |grep --line-buffered -i error > errors.txt
```

And then **on my local desktop environment** I tail the remote file using SSH and write to a local file:

```bash
ssh server tail -c 0 -f /home/user/errors.txt > remote-errors.txt
```

Note that the `tail -c 0 -f /home/user/errors.txt` part runs on the server and the `> re.txt` part runs locally. Finally, I can use the debouncing script and `notify-send`, as before:

```bash
ow.sh remote-errors.txt 15m notify-send "Oh no, an alert!"
```

## Phone notifications
Phone notifications are where my knowledge runs out. I don't know the best way to send notifications to a phone, especially in a self-hosted way. In the past, I've relied on free tiers of paid services, but I'm hopeful I can eventually figure out something that is fully self-hosted (except for the app itself and associated notification infrastructure).

Here are a few ideas:

### IFTTT
(Edit: IFTTT no longer supports phone notifications via webhook on the free plan.)

### ntfy.sh
[ntfy.sh](https://ntfy.sh/) is an awesome service that allows sending phone notifications without even signing up for an account. Don't forget to donate!

### Matrix
I strongly suspect there is some way to use [Matrix](https://matrix.org/) and an associated phone app for notifications, but I haven't investigated this option yet.

# Recap
So there it is, alerting for hobby projects using only:

* Output redirection
* `tail`
* `grep`
* Bash
* `inotifywait`
* `sleep`
* SSH
* And `notify-send` or some phone equivalent
