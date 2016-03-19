/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var load = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var merge = require('merge-stream');
var path = require('path');
var fs = require('fs');
var glob = require('glob-all');
var packageJson = require('./package.json');
var crypto = require('crypto');
var url = require('url');
var proxy = require('proxy-middleware');
var polybuild = require('polybuild');
var jsonminify = require('gulp-jsonminify');
var jshint = require('gulp-jshint');

var DIST = 'dist';

var dist = function(subpath) {
  return !subpath ? DIST : path.join(DIST, subpath);
};

var imageOptimizeTask = function(src, dest) {
  return gulp.src(src)
    .pipe(load.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(dest))
    .pipe(load.size({title: 'images'}));
};

// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src([
      'app/scripts/**/*.js',
      'app/elements/**/*.js',
      'app/elements/**/*.html'
    ])
    .pipe(reload({stream: true, once: true}))
    .pipe(jshint.extract()) // Extract JS from .html files
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(load.if(!browserSync.active, jshint.reporter('fail')));
});

// Optimize images
gulp.task('images', function() {
  return imageOptimizeTask('app/images/**/*', dist('images'));
});

// Copy All Files At The Root Level (app)
gulp.task('copy', function() {
  var app = gulp.src([
    'app/*',
    '!app/elements',
    '!app/test',
    '!app/bower_components',
    '!app/cache-config.json',
    '!**/.DS_Store'
  ], {
    dot: true
  }).pipe(gulp.dest(dist()));

  var markdown = gulp.src([
    'app/scripts/*.md'
  ]).pipe(gulp.dest(dist('scripts')));

  var scripts = gulp.src(['app/scripts/*.json'])
    .pipe(jsonminify())
    .pipe(gulp.dest(dist('scripts')));

  return merge(app, markdown, scripts)
    .pipe(load.size({title: 'copy'}));
});

// Copy Web Fonts To Dist
gulp.task('fonts', function () {
  return gulp.src(['app/fonts/**'])
    .pipe(gulp.dest('dist/fonts'))
    .pipe(load.size({title: 'fonts'}));
});

// Vulcanize granular configuration
gulp.task('vulcanize', function() {
  return gulp.src('app/elements/elements.html')
    .pipe(load.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe(gulp.dest(dist('elements')))
    .pipe(load.size({title: 'vulcanize'}));
});

gulp.task('build', function() {
  return gulp.src('app/index.html')
  .pipe(polybuild({
    maximumCrush: true,
    suffix: ''
  }))
  .pipe(load.if('*.js', load.rev()))
  .pipe(load.revReplace())
  .pipe(load.if('*.html', load.minifyHtml({
    quotes: true,
    empty: true,
    spare: true
  })))
  .pipe(gulp.dest('dist/.'));
});


// Generate config data for the <sw-precache-cache> element.
// This include a list of files that should be precached, as well as a (hopefully unique) cache
// id that ensure that multiple PSK projects don't share the same Cache Storage.
// This task does not run by default, but if you are interested in using service worker caching
// in your project, please enable it within the 'default' task.
// See https://github.com/PolymerElements/polymer-starter-kit#enable-service-worker-support
// for more context.
gulp.task('cache-config', function(callback) {
  var dir = dist();
  var config = {
    cacheId: packageJson.name || path.basename(__dirname),
    disabled: false
  };

  glob([
    'index.html',
    './',
    'bower_components/webcomponentsjs/webcomponents-lite.min.js',
    '{elements,scripts,styles}/**/*.*'],
    {cwd: dir}, function(error, files) {
    if (error) {
      callback(error);
    } else {
      config.precache = files;

      var md5 = crypto.createHash('md5');
      md5.update(JSON.stringify(config.precache));
      config.precacheFingerprint = md5.digest('hex');

      var configPath = path.join(dir, 'cache-config.json');
      fs.writeFile(configPath, JSON.stringify(config), callback);
    }
  });
});

// Clean output directory
gulp.task('clean', function() {
  return del(['.tmp', dist()]);
});

var serve = function(baseDir) {
  var proxyOptions = url.parse('http://localhost:9000/api/');
  proxyOptions.route = '/api';

  browserSync({
    port: 5100,
    notify: false,
    logPrefix: 'PSK',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function (snippet) {
          return snippet;
        }
      }
    },
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: baseDir,
      middleware: [proxy(proxyOptions)]
    }
  });
};

// Watch Files For Changes & Reload
gulp.task('serve', ['images'], function () {
  serve(['.tmp', 'app']);

  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/styles/**/*.css'], [reload]);
  gulp.watch(['app/elements/**/*.css'], [reload]);
  gulp.watch(['app/{scripts,elements}/**/*.js'], ['jshint', reload]);
  gulp.watch(['app/images/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function() {
  serve(['dist']);

  gulp.watch(['app/**/*.html'], ['default', reload]);
  gulp.watch(['app/styles/**/*.css'], ['default', reload]);
  gulp.watch(['app/elements/**/*.css'], ['default', reload]);
  gulp.watch(['app/images/**/*'], reload);
});

// Build production files, the default task
gulp.task('default', ['clean'], function(cb) {
  runSequence(
    'copy',
    ['images', 'fonts'],
    'build',
    cb);
});

// Load custom tasks from the `tasks` directory
try {
  require('require-dir')('tasks');
} catch (err) {}
