---
title: NPM requires X11 on Debian. Wait, what?
description: Here's a rant about that time I tried to install NPM on Debian.
date: 2021-11-04
---
# Debian
[Debian](https://www.debian.org/) has been my preferred Linux distribution for a long time (longer than [Ubuntu](https://ubuntu.com/) has even existed).

The main reason I like Debian is that its [apt](https://manpages.debian.org/buster/apt/apt.8.en.html) package manager has been the most reliable package manager I've ever dealt with, especially when it comes to removing and/or upgrading packages.

# NPM
Since I've been playing around with Node and NPM on Windows, I decided I should see if one of my tools works on Linux. Fortunately, I was on Debian 11, which ships with a not-*completely*-out-of-date Node v12 runtime.

Great, I'll just run `sudo apt install nodejs npm` and get started! I was immediately greeted with the following wall of packages:

```
$ sudo apt install nodejs npm
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following additional packages will be installed:
  at-spi2-core dbus-user-session dconf-gsettings-backend dconf-service glib-networking glib-networking-common glib-networking-services gsettings-desktop-schemas gyp javascript-common libatk-bridge2.0-0 libatspi2.0-0 libauthen-sasl-perl
  libc-ares2 libclone-perl libcolord2 libdata-dump-perl libdconf1 libdrm-amdgpu1 libdrm-common libdrm-intel1 libdrm-nouveau2 libdrm-radeon1 libdrm2 libencode-locale-perl libepoxy0 libfile-basedir-perl libfile-desktopentry-perl
  libfile-listing-perl libfile-mimeinfo-perl libfont-afm-perl libfontenc1 libgl1 libgl1-mesa-dri libglapi-mesa libglvnd0 libglx-mesa0 libglx0 libgtk-3-0 libgtk-3-bin libgtk-3-common libhtml-form-perl libhtml-format-perl
  libhtml-parser-perl libhtml-tagset-perl libhtml-tree-perl libhttp-cookies-perl libhttp-daemon-perl libhttp-date-perl libhttp-message-perl libhttp-negotiate-perl libice6 libio-html-perl libio-socket-ssl-perl libio-stringy-perl
  libipc-system-simple-perl libjs-highlight.js libjs-inherits libjs-is-typedarray libjs-psl libjs-typedarray-to-buffer libjson-glib-1.0-0 libjson-glib-1.0-common liblcms2-2 libllvm11 liblua5.3-0 liblwp-mediatypes-perl
  liblwp-protocol-https-perl libmailtools-perl libnet-dbus-perl libnet-http-perl libnet-smtp-ssl-perl libnet-ssleay-perl libnode-dev libnode72 libpciaccess0 libproxy1v5 librest-0.7-0 libsensors-config libsensors5 libsm6
  libsoup-gnome2.4-1 libsoup2.4-1 libssl-dev libtie-ixhash-perl libtimedate-perl libtry-tiny-perl liburi-perl libuv1 libuv1-dev libvte-2.91-0 libvte-2.91-common libvulkan1 libwayland-client0 libwayland-cursor0 libwayland-egl1
  libwww-perl libwww-robotrules-perl libx11-protocol-perl libx11-xcb1 libxaw7 libxcb-dri2-0 libxcb-dri3-0 libxcb-glx0 libxcb-present0 libxcb-randr0 libxcb-shape0 libxcb-sync1 libxcb-xfixes0 libxft2 libxkbcommon0 libxkbfile1
  libxml-parser-perl libxml-twig-perl libxml-xpathengine-perl libxmu6 libxshmfence1 libxt6 libxtst6 libxv1 libxxf86dga1 libxxf86vm1 libz3-4 mesa-vulkan-drivers node-abbrev node-agent-base node-ajv node-ansi node-ansi-regex
  node-ansi-styles node-ansistyles node-aproba node-archy node-are-we-there-yet node-asap node-asn1 node-assert-plus node-asynckit node-aws-sign2 node-aws4 node-balanced-match node-bcrypt-pbkdf node-brace-expansion node-builtins
  node-cacache node-caseless node-chalk node-chownr node-clone node-color-convert node-color-name node-colors node-columnify node-combined-stream node-concat-map node-console-control-strings node-copy-concurrently node-core-util-is
  node-dashdash node-debug node-defaults node-delayed-stream node-delegates node-depd node-ecc-jsbn node-encoding node-err-code node-escape-string-regexp node-extend node-extsprintf node-fast-deep-equal node-forever-agent
  node-form-data node-fs-write-stream-atomic node-fs.realpath node-function-bind node-gauge node-getpass node-glob node-graceful-fs node-gyp node-har-schema node-har-validator node-has-flag node-has-unicode node-hosted-git-info
  node-http-signature node-https-proxy-agent node-iconv-lite node-iferr node-imurmurhash node-indent-string node-inflight node-inherits node-ini node-ip node-ip-regex node-is-typedarray node-isarray node-isexe node-isstream node-jsbn
  node-json-parse-better-errors node-json-schema node-json-schema-traverse node-json-stable-stringify node-json-stringify-safe node-jsonify node-jsonparse node-jsonstream node-jsprim node-leven node-lockfile node-lru-cache node-mime
  node-mime-types node-minimatch node-mkdirp node-move-concurrently node-ms node-mute-stream node-nopt node-normalize-package-data node-npm-bundled node-npm-package-arg node-npmlog node-number-is-nan node-oauth-sign node-object-assign
  node-once node-opener node-osenv node-p-map node-path-is-absolute node-performance-now node-process-nextick-args node-promise-inflight node-promise-retry node-promzard node-psl node-puka node-punycode node-qs node-read
  node-read-package-json node-readable-stream node-request node-resolve node-resolve-from node-retry node-rimraf node-run-queue node-safe-buffer node-semver node-set-blocking node-signal-exit node-slash node-spdx-correct
  node-spdx-exceptions node-spdx-expression-parse node-spdx-license-ids node-sshpk node-ssri node-string-decoder node-string-width node-strip-ansi node-supports-color node-tar node-text-table node-through node-tough-cookie
  node-tunnel-agent node-tweetnacl node-typedarray-to-buffer node-unique-filename node-universalify node-uri-js node-util-deprecate node-uuid node-validate-npm-package-license node-validate-npm-package-name node-verror node-wcwidth.js
  node-which node-wide-align node-wrappy node-write-file-atomic node-yallist nodejs-doc perl-openssl-defaults python3-pkg-resources termit x11-common x11-utils x11-xserver-utils xdg-utils xkb-data
```

# Why?
That's a lot more packages than I was expecting. Wait, `x11-common`? `x11-xserver-utils`? What's going on here?

It turns out that [Debian's package for NPM](https://packages.debian.org/bullseye/npm) depends on something called [node-opener](https://packages.debian.org/bullseye/node-opener), which depends on [xdg-utils](https://packages.debian.org/bullseye/xdg-utils), which is described as "desktop integration utilities from freedesktop.org". Uh oh. Yeah, that depends on X11.

**Why in the world does a command line package manager depend on a GUI environment?**

# node-opener
So what is this `node-opener` thing, and does NPM really require it?

The [package's web site](https://github.com/domenic/opener) describes it as "Opens stuff, like webpages and files and executables, cross-platform". I'm still not seeing the relation to NPM. Looking at the code, it's just a script that calls `xdg-open` on Linux (and other commands on Windows and Mac).

[Peering into NPM's source code](https://github.com/npm/cli/blob/04eb43f2b2a387987b61a7318908cf18f03d97e0/lib/utils/open-url.js), I see that it does in fact seem to `require('opener')`. That's disappointing.

# NodeSource to the rescue?
The official nodejs.org site [mentions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) binary distributions [from NodeSource](https://github.com/nodesource/distributions/blob/master/README.md). NodeSource helpfully suggests downloading and running their setup script as root.

The script appears to mostly do reasonable things like checking for required packages and then updating apt's `sources.list` file, and I guess I'm trusting them with the binaries they're providing, so I'll give it a try. They do provide manual install instructions as well.

# Success
I can't say I'm pleased with this setup, but NodeSource's Node package did in fact work and now I've got `node` and `npm` commands running fine without an X11 installation.
