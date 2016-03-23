var cp = require('child_process');
var path = require('path');

var builder = {};

builder.watch = function() {
  var command = cp.spawn(path.join(process.cwd(), "node_modules", ".bin", "webpack"), [
    "--watch",
    "--colors",
    "--config", path.join(path.resolve(__dirname), "webpack.config.js"),
  ]);

  command.stdout.on('data', function(message) {
    process.stdin.write(message);
  });

  command.stderr.on('data', function(message) {
    process.stderr.write(message);
  });
};

module.exports = builder;
