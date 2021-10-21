export default () => ((files, metalsmith, done) => {
    Object.keys(files).forEach(key => {
        // Link relative to the site root
        const file = files[key];
        file.linkFromRoot = key
            .replace(/\\/g, "/") // Convert slashes...
            .replace(/\/index.html$/, ""); // Remove file name
        
        // Absolute link (if absolute link to site root provided)
        const siteUrl = metalsmith?.metadata()?.site?.url;
        if (siteUrl) {
            file.linkAbsolute = siteUrl + (siteUrl.endsWith("/") ? "" : "/") + file.linkFromRoot;
        }
    });
    done();
});
