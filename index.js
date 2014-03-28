"use strict";

var browserify = require('gulp-browserify'),
  less = require('gulp-less'),
  jade = require('gulp-jade'),
  ecstatic = require('ecstatic'),
  http = require('http'),
  ltld = require('local-tld-lib'),
  fs = require('fs');

var debug = function(){
    var args = ['guz:'];
    Array.prototype.slice.call(arguments, 0).map(function(a){
      if(Array.isArray(a) || typeof a === 'object'){
        a = JSON.stringify(a, null, 2);
      }
      args.push(a);
    });

    require('gulp-util').log.apply(this, args);
};

module.exports = function(gulp, dir){
  dir = dir || process.cwd();
  var data = fs.readFileSync(dir + '/package.json', 'utf-8');
  var pkg = JSON.parse(data),
    type = pkg.guzzle || 'gulp plugin';
  pkg.dir = dir;

  return gulps[type](pkg, gulp);
};

// Different types of project templates
var gulps = {
  ui: function(pkg, gulp){
    var name = pkg.name,
      dest = pkg.dir + '/.' + name,
      src = pkg.dir,
      nm = '!' + src + '/node_modules/**',
      sources = {
        js: [src + '/index.js'],
        pages: [nm, src + '/{*,**/*}.jade'],
        files: [
          src + '/{img,fonts,json,csv}/*',
          src + '/*.html'
        ],
        less: [src + '/less/*.less']
      },
      keys = Object.keys(sources);

    debug('sources ->', sources);

    gulp.task('files', function(){
      gulp.src(sources.files)
        .pipe(gulp.dest(dest));
    });

    gulp.task('pages', function(){
      gulp.src(sources.pages)
        .pipe(jade({}))
        .pipe(gulp.dest(dest));
    });

    gulp.task('js', function(){
      gulp.src(sources.js)
        .pipe(browserify({debug : false}))
        .pipe(gulp.dest(dest));
    });

    gulp.task('less', function(){
      gulp.src(sources.less)
        .pipe(less({}))
        .pipe(gulp.dest(dest));
    });


    gulp.task('watch', function (){
      keys.map(function(k){
        gulp.watch(sources[k], [k]);
      });
    });

    gulp.task('build', keys);

    gulp.task('serve', function(){
      http.createServer(ecstatic({root: dest}))
        .listen(ltld.getPort(name));

      debug('-> http://' + name + '.dev/', '-> ', 'http://localhost:' + ltld.getPort(name) + '/');
    });

    gulp.task('github-pages', function(){
      var exec = require('child_process').exec,
        msg, cmd,
        remote = pkg.repository.url.replace('git://github.com/', 'git@github.com:');

      debug('deploying', remote);
      exec('git log --oneline HEAD | head -n 1', {cwd: src}, function(err, stdout){
        msg = stdout.toString();
        debug('last commit', msg);

        cmd = [
          'git init',
          'rm -rf .DS_Store **/.DS_Store',
          'git add .',
          'git commit -m "Deploy: ' + msg + '"',
          'git push --force ' + remote + ' master:gh-pages',
          'rm -rf .git'
        ].join('&&');

        exec(cmd, {cwd: dest}, function(){
          debug('deployed');
        });
      })
    });

    gulp.task('deploy', ['build', 'github-pages']);

    gulp.task('dev', ['build', 'serve', 'watch']);
  },
  'gulp plugin': function (pkg, gulp){
    gulp.task('default', function(){
      debug('@todo');
    });
  },
  cli: function(pkg, gulp){
    gulp.task('default', function(){
      debug('@todo');
    });
  },
  rest: function(pkg, gulp){
    gulp.task('default', function(){
      debug('@todo');
    });
  }
};
