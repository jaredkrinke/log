module.exports = function(eleventyConfig) {
    // Copy everything under "static" to the root of the built site (note: this is relative to this config file)
    eleventyConfig.addPassthroughCopy({ "static": "./" });

    // Convert relative Markdown file links to relative post links
    const customMarkdownIt = require("markdown-it")({
            html: true,
            replaceLink: link => link.replace(/^([^/][^:]*)\.md$/, "../$1"),
        })
        .use(require("markdown-it-replace-link"));

    eleventyConfig.setLibrary("md", customMarkdownIt);

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
