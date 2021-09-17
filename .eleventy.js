const path = require("path").posix;
const fs = require("fs");
const relativeLinkRegexp = /^([^/][^:]*)\.md$/;

module.exports = function(eleventyConfig) {
    // Copy everything under "static" to the root of the built site (note: this is relative to this config file)
    eleventyConfig.addPassthroughCopy({ "static": "./" });

    // Convert relative Markdown file links to relative post links
    const customMarkdownIt = require("markdown-it")({
            html: true,
            replaceLink: function (link, env) {
                const result = relativeLinkRegexp.exec(link);
                if (result) {
                    // Ensure the destination file exists
                    const sourceDirectory = path.dirname(env.page.inputPath);
                    const resolvedPath = path.join(sourceDirectory, link);
                    // TODO: Ideally, these checks would be done asynchronously instead of waiting on the file system every time a relative link is encountered
                    if (fs.existsSync(resolvedPath)) {
                        return `../${result[1]}`;
                    } else {
                        console.error(`*** Error in "${env.page.inputPath}": relative link target does not exist: ${resolvedPath}`);
                        return link;
                    }
                } else {
                    return link;
                }
            },
        })
        .use(require("markdown-it-replace-link"));

    eleventyConfig.setLibrary("md", customMarkdownIt);

    // RSS/Atom feed
    eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-rss"));

    return {
        // Don't process Markdown first with a template language
        markdownTemplateEngine: false,

        dir: {
            input: "content",
            output: "out",
            includes: "../templates" // Note: this is relative to the input directory
        }
    }
};
