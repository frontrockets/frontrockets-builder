var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var SetupEntryPoints = require('./lib/setup-entry-points-plugin.js');

module.exports = function(options) {
  return {
    entry: options.entry,
    output: {
      path: options.output.path,
      filename: options.output.filenameJs,
      publicPath: '/assets/',
    },
    module: {
      loaders: [
        {
          test: /\.(jpe?g|tiff|gif|bmp|png|webp)$/,
          loader: path.join(__dirname, 'lib', 'assets-loader.js'),
          query: {
            limit: 1024,
            name: options.output.filenameImage,
            publicPrefix: options.dirForImageRelativeToOutputPath,
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
            presets: options.babelPresets,
          },
          exclude: /node_modules/,
        },
      ],
      noParse: /frontrockets/,
    },
    postcss: function(webpack) {
      var plugins = options.postcss.apply(this, arguments);

      var corePlugins = [
        require('postcss-easy-import')({
          glob: true,
          extensions: ['.css', '.scss', '.less'],
          addDependencyTo: webpack
        })
      ];

      return corePlugins.concat(plugins);
    },
    plugins: (function() {
      var plugins = [
        new SetupEntryPoints(),
        new ExtractTextPlugin(options.output.filenameCss, {
          allChunks: true,
        }),
      ];

      if (process.env.NODE_ENV === 'production') {
        plugins.push(new webpack.optimize.DedupePlugin());
        plugins.push(new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
          },
          sourceMap: false,
          test: /\.js$/,
          exclude: /node_modules/,
        }));
      }

      return plugins;
    })(),
  };
};
