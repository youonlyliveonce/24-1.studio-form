var config      = require('../config')
if(!config.tasks.htdocs) return

var browserSync = require('browser-sync')
var gulp        = require('gulp')
var path        = require('path')
var mode        = config.root.mode;

var htdocsTask = function() {
	if (mode != 'cms'){
	return gulp.src(config.root[mode].src + config.tasks.htdocs.src + '/**')
		.pipe(gulp.dest(config.root[mode].dest + config.tasks.htdocs.dest ))
		.pipe(browserSync.stream())
	}
}

gulp.task('htdocs', htdocsTask)
module.exports = htdocsTask
