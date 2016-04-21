var path = require('path');
var webpack = require('webpack');

builder.watch = function(configPath) {
  var config = loadConfig('development', configPath);

  process.stdout.write("Start, sir!\n");
  webpack(config).watch({}, callback({
    colors: true,
  }));
};

builder.build = function(configPath) {
  var config = loadConfig('production', configPath)

  process.stdout.write("Okay...\n");
  webpack(config).run(callback())
};

function loadConfig(environment, configPath) {
  process.env.NODE_ENV = process.env.NODE_ENV || environment;

  if (configPath) {
    process.env.FRONTROCKETS_CONFIG_PATH = configPath;
  }

  return require(path.resolve(__dirname, 'webpack.config.js'));
};

function callback(options) {
  var data = Object.assign({}, {
    version: false,
    chunks: false,
  }, options || {});

  return function(err, stats) {
    if (err) {
      return console.log(err);
    }

    console.log("\n", stats.toString(data));
  };
}

module.exports = builder;
