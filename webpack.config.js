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
  outputImageFilename: '[name].[ext]',
  publicPrefixImage: '',
};

try {
  var localConfigPath = path.join(process.cwd(), 'frontrockets-builder.yml');
  fs.statSync(localConfigPath);
  options = Object.assign(options, YAML.load(localConfigPath));
} catch(e) {}

if (options.postcss && options.postcss.plugins) {
  var postcssPlugins = options.postcss.plugins.map(function(name) {
    return require(name);
  });
};

module.exports = {
  entry: options.entry,
  output: {
    path: options.outputPath,
    filename: options.outputJsFilename,
    publicPath: '/assets/',
  },
  module: {
    loaders: [
      {
        test: /\.(css|scss|less)$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader'),
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      },
      {
        test: /\.(jpe?g|tiff|gif|bmp|png|webp)$/,
        loader: path.join(__dirname, 'loader', 'assets-loader.js'),
        query: {
          limit: 1024,
          name: options.outputImageFilename,
          publicPrefix: options.publicPrefixImage,
        },
      },
    ],
  },
  postcss: function() {
    return postcssPlugins;
  },
  plugins: [
    new SetupEntryPoints(options.entry),
    new ExtractTextPlugin(options.outputCssFilename, {
      allChunks: true,
    }),
  ],
}
