"use strict";

console.log('in guzzle');

var browserify = require('gulp-browserify'),
  ecstatic = require('ecstatic'),
  http = require('http'),
  ltld = require('local-tld-lib'),
  fs = require('fs');

module.exports = function(gulp, dir){
  dir = dir || process.cwd();
  var data = fs.readFileSync( + '/package.json', 'utf-8');
  var pkg = JSON.parse(data),
    type = pkg.guzzle || 'gulp plugin';
  pkg.dir = dir;

  return gulps[type](pkg, gulp);
};

// Different types of project templates
var gulps = {
  ui: function(pkg, gulp){
    var name = pkg.name,
      dest = pkg.dir + './.' + name,
      src = pkg.dir + './',
      files = [src + '/{img,fonts,css,json,csv}/*', src + '/*.html'];

    gulp.task('js', function(){
      gulp.src(src + '/*.js')
        .pipe(browserify({debug : false}))
        .pipe(gulp.dest(dest));
    });

    gulp.task('watch', function (){
      gulp.watch(['!' + src + '/node_modules/**', src + '/{*,**/*}.{js}'], ['js']);
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
  'gulp plugin': function (pkg, gulp){
    gulp.task('default', function(){
      console.log('@todo');
    });
  },
  cli: function(pkg, gulp){
    gulp.task('default', function(){
      console.log('@todo');
    });
  },
  rest: function(pkg, gulp){
    gulp.task('default', function(){
      console.log('@todo');
    });
  }
};
