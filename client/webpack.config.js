const path = require('path');
const webpack = require('webpack');

const config = {
    entry: "./app.js",
    mode: "production",
    devtool: 'source-map',
    optimization: {
        minimize: false
    },
    resolve: {
        fallback: {
            crypto: false,
            path: false
        },
    },
};

module.exports = config;