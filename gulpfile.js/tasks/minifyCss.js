var config = require('../config')
if(!config.tasks.production) return

var gulp 		= require('gulp')
var minifyCSS 	= require('gulp-minify-css')
var size      	= require('gulp-filesize')

var minifyCssTask = function() {
	return gulp.src(config.tasks.production.cssSrc)
	    .pipe(minifyCSS({keepBreaks:false}))
	    .pipe(gulp.dest(config.tasks.production.dest))
	    .pipe(size());
}

gulp.task('minifyCss', ['css'], minifyCssTask)
module.exports = minifyCssTask