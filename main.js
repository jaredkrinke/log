const path = require("path");
const marked = require("marked");
const Metalsmith = require("metalsmith");
const markdown = require("metalsmith-markdown");
const layouts = require("metalsmith-layouts");
const collections = require("metalsmith-collections");
const permalinks = require("metalsmith-permalinks");
const rootPath = require("metalsmith-rootpath");
const discoverPartials = require("metalsmith-discover-partials");
const assets = require("metalsmith-static");
const drafts = require("metalsmith-drafts");
const feed = require("metalsmith-feed");
const brokenLinkChecker = require("metalsmith-broken-link-checker");
const metalsmithExpress = require("metalsmith-express");
const metalsmithWatch = require("metalsmith-watch");

// Command line arguments
let clean = false;
let serve = false;

for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === "--clean") {
        clean = true;
    } else if (arg === "--serve") {
        serve = true;
    }
}

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

let metalsmith = Metalsmith(__dirname)
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
    .use(collections({
        posts: {
            pattern: "posts/**/*.md",
            sortBy: "date",
            reverse: true,
        }
    }))
    .use(markdown({ renderer: markdownRenderer }))
    .use(permalinks())
    .use(feed({
        collection: "posts",
        destination: "feed.xml",
        limit: 5,
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
