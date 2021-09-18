const path = require("path");
const Metalsmith = require("metalsmith");
const markdown = require("metalsmith-markdown");
const layouts = require("metalsmith-layouts");
const collections = require("metalsmith-collections");

const clean = true;

// TODO: Should output files each have their own directory (similar to what Eleventy does)?

// Simple plugin to add some custom properties
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });
const addCustomProperties = (files, metalsmith, done) => {
    Object.keys(files).forEach(key => {
        const file = files[key];
        file.fileName = path.basename(key);

        const date = file.date;
        if (date) {
            file.dateShort = date.toISOString().replace(/T.*$/, "");
            file.dateDisplay = dateFormatter.format(date);
        }
    });
    done();
};

(async () => {
    const createErrorHandler = (resolve, reject) => ((err, result) => err ? reject(err) : resolve(result));

    // Copy static assets first
    await new Promise((resolve, reject) => {
        Metalsmith(__dirname)
            .source("./static")
            .destination("./out")
            .clean(clean)
            .build(createErrorHandler(resolve, reject));
    });

    // Build site
    await new Promise((resolve, reject) => {
        Metalsmith(__dirname)
            .metadata({
                siteName: "Schemescape",
                siteUrl: "https://log.schemescape.com/",
                description: "Development log of a life-long coder",
            })
            .clean(false)
            .source("./content")
            .destination("./out")
            .use(collections({
                posts: {
                    pattern: "posts/**/*.md",
                    sortBy: "date",
                    reverse: true,
                }
            }))
            .use(markdown())
            .use(require("metalsmith-rootpath")())
            .use(addCustomProperties)
            .use(require("metalsmith-discover-partials")({ directory: "templates" }))
            .use(layouts({
                directory: "templates",
                default: "default.hbs",
            }))
            .build(createErrorHandler(resolve, reject));
    });
})();
