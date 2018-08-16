const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleTracker = require('webpack-bundle-tracker');

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
  favicon: './src/favicon.ico',
});

const devMode = process.env.NODE_ENV !== 'production';
const miniCssExtractPlugin = new MiniCssExtractPlugin({
  // Options similar to the same options in webpackOptions.output
  // both options are optional
  filename: devMode ? '[name].css' : '[name].[hash].css',
  chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
});

const bundleTracker = new BundleTracker({
  filename: '../webpack-stats.json',
});

module.exports = {
  context: path.resolve(__dirname), // Current directory
  entry: {
    app: path.resolve('./src', 'index.js'), // './src/index.js'
    vendors: ['react'],
  },
  output: {
    path: path.resolve('../mysitestatic/build'),
    filename: '[name]-[hash].js',
    publicPath: 'http://127.0.0.1:8080/mysitestatic/build/',

  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(svg$|png$|gif$|jpe?g$|woff$|ttf$|wav$|mp3$)$/,
        include: path.resolve('./src'),
        use: {
          loader: 'file-loader',
          options: {
            context: '',
            name: '[path]/static/[name]-[hash].[ext]',
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          // 'postcss-loader',
          // 'sass-loader',
        ],
      },
    ],
  },
  plugins: [htmlWebpackPlugin, miniCssExtractPlugin, bundleTracker],
};
