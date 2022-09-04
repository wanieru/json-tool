const path = require('path');

module.exports = {
    entry: {
        'lib/json-tool.js': './dist/index.js',
        'www/js/json-tool.js': './dist/index.js',
        'www/js/main.js': './dist/www.js'
    },
    output: {
        filename: '[name]',
        path: __dirname,
    },
    resolve: {
    },
    watch: true,
    devtool: "source-map"
};