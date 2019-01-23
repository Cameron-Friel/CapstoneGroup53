let gulp = require('gulp');
let browserify = require('browserify');
let source = require('vinyl-source-stream');

/*
  * Builds the Pendulum case 1 source files
*/

gulp.task('build-case1', async () => {
  browserify('./src/Pendulum/case1/Sketch.js').bundle().pipe(source('bundle.js')).pipe(gulp.dest('./src/Pendulum/case1'));
});
