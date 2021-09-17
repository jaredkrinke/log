const { renderPage, renderArticleShort } = require("./shared");

module.exports = data => renderPage(data,
`<ul>
    ${data.collections.post.slice().reverse().map(post => `<li>${renderArticleShort(post.data)}</li>`).join("\n")}
</ul>`)
