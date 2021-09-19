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

const clean = true;

// TODO: Validate internal links

// Translate relative Markdown links to point to corresponding HTML output files
const markdownRenderer = new marked.Renderer();
const baseLinkRenderer = markdownRenderer.link;
markdownRenderer.link = function (href, title, text) {
    return baseLinkRenderer.call(this,
        href.replace(/^([^/][^:]*)\.md$/, "../$1"),
        title,
        text);
};

// Simple plugin to add some custom properties
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });
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
    .use(drafts())
    .use(collections({
        posts: {
            pattern: "posts/**/*.md",
            sortBy: "date",
            reverse: true,
        }
    }))
    .use(markdown({ renderer: markdownRenderer }))
    .use(permalinks())
    .use(rootPath())
    .use(addCustomProperties)
    .use(discoverPartials({ directory: "templates" }))
    .use(layouts({
        directory: "templates",
        default: "default.hbs",
    }))
    .use(feed({
        collection: "posts",
        destination: "feed.xml",
        limit: 5,
    }))
    .build(err => {
        if (err) {
            throw err;
        }
    });