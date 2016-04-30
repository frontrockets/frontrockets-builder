var path = require('path');

module.exports = function(options, patch) {
  var config = require(path.resolve(__dirname, 'config.js'))(options);

  return patch ? patch(config) : config;
};
