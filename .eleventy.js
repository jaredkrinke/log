module.exports = function(eleventyConfig) {
    // Copy everything under "static" to the root of the built site (note: this is relative to this config file)
    eleventyConfig.addPassthroughCopy({ "static": "./" });

    return {
        dir: {
            input: "content",
            output: "out",
            includes: "../templates" // Note: this is relative to the input directory
        }
    }
};
