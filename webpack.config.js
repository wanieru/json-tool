const path = require('path');

module.exports = {
    entry: {
        'lib/json-tool.js': './js/index.js',
        'www/js/json-tool.js': './js/index.js',
        'www/js/main.js': './js/www.js',
        'docs/js/json-tool.js': './js/index.js',
        'docs/js/main.js': './js/www.js'
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