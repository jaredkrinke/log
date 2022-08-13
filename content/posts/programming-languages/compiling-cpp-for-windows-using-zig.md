---
title: Testing out Zig... for C/C++ code... on Windows
description: Can Zig save me from downloading multi-gigabyte SDKs just to build Windows programs?
date: 2022-08-13
keywords: [zig]
---
I briefly played around with Zig's C/C++ compiler in the past. It's a tidy ~60 MB download that can magically even cross-compile. I haven't worked up the nerve to investigate the Zig *programming language*, but its built-in C/C++ compiler impressed me.

Now how far can I push it?

## Aside: toolchain bloat
A good way to discourage me from testing out your software is to require a gigabyte (or more) download (and no, providing an installer that obscures the massive download is not a solution).

The chief offender of inexplicably enormous downloads is, unfortunately, anything related to compiling software for Windows. Want to use the free edition of Microsoft Visual C? That will be at least 3 GB. How about a more modern language like C#? That's 5 GB. Even non-Visual Studio C/C++ compilers tend to be hundreds of megabytes.

# Hello, ~~Zig~~ C!
First, here's a trivial "hello world" program:

```c
#include <stdio.h>

int main(int argc, const char** argv) {
    printf("Hello, C!");
    return 0;
}
```

Here's the result:

```txt
> zig cc hello-c.c -o hello-c.exe

> hello-c.exe
Hello, C!
```

Success!

## Making the binary more portable
According to ziglearn.org, [Zig targets the host's specific CPU by default](https://ziglearn.org/chapter-3/#cross-compilation). If you plan to distribute programs built with Zig, you'll probably want to choose a more generic architecture, e.g. `i386` or `x86_64`:

```txt
> zig cc -target i386-windows-gnu hello-c.c -o hello-c.exe 
```

# Hello, Win32!
That last exercise was somewhat trivial, although I'm still impressed at how easy it was to get started with Zig's compiler (just unzip--no installation or SDK required).

But I want to be able to call Win32 APIs from my programs. Is Zig up to that task?

Here's a trivial program to pop up a message box:

```c
#include <windows.h>

int main() {
    MessageBox(NULL, "Hello there!", "From Zig land!", MB_OK);
    return 0;
}
```

Build command:

```txt
> zig cc -target i386-windows-gnu hello-win32.c -o hello-win32.exe 

> hello-win32.exe
```

Sure enough, a message box appeared!

At this point, I'm impressed, but it remains to be seen if Zig's magic will work beyond trivial examples like this.

# Hello, C++ and WinMain!
Time to throw in some C++ and create an actual Window:

```cpp
#include <windows.h>
#include <stdlib.h>
#include <string>
#include <tchar.h>

static TCHAR szWindowClass[] = _T("DesktopApp");
static TCHAR szTitle[] = _T("Hello, Windows!");

LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);

int CALLBACK WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    WNDCLASSEX wcex;

    wcex.cbSize = sizeof(WNDCLASSEX);
    wcex.style = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc = WndProc;
    wcex.cbClsExtra = 0;
    wcex.cbWndExtra = 0;
    wcex.hInstance = hInstance;
    wcex.hIcon = LoadIcon(hInstance, IDI_APPLICATION);
    wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    wcex.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    wcex.lpszMenuName = NULL;
    wcex.lpszClassName = szWindowClass;
    wcex.hIconSm = LoadIcon(wcex.hInstance, IDI_APPLICATION);

    if (!RegisterClassEx(&wcex)) {
        MessageBox(NULL, _T("Call to RegisterClassEx failed!"), _T("Test app"), NULL);
        return 1;
    }

    HWND hWnd = CreateWindow(szWindowClass, szTitle, WS_OVERLAPPEDWINDOW, CW_USEDEFAULT, CW_USEDEFAULT, 1200, 900, NULL, NULL, hInstance, NULL);
    if (!hWnd) {
        MessageBox(NULL,
            _T("Call to CreateWindow failed!"),
            _T("Test app"),
            NULL);

        return 1;
    }

    ShowWindow(hWnd, nCmdShow);
    UpdateWindow(hWnd);

    MSG msg;
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    return (int)msg.wParam;
}

LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam) {
    switch (message) {
    case WM_DESTROY:
        PostQuitMessage(0);
        break;

    default:
        return DefWindowProc(hWnd, message, wParam, lParam);
        break;
    }

    return 0;
}
```

And now to build and test:

```txt
> zig c++ -target i386-windows-gnu hello-window.cpp -o hello-window.exe

> hello-window.exe
```

This popped up a window that I could close.

Based on functionality, this is a fairly trivial example, but based on the number of lines of code in the included header files, I actually wasn't expecting this to work on the first try.

It's not yet clear to me how much of the Windows SDK Zig ships with, but it's at least enough to create a real window.

# Hello, WebView2?
Given that [WebView2](https://docs.microsoft.com/en-us/microsoft-edge/webview2/) isn't a part of the standard Windows SDK, I'm almost certain that this won't work out of the box, but I'm going to give it a try anyway.

I'm going to work off of the [WebView2 for Win32 tutorial](https://docs.microsoft.com/en-us/microsoft-edge/webview2/get-started/win32). The code is fairly lengthy, so I'm not going to duplicate it here.

After trying to compile the sample, I finally managed to stump Zig:

```txt
> zig c++ -target i386-windows-gnu hello-webview2.cpp -o hello-webview2.exe
hello-webview2.cpp:5:10: fatal error: 'wil/com.h' file not found
#include <wil/com.h>
         ^~~~~~~~~~~
1 error generated.
```

The sample code uses [WIL](https://github.com/microsoft/wil), and regardless of whether that's part of the Windows SDK, Zig doesn't ship with it. I'll try cloning the repository, but you could also download the NuGet package and unzip it (`.nupkg` files are just Zip files).

Second attempt, this time with WIL:

```txt
> zig c++ -target i386-windows-gnu hello-webview2.cpp -I..\wil\include -o hello-webview2.exe
In file included from hello-webview2.cpp:5:
..\wil\include\wil/com.h:14:10: fatal error: 'WeakReference.h' file not found
#include <WeakReference.h>
         ^~~~~~~~~~~~~~~~~
1 error generated.
```

Alright, `WeakReference.h` is part of [WRL](https://docs.microsoft.com/en-us/cpp/cppcx/wrl/windows-runtime-cpp-template-library-wrl?view=msvc-170), which is actually part of the Windows SDK. Zig doesn't appear to ship with WRL (and I'm not even sure that it *should*).

I suspect I don't actually *need* WIL or WRL, but proceeding without them might not be the best use of time, because instantiating WebView2 appears to be an COM-based asynchronous operation, and I don't want to reimplement a large chunk of WIL, WRL, or even COM just to avoid using the Windows SDK and Visual Studio.

Ok, fine, Visual Studio Installer. You win this round.