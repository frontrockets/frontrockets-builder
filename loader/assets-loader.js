var path = require('path');
var urlLoader = require('url-loader');

var fixString = function(source, block) {
  return source.replace(block, path.parse(block).base);
}

module.exports = function(content) {
  var string = urlLoader.call(this, content);

  if (/__webpack_public_path__/.test(string)) {
    string = string.replace(/^module\.exports\s=[^"]+"([^"]+)".*$/, fixString);
  }

  return string;
};

module.exports.raw = true;
