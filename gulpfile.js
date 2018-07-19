const gulp = require('gulp');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const watchify = require('watchify');
const tsify = require('tsify');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');

/*
 * Browserify/watchify bundler stuff
 */

gulp.task('default', ['js:build']);

function compileTypescript() {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['javascript/src/woocommerce-cc-gateway.ts'],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify)
    .bundle()
    .on('error', console.error)
    .pipe(source('woocommerce-cc-gateway.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify().on('error', console.error))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('javascript/dist'));
}

gulp.task('js:build', compileTypescript);
gulp.task('js:watch', ['js:build'], () => gulp.watch('**/*.ts', ['js:build']));

/*
 * Build plugin
 */
const excludeChecker = function(file){
  const excludeGlobs = [
    '.git',
    './dist',
    '.gitignore',
    './node_modules',
    './**/node_modules',
    '.DS_Store',
    'gulpfile.js',
    'package.json',
    './javascript/spec',
    './javascript/src',
    './javascript/.DS_Store',
    './javascript/tests.html',
    './tsconfig.json'
  ];
  console.log(file.name());
  return false;
  // if(excludeGlobs.indexOf(file) !== -1)
};

gulp.task('build', function() {
  gulp.src('./**/*')
    .pipe(gulpif(excludeChecker, uglify()))
    //.pipe(uglify({mangle: false}))
    .pipe(gulp.dest('./dist/'));
});
