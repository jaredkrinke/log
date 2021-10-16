// TODO: Support patterns
export default options => {
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();
    return (files, metalsmith, done) => {
        Object.keys(options).forEach(fileName => {
            const file = files[fileName];
            const rows = options[fileName];
            let contents = textDecoder.decode(file.contents);
            rows.forEach(regExpAndReplacement => {
                contents = contents.replace(regExpAndReplacement[0], regExpAndReplacement[1]);
            });
            file.contents = textEncoder.encode(contents);
        });
        done();
    };
};
