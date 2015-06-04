/* jshint camelcase:false */
var gulp = require('gulp');
var browserSync = require('browser-sync');
var del = require('del');
var glob = require('glob');
var karma = require('karma').server;
var merge = require('merge-stream');
var paths = require('./gulp.config.json');
var plato = require('plato');
var plug = require('gulp-load-plugins')();
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var env = plug.util.env;
var log = plug.util.log;
var port = process.env.PORT || 7203;
var SRC = 'index.js';
var DEST = 'dist';

/**
 * List the available gulp tasks
 */
gulp.task('help', plug.taskListing);

/**
 * Lint the code, create coverage report, and a visualizer
 * @return {Stream}
 */
gulp.task('analyze', function() {
  log('Analyzing source with JSHint, JSCS, and Plato');

  var jshint = analyzejshint([].concat(paths.js, paths.specs, paths.nodejs));
  var jscs = analyzejscs([].concat(paths.js, paths.nodejs));

  //startPlatoVisualizer();

  return merge(jshint, jscs);
});

/**
 * Minify and bundle the app's JavaScript
 * @return {Stream}
 */
gulp.task('js', ['analyze'], function() {
  log('Bundling, minifying, and copying the app\'s JavaScript');

  var source = [].concat(paths.js, paths.build + 'templates.js');
  return gulp
    .src(source)
    // .pipe(plug.sourcemaps.init()) // get screwed up in the file rev process
    .pipe(plug.concat('all.min.js'))
    .pipe(plug.ngAnnotate({
      add: true,
      single_quotes: true
    }))
    .pipe(plug.bytediff.start())
    .pipe(plug.uglify({
      mangle: true
    }))
    .pipe(plug.bytediff.stop(bytediffFormatter))
    // .pipe(plug.sourcemaps.write('./'))
    .pipe(gulp.dest(paths.build));
});

/**
 * Copy the Vendor JavaScript
 * @return {Stream}
 */
gulp.task('vendorjs', function() {
  log('Bundling, minifying, and copying the Vendor JavaScript');

  return gulp.src(paths.vendorjs)
    .pipe(plug.concat('vendor.min.js'))
    .pipe(plug.bytediff.start())
    .pipe(plug.uglify())
    .pipe(plug.bytediff.stop(bytediffFormatter))
    .pipe(gulp.dest(paths.build));
});

/**
 * Minify and bundle the CSS
 * @return {Stream}
 */
gulp.task('css', function() {
  log('Bundling, minifying, and copying the app\'s CSS');

  return gulp.src(paths.css)
    .pipe(plug.concat('all.min.css')) // Before bytediff or after
    .pipe(plug.autoprefixer('last 2 version', '> 5%'))
    .pipe(plug.bytediff.start())
    .pipe(plug.minifyCss({}))
    .pipe(plug.bytediff.stop(bytediffFormatter))
    //        .pipe(plug.concat('all.min.css')) // Before bytediff or after
    .pipe(gulp.dest(paths.build + 'content'));
});

/**
 * Minify and bundle the Vendor CSS
 * @return {Stream}
 */
gulp.task('vendorcss', function() {
  log('Compressing, bundling, copying vendor CSS');

  var vendorFilter = plug.filter(['**/*.css']);

  return gulp.src(paths.vendorcss)
    .pipe(vendorFilter)
    .pipe(plug.concat('vendor.min.css'))
    .pipe(plug.bytediff.start())
    .pipe(plug.minifyCss({}))
    .pipe(plug.bytediff.stop(bytediffFormatter))
    .pipe(gulp.dest(paths.build + 'content'));
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('fonts', function() {
  var dest = paths.build + 'fonts';
  log('Copying fonts');
  return gulp
    .src(paths.fonts)
    .pipe(gulp.dest(dest));
});

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', function() {
  var dest = paths.build + 'content/images';
  log('Compressing, caching, and copying images');
  return gulp
    .src(paths.images)
    .pipe(plug.cache(plug.imagemin({
      optimizationLevel: 3
    })))
    .pipe(gulp.dest(dest));
});

/**
 * Inject all the files into the new index.html
 * rev, but no map
 * @return {Stream}
 */
gulp.task('rev-and-inject', ['js', 'vendorjs', 'css', 'vendorcss'], function() {
  log('Rev\'ing files and building index.html');

  var minified = paths.build + '**/*.min.*';
  var index = paths.client + 'index.html';
  var minFilter = plug.filter(['**/*.min.*', '!**/*.map']);
  var indexFilter = plug.filter(['index.html']);

  var stream = gulp
    // Write the revisioned files
    .src([].concat(minified, index)) // add all built min files and index.html
    .pipe(minFilter) // filter the stream to minified css and js
    .pipe(plug.rev()) // create files with rev's
    .pipe(gulp.dest(paths.build)) // write the rev files
    .pipe(minFilter.restore()) // remove filter, back to original stream

    // inject the files into index.html
    .pipe(indexFilter) // filter to index.html
    .pipe(inject('content/vendor.min.css', 'inject-vendor'))
    .pipe(inject('content/all.min.css'))
    .pipe(inject('vendor.min.js', 'inject-vendor'))
    .pipe(inject('all.min.js'))
    .pipe(gulp.dest(paths.build)) // write the rev files
    .pipe(indexFilter.restore()) // remove filter, back to original stream

    // replace the files referenced in index.html with the rev'd files
    .pipe(plug.revReplace()) // Substitute in new filenames
    .pipe(gulp.dest(paths.build)) // write the index.html file changes
    .pipe(plug.rev.manifest()) // create the manifest (must happen last or we screw up the injection)
    .pipe(gulp.dest(paths.build)); // write the manifest

  function inject(path, name) {
    var pathGlob = paths.build + path;
    var options = {
      ignorePath: paths.build.substring(1),
      read: false
    };
    if (name) {
      options.name = name;
    }
    return plug.inject(gulp.src(pathGlob), options);
  }
});

/**
 * Build the optimized app
 * @return {Stream}
 */
gulp.task('build', ['rev-and-inject', 'images', 'fonts'], function() {
  log('Building the optimized app');

  return gulp.src('').pipe(plug.notify({
    onLast: true,
    message: 'Deployed code!'
  }));
});

/**
 * Backwards compatible call to make stage and build equivalent
 */
gulp.task('stage', ['build'], function() {});

/**
 * Remove all files from the build folder
 * One way to run clean before all tasks is to run
 * from the cmd line: gulp clean && gulp build
 * @return {Stream}
 */
gulp.task('clean', function(cb) {
  log('Cleaning: ' + plug.util.colors.blue(paths.build));

  var delPaths = [].concat(paths.build, paths.report);
  del(delPaths, cb);
});

/**
 * Watch files and build
 */
gulp.task('watch', function() {
  log('Watching all files');

  var css = ['gulpfile.js'].concat(paths.css, paths.vendorcss);
  var images = ['gulpfile.js'].concat(paths.images);
  var js = ['gulpfile.js'].concat(paths.js);

  gulp
    .watch(js, ['js', 'vendorjs'])
    .on('change', logWatch);

  gulp
    .watch(css, ['css', 'vendorcss'])
    .on('change', logWatch);

  gulp
    .watch(images, ['images'])
    .on('change', logWatch);

  function logWatch(event) {
    log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
  }
});

gulp.task('browserify', function() {
  return gulp.src(SRC)
    .pipe(browserify({
      detectGlobals: true,
      standalone: 'sa'
    }))
    .pipe(rename('safeaccessors.js'))
    .pipe(gulp.dest(DEST));
});

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
gulp.task('test', ['browserify'], function(done) {
  startTests(true /*singleRun*/ , done);
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run midway specs as well:
 *    gulp autotest --startServers
 */
gulp.task('autotest', function(done) {
  startTests(false /*singleRun*/ , done);
});

/**
 * serve the dev environment, with debug,
 * and with node inspector
 */
gulp.task('serve-dev-debug', function() {
  serve({
    mode: 'dev',
    debug: '--debug'
  });
});

/**
 * serve the dev environment, with debug-brk,
 * and with node inspector
 */
gulp.task('serve-dev-debug-brk', function() {
  serve({
    mode: 'dev',
    debug: '--debug-brk'
  });
});

/**
 * serve the dev environment
 */
gulp.task('serve-dev', function() {
  serve({
    mode: 'dev'
  });
});

/**
 * serve the build environment
 */
gulp.task('serve-build', function() {
  serve({
    mode: 'build'
  });
});

/**
 * Backwards compatible call to make stage and build equivalent
 */
gulp.task('serve-stage', ['serve-build'], function() {});

////////////////

/**
 * Execute JSHint on given source files
 * @param  {Array} sources
 * @param  {String} overrideRcFile
 * @return {Stream}
 */
function analyzejshint(sources, overrideRcFile) {
  var jshintrcFile = overrideRcFile || './.jshintrc';
  log('Running JSHint');
  log(sources);
  return gulp
    .src(sources)
    .pipe(plug.jshint(jshintrcFile))
    .pipe(plug.jshint.reporter('jshint-stylish'));
}

/**
 * Execute JSCS on given source files
 * @param  {Array} sources
 * @return {Stream}
 */
function analyzejscs(sources) {
  log('Running JSCS');
  return gulp
    .src(sources)
    .pipe(plug.jscs('./.jscsrc'));
}

/**
 * Start the node server using nodemon.
 * Optionally start the node debugging.
 * @param  {Object} args - debugging arguments
 * @return {Stream}
 */
function serve(args) {
  var options = {
    script: paths.server + 'app.js',
    delayTime: 1,
    env: {
      'NODE_ENV': args.mode,
      'PORT': port
    },
    watch: [paths.server]
  };

  var exec;
  if (args.debug) {
    log('Running node-inspector. Browse to http://localhost:8080/debug?port=5858');
    exec = require('child_process').exec;
    exec('node-inspector');
    options.nodeArgs = [args.debug + '=5858'];
  }

  return plug.nodemon(options)
    .on('start', function() {
      startBrowserSync();
    })
    //.on('change', tasks)
    .on('restart', function() {
      log('restarted!');
      setTimeout(function () {
        browserSync.reload({ stream: false });
      }, 1000);
    });
}

/**
 * Start BrowserSync
 */
function startBrowserSync() {
  if(!env.browserSync || browserSync.active) {
    return;
  }

  log('Starting BrowserSync on port ' + port);
  browserSync({
    proxy: 'localhost:' + port,
    port: 3000,
    files: [paths.client + '/**/*.*'],
    ghostMode: { // these are the defaults t,f,t,t
      clicks: true,
      location: false,
      forms: true,
      scroll: true
    },
    logLevel: 'debug',
    logPrefix: 'gulp-patterns',
    notify: true,
    reloadDelay: 5000
  });
}

/**
 * Start Plato inspector and visualizer
 */
function startPlatoVisualizer() {
  log('Running Plato');

  var files = glob.sync('./src/client/app/**/*.js');
  var excludeFiles = /\/src\/client\/app\/.*\.spec\.js/;

  var options = {
    title: 'Plato Inspections Report',
    exclude: excludeFiles
  };
  var outputDir = './report/plato';

  plato.inspect(files, outputDir, options, platoCompleted);

  function platoCompleted(report) {
    var overview = plato.getOverviewReport(report);
    log(overview.summary);
  }
}

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
  var child;
  var excludeFiles = ['./src/client/app/**/*spaghetti.js'];
  var fork = require('child_process').fork;
  if (env.startServers) {
    log('Starting servers');
    var savedEnv = process.env;
    savedEnv.NODE_ENV = 'dev';
    savedEnv.PORT = 8888;
    child = fork('src/server/app.js', childProcessCompleted);
  } else {
    excludeFiles.push('./src/client/test/midway/**/*.spec.js');
  }

  karma.start({
    configFile: __dirname + '/karma.conf.js',
    exclude: excludeFiles,
    singleRun: !!singleRun
  }, karmaCompleted);

  ////////////////

  function childProcessCompleted(error, stdout, stderr) {
    log('stdout: ' + stdout);
    log('stderr: ' + stderr);
    if (error !== null) {
      log('exec error: ' + error);
    }
  }

  function karmaCompleted() {
    if (child) {
      child.kill();
    }
    done();
  }
}

/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter(data) {
  var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
  return data.fileName + ' went from ' +
    (data.startSize / 1000).toFixed(2) + ' kB to ' + (data.endSize / 1000).toFixed(2) + ' kB' +
    ' and is ' + formatPercent(1 - data.percent, 2) + '%' + difference;
}

/**
 * Format a number as a percentage
 * @param  {Number} num       Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {String}           Formatted percentage
 */
function formatPercent(num, precision) {
  return (num * 100).toFixed(precision);
}














//
//
//
//
//var gulp = require('gulp-param')(require('gulp'), process.argv),
//  mocha = require("gulp-mocha"),
//  istanbul = require('gulp-istanbul'),
//  bench = require('gulp-bench'),
//  uglify = require('gulp-uglify'),
//  rimraf = require('gulp-rimraf'),
//  bump = require('gulp-bump'),
//  replace = require('gulp-replace'),
//  rename = require('gulp-rename'),
//  browserify = require('gulp-browserify'),
//  SRC = 'index.js',
//  DEST = 'dist',
//  SRC_COMPILED = 'safeaccessors.js',
//  MIN_FILE = 'safeaccessors.min.js',
//  VERSION_FILES = ['./package.json', './component.json', './bower.json'];
//VERSION_FILES_JS = [SRC, 'package.js'];
//
//gulp.task('test', ['browserify'], function(cov) {
//  var reporters = ['html'];
//
//  if (cov) {
//    reporters.push('text');
//  } else {
//    reporters.push('text-summary');
//  }
//
//  return gulp.src(['*.js'])
//    .pipe(istanbul())
//    .pipe(istanbul.hookRequire())
//    .on('finish', function () {
//      return gulp.src(['tests/*.js'])
//        .pipe(mocha({
//          ui: 'qunit',
//          reporter: 'dot'
//        }))
//        .pipe(istanbul.writeReports({
//          reporters: reporters
//        }));
//    });
//});
//
//gulp.task('bench', ['browserify'], function(func) {
//  func = func || '*';
//  return gulp.src('bench/'+ func + '.js')
//    .pipe(bench());
//});
//
//gulp.task('browserify', function() {
//  return gulp.src(SRC)
//    .pipe(browserify({
//      detectGlobals: true,
//      standalone: 's'
//    }))
//    .pipe(rename('safeaccessors.js'))
//    .pipe(gulp.dest(DEST));
//});
//
//gulp.task('clean', function() {
//  return gulp.src(DEST)
//    .pipe(rimraf());
//});
//
//gulp.task('bump-in-js', function(semver) {
//  return gulp.src(VERSION_FILES_JS)
//    .pipe(replace(/(version?\s?=?\:?\s\')([\d\.]*)\'/gi, '$1' + semver + "'"))
//    .pipe(gulp.dest('./'));
//});
//
//// usage: gulp bump -s <% Version %>
//// usage: gulp bump --semver <% Version %>
//gulp.task('bump', ['bump-in-js'], function(semver) {
//  if (typeof semver !== 'string' || semver.length <= 0) {
//    console.error('pass a new version `gulp bump --semver 2.4.1`');
//    process.exit(1);
//  }
//
//  return gulp.src(VERSION_FILES)
//    .pipe(bump({
//      version: semver
//    }))
//    .pipe(gulp.dest('./'));
//});
//
//gulp.task('build', ['test', 'clean'], function() {
//  gulp.src(DEST + '/' + SRC_COMPILED)
//    .pipe(uglify())
//    .pipe(rename(MIN_FILE))
//    .pipe(gulp.dest(DEST));
//});
//
