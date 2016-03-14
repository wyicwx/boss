var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
    entry: {
        app: './src/app.js'
    },
    output: {
        path: './statics/js',
        filename: '[name].js'
    }
};