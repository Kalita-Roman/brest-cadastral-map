
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const path = require('path');


module.exports = {
    //entry: __dirname + "/main.js",
    entry: {
        bundle: __dirname + "/main.js",
        test: __dirname + "/testcontrol.js"
    },
    /*output: {
        path: __dirname + "/build",
        filename: "bundle.js",
        library: "index"
    },*/
    output: {
        path: path.join(__dirname, "build"),
        filename: "[name].js"
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