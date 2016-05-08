var ExtractTextPlugin = require('extract-text-webpack-plugin');

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

 //   watch: true,

    devtool: "cheap-inline-module-source-map", 

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
            /*{
                test: /\.jsx$/,
                loader: 'jsx-loader?insertPragma=React.DOM&harmony'
            },*/
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin('bundle.css')
    ]
}