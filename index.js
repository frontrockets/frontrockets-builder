var path = require('path');
var webpack = require('webpack');

module.exports = {
  watch: function(optionsPath) {
    return loadWebpack('development', optionsPath, "Start, sir!\n").watch({}, callback);
  },

  build: function(optionsPath) {
    return loadWebpack('production', optionsPath, "Okay...\n").run(callback);
  }
};

function loadWebpack(environment, optionsPath, message) {
  process.stdout.write(message);

  return webpack(loadConfig(environment, optionsPath));
};

function loadConfig(environment, optionsPath) {
  process.env.NODE_ENV = process.env.NODE_ENV || environment;

  if (optionsPath) {
    process.env.FRONTROCKETS_CONFIG_PATH = optionsPath;
  }

  return require(path.resolve(__dirname, 'config.js'));
};

function callback(err, stats) {
  if (err) {
    return console.log(err);
  }

  console.log("\n", stats.toString({
    colors: true,
    version: false,
    chunks: false,
  }));
};
