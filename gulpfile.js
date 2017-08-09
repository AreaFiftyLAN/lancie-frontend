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
const jshint = require('gulp-jshint');
const superagent = require('superagent');
const fs = require('fs-extra');
const glob = require('glob');

// Got problems? Try logging 'em
// const logging = require('plylog');
// logging.setVerbose();

const project = require('./project.js');
const ensureLazyFragments = require('./gulp-tasks/ensure-lazy-fragments.js');

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

gulp.task('ensure-lazy-fragments', ensureLazyFragments);

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
  linter,
  project
]));
