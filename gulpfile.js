var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');
var sassGlob = require('gulp-sass-glob');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var prefix = require('gulp-autoprefixer');
var flatten = require('gulp-flatten');
var connect = require('gulp-connect');

var path = {
  source: 'src/',
  assets: 'app/assets/'
}

gulp.task('styles', function (done) {
  gulp.src([path.source + '/styles/app.scss'])
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(sass({ errLogToConsole: true }))
    .pipe(prefix({ browsers: ['ie >= 10', 'ff >= 30', 'chrome >= 34', 'safari >= 7', 'opera >= 23', 'ios >= 7', 'android >= 4.4'] }))
    .pipe(concat('styles.min.css'))
    .pipe(cleanCss({ compatibility: 'ie9' }))
    .pipe(gulp.dest(path.assets))

  done();
})

gulp.task('scripts', function(done) {
  gulp.src([path.source + '/scripts/*.js'])
    .pipe(plumber())
    .pipe(uglify())
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest(path.assets))

  done();
})

gulp.task('fonts', function (done) {
  gulp.src([path.source + '/fonts/**/*.{woff,woff2,ttf,svg}'])
    .pipe(flatten())
    .pipe(gulp.dest(path.assets + '/fonts/'));

  done();
})

gulp.task('images', function (done) {
  gulp.src([path.source + '/images/*.{jpg,png,gif}'])
    .pipe(flatten())
    .pipe(gulp.dest(path.assets + '/images/'));

  done();
})

gulp.task('watch', function (done) {
  gulp.watch('./src/**/*', gulp.series('styles', 'scripts'));

  done();
})

gulp.task('connect', function(done) {
  connect.server({
    root: 'app'
  });

  done();
});

gulp.task('default', gulp.parallel('styles', 'scripts', 'images', 'fonts', 'connect', 'watch'));
