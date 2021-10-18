export default () => ((files, metalsmith, done) => {
    Object.keys(files).forEach(key => {
        // TODO: Add absolute links as well?
        files[key].link = key
            .replace(/\\/g, "/") // Convert slashes...
            .replace(/\/index.html$/, ""); // Remove file name
    });
    done();
});
