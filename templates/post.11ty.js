module.exports = function(data) {
    return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Schemescape: ${data.title}</title>
        <meta name="description" content="${data.summary ?? ""}" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="stylesheet" href="/css/style.css" />
        ${/* TODO: RSS */ ""}
    </head>
    <body>
        <main>
            <header><h1><a href="">Schemescape</a></h1></header><!-- TODO: URL -->
            <article>
                <header>
                    <h1><a href="">${data.title}</a><!-- TODO: insert title and make it a link --></h1>
                    <p>Date: <time>${data.page.date}</time></p><!-- TODO -->
                </header>
                <!-- TODO: summary -->
                <summary>${data.summary ?? ""}</summary>
                ${data.content}
            </article>
        </main>
    </body>
</html>
`
}