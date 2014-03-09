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

files['package.json'] = JSON.stringify(_.extend(files['package.json'],
  pkgs[pkg.type](pkg)['package.json']), null, 2);

_.extend(files, {'gulpfile.js': "require('guzzle')();"});


var gulp = require('gulp'),
  es = require('event-stream'),
  File = require('gulp-util').File,
  exec = require('child_process').exec,
  path = require('path');

var fudge = function(contents){
  return es.readable(function (_, fn) {
    this.emit('data', new File({
      path: '.',
      contents: new Buffer(contents)
    }));
    this.emit('end');
    fn();
  });
};

var npm = {
  install: function(){
    return es.map(function(file, fn){
      exec('npm install', {cwd: path.dirname(file.path)}, function(err){
        fn(err, file);
      });
    });
  },
  link: function(name){
    return es.map(function(file, fn){
      exec('npm link ' + name, {cwd: path.dirname(file.path)}, function(err){
        fn(err, file);
      });
    });
  }
};

var dest = process.cwd() + '/' + pkg.name;

gulp.task('default', function(){
  fudge(files['package.json'])
    .pipe(gulp.dest(dest + '/package.json'))
    .pipe(npm.install())
    .pipe(npm.link('guzzle'));

  fudge("require('guzzle')(require('gulp'));")
    .pipe(gulp.dest(dest + '/gulpfile.js'));
});



//   function CompileJade(file, enc, cb){
//     opts.filename = file.path;
//     file.path = handleExtension(file.path, opts);

//     if(file.isStream()){
//       this.emit('error', new PluginError('gulp-jade', 'Streaming not supported'));
//       return cb();
//     }

//     if(file.isBuffer()){
//       try {
//         file.contents = new Buffer(handleCompile(String(file.contents), opts));
//       } catch(e) {
//         this.emit('error', e);
//       }
//     }

//     this.push(file);
//     cb();
//   }

// return through.obj(CompileJade);

gulp.start('default');
// fs.writeFile('package.json')



