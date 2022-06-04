const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  output: {
    filename: '[name].js',
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    static: path.join(__dirname, 'build'),
    hot: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080/api',
        pathRewrite: { '/api': '' }
      },
    },
  },
})
