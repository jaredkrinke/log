import path from "path";
import markdown from "./metalsmith-marked.js";
import relativeLinks from "./metalsmith-relative-links.js";
import graphvizDiagrams from "./metalsmith-graphviz-diagrams.js";
import syntaxHighlighting from "./metalsmith-syntax-highlighting.js";
import contentReplace from "./metalsmith-content-replace.js";
import routeProperties from "./metalsmith-route-properties.js";
import normalizeSlashes from "./metalsmith-normalize-slashes.js";
import linkify from "./metalsmith-linkify.js";
import handlebars from "handlebars";
import Metalsmith from "metalsmith";
import layouts from "metalsmith-layouts";
import collections from "metalsmith-collections";
import permalinks from "metalsmith-permalinks";
import rootPath from "metalsmith-rootpath";
import discoverPartials from "metalsmith-discover-partials";
import assets from "metalsmith-static";
import drafts from "metalsmith-drafts";
import feed from "metalsmith-feed";
import taxonomy from "metalsmith-taxonomy";
import fileMetadata from "metalsmith-filemetadata";
import brokenLinkChecker from "metalsmith-broken-link-checker";
import metalsmithExpress from "metalsmith-express";
import metalsmithWatch from "metalsmith-watch";

// Command line arguments
const serve = process.argv.includes("--serve");
const clean = !serve && process.argv.includes("--clean");

// Handlebars template custom helpers
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
[
    [ "and", (a, b) => (a && b) ],
    [ "equal", (a, b) => (a === b) ],
    [ "formatDateShort", date => date.toISOString().replace(/T.*$/, "") ],
    [ "formatDate", date => dateFormatter.format(date) ],
].forEach(row => handlebars.registerHelper(row[0], row[1]));

// Trivial plugin that does nothing (for toggling on/off plugins)
const noop = (files, metalsmith, done) => done();

// Category sorting: sort by most posts, and then most recent post if there's a tie
const sortCategories = (a, b) => ((b.postsInCategory.length - a.postsInCategory.length) || (b.postsInCategory[0].date - a.postsInCategory[0].date));

Metalsmith(path.dirname(process.argv[1]))
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
    .use(normalizeSlashes())
    .use(serve ? noop : drafts())
    .use(routeProperties({ "posts/(:category/):fileName.md": { category: "misc" } }))
    .use(taxonomy({
        pattern: "posts/**/*.md",
        taxonomies: ["category"],
        pages: ["term"],
    }))
    .use(fileMetadata([
        {
            pattern: "category/*.html",
            metadata: (file, metadata) => ({
                title: file.term,
                category: file.term,
                layout: "categoryIndex.hbs",
                isCategoryIndex: true,
                postsInCategory: metadata.taxonomies.category[file.term].slice().sort((a, b) => (b.date - a.date)),
            }),
        },
    ]))
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
            limit: 5,
        },
        categories: {
            pattern: "category/*.html",
            filterBy: file => file.isCategoryIndex,
            sortBy: sortCategories,
        },
        categories_top: {
            pattern: "category/*.html",
            filterBy: file => file.isCategoryIndex,
            sortBy: sortCategories,
            limit: 3,
        },
    }))
    .use(relativeLinks({ prefix: "../" })) // permalinks plugin moves posts into their own directories
    .use(syntaxHighlighting({
        aliases: [
            { tag: "dot", language: "c" },
        ],
    }))
    .use(graphvizDiagrams({ cssClasses: true }))
    .use(markdown())
    .use(permalinks({
        pattern: "posts/:category/:fileName",
        linksets: [
            {
                match: { type: "taxonomy:term" },
                pattern: "posts/:term",
            },
        ],
    }))
    .use(feed({
        collection: "posts",
        destination: "feed.xml", // TODO: Relative links probably break this output -- how to fix? Rewrite plugin?
        limit: 5,
    }))
    .use(contentReplace({
        // Remove some unnecessary/constantly changing fields
        "feed.xml": [
            [/<lastBuildDate>.*?<\/lastBuildDate>/, ""],
            [/<generator>.*?<\/generator>/, ""],
        ],
    }))
    .use(rootPath())
    .use(discoverPartials({ directory: "templates" }))
    .use(linkify())
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
