///* jshint camelcase:false */
//var gulp = require('gulp');
//var browserSync = require('browser-sync');
//var del = require('del');
//var glob = require('glob');

var gulp = require('gulp-param')(require('gulp'), process.argv),
  mocha = require("gulp-mocha"),
  istanbul = require('gulp-istanbul'),
  bench = require('gulp-bench'),
  uglify = require('gulp-uglify'),
  rimraf = require('gulp-rimraf'),
  bump = require('gulp-bump'),
  replace = require('gulp-replace'),
  rename = require('gulp-rename'),
  browserify = require('gulp-browserify'),
  SRC = 'index.js',
  DEST = 'dist',
  SRC_COMPILED = 'safe.accessors.js',
  MIN_FILE = 'safe.accessors.min.js',
  VERSION_FILES = ['./package.json', './component.json', './bower.json'];
VERSION_FILES_JS = [SRC, 'package.js'];

gulp.task('test', ['browserify'], function(cov) {
  var reporters = ['html'];

  if (cov) {
    reporters.push('text');
  } else {
    reporters.push('text-summary');
  }

  return gulp.src(['isVoid.js', 'safeGet.js', 'safeCall.js', 'safeSet.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      return gulp.src(['test/specs/*.js'])
        .pipe(
          mocha({
            globals: '*',
            reporter: 'dot'
          })
        )
        .pipe(istanbul.writeReports({
          reporters: reporters
        }));
    });
});

gulp.task('bench', ['browserify'], function(func) {
  func = func || '*';
  return gulp.src('bench/'+ func + '.js')
    .pipe(bench());
});

gulp.task('browserify', function() {
  return gulp.src(['index.js'])
    .pipe(browserify())
    .pipe(rename('safe.accessors.js'))
    .pipe(gulp.dest(DEST));
});

gulp.task('clean', function() {
  return gulp.src(DEST)
    .pipe(rimraf());
});

gulp.task('bump-in-js', function(semver) {
  return gulp.src(VERSION_FILES_JS)
    .pipe(replace(/(version?\s?=?\:?\s\')([\d\.]*)\'/gi, '$1' + semver + "'"))
    .pipe(gulp.dest('./'));
});

// usage: gulp bump -s <% Version %>
// usage: gulp bump --semver <% Version %>
gulp.task('bump', ['bump-in-js'], function(semver) {
  if (typeof semver !== 'string' || semver.length <= 0) {
    console.error('pass a new version `gulp bump --semver 2.4.1`');
    process.exit(1);
  }

  return gulp.src(VERSION_FILES)
    .pipe(bump({
      version: semver
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('build', ['test', 'clean'], function() {
  gulp.src(DEST + '/' + SRC_COMPILED)
    .pipe(uglify())
    .pipe(rename(MIN_FILE))
    .pipe(gulp.dest(DEST));
});
