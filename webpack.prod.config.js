var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin('bundle.css');
const path = require('path')
const webpack = require('webpack')

module.exports = {

  entry: [
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

  devtool: false,

  plugins: [
    extractCSS,
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],

  module: {
    loaders: [
      { 
        test: /\.js?$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      { 
        test: /\.css?$/,
        loader: extractCSS.extract(['css']),
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
