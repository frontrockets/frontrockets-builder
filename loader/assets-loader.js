var path = require('path');
var urlLoader = require('url-loader');
var loaderUtils = require('loader-utils');

var getFixString = function(query) {
  return function(source, block) {
    return source.replace(block, query.publicPrefix + path.parse(block).base);
  };
};

module.exports = function(content) {
  this.cacheable && this.cacheable();

  var query = loaderUtils.parseQuery(this.query);
  var string = urlLoader.call(this, content);

  if (/__webpack_public_path__/.test(string)) {
    fixString = getFixString(query);
    string = string.replace(/^module\.exports\s=[^"]+"([^"]+)".*$/, fixString);
  }

  return string;
};

module.exports.raw = true;
