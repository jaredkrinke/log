import marked from "marked";

export const createReplaceLinksOptions = (replace) => {
    const createHandler = baseHandler => {
        return function (originalHref, originalTitle, originalText) {
            const result = replace(originalHref, originalTitle, originalText);
            let href, title, text, raw;
            if (typeof(result) === "string") {
                href = result;
                title = originalTitle;
                text = originalText;
            } else {
                ({ href, title, text, raw } = result);
            }

            return raw ?? baseHandler.call(this, href, title, text);
        };
    }

    const baseMarkdownRenderer = new marked.Renderer();
    return {
        renderer: {
            link: createHandler(baseMarkdownRenderer.link),
            image: createHandler(baseMarkdownRenderer.image),
        },
    };
};
