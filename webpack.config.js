var path = require('path');
var fs = require('fs');

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

  babel_presets: [],
};

if (process.env.FRONTROCKETS_CONFIG_PATH) {
  var localConfigPath = path.resolve(process.cwd(), process.env.FRONTROCKETS_CONFIG_PATH || '');
  var userOptions = require(localConfigPath);

  if (typeof userOptions === 'object') {
    options = Object.assign(options, userOptions);
  }
}

var webpackPlugins = [
  new SetupEntryPoints(options.entry),
  new ExtractTextPlugin(options.outputCssFilename, {
    allChunks: true,
  }),
];

if (process.env.NODE_ENV === 'production') {
  webpackPlugins.push(new webpack.optimize.DedupePlugin());
  webpackPlugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
    },
    sourceMap: false,
    test: /\.js$/,
    exclude: /node_modules/,
  }));
}

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
        test: /\.(jpe?g|tiff|gif|bmp|png|webp)$/,
        loader: path.join(__dirname, 'loader', 'assets-loader.js'),
        query: {
          limit: 1024,
          name: options.outputImageFilename,
          publicPrefix: options.publicPrefixImage,
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss|less)$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader'),
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        query: {
          presets: options.babel_presets,
        },
        exclude: /node_modules/,
      },
    ],
    noParse: /frontrockets/,
  },
  postcss: function(webpack) {
    var postcssPlugins = [require('postcss-easy-import')({
      glob: true,
      extensions: ['.css', '.scss', '.less'],
      addDependencyTo: webpack,
    })];

    if (options.postcss && options.postcss.plugins) {
      postcssPlugins = postcssPlugins.concat(options.postcss.plugins.map(function(name) {
        return require(name);
      }));
    };

    return postcssPlugins;
  },
  plugins: webpackPlugins,
}
