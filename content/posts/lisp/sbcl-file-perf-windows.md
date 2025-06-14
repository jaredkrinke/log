---
title: Investigating slow file enumeration in SBCL on Windows
description: Is file enumeration when using SBCL on Windows so slow that it can't support a fast static site generator? Yes and no.
date: 2023-11-14
keywords: [static-site-generators]
---
While experimenting to see if I could improve upon [the performance of md2blog](../static-site-generators/speeding-up-rebuilds-4.md) using Common Lisp (and a fancier design), I noticed that **file enumeration in [Steel Bank Common Lisp](https://www.sbcl.org/) (on Windows) was slow**.

Spoiler: it can be a *lot* faster (for my scenario, at least).

# The problem
Obviously, I shouldn't be wasting my time building a new static site generator, with precise incremental builds. Also, obviously, I am.

Since I've gotten [live rebuilds of md2blog down to 50 milliseconds on my desktop](../static-site-generators/speeding-up-rebuilds-4.md#results), there's not a lot of room for inefficiency when trying to improve performance. Unfortunately, my initial experiments using SBCL showed that **just *enumerating* files (no processing whatsoever) took up my entire 50 millisecond budget**.

I tried simplifying my code so that it only used built-in directory/pathname functions:

```lisp
(defparameter *wildcard-pathname* (make-pathname :name :wild
                                                 :type :wild))

(defun enumerate-files (directory)
  (let ((items (list directory))
        (files nil))
    (loop while items do
      (let ((item (pop items)))
        (if (pathname-name item)
            (push item files)
            (loop for child in (directory (merge-pathnames *wildcard-pathname* item)) do
              (push child items)))))
    files))
```

# Investigation
## Is it just Windows?
As a sanity check, I ran the same scenario under SBCL on Linux on a *much* slower computer (Intel Atom, rotational drive)... but the performance was the same: 50 milliseconds. Could Windows really be so slow that my fancy desktop is as slow as an old netbook?

No, that can't be. I can enumerate all these files using [Deno](https://deno.com/) in 5 milliseconds (that's what md2blog does, after all).

## Is it just overhead?
So if the problem is *not* Windows, maybe the problem is SBCL (or Common Lisp itself). Fortunately, Common Lisp has a built-in `time` function to measure time spent in a function.

```lisp
(time (enumerate-files #p"../../log/content/"))
```

Reports:

```
Evaluation took:
  0.054 seconds of real time
  0.046875 seconds of total run time (0.000000 user, 0.046875 system)
  87.04% CPU
  186,748,133 processor cycles
  425,088 bytes consed
```

Hmmm... no "user" time and all "system" time? Blaming the system seems a little suspicious, given that this code runs 10x slower than Deno's baseline.

I thought this might be a great time to test out [SBCL's statistical profiler](http://www.sbcl.org/manual/#Statistical-Profiler), but it turns out it's [not implemented on Windows](https://github.com/sbcl/sbcl/blob/a9abb1c41c457e9299b53f75b4196d3014432c9b/contrib/sb-sprof/interface.lisp#L224).

## Is SBCL using the wrong API?
Maybe SBCL is correctly reporting that virtually the entire time is spent in system calls because it's using an inefficient API?

After locating a searchable version of its source, I found that SBCL [is using FindFirstile](https://github.com/sbcl/sbcl/blob/a9abb1c41c457e9299b53f75b4196d3014432c9b/src/code/win32.lisp#L534). There *is* a `FindFirstFileEx` which offers at least one minor optimization, but I don't see Rust/Deno using it, so that's probably not the issue.

# Reassessing
SBCL indicates that the operating system is the bottleneck, but it's calling `FindFirstFile`--same as Deno. Maybe there are some *other* system calls I didn't notice?

Time to just inspect the system and see what's happening!

## Debugging
I don't recommend this approach, but since I already had WinDbg installed, I attached WinDbg to sbcl.exe and set a breakpoint on everything in kernel32.dll (`bm kernel32!*`), let the program run, and kept track of which functions were hit (disabling each breakpoint afterwards).

These functions sounded relevant:

* FindFirstFileW
* GetFileAttributesExW
* GetLongPathNameW

I wasn't familiar with that last one (`GetLongPathName`), but apparently it's for [converting from "short" (DOS-style 8.3) file names (e.g. "progra~1") to "long" file names](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-getlongpathnamea). Honestly, this is the first time I've had to think about short file names in at least a decade.

New question: **which (if any) of these functions is slow?**

## Windows Performance Recorder/Analyzer
In the past, I've used [Windows Performance Analyzer](https://learn.microsoft.com/en-us/windows-hardware/test/wpt/windows-performance-analyzer) for this sort of problem. Conveniently, **Microsoft now bundles Windows Performance Analyzer (a 15 MB tool) along with a million other things I doubt I'll ever use in a tidy little 4 GB download**. I'd think it would be in their best interest to separate these tools in order to reduce the bandwidth needed to deliver basic performance analysis tools, but what do I know?

Using Windows Performance Recorder's generic profile, I captured a several second trace of file enumeration via SBCL. Opening the trace and looking at the "CPU Usage (Sampled)" chart (and filtering to "sbcl.exe"--with symbol loading enabled), I see the following sample counts by stack:

```
Line #, Process, Stack, Count
1, sbcl.exe (34020), , 1581
2, , [Root], 1579
3, ,   |- ?!?, 1576
4, ,   |    |- kernel32.dll!GetLongPathNameW, 1299
5, ,   |    |- KernelBase.dll!GetFileAttributesExW, 155
6, ,   |    |- ?!?<itself>, 75
7, ,   |    |- KernelBase.dll!FindNextFileW, 16
8, ,   |    |- KernelBase.dll!FindFirstFileW, 14
```

Looks like the vast majority of samples are in `GetLongPathName`, with a significant chunk in `GetFileAttributesEx`. I'm still not entirely clear why these are necessary. Maybe the Common Lisp spec specifies that `DIRECTORY` must return absolute paths? I don't see anything like that in the [Common Lisp HyperSpec entry for DIRECTORY](http://clhs.lisp.se/Body/f_dir.htm), but I definitely don't know what I'm talking about, so I'll just stop speculating.

## Debugging SBCL with itself
While exploring [SBCL's Win32 code](https://github.com/sbcl/sbcl/blob/a9abb1c41c457e9299b53f75b4196d3014432c9b/src/code/win32.lisp), I decided to try debugging SBCL using itself:

* Download a copy of SBCL 2.3.2's source code
* Open it in Emacs (with SLIME)
* Add a call to `BREAK` within a function of interest
* Ctrl+C, Ctrl+C to recompile the function
* Run file enumeration code

The breakpoint was hit! Of course, after that I tried to remove the breakpoint and recompile, but the recompilation process started hitting breakpoints related to the function of SLIME/SBCL itself. So maybe messing with SBCL's internals isn't always a great approach. It's still neat that you can tinker with SBCL's internals without any external tools (Emacs+SLIME make it easier, but are not *required*).

# Solution?
## Initial attempt
As an initial attempt to speed up file enumeration, I decided to just directly call SBCL's internal Win32 function that uses `FindFirstFile`/`FindNextFile`. The function is named `native-call-with-directory-iterator`, and here's the (surprisingly readable, other than the convoluted callback convention) definition:

```lisp
(defun native-call-with-directory-iterator (function namestring errorp)
  (declare (type (or null string) namestring)
           (function function))
  (when namestring
    (with-alien ((find-data find-data))
      (with-handle (handle (syscall (("FindFirstFile" t) handle
                                     system-string find-data)
                                    (if (eql result invalid-handle)
                                        (if errorp
                                            (win32-error "FindFirstFile")
                                            (return))
                                        result)
                                    (concatenate 'string
                                                 namestring "*.*")
                                    find-data)
                    :close-operator find-close)
        (let ((more t))
          (dx-flet ((one-iter ()
                      (tagbody
                       :next
                         (when more
                           (let ((name (decode-system-string
                                        (slot find-data 'long-name)))
                                 (attributes (slot find-data 'attributes)))
                             (setf more
                                   (syscall (("FindNextFile" t) lispbool
                                             handle find-data) result
                                             handle find-data))
                             (cond ((equal name ".") (go :next))
                                   ((equal name "..") (go :next))
                                   (t
                                    (return-from one-iter
                                      (values name
                                              (attribute-file-kind
                                               attributes))))))))))
            (funcall function #'one-iter)))))))
```

Interestingly, the callback receives both the file system item's name, as well as its "kind" (`:file` or `:directory`).

Here's my sloppy code (note to self: make it more obvious which variables are "namestrings" versus "pathnames"):

```lisp
(defun for-each-item-in-directory (function directory)
  "Calls FUNCTION with (string, (or :file :directory)) for each item in DIRECTORY"
  (declare (type function function))
  (sb-win32::native-call-with-directory-iterator
   (lambda (next)
     (declare (type function next))
     (loop for (name kind) = (multiple-value-list (funcall next))
           while name
           do (funcall function name kind)))
   (namestring directory)
   nil))

(defun enumerate-files (directory)
  (declare (type pathname directory))
  (let ((items (list directory))
        (files nil))
    (loop while items do
      (let ((item (pop items)))
        (declare (type pathname item))
        (if (pathname-name item)
            (push item files)
            (for-each-item-in-directory
             (lambda (name kind)
               (push (merge-pathnames
                      (ecase kind
                        (:file (parse-namestring name))
                        (:directory (make-pathname :directory (list :relative name))))
                      item)
                     items))
             item))))
    files))
```

And now, the moment of truth when I run this modified function:

```
Evaluation took:
  0.002 seconds of real time
  0.015625 seconds of total run time (0.000000 user, 0.015625 system)
  800.00% CPU
  7,000,104 processor cycles
  65,200 bytes consed
```

**That's a 27x speedup!** And, other than returning relative paths instead of absolute paths (a detail which doesn't currently matter to me), the output looks the same. Even better, there might be more opportunities for improvement in my scenario:

* I'll likely need the "last modified" time of each time, but it looks like `FindFirstFile` already provides that value
* There is a `FindFirstFileEx`, with some (Windows 7+) optimization flags

Of course, to do all this *correctly* (i.e. portably), I should use CFFI instead of SBCL-internal functions. But I don't know how to do that yet.

# Conclusion
Reducing file enumeration down to 2 milliseconds gives me some breathing room in my 50-ish millisecond budget. This is fortunate in the sense that I might end up with something useful, but unfortunate in the sense that I can no longer be satisfied with immediately discarding this project as obviously infeasible.

Looks like I've got some more work to do...
