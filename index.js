"use strict";

var gulp = require('gulp'),
  gutil = require('gulp-util'),
  browserify = require('gulp-browserify'),
  ecstatic = require('ecstatic'),
  http = require('http'),
  ltld = require('local-tld-lib'),
  fs = require('fs');

module.exports = function(){
  fs.readFile(process.cwd() + '/package.json', 'utf-8', function(err, data){
    if(err) return console.error(err);
    var pkg = JSON.parse(data),
      type = pkg.guzzle || 'gulp plugin';

    return gulps[type](pkg);
  });
};

// Different types of project templates
var gulps = {
  ui: function(pkg){
    var dest = './.' + name,
      src ='./' + name,
      files = [src + '/{img,fonts,css,json,csv}/*', src + '/*.html'];

    gulp.task('js', function(){
      gulp.src(src + '/*.js')
        .pipe(browserify({debug : false}))
        .pipe(gulp.dest(dest));
    });

    gulp.task('watch', function (){
      gulp.watch(['!node_modules/**', src + '/{*,**/*}.{js}'], ['js']);
      gulp.watch(files, ['cp']);
    });

    gulp.task('cp', function(){
      gulp.src(files).pipe(gulp.dest(dest));
    });

    gulp.task('serve', function(){
      http.createServer(ecstatic({root: dest}))
        .listen(ltld.getPort(name));
      console.log('-> http://' + name + '.dev/');
    });

    gulp.task('build', ['js', 'cp']);
    gulp.task('dev', ['build', 'serve', 'watch']);
  },
  'gulp plugin': function (){
    gulp.task('default', function(){
      console.log('@todo');
    });
  },
  cli: function(){
    gulp.task('default', function(){
      console.log('@todo');
    });
  },
  rest: function(){
    gulp.task('default', function(){
      console.log('@todo');
    });
  }
};
