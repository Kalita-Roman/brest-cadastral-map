
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');


module.exports = {
    entry: __dirname + "/main.js",
    output: {
        path: __dirname + "/build",
        filename: "bundle.js",
        library: "index"
    },
    resolve: {
        modulesDirectories: ['node_modules']
    },

    watch: NODE_ENV === 'development',

    devtool: NODE_ENV === 'development' ? 'cheap-inline-module-source-map' : null, 

    module: {
    	loaders: [
            { 
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react'] 
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin('bundle.css'),
        new webpack.DefinePlugin({ NODE_ENV: JSON.stringify(NODE_ENV) })
    ]
}