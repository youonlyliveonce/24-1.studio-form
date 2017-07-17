var browserSync = require('browser-sync')
var config      = require('../config')
var gulp        = require('gulp')
var path        = require('path')

var mode = config.root.mode;

var browserSyncTask = function() {
	return browserSync(config.root[mode].browserSync)
  // return browserSync(config.tasks.browserSync)
}
gulp.task('browserSync', browserSyncTask)
module.exports = browserSyncTask
