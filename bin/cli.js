#!/usr/bin/env node

var builder = require('../builder.js');
var argv = process.argv;

argv.splice(0, 2);

switch(argv[0]) {
  case "start":
    process.stdout.write("Start, sir!\n");
    builder.watch();
    break;

  case "build":
    process.stdout.write("Okay...\n");
    break;

  default:
    process.exit()
}
