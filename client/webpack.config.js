const path = require('path');
const webpack = require('webpack');

const config = {
    entry: "./app.js",
    mode: "production",
    devtool: 'source-map',
    optimization: {
        minimize: false
    },
};
module.exports = config;