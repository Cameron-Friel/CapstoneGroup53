let gulp = require('gulp');
let terser = require('gulp-terser');
let clean = require('gulp-clean');
let fs = require('fs');
let browserify = require('browserify');
let source = require('vinyl-source-stream');

/**
  * Minifies all js files in the build folder
*/

gulp.task('minify', () => {
  return gulp.src('./build/*.js').pipe(terser()).pipe(gulp.dest('./build'), {mode: 0777});
});


/**
  * Builds a pendulum case to the build folder
  * Takes a command line argument --case [case] where case is a folder name
*/

gulp.task('build', async () => {
  if (process.argv.indexOf('--case') !== -1) {
    let folder = process.argv[process.argv.indexOf('--case') + 1];

    browserify(`./src/Pendulum/${folder}/Sketch.js`).bundle().pipe(source('bundle.js')).pipe(gulp.dest('./build'), {mode: 0777});
    gulp.src(`./src/Pendulum/${folder}/**/*.css`).pipe(gulp.dest('./build'), {mode: 0777});
    gulp.src(`./src/Pendulum/${folder}/**/*.html`).pipe(gulp.dest('./build'), {mode: 0777});
  }
  else {
    console.log('Error: The folder to build was not specified. Enter the command gulp build --case [Your Case].');
  }
});

/**
  * Cleans the build directory
*/

gulp.task('clean', async () => {
  fs.access('./build', (error) => {
    if (error) {
      console.log('Error: ./build does not exist.');
    }
    else {
      gulp.src('./build', {read: false}).pipe(clean(), {mode: 0777});
    }
  });
});
