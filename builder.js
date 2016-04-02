var cp = require('child_process');
var path = require('path');

var builder = {};

var executeCommand = function(command, argv) {
  var command = cp.spawn(command, argv);

  command.stdout.on('data', function(message) {
    process.stdin.write(message);
  });

  command.stderr.on('data', function(message) {
    process.stderr.write(message);
  });
};

var executeWebpackCommand = function(argv) {
  return executeCommand(path.join(process.cwd(), "node_modules", ".bin", "webpack"), argv);
};

var pathToWebpackConfig = path.join(path.resolve(__dirname), "webpack.config.js")

builder.watch = function() {
  process.stdout.write("Start, sir!\n");
  return executeWebpackCommand([
    "--watch", "--colors", "--config", pathToWebpackConfig
  ]);
};

builder.build = function() {
  process.stdout.write("Okay...\n");
  return executeWebpackCommand([
    "-p", "--colors", "--config", pathToWebpackConfig
  ]);
};

module.exports = builder;
