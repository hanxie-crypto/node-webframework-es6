'use strict';

// const webpack = require('webpack');
const path = require('path');
const webpack = require('webpack');


module.exports = {
    entry: [
        'webpack-dev-server/client?http://127.0.0.1:5001/',
        'webpack/hot/only-dev-server',
        path.join(__dirname, 'js/index.js')
    ],
    output: {
        publicPath: 'http://127.0.0.1:5001/jsdev',
        path: path.join(__dirname, 'jsdev'), // absolute path
        filename: 'index.js'
    },
    resolve: {
        extensions: ['', '.js']
    },
    eslint: {
        configFile: '.eslintrc'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};