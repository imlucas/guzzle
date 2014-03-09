#!/usr/bin/env node
"use strict";

var yargs = require('yargs')
    .usage('Bootstrap a project.\nguz [type] [name]')
    .demand(2),
  argv = yargs.argv,
  _ = require('underscore'),
  pkg = {
    type: argv._[0],
    name: argv._[1]
  }, files = {};


var pkgs = {
  ui: function(pkg){
    return {
      'package.json': {
        scripts: {
          "start": "gulp dev",
          "test": "mocha"
        },
        homepage: 'http://github.com/imlucas/' + pkg.name,
        devDependencies: {
          mocha: "^1.17.1",
          gulp: "^3.5.2",
          guzzle: "imlucas/guzzle"
        },
        repository: {
          type: 'git',
          url: 'git://github.com/imlucas/' + pkg.name
        }
      }
    };
  }
};

files['package.json'] = {
  name: pkg.name,
  description: '@todo',
  author: 'Lucas Hrabovsky <hrabovsky.lucas@gmail.com> (http://imlucas.com)',
  version: '0.0.1',
  guzzle: pkg.type,
  dependencies: {},
  license: 'MIT'
};

_.extend(files['package.json'], pkgs[pkg.type](pkg)['package.json']);
console.log('files:', files);

var gulp = require('gulp');
gulp.dest('./test');

// fs.writeFile('package.json')



