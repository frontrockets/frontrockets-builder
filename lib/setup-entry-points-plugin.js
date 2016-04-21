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

function SetupEntryPoints(options) {};

SetupEntryPoints.prototype.apply = function(compiler) {
  var pathDest = './tmp/entry_points';

  mkpath.sync(pathDest);

  for (var entryName in compiler.options.entry) {
    var filePath = path.resolve(pathDest, entryName + '.js');

    fs.writeFileSync(filePath, entryPointCode(compiler.options.entry[entryName], entryName), 'utf-8');

    compiler.options.entry[entryName] = filePath;
  }
};

module.exports = SetupEntryPoints;
