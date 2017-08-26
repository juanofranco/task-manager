var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var babel = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

gulp.task('styles', function () {
  gulp
    .src('./src/scss/style.scss')
    .pipe(sass())
    .pipe(rename('app.css'))
    .pipe(gulp.dest('./public/css'));
})

function compile(watch) {
  var bundle = browserify('./src/js/index.js', {debug: true});

  if (watch) {
    bundle = watchify(bundle);
    bundle.on('update', function () {
      console.log('--> Bundling...');
      rebundle();
    });
  }

  function rebundle() {
    bundle
      .transform(babel, { presets: [ 'es2015' ], plugins: [ 'syntax-async-functions', 'transform-regenerator' ] })
      .bundle()
      .on('error', function (err) { console.log(err); this.emit('end') })
      .on('end', function () { console.log('--> Ended')})
      .pipe(source('index.js'))
      .pipe(rename('app.js'))
      .pipe(gulp.dest('./public/js'));
  }

  rebundle();
}

gulp.task('build', function () {
  return compile();
});
gulp.task('watch', function () { return compile(true); });
gulp.task('default', ['styles', 'build']);


