var config      = require('../config')
if(!config.tasks.responsiveImages) return

var data		= config.tasks.responsiveImages
var browserSync = require('browser-sync')
var gulp        = require('gulp')
var rename 		= require("gulp-rename")
var imagemin    = require('gulp-imagemin')
var util 		= require('gulp-util');
var imageResize = require('gulp-image-resize')
var path        = require('path')
var paths 		= []
//	src: path.join(config.root.src, config.tasks.responsiveImages.src, '/**')
var mode = config.root.mode;

for (var key in data.sourcen) {
	paths[key] = {"src":"", "dest":""};
	paths[key].src = path.join(config.root[mode].src, data.sourcen[key], '/**');
	paths[key].dest = path.join(config.root[mode].dest, data.destinations[key]);
}

var responsiveImagesTask = function() {
	return data.sizes.forEach(function(size){
		return paths.forEach(function(setup){
			return gulp.src(setup.src)
			  	.pipe(rename(function (path) {
			  		// Nur umbennen wenn Datei nicht wenn Folder
			  		if(path.extname != ''){
				    	path.dirname += "/" + size.folder;
				    }
				  }))
			    .pipe(imageResize({ width : size.size, quality: 0.95, imageMagick: true}))
			    .pipe(imagemin()) // Optimize
			    .pipe(gulp.dest(setup.dest))
			    .on("finish", function() {
			    	util.log('responsive Images:', setup.src + " in " + size.folder)
			    });
		})
	})
}

gulp.task('responsiveImages', responsiveImagesTask)
module.exports = responsiveImagesTask
