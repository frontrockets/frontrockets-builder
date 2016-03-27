var loadFolder = function(entry) {
  var result = [];

  if (Array.isArray(entry)) {
    var files = [];
    entry.map(function(extension) {
      if (/^\..+$/.test(extension)) {
        files.push('(?!{entryName}\\' + extension + ').*\\' + extension);
      } else if (typeof extension === 'string') {
        files.push(extension);
      } else {
        files.push(loadFolder(extension));
      }
    });
    result.push('(' + files.join('|') + ')');

  } else {
    var folders = [];
    for (var folderName in entry) {
      folders.push(folderName + '/' + loadFolder(entry[folderName]).join('|'));
    }
    result.push('(' + folders.join('|') + ')');
  }

  return result;
};

var getEntriesRegExp = function(points, name) {
  regexp = loadFolder(points).join('|').replace(/{entryName}/g, name);

  return new RegExp(regexp + '$');
};

var entryPointCode = function(data, name) {
  return 'var r=require.context("./../../app/",!0,' + getEntriesRegExp(data, name) + ');r.keys().map(r);';
};

var path = require('path');
var fs = require('fs');

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
