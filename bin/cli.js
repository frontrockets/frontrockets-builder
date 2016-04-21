#!/usr/bin/env node

var builder = require('./../index');
var argv = process.argv;

argv.splice(0, 2);

switch(argv[0]) {
  case 'build':
    argv.splice(0, 1);
    builder.build(argv[0]);
    break;

  case 'start':
    argv.splice(0, 1);
    builder.watch(argv[0]);
    break;

  default:
    builder.watch();
}
