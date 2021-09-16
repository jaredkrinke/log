const path = require("path").posix
const escapeHTML = require("escape-html")

const getPagePathToRoot = data => (path.relative(data.page.url, "/") || ".")
const getPageDateOnly = data => data.page.date.toISOString().replace(/T.*$/, "")

module.exports = {
    getPagePathToRoot,
    getPageDateOnly,
    escapeHTML,

    renderPage: (data, content) => `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Schemescape${data.title?.length > 0 ? `: ${escapeHTML(data.title)}` : ""}</title>
        ${data.description ? `<meta name="description" content="${escapeHTML(data.description)}" />` : ""}
        ${data.keywords?.length > 0 ? `<meta name="keywords" content="${escapeHTML(data.keywords.join(","))}" />` : ""}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="stylesheet" href="${getPagePathToRoot(data)}/css/style.css" />
        ${/* TODO: RSS */ ""}
    </head>
    <body>
        <main>
            <header><h1><a href="${getPagePathToRoot(data)}/">Schemescape</a></h1></header>
            ${content}
        </main>
    </body>
</html>`,

    renderArticleShort: data => `
<article>
    <header>
        <h1><a href=".${data.page.url}">${data.title}</a></h1>
        <p>Date: <time>${getPageDateOnly(data)}</time></p>
    </header>
    <summary><p>${data.description}</p></summary>
</article>`,

    renderArticle: data => `
<article>
    <header>
        <h1><a href="./">${escapeHTML(data.title)}</a></h1>
        <p>Date: <time>${getPageDateOnly(data)}</time></p>
    </header>
    ${data.content}
</article>`
    // Fragile kludge to make relative links work
    .replace(/(<a href=")(.*?)\.md"/g, "$1../$2\""),
}
