import marked from "marked";
import markdown from "./metalsmith-marked.js";

const baseMarkdownRenderer = new marked.Renderer();
const baseLinkRenderer = baseMarkdownRenderer.link;
const baseImageRenderer = baseMarkdownRenderer.image;
export default (replace) => {
    // const o = {
    //     renderer: {
    //         // Translate relative Markdown links to point to corresponding HTML output files (with anchor support)
    //         link: function (href, title, text) {
    //             return baseLinkRenderer.call(this,
    //                 href.replace(/^([^/][^:]*)\.md(#[^#]+)?$/, `${prefix}$1.html$2`),
    //                 title,
    //                 text);
    //         },
    //     },
    // };

    // if (prefix) {
    //     // E.g. the permalinks plugin moves all posts one level deeper, so adjust relative image links, if needed
    //     o.renderer.image = function (href, title, text) {
    //         return baseImageRenderer.call(this,
    //             href.replace(/^([^/][^:]+)$/, `${prefix}$1`),
    //             title,
    //             text);
    //     };
    // }

    return markdown.options({
        renderer: {
            link: function (href, title, text) {
                return baseLinkRenderer.call(this, replace(href), title, text);
            },

            image: function (href, title, text) {
                return baseImageRenderer.call(this, replace(href), title, text);
            }
        },
    });
};
