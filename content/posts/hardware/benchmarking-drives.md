---
title: How to benchmark disk drives on Windows
description: Not sure which drive in your computer is the fastest? Here's how to benchmark drives on Windows.
date: 2021-09-17
---

My computer (running Windows) has multiple drives in it and I was wondering which drive is actually the fastest. Fortunately, there's an app for that.

# Background
In the past, I kept up to date on computer hardware (because, let's be honest, games), but I've been lazy for the past decade or so.

I recently inherited some new parts and now I've got 3 drives:

1. Cheapo solid state drive I bought off Newegg a few years back
1. 1 TB rotational drive I salvaged from a discarded Western Digital My Book
1. Fancy new non-volatile memory (NVMe) drive

My limited understanding tells me that the NVMe drive should be the fastest and that the rotational drive should be incredibly slow in comparison.

# Benchmarking with DiskSpd
Enter [DiskSpd](https://github.com/Microsoft/diskspd/wiki), an official disk benchmarking tool from Microsoft. It's just an executable that you download and run (as administrator).

It has [a lot of command line options](https://github.com/Microsoft/diskspd/wiki/Command-line-and-parameters), but [a random article I found directed me to the most relevant ones](https://www.windowscentral.com/how-test-hard-drive-performance-diskspd-windows-10).

In my case, I'm just interested in read performance, so I ran the following two commands (the first, `-s`, is for sequential reads and the second, `-r`, is for random reads):

```txt
diskspd -d10 -c128M -t1 -o1 -Sh -w0 -s d:\tmp.dat
diskspd -d10 -c128M -t1 -o1 -Sh -w0 -r d:\tmp.dat
```

These tests run:

* For 10 seconds
* On a 128 MB test file (which DiskSpd leaves behind after it finishes)
* On a single thread
* With one operation outstanding
* Without write caching (probably unnecessary for read tests)
* 0% of operations are writes
* In sequential or random access, as indicated
* On a file named d:\tmp.dat (I change the drive letter for each drive, obviously)

# Results
| Drive | Sequential (MB/s) | Random (MB/s) |
| --- | ---: | ---: |
| SATA SSD | 190 | 130 |
| Rotational | 55 | 8 |
| NVMe | 550 | 530 |

As expected, the NVMe drive was the fastest and the rotational drive was the slowest (especially for random reads)... but the actual gaps are enormous!

I guess if I ever get to a point where I have a project that is big enough that disks become the bottleneck, I can just throw everything over onto the NVMe and enjoy a ~3x speedup. Good to know!