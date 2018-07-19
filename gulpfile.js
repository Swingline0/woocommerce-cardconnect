const gulp = require('gulp');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const watchify = require('watchify');
const tsify = require('tsify');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');

/*
 * Browserify/watchify bundler stuff
 */
const jsConfig = {
  publicPath : __dirname + '/javascript/dist',
  source: {
    path: __dirname + '/javascript/src',
    main: 'woocommerce-cc-gateway.ts',
    result: 'woocommerce-cc-gateway.js'
  }
};

gulp.task('default', ['compile-js']);

gulp.task('compile-js', function (){
  let bundler = browserify(
    {
      basedir: jsConfig.source.path,
      cache: {},
      packageCache: {}
    })
    .add(jsConfig.source.path + '/' + jsConfig.source.main)
    .plugin(tsify);

  bundler = watchify(bundler);

  const bundle = function(bundler){
    bundler.bundle()
      .on('error', notify.onError({
        message: 'Error: <%= error.toString() %>',
        title: 'Compile Error',
        sound: true,
        icon: ''
      }))
      .on('error', function(error){
        this.emit('end');
      })
      .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
      .pipe(source(jsConfig.source.result))
      .pipe(gulp.dest(jsConfig.publicPath))
      .pipe(notify('Bundle re-bundled.'));
  };

  bundler.on('update', function(){
    bundle(bundler);
  });

  bundle(bundler);
});


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
