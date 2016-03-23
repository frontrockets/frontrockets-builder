var path = require('path');
var fs = require('fs');

var YAML = require('yamljs');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var SetupEntryPoints = require('./loader/setup-entry-points.js');

var options = {
  entry: {
    application: './tests/application.entry.js',
  },
  outputPath: path.resolve('.', 'tests', 'build'),

  outputCssFilename: '[name].css',
  outputJsFilename: '[name].js',
};

var localConfigPath = path.join(process.cwd(), 'frontrockets-builder.yml');

if (!fs.accessSync(localConfigPath)) {
  options = Object.assign(options, YAML.load(localConfigPath))
}

module.exports = {
  entry: options.entry,
  output: {
    path: options.outputPath,
    filename: options.outputJsFilename,
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
      },
    ],
  },
  plugins: [
    new SetupEntryPoints(options.entry),
    new ExtractTextPlugin(options.outputCssFilename, {
      allChunks: true,
    }),
  ],
}
