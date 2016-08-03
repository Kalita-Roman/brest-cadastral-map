var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin('bundle.css');
const path = require('path')
const webpack = require('webpack')

module.exports = {

  entry: [
    'webpack-hot-middleware/client',
    path.join(__dirname, 'main.js')
  ],

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/'
  },

  resolve: {
      modulesDirectories: ['node_modules']
  },

  devtool: 'cheap-inline-module-source-map',

  plugins: [
    extractCSS,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        exclude: /node_modules//*,
        query: {
            presets: ['es2015', 'react'] 
        }*/
      },
      { 
        test: /\.css?$/,
        loader: extractCSS.extract(['css'])
      },
      { 
        test: /\.png$/,
        loader: 'file' 
      },
      { 
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file'
      }
    ]
  }
}
