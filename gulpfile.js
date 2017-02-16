/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at
http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at
http://polymer.github.io/PATENTS.txt
*/
'use strict';

const path = require('path');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const cssSlam = require('css-slam').gulp;
const htmlMinifier = require('gulp-html-minifier');
const jshint = require('gulp-jshint');
const superagent = require('superagent');
const fs = require('fs-extra');
const glob = require('glob');

// Got problems? Try logging 'em
// const logging = require('plylog');
// logging.setVerbose();

// !!! IMPORTANT !!! //
// Keep the global.config above any of the gulp-tasks that depend on it
global.config = {
  polymerJsonPath : path.join(process.cwd(), 'polymer.json'),
  build : {
    rootDirectory : 'build',
    bundledDirectory : 'bundled',
    unbundledDirectory : 'unbundled',
    // Accepts either 'bundled', 'unbundled', or 'both'
    // A bundled version will be vulcanized and sharded. An unbundled version
    // will not have its files combined (this is for projects using HTTP/2
    // server push). Using the 'both' option will create two output projects,
    // one for bundled and one for unbundled
    bundleType : 'both'
  },
  // Path to your service worker, relative to the build root directory
  serviceWorkerPath : 'service-worker.js',
  // Service Worker precache options based on
  // https://github.com/GoogleChrome/sw-precache#options-parameter
  swPrecacheConfig : require('./sw-precache-config.json')
};

// Add your own custom gulp tasks to the gulp-tasks directory
// A few sample tasks are provided for you
// A task should return either a WriteableStream or a Promise
const clean = require('./gulp-tasks/clean.js');
const project = require('./gulp-tasks/project.js');

function minify() {
  return htmlMinifier({
    collapseWhitespace : true,
    removeComments : true,
    removeAttributeQuotes : true,
    removeRedundantAttributes : true,
    useShortDoctype : true,
    removeEmptyAttributes : true,
    removeScriptTypeAttributes : true,
    removeStyleLinkTypeAttributes : true,
    removeOptionalTags : true
  });
}

// The source task will split all of your source files into one
// big ReadableStream. Source files are those in src/** as well as anything
// added to the sourceGlobs property of polymer.json.
// Because most HTML Imports contain inline CSS and JS, those inline resources
// will be split out into temporary files. You can use gulpif to filter files
// out of the stream and run them through specific tasks. An example is provided
// which filters all images and runs them through imagemin
function source() {
  return project.splitSource()
      // Add your own build tasks here!
      .pipe(gulpif(/\.js$/, uglify()))
      .pipe(gulpif(/\.css$/, cssSlam()))
      .pipe(gulpif(/\.html$/, cssSlam()))
      .pipe(gulpif(/\.html$/, minify()))
      .pipe(project.rejoin());
}

// The dependencies task will split all of your bower_components files into one
// big ReadableStream
// You probably don't need to do anything to your dependencies but it's here in
// case you need it :)
function dependencies() {
  return project.splitDependencies()
      .pipe(gulpif(/\.js$/, uglify()))
      .pipe(gulpif(/\.css$/, cssSlam()))
      .pipe(gulpif(/\.html$/, cssSlam()))
      .pipe(gulpif(/\.html$/, minify()))
      .pipe(project.rejoin());
}

const root = path.resolve(process.cwd(), 'images');
const optimizedImagesRoot = path.resolve(process.cwd(), 'images-optimized');
const imageOptions = {
  activities: '340x340',
  logos: '250,scale-down',
  unofficial: '340x340',
  slider: '2000x500,scale-down'
};

// Optimize images with ImageOptim
// Run with `yarn run build optimize-images`
gulp.task('optimize-images', () =>
  glob('images/**/*.{jpg,png,svg}', (err, files) => {
    for (const file of files) {
      const relativeFile = file.substring(file.indexOf('/') + 1);
      fs.ensureDirSync(path.resolve(optimizedImagesRoot, path.dirname(relativeFile)));
      if (path.extname(file) === '.svg') {
        fs.copySync(file, path.resolve(optimizedImagesRoot, relativeFile));
      } else {
        const imageCategory = path.relative(root, file).split('/')[0];
        const options = imageOptions[imageCategory] || 'full';
        superagent.post(`https://im2.io/nddfzrzzpk/${options}`)
        .attach('file', file)
        .end((err, res) =>  {
          console.log(`Finished optimizing ${file}`);
          fs.writeFileSync(path.resolve(optimizedImagesRoot, relativeFile), res.body);
        });
      }
    }
  })
);

gulp.task('ensure-images-optimized', () =>
  new Promise((resolve, reject) => {
    if (!fs.existsSync(optimizedImagesRoot)) {
      reject('`images-optimized` does not exist. Make sure to run `yarn run build optimize-images`');
    } else {
      resolve();
    }
  })
);

function linter() {
  return gulp.src([ 'scripts/**/*.js',
                    'src/**/*.html' ])
      .pipe(jshint.extract()) // Extract JS from .html files
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
}

// Clean the build directory, split all source and dependency files into streams
// and process them, and output bundled and unbundled versions of the project
// with their own service workers
gulp.task('default', gulp.series([
  clean([ global.config.build.rootDirectory ]), linter,
  project.merge(source, dependencies), project.serviceWorker
]));
