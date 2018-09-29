'use strict';

const path = require('path');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const gulpreplace = require('gulp-replace');
const jshint = require('gulp-jshint');
const superagent = require('superagent');
const fs = require('fs-extra');
const glob = require('glob');

// Got problems? Try logging 'em
// const logging = require('plylog');
// logging.setVerbose();

const ensureLazyFragments = require('./gulp/ensure-lazy-fragments.js');

const root = path.resolve(process.cwd(), 'images');
const optimizedImagesRoot = path.resolve(process.cwd(), 'images-optimized');
const imageOptions = {
  activities: '340x340',
  logos: '250,scale-down',
  unofficial: '340x340',
  banner: '750x500,scale-down'
};

// Optimize images with ImageOptim
// Run with `yarn run build optimize-images`
const optimizeImages = () => new Promise((resolve, reject) => {
  glob('images/**/*.{jpg,png,svg}', (err, files) => {
    for (const file of files) {
      const relativeFile = file.substring(file.indexOf('/') + 1);
      fs.ensureDirSync(path.resolve(optimizedImagesRoot, path.dirname(relativeFile)));
      if (path.extname(file) === '.svg') {
        fs.copySync(file, path.resolve(optimizedImagesRoot, relativeFile));
      } else {
        const imageCategory = relativeFile.split('/')[0];
        const options = imageOptions[imageCategory] || 'full';
        superagent.post(`https://im2.io/nddfzrzzpk/${options}`)
        .attach('file', file)
        .end((err, res) =>  {
          if (err) {
            console.warn(`Failed optimizing ${file}`);
            fs.writeFileSync(path.resolve(optimizedImagesRoot, relativeFile), fs.readFileSync(file));
          } else {
            console.log(`Finished optimizing ${file}`);
            fs.writeFileSync(path.resolve(optimizedImagesRoot, relativeFile), res.body);
          }
        });
      }
    }
    resolve();
  });
});

gulp.task('optimize-images', optimizeImages);

gulp.task('replace-api', () => {
  return gulp.src(['build/**/*']).pipe(gulpif(/\.html$/, gulpreplace('/api/v1', 'https://api.areafiftylan.nl/api/v1'))).pipe(gulp.dest('build'));
});

gulp.task('ensure-images-optimized', () =>
  new Promise((resolve, reject) => {
    if (!fs.existsSync(optimizedImagesRoot)) {
      optimizeImages();
    }
    resolve();
  })
);

gulp.task('ensure-lazy-fragments', ensureLazyFragments);

const linter = () => {
  return gulp.src('src/**/*.html')
      .pipe(jshint.extract()) // Extract JS from .html files
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
};
gulp.task('linter', linter);

// Changed it back to series to make it easier to test
gulp.task('default', gulp.series([
  'linter',
  'ensure-images-optimized',
  'ensure-lazy-fragments'
]));

gulp.task('post-build', gulp.series([
  'replace-api'
]));
