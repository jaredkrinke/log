const { renderPage, renderArticle } = require("./shared");

module.exports = data => renderPage(data, renderArticle(data))
