export default () => ((files, metalsmith, done) => {
    Object.keys(files).forEach(key => {
        // TODO: Add absolute links as well (linkAbsolute), and rename this one to linkFromRoot
        files[key].link = key
            .replace(/\\/g, "/") // Convert slashes...
            .replace(/\/index.html$/, ""); // Remove file name
    });
    done();
});
