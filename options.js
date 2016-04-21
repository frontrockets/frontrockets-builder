module.exports = {
  entry: {
    application: './tests/application.entry.js',
  },
  outputPath: './tests/build',

  outputCssFilename: '[name].css',
  outputJsFilename: '[name].js',
  outputImageFilename: '[name].[ext]',
  publicPrefixImage: '',

  babel_presets: [],
};
