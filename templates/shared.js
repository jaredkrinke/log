const path = require("path").posix
const escapeHTML = require("escape-html")

const getPagePathToRoot = data => (path.relative(data.page.url, "/") || ".")
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });
const formatDateAsTimeElement = date => `<time datetime="${date.toISOString().replace(/T.*$/, "")}">${dateFormatter.format(date)}</time>`;

module.exports = {
    renderPage: (data, content) => `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Schemescape${data.title?.length > 0 ? `: ${escapeHTML(data.title)}` : ""}</title>
        ${data.description ? `<meta name="description" content="${escapeHTML(data.description)}" />` : ""}
        ${data.keywords?.length > 0 ? `<meta name="keywords" content="${escapeHTML(data.keywords.join(","))}" />` : ""}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="stylesheet" href="${getPagePathToRoot(data)}/css/style.css" />
        <link rel="alternate" type="application/atom+xml" href="${getPagePathToRoot(data)}/feed.xml" />
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
        <p>${formatDateAsTimeElement(data.page.date)}</p>
    </header>
    <summary><p>${data.description}</p></summary>
</article>`,

    renderArticle: data => `
<article>
    <header>
        <h1><a href="./">${escapeHTML(data.title)}</a></h1>
        <p>${formatDateAsTimeElement(data.page.date)}</p>
    </header>
    ${data.content}
</article>`,
}
