var gulp   = require('gulp')
var nib    = require('nib')
var stylus = require('gulp-stylus')
var rename = require('gulp-rename')
var jade   = require('gulp-jade');

gulp.task('styles', function () {
  return gulp.src('./public/styles/style.styl')
    .pipe(stylus({
      use: nib(),
      import: ['nib']
    }))
    .pipe(gulp.dest('./public/styles/'))
})

gulp.task('cstyles', function () {
  return gulp.src('./public/styles/style.styl')
    .pipe(stylus({
      use: nib(),
      import: ['nib'],
      compress: true
    }))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest('./public/styles/'))
})

gulp.task('views', function () {
  gulp.src('./views/index.jade')
    .pipe(jade())
    .pipe(gulp.dest('./'))
})

gulp.task('watch', function () {
  gulp.watch('./public/styles/*.styl', ['styles', 'cstyles'])
  gulp.watch('./views/*', ['views'])
})

gulp.task('default', ['watch'])
