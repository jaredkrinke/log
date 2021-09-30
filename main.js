import path from "path";
import marked from "marked";
import highlight from "highlight.js";
import Metalsmith from "metalsmith";
import markdown from "metalsmith-markdown";
import layouts from "metalsmith-layouts";
import collections from "metalsmith-collections";
import permalinks from "metalsmith-permalinks";
import rootPath from "metalsmith-rootpath";
import discoverPartials from "metalsmith-discover-partials";
import assets from "metalsmith-static";
import drafts from "metalsmith-drafts";
import feed from "metalsmith-feed";
import brokenLinkChecker from "metalsmith-broken-link-checker";
import metalsmithExpress from "metalsmith-express";
import metalsmithWatch from "metalsmith-watch";
import { createAsync as createDOTToSVGAsync } from "dot2svg-wasm";

(async () => {
// Command line arguments
let clean = false;
let serve = false;

const __dirname = path.dirname(process.argv[1]);

for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === "--clean") {
        clean = true;
    } else if (arg === "--serve") {
        serve = true;
    }
}

// Configure syntax highlighting aliases
[
    [ "wasm", "lisp" ],
    [ "dot", "c" ],
].forEach(row => highlight.registerAliases(row[0], { languageName: row[1] }));

// Trivial plugin that does nothing (for toggling on/off plugins)
const noop = (files, metalsmith, done) => done();

// Translate relative Markdown links to point to corresponding HTML output files (with anchor support)
const markdownRenderer = new marked.Renderer();
const baseLinkRenderer = markdownRenderer.link;
markdownRenderer.link = function (href, title, text) {
    return baseLinkRenderer.call(this,
        href.replace(/^([^/][^:]*)\.md(#[^#]+)?$/, "../$1/$2"),
        title,
        text);
};

// The permalinks plugin moves all posts one level deeper, so adjust relative image links appropriately
const baseImageRenderer = markdownRenderer.image;
markdownRenderer.image = function (href, title, text) {
    return baseImageRenderer.call(this,
        href.replace(/^([^/][^:]+)$/, "../$1"),
        title,
        text);
};

// Generate diagrams with dot2svg
const baseCodeRenderer = markdownRenderer.code;
const dotConverter = await createDOTToSVGAsync();
markdownRenderer.code = function (code, language, escaped) {
    if (language === "dot2svg") {
        const svg = dotConverter.dotToSVG(code);
        if (svg) {
            // Remove XML prolog, since we're inlining
            // Also convert default styles to CSS classes, for custom styling
            return svg
                .replace(/^.*?<svg /s, "<svg ")
                .replace(/<!--.*?-->\n?/sg, "")
                .replace(/fill="([^"]+)" stroke="([^"]+)"/g, "class=\"diagram-$2-$1\"");
        } else {
            // On error, just treat the code block like normal
            console.log(dotConverter.getConsoleOutput());
            language = "";
        }
    }
    return baseCodeRenderer.call(this, code, language, escaped);
};

// Create a collection for each subdirectory
const addCategory = (files, metalsmith, done) => {
    Object.keys(files).forEach(key => {
        const file = files[key];

        // Posts are placed in paths as follows: "posts/[category]/{postName}"
        // Attach the category as a property here (with "misc" as a fallback)
        const directory = path.dirname(key);
        if (directory !== ".") {
            const directoryParts = directory.split(/[\\/]/g);
            file.collection = (directoryParts.length > 1) ? directoryParts[1] : "misc";
        }
    });
    done();
};

// Simple plugin to add some custom properties (note: dates are parsed assuming UTC, so use UTC when formatting)
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const addCustomProperties = (files, metalsmith, done) => {
    Object.keys(files).forEach(key => {
        const file = files[key];

        file.fileName = path.basename(key);
        file.link = key
            .replace(/\\/g, "/") // Convert slashes...
            .replace(/[/]index.html$/, ""); // Remove file name

        const date = file.date;
        if (date) {
            file.dateShort = date.toISOString().replace(/T.*$/, "");
            file.dateDisplay = dateFormatter.format(date);
        }
    });
    done();
};

Metalsmith(__dirname)
    .metadata({
        site: {
            title: "Schemescape",
            url: "https://log.schemescape.com/",
            description: "Development log of a life-long coder",
        },
    })
    .clean(clean)
    .source("./content")
    .destination("./out")
    .use(assets({
        src: "static",
        dest: ".",
    }))
    .use(serve ? noop : drafts())
    .use(addCategory)
    .use(collections({
        posts: {
            pattern: "posts/**/*.md",
            sortBy: "date",
            reverse: true,
        },
        posts_recent: {
            pattern: "posts/**/*.md",
            sortBy: "date",
            reverse: true,
            limit: 6,
        },
    }))
    .use(markdown({
        renderer: markdownRenderer,
        highlight: (code, language) => {
            if (language) {
                return highlight.highlight(code, { language }).value;
            } else {
                return highlight.highlightAuto(code).value;
            }
        },
    }))
    .use(permalinks())
    .use(feed({
        collection: "posts",
        destination: "feed.xml",
        limit: 6,
    }))
    .use(rootPath())
    .use(addCustomProperties)
    .use(discoverPartials({ directory: "templates" }))
    .use(layouts({
        directory: "templates",
        default: "default.hbs",
        pattern: "**/*.html",
    }))
    .use(serve ? metalsmithExpress({ host: "localhost" }) : noop)
    .use(serve
        ? metalsmithWatch({
            paths: {
                "${source}/**/*": true,
                "static/**/*": "**/*",
                "templates/**/*": "**/*",
            },
            livereload: true,
        })
        : noop)
    .use(serve ? noop : brokenLinkChecker({ // Link checker doesn't play nicely with metalsmith-watch
        allowRedirects: true,
        checkAnchors: true,
    }))
    .build(err => { if (err) throw err; });
})();
