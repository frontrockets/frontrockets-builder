var cp = require('child_process');
var path = require('path');

var builder = {
  // It will be filled by bin/cli.js
  arguments: [],
};

var executeCommand = function(command, argv) {
  var command = cp.spawn(command, argv, {
    env: (function(builderArgv) {
      if (builderArgv.length) {
        return Object.assign({}, process.env, {
          __FRONTROCKETS_CONFIG_PATH: builderArgv[0],
        });
      } else {
        return process.env;
      }
    })(builder.arguments),
  });

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
