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

var gulp = require('gulp'),
  es = require('event-stream'),
  File = require('gulp-util').File,
  exec = require('child_process').exec,
  path = require('path');

var fakeit = function(name, contents){
  return es.readable(function (_, fn) {
    this.emit('data', new File({
      path: name,
      contents: new Buffer(contents)
    }));
    this.emit('end');
    fn();
  });
};

gulp.task('default', function(){
  fakeit('.', JSON.stringify(files['package.json'], null, 2))
    .pipe(gulp.dest('./test/package.json'))
    .pipe(function(){
      return es.map(function(file, fn){
        exec('npm install', {cwd: path.dirname(file.path)}, function(err){
          fn(err, file);
        });
      });
    }());
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



