var path = require('path');
var fs = require('fs');
var mkpath = require('mkpath');

var entryPointCode = function(data, name) {
  text = '';

  for (var kind in data) {
    text += 'require("'+ path.join(process.cwd(), data[kind]) +'");';
  }

  return text;
};

module.exports = function(entry) {
  var pathDest = './tmp/entry_points';
  var result = {};

  mkpath.sync(pathDest);

  for (var entryName in entry) {
    var filePath = path.resolve(pathDest, entryName + '.js');

    fs.writeFileSync(filePath, entryPointCode(entry[entryName], entryName), 'utf-8');

    result[entryName] = filePath;
  }

  return result;
};
