var config       = require('../config')
var gulp         = require('gulp')
var gulpSequence = require('gulp-sequence')
var getEnabledTasks = require('../lib/getEnabledTasks')

var mediaTask = function(cb) {
  gulpSequence('images', 'responsiveImages', cb)
}

gulp.task('media', mediaTask)
module.exports = mediaTask
