// Webpack
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

//CesiumJs
const cesiumSource = '../node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'

const path = require('path')
const cwd = process.cwd()
const mode = 'production'

const config = {
  plugins: [
    new CopyWebpackPlugin([{ from: 'source', to: 'dest' }])
  ]
}

/**
 * Config
 */
module.exports = {
  context: path.join(cwd, 'app'),
  mode,
  entry: {
    app: ['./js/index.jsx'],
    react: ['react', 'react-dom', 'react-router-dom', 'react-router', 'redux', 'react-redux', 'react-router-redux', 'react-tap-event-plugin', 'history'],
  },
  devServer: {
    contentBase: path.join(__dirname, "dist")
  },
  output: {
    path: path.resolve('dist'),
    filename: 'bundle_[name].js',
    // Needed to compile multiline strings in Cesium
    sourcePrefix: ''
  },
  amd: {
    // Enable webpack-friendly use of require in Cesium
    toUrlUndefined: true
  },
  node: {
    // Resolve node module use of fs
    fs: 'empty'
  },
  resolve: {
    alias: {
      // Cesium module name
      cesium: path.resolve(__dirname + 'node_modules/cesium/Source')
    }
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: ['babel-loader'],
      exclude: /node_modules/
    }, {
      test: /\.json$/,
      use: [
        'json-loader'
      ]
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        'less-loader'
      ]
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'scss-loader'
      ]
    }, {
      test: /\.(png|jpg|jpeg|svg|gif)$/,
      use: [
        'file-loader'
      ]
    }, {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        'file-loader'
      ]
    }, {
      //For Graphql imports
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    }, {
      test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
      use: ['url-loader']
    }]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.ejs',
    }),
    new webpack.DefinePlugin({
      CONSTANTS: {
        PRODUCTION: mode === 'PRODUCTION'
      }
    }),
    new webpack.IgnorePlugin(/^(fs|ipc|cfg)$/),
    new CopyWebpackPlugin([{
      from: 'js/constants/ui_config.cfg', to: 'ui_config.cfg', toType: 'file'
    }
    ]),
    // Copy Cesium Assets, Widgets, and Workers to a static directory
    new CopywebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
    new CopywebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
    new CopywebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
    new webpack.DefinePlugin({
      // Define relative base path in cesium for loading assets
      CESIUM_BASE_URL: JSON.stringify('')
    })
  ]
}