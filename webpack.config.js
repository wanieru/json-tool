const path = require('path');

module.exports = {
    entry: './dist/index.js',
    output: {
        filename: 'json-tool.js',
        path: __dirname + "/lib",
    },
    resolve: {
    },
    watch: true,
    devtool: "source-map"
};