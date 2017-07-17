var config = require('../config')
if(!config.tasks.images) return

var gulp 		= require('gulp')
var changed    	= require('gulp-changed');
var browserSync = require('browser-sync');

var minifyImagesTask = function() {
	return gulp.src(config.tasks.images.src)
	    .pipe(changed(config.tasks.images.dest))
	    .pipe(gulp.dest(config.tasks.images.dest))
	    .pipe(browserSync.reload({stream:true}));
}

gulp.task('minifyImages', minifyImagesTask)
module.exports = minifyImagesTask