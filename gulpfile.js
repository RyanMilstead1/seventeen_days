'use strict';

var q = require('q');
var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpIf = require('gulp-if');
var bower = require('bower');
var debug = require('gulp-debug');
var concat = require('gulp-concat');
var inject = require('gulp-inject-string');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var babel = require('gulp-babel');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var childProcess = require('child_process');

var paths = {
  sass: ['./scss/**/*.scss'], //should we do env-specific scss?
  js: {
    src: ['./www/app/**/!(*.env.*)*.js',`./www/app/**/*.env.${getEnvironmentName()}.js`],
    libs: [
      './www/lib/ionic/js/ionic.bundle.js',
      './www/lib/ngCordova/dist/ng-cordova.js',
      './www/lib/angular-animate/angular-animate.js',
      './www/lib/angular-resource/angular-resource.js',
      './www/lib/angular-sanitize/angular-sanitize.js',
      './www/lib/angular-ui-router/release/angular-ui-router.js',
      './www/lib/ng-token-auth/dist/ng-token-auth.js',
      './www/lib/angular-cookie/angular-cookie.js',
      './www/lib/jquery/dist/jquery.js',
      './www/lib/bootstrap/dist/js/bootstrap.js',
      './www/lib/angular-route/angular-route.min.js',
      './www/lib/angular-cookies/angular-cookies.min.js',
      './www/lib/moment/moment.js',
      './www/lib/videogular/videogular.js',
      './www/lib/videogular-overlay-play/vg-overlay-play.js',
      './www/lib/videogular-buffering/vg-buffering.js'
    ]
  }
};

console.log('environment asserted [' + getEnvironmentName() + ']');

function fn(wrappedFn){
  return function(){
    wrappedFn();
  }
}

function environmentIsNot(environ){
  return getEnvironmentName() !== environ;
}

function environmentIsNotDev(){
  return environmentIsNot('remote_development') && environmentIsNot('development');
}

function environmentIsDev(){
  return !environmentIsNotDev();
}

function spawnIonicProc(){
  var defer = q.defer();
  function log(s){ console.log(s.toString('utf8')); }
  function error(s) { console.error(s.toString('utf8')); }
  var proc = childProcess.spawn('ionic', ['serve']);
  proc.stdout.on('data', log);
  proc.stderr.on('data', error);
  proc.on('close', (code) => { proc.kill(); });
  return defer.promise;
}

function getArgumentValueFor(target){
  var args = process.argv.slice(2);
  for (var i =0;i<args.length;i++){
    if (args[i] === target){
      if (args[i+1]){
        return args[i+1].trim();
      }
    }
  }
}

function getEnvironmentName(){
  return getArgumentValueFor('-e') || 'development';
}

function assertEnvironment(){

  if (process.env.environmentSet) { return q(); }

  var env = getEnvironmentName();
  console.log('environment asserted [' + env + ']');
  return q();
}

function bundleSrcStream(){
  var defer = q.defer(),
      envPreprended = false,
      prependPredicate = function(){
        if (!envPreprended){
          envPreprended = true;
          return false;
        }
        return envPreprended;
      }
  gulp.src(paths.js.src)
    .pipe(gulpIf(environmentIsDev(), debug({title: 'concatenating application js file:'})))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(ngAnnotate())
    // .pipe(gulpIf(prependPredicate(), inject.prepend(';this.seventeen_days_environment= "' + getEnvironmentName() + '";\n')))
    .pipe(gulpIf(environmentIsNotDev(), uglify()))
    .pipe(concat('application.js'))
    .pipe(gulp.dest('./www/js'))
    .on('finish', function(){
      var minified = environmentIsNotDev() ? ', uglified, ' : ' ';
      console.log('application js concatenation complete' + minified + 'and written');
      defer.resolve();
    });
  return defer.promise;
}

function sassStream() {
  var defer = q.defer();
  gulp.src('./scss/ionic.app.scss')
    .pipe(gulpIf(environmentIsDev(), debug({title: 'concatenating scss/css file:'})))
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(
      gulpIf(
        environmentIsNotDev(),
        minifyCss({
          keepSpecialComments: 0
        })
      )
    )
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('finish', function(){
      var minified = environmentIsNotDev() ? ', minified, ' : ' ';
      console.log('sass/css concatenation complete' + minified + 'and written');
      defer.resolve();
    });
    return defer.promise;
}

function bundleLibStream() {
  var defer = q.defer();
  gulp.src(paths.js.libs)
    .pipe(gulpIf(environmentIsDev(), debug({title: 'concatenating vendor js file:'})))
    .pipe(gulpIf(environmentIsNotDev(), uglify()))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./www/js'))
    .on('finish', function(){
      var minified = environmentIsNotDev() ? ', uglified, ' : ' ';
      console.log('vendor js concatenation complete' + minified + 'and written');
      defer.resolve();
    });
  return defer.promise;
}

function build(){
  return sassStream().then(function(){
      return bundleSrcStream();
    })
    .then(function(){
      return bundleLibStream();
    });
}

function watchTaskPromise(){
  return build()
    .then(function(){
      console.log('adding watches on sass, application js, and vendor js -->')
      gulp.watch(paths.sass, fn(sassStream));
      gulp.watch(paths.js.src, fn(bundleSrcStream));
      gulp.watch(paths.js.libs, fn(bundleLibStream));
      return q();
    });

}

gulp.task('build', fn(build))

gulp.task('default', ['build']);

gulp.task('sass', fn(sassStream));

gulp.task('bundleSrc', fn(bundleSrcStream));

gulp.task('bundleLib', fn(bundleLibStream));

gulp.task('build', fn(build));

gulp.task('watch', fn(watchTaskPromise));

gulp.task('run:local', function(){
  watchTaskPromise()
    .then(function(){
      return spawnIonicProc()
      .then(function(){
        console.log('all done');
      });
    });

});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
