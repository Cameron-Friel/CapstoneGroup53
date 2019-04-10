let gulp = require('gulp');
let terser = require('gulp-terser');
let clean = require('gulp-clean');
let fs = require('fs');
let browserify = require('browserify');
let source = require('vinyl-source-stream');

let folders = ['case1', 'case2', 'case3', 'case4', 'case5', 'exploratory'];

/**
  * Minifies all js files in the build folder
*/

gulp.task('minify', () => {
  return new Promise((resolve, reject) => {
    try {
      for (let i = 0; i < folders.length; i++) {
        fs.access(`./build/${folders[i]}`, (error) => {
          if (error) {
            console.log(`${folders[i]} folder does not exist. Skipping...`);
          }
          else {
            gulp.src(`./build/${folders[i]}/*.js`).pipe(terser()).pipe(gulp.dest(`./build/${folders[i]}`), {mode: 0777});
          }
        });
      }

      resolve();
    }
    catch (error) {
      console.log('Script could not be run: ' + error);
      reject();
    }
  });
});

/**
  * Builds all pendulum cases to the build folder
*/

gulp.task('build-all', () => {
  return new Promise((resolve, reject) => {
    try {
      for (let i = 0; i < folders.length; i++) {
        browserify(`./src/Pendulum/${folders[i]}/Sketch.js`).bundle().pipe(source('bundle.js')).pipe(gulp.dest(`./build/${folders[i]}`), {mode: 0777});
        gulp.src(`./src/Pendulum/${folders[i]}/**/*.css`).pipe(gulp.dest(`./build/${folders[i]}`), {mode: 0777});
        gulp.src(`./src/Pendulum/${folders[i]}/**/*.html`).pipe(gulp.dest(`./build/${folders[i]}`), {mode: 0777});
      }

      resolve();
    }
    catch (error) {
      console.log('Script could not be run: ' + error);
      reject();
    }
  });
});

/**
  * Builds a single pendulum case to the build folder
  * Takes a command line argument --case [case] where case is a folder name
*/

gulp.task('build', () => {
  return new Promise((resolve, reject) => {
    try {
      if (process.argv.indexOf('--case') !== -1) {
        let folder = process.argv[process.argv.indexOf('--case') + 1];

        browserify(`./src/Pendulum/${folder}/Sketch.js`).bundle().pipe(source('bundle.js')).pipe(gulp.dest('./build'), {mode: 0777});
        gulp.src(`./src/Pendulum/${folder}/**/*.css`).pipe(gulp.dest('./build'), {mode: 0777});
        gulp.src(`./src/Pendulum/${folder}/**/*.html`).pipe(gulp.dest('./build'), {mode: 0777});
      }
      else {
        console.log('Error: The folder to build was not specified. Enter the command gulp build --case [Your Case].');
      }

      resolve();
    }
    catch (error) {
      console.log('Script could not be run: ' + error);
      reject();
    }
  });
});

/**
  * Cleans the build directory
*/

gulp.task('clean', () => {
  return new Promise((resolve, reject) => {
    try {
      fs.access('./build', (error) => {
        if (error) {
          console.log('Error: ./build does not exist.');
        }
        else {
          gulp.src('./build', {read: false}).pipe(clean(), {mode: 0777});
        }
      });

      resolve();
    }
    catch (error) {
      console.log('Script could not be run: ' + error);
      reject();
    }
  });
});

gulp.task('default', gulp.series('build-all'));
