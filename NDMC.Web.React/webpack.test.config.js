const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const cwd = process.cwd()
const mode = 'production'

module.exports = {
  context: path.join(cwd, 'app'),
  mode,

  optimization: {
    minimizer: [
      new TerserPlugin({
        chunkFilter: (chunk) => {
          if (chunk.name === 'config') {
            return false;
          }
    
          return true;
        },
      }),
    ],
    runtimeChunk: 'single',
    //minimize: false,
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        config: {
          name: "config",
          test: /[\\/]app[\\/]js[\\/]config[\\/]/,
          minSize: 0
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        }
      },
    },
  },

  entry: {
    app: ["babel-polyfill", './js/index.jsx'],
    silentRenew: ["./silent_renew/silent_renew.js"],
  },

  output: {
    path: path.resolve('dist'),
    filename: 'bundle_[name].js'
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      use: ['babel-loader'],
      exclude: /node_modules/
    },
    {
      test: /\.json$/,
      use: ['json-loader'],
      exclude: /node_modules/
    },
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    },
    {
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        'less-loader'
      ]
    },
    {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'scss-loader'
      ]
    },
    {
      test: /\.(png|jpg|jpeg|svg|gif)$/,
      use: [
        'file-loader'
      ]
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        'file-loader'
      ]
    },
    {
      test: /\.(pptx|zip)$/,
      loader: "file-loader",
      options: {
        name: '[name].[ext]'
      }
    }]
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: './index.ejs',
      excludeChunks: ["silentRenew"],
    }),
    new HtmlWebpackPlugin({
      template: "./silent_renew/silent_renew.html",
      chunks: ["silentRenew",],
      filename: "silent_renew.html"
    }),
    new webpack.DefinePlugin({
      CONSTANTS: {
        PROD: false,
        TEST: true,
        DEV: false
      }
    }),
    new webpack.IgnorePlugin(/^(fs|ipc|ignore)$/)
  ]
}