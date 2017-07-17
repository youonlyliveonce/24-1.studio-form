var config      = require('../config')
if(!config.tasks.images) return

var browserSync = require('browser-sync')
var changed     = require('gulp-changed')
var gulp        = require('gulp')
var imagemin    = require('gulp-imagemin')
var path        = require('path')

var mode = config.root.mode;

var paths = {
  src: path.join(config.root[mode].src, config.tasks.images.src, '/**'),
  dest: path.join(config.root[mode].dest, config.tasks.images.dest)
}

var imagesTask = function() {
  return gulp.src(paths.src)
    .pipe(changed(paths.dest)) // Ignore unchanged files
    .pipe(imagemin()) // Optimize
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream())
}

gulp.task('images', imagesTask)
module.exports = imagesTask
