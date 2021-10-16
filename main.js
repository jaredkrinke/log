import path from "path";
import markdown from "./metalsmith-marked.js";
import relativeLinks from "./metalsmith-relative-links.js";
import graphvizDiagrams from "./metalsmith-graphviz-diagrams.js";
import syntaxHighlighting from "./metalsmith-syntax-highlighting.js";
import contentReplace from "./metalsmith-content-replace.js";
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
import brokenLinkChecker from "metalsmith-broken-link-checker";
import metalsmithExpress from "metalsmith-express";
import metalsmithWatch from "metalsmith-watch";

// Command line arguments
const serve = process.argv.includes("--serve");
const clean = !serve && process.argv.includes("--clean");

// Handlebars template custom helpers
// TODO: Use a standard Handlebars library or switch to a template language that has this functionality built in
handlebars.registerHelper("and", (a, b) => (a && b));
handlebars.registerHelper("equal", (a, b) => (a === b));

// Trivial plugin that does nothing (for toggling on/off plugins)
const noop = (files, metalsmith, done) => done();

// Create a category for each subdirectory
// TODO: Create a route parsing plugin that adds this automatically from a string like "posts/:category/*.md"
const addCategory = (files, metalsmith, done) => {
    Object.keys(files).forEach(key => {
        const file = files[key];

        // Posts are placed in paths as follows: "posts/[category]/{postName}"
        // Attach the category as a property here (with "misc" as a fallback)
        const directory = path.dirname(key);
        if (directory !== ".") {
            const directoryParts = directory.split(/[\\/]/g);
            if (directoryParts[0] === "posts") {
                file.category = (directoryParts.length > 1) ? directoryParts[1] : "misc";
                file.categoryPath = `posts/${file.category}`;
            }
        }
    });
    done();
};

// TODO: Replace this with a plugin that allows querying/grouping over properties?
const addCategoryIndexes = (files, metalsmith, done) => {
    const categoryMap = {};
    Object.keys(files).forEach(key => {
        const file = files[key];
        const category = file.category;
        if (category) {
            let categoryList = categoryMap[category];
            if (!categoryList) {
                categoryList = [];
                categoryMap[category] = categoryList;
            }
            categoryList.push(file);
        }
    });

    Object.keys(categoryMap).forEach(category => {
        const categoryList = categoryMap[category];
        const categoryIndexDestination = path.join("posts", category, "index.html");
        files[categoryIndexDestination] = {
            title: category,
            mode: "0666",
            permalink: false,
            category,
            categoryPath: categoryList[0].categoryPath,
            isCategoryIndex: true,
            layout: "categoryIndex.hbs",
            contents: new Uint8Array(0),
            postsInCategory: categoryList.sort((a, b) => (b.date - a.date)),
        };
    });
    done();
};

// Simple plugin to add some custom properties (note: dates are parsed assuming UTC, so use UTC when formatting)
// TODO: Date formatting should be implemented in the template layer
// TODO: See if there's an existing plugin for creating these links
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const addCustomProperties = (files, metalsmith, done) => {
    Object.keys(files).forEach(key => {
        const file = files[key];

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
    .use(serve ? noop : drafts())
    .use(addCategory)
    .use(addCategoryIndexes)
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
            pattern: "posts/**/*.html",
            filterBy: file => file.isCategoryIndex,
            sortBy: sortCategories,
        },
        categories_top: {
            pattern: "posts/**/*.html",
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
    .use(permalinks())
    .use(feed({
        collection: "posts",
        destination: "feed.xml",
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
