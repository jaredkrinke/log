import path from "path";
import cheerio from "cheerio";
import marked from "marked";
import handlebars from "handlebars";
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
clean = (clean && !serve);

// Handlebars template custom helpers
handlebars.registerHelper("and", (a, b) => (a && b));
handlebars.registerHelper("equal", (a, b) => (a === b));

// Configure syntax highlighting aliases
[
    [ "wasm", "lisp" ],
    [ "dot", "c" ],
].forEach(row => highlight.registerAliases(row[0], { languageName: row[1] }));

// Trivial plugin that does nothing (for toggling on/off plugins)
const noop = (files, metalsmith, done) => done();

const originalFileNames = () => ((files, metalsmith, done) => {
    Object.keys(files).forEach(fileName => {
        files[fileName].originalFileName = fileName;
    });
    done();
});

// TODO: Find a deep merge library?
// Recursive merge
// TODO: How to handle overwritten properties?
function merge(destination, source) {
    Object.keys(source).forEach(key => {
        const value = source[key];
        if (typeof(value) === "object") {
            let nestedDestination = destination[key];
            if (!nestedDestination) {
                nestedDestination = {};
                destination[key] = nestedDestination;
            }

            merge(nestedDestination, value);
        } else {
            destination[key] = value;
        }
    });
};

let markedOptionsStatic = {};
const markedOptions = (options) => {
    if (options) {
        merge(markedOptionsStatic, options);
        return (files, metalsmith, done) => done();
    } else {
        const markedOptions = markedOptionsStatic;
        markedOptionsStatic = {};

        // Merge renderer options onto an actual instance of marked.Renderer
        if (markedOptions.renderer) {
            const renderer = new marked.Renderer();
            merge(renderer, markedOptions.renderer);
            markedOptions.renderer = renderer;
        }

        return markdown(markedOptions);
    }
};

const relativeLinks = () => ((files, metalsmith, done) => {
    // Map all source files to their destinations (and also normalize slashes)
    const originalToFinal = {};
    const normalizeSlashes = str => str.replace(/\\|\//g, "/");
    Object.keys(files).forEach(destination => {
        // Ignore files without a originalFileName property
        const originalFileName = files[destination].originalFileName;
        if (originalFileName) {
            originalToFinal[normalizeSlashes(originalFileName)] = normalizeSlashes(destination);
        }
    });

    // Find all relative links and image references and update
    const textDecoder = new TextDecoder();
    const htmlPattern = /\.html$/;
    const relativeLinkPattern = /^([^/#][^#:]+)(#[^#]+)?$/;
    Object.keys(files).forEach(finalSourceFileName => {
        // Only process HTML files
        if (htmlPattern.test(finalSourceFileName)) {
            const file = files[finalSourceFileName];

            // Only process files that previously existed
            if (file.originalFileName) {
                const originalSourceFileName = normalizeSlashes(file.originalFileName);
                const originalSourceFileDirectory = path.posix.dirname(originalSourceFileName);
                const finalSourceFileDirectory = path.posix.dirname(normalizeSlashes(finalSourceFileName));
                const $ = cheerio.load(textDecoder.decode(file.contents));

                // Find relative links to process
                let modified = false;
                for (const [ elementName, attributeName ] of [["a", "href"], ["img", "src"]]) {
                    $(`${elementName}[${attributeName}]`).each(function () {
                        const href = $(this).attr(attributeName);
                        const matchGroups = relativeLinkPattern.exec(href);
                        if (matchGroups) {
                            // Find the original link target
                            const originalTargetPath = path.posix.normalize(path.posix.join(originalSourceFileDirectory, matchGroups[1]));
    
                            // Only modify if the destination is in the lookup table
                            if (originalToFinal[originalTargetPath]) {
                                const anchor = matchGroups[2] ?? "";
                                const updatedRelativePath = path.posix.relative(finalSourceFileDirectory, originalToFinal[originalTargetPath]).replace(/\/index.html$/, "/") + anchor;
                                modified = true;
                                $(this).attr(attributeName, updatedRelativePath);
                            }
                        }
                    });
                }

                if (modified) {
                    file.contents = Buffer.from($.html());
                }
            }
        }
    });

    done();
});

const syntaxHighlighting = () => markedOptions({
    highlight: (code, language) => {
        if (language) {
            return highlight.highlight(code, { language }).value;
        } else {
            return highlight.highlightAuto(code).value;
        }
    },
});

// Generate diagrams with dot2svg
const baseMarkdownRenderer = new marked.Renderer();
const baseCodeRenderer = baseMarkdownRenderer.code;
const dotConverter = await createDOTToSVGAsync();
const graphvizDiagrams = () => markedOptions({
    renderer: {
        code: function (code, language, escaped) {
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
        },
    },
});

// Create a category for each subdirectory
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

// Plugin for deleting unnecessary content
const eraser = options => {
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();
    return (files, metalsmith, done) => {
        Object.keys(options).forEach(fileName => {
            const file = files[fileName];
            const regExps = options[fileName];
            let contents = textDecoder.decode(file.contents);
            regExps.forEach(regExp => {
                contents = contents.replace(regExp, "");
            });
            file.contents = textEncoder.encode(contents);
        });
        done();
    };
};

// Category sorting: sort by most posts, and then most recent post if there's a tie
const sortCategories = (a, b) => ((b.postsInCategory.length - a.postsInCategory.length) || (b.postsInCategory[0].date - a.postsInCategory[0].date));

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
    .use(originalFileNames())
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
    .use(syntaxHighlighting())
    .use(graphvizDiagrams())
    .use(markedOptions())
    .use(permalinks())
    .use(feed({
        collection: "posts",
        destination: "feed.xml",
        limit: 5,
    }))
    .use(eraser({
        // Remove some unnecessary/constantly changing fields
        "feed.xml": [
            /<lastBuildDate>.*?<\/lastBuildDate>/,
            /<generator>.*?<\/generator>/,
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
    .use(relativeLinks())
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
