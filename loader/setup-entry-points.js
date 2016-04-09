var path = require('path');
var fs = require('fs');

var entryPointCode = function(data, name) {
  text = '';

  for (var kind in data) {
    text += 'require("'+ path.join(process.cwd(), data[kind]) +'");';
  }

  return text;
};

function SetupEntryPoints(options) {};

SetupEntryPoints.prototype.apply = function(compiler) {
  try {
    fs.statSync('./tmp');
  } catch(e) {
    fs.mkdirSync('./tmp');
  }

  try {
    fs.statSync('./tmp/entry_points');
  } catch(e) {
    fs.mkdirSync('./tmp/entry_points');
  }

  for (var entryName in compiler.options.entry) {
    var filePath = './tmp/entry_points/' + entryName + '.js';

    fs.writeFileSync(filePath, entryPointCode(compiler.options.entry[entryName], entryName), 'utf-8');

    compiler.options.entry[entryName] = filePath;
  }
};

module.exports = SetupEntryPoints;
