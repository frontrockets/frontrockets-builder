#!/usr/bin/env node

var builder = require('../builder.js');
var argv = process.argv;

argv.splice(0, 2);

switch(argv[0]) {
  case "build":
    builder.build();
    break;

  case "start":
  default:
    builder.watch();
}
