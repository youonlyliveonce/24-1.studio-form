var config = require('../config')
var gulp   = require('gulp')
var path   = require('path')
var watch  = require('gulp-watch')

var watchTask = function() {
	var watchableTasks = ['fonts', 'images', 'css', 'pug']

	var mode = config.root.mode;

	watchableTasks.forEach(function(taskName) {
		var task = config.tasks[taskName]
		if(task) {
			var glob = path.join(config.root[mode].src, task.src, '**/*.{' + task.extensions.join(',') + '}')
			watch(glob, function() {
			 require('./' + taskName)()
			})
		}
	})
}

gulp.task('watch', ['browserSync'], watchTask)
module.exports = watchTask
