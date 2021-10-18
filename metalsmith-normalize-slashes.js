export default () => ((files, metalsmith, done) => {
    const keys = Object.keys(files);
    for (const key of keys) {
        const newKey = key.replace(/\\/g, "/");
        if (newKey !== key) {
            files[newKey] = files[key];
            delete files[key];
        }
    }
    done();
});
