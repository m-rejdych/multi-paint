const common = require('./webpack.common');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  output: {
    filename: '[name].[contenthash:8].js',
  },
  mode: 'production',
})
