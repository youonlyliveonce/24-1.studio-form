var config = require('../../config')
var gulp   = require('gulp')
var minify = require('gulp-minify-css')
var path   = require('path')
var uglify = require('gulp-uglify')

var mode = config.root.mode;

gulp.task('minify-css', function(){
	return gulp.src(path.join(config.root[mode].dest,'/**/*.css'))
		.pipe(minify())
		.pipe(gulp.dest(config.root[mode].dest))
})
