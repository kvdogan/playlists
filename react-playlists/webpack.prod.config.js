const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleTracker = require('webpack-bundle-tracker');

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
  favicon: './src/favicon.ico',
});

const miniCssExtractPlugin = new MiniCssExtractPlugin({
  // Options similar to the same options in webpackOptions.output
  // both options are optional
  filename: '[name].[hash].css',
  chunkFilename: '[id].[hash].css',
});

const bundleTracker = new BundleTracker({
  filename: '../webpack-stats.json',
});

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname), // Current directory
  entry: {
    app: path.resolve('./src', 'index.js'), // './src/index.js'
    vendors: ['react'],
  },
  output: {
    path: path.resolve('../mysitestatic/reactBuild'),
    filename: '[name]-[hash].js',
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
        type: 'javascript/auto',
        test: /\.(svg|png|gif|jpe?g|woff|ttf|wav|mp3|json)$/,
        include: path.resolve('./src'),
        use: {
          loader: 'file-loader',
          options: {
            context: '',
            name: '[name].[ext]',
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          // 'postcss-loader',
          // 'sass-loader',
        ],
      },
    ],
  },
  plugins: [htmlWebpackPlugin, miniCssExtractPlugin, bundleTracker],
};
