var path = require('path');

var webpack = require('webpack');

var builder = {
  // It will be filled by bin/cli.js
  arguments: [],
};

var loadConfig = function(environment) {
  process.env.NODE_ENV = process.env.NODE_ENV || environment;

  if (builder.arguments[0]) {
    process.env.FRONTROCKETS_CONFIG_PATH = builder.arguments[0];
  }

  return require(path.resolve(__dirname, 'webpack.config.js'));
};

builder.watch = function() {
  process.stdout.write("Start, sir!\n");
  webpack(loadConfig('development')).watch({}, callback({
    colors: true,
  }));
};

builder.build = function() {
  process.stdout.write("Okay...\n");
  webpack(loadConfig('production')).run(callback())
};

module.exports = builder;

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
