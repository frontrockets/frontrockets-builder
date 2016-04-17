#!/usr/bin/env node

var builder = require('../builder.js');
var argv = process.argv;

argv.splice(0, 2);

builder.arguments = argv;

switch(argv[0]) {
  case "build":
    argv.splice(0, 1);
    builder.build();
    break;

  case "start":
    argv.splice(0, 1);
    builder.watch();
    break;

  default:
    builder.watch();
}
