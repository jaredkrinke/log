const path = require("path");
const Metalsmith = require("metalsmith");
const markdown = require("metalsmith-markdown");
const layouts = require("metalsmith-layouts");

const clean = true;

// Simple plugin to add some custom properties
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });
const addCustomProperties = (files, metalsmith, done) => {
    Object.keys(files).forEach(key => {
        const file = files[key];
        file.fileName = path.basename(key);

        const date = file.date;
        file.dateShort = date.toISOString().replace(/T.*$/, "");
        file.dateDisplay = dateFormatter.format(date);
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
            // .use(collections({
            //     posts: "posts/**/*.md",
            // }))
            .use(markdown())
            .use(require("metalsmith-rootpath")())
            .use(addCustomProperties)
            .use(layouts({
                directory: "templates",
                default: "default.hbs",
            }))
            .build(createErrorHandler(resolve, reject));
    });
})();
