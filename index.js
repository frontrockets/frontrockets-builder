var path = require('path');
var webpack = require('webpack');

var callbacks = {
  configReady: [],
};

module.exports = {
  watch: function(optionsPath) {
    return loadWebpack('development', optionsPath, "Start, sir!\n").watch({}, callback);
  },

  build: function(optionsPath) {
    return loadWebpack('production', optionsPath, "Okay...\n").run(callback);
  },

  onConfigReady: function(callback) {
    var string = toString.call(callback);
    if (string === '[object Function]' || (typeof callback === 'function' && string !== '[object RegExp]')) {
      callbacks.configReady.push(callback);
    }
  }
};

function loadWebpack(environment, optionsPath, message) {
  process.stdout.write(message);

  var config = loadConfig(environment, optionsPath);

  callbacks.configReady.forEach(function(callback) {
    config = callback(config);
  });

  return webpack(config);
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
