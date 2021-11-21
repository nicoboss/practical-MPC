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
    plugins: [
        new webpack.DefinePlugin({
            'process.browser': true
        })
    ],
};

module.exports = config;