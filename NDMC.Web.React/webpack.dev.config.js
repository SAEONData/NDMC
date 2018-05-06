const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const cwd = process.cwd()

const mode = 'development'

/**
 * Config
 */
module.exports = {
  context: path.join(cwd, 'app'),
  devtool: 'inline-source-map',
  mode,
  entry: {
    app: ['./js/index.jsx'],
    react: ['react', 'react-dom', 'react-router-dom', 'react-router', 'redux', 'react-redux', 'react-router-redux', 'react-tap-event-plugin', 'history'],
    //styles: ['font-awesome/css/font-awesome.min.css', 'bootstrap/dist/css/bootstrap.min.css', 'mdbreact/docs/css/mdb.min.css']
  },

  output: {
    path: path.resolve('dev-dist'),
    filename: 'bundle_dev_[name].js'
  },

  module: {
    rules: [{
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        use: [
          'json-loader'
        ]
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
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.ejs',
    }),
    new webpack.DefinePlugin({
      CONSTANTS: {
        PRODUCTION: mode === 'production'
      }
    }),
    new webpack.IgnorePlugin(/^(fs|ipc)$/)
  ]
}