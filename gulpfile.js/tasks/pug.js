var config = require('../config')
var pugPath = config.tasks.pug
if(!pugPath) return

var gulp = require('gulp')
var path = require('path')
var browserSync = require('browser-sync')
var gulpData = require('gulp-data');
var yaml = require('js-yaml');
var yamlinc = require('yaml-include');
var fs = require('fs')
var pug = require('gulp-pug')
var handleErrors = require('../lib/handleErrors')

var mode = config.root.mode;

var getData = function(file) {
	if(pugPath.data){
		var dir = path.dirname(file.path),
			base = path.basename(file.path, '.pug'),
			fileSrc = dir + '/' + base + pugPath.data.ext,
			fileDest = fileSrc.replace(pugPath.data.src, pugPath.data.dest),
			fileData;

		if( !fs.existsSync(fileDest) ){
			return;
		}

		fileData = fs.readFileSync(fileDest);


		if (pugPath.data.ext == ".yml"){
			yamlcontent = yaml.safeLoad(fileData, { schema: yamlinc.YAML_INCLUDE_SCHEMA })
			return yamlcontent;
		} else {
			return JSON.parse(fileData);
		}
	}
}

var pugTask = function() {
	return gulp.src(config.root[mode].src + "/" + config.tasks.pug.render)
		.pipe(gulpData(getData))
		.pipe(pug({
				client: false,
				pretty: true
				// ,basedir: path.dirname(config.root[mode].src + "/" + config.tasks.pug.src+ "/"),
			}))
		.on('error', handleErrors)
		.pipe(gulp.dest(config.tasks.pug.dest))
		.pipe(browserSync.stream())

}

gulp.task('pug', pugTask)
module.exports = pugTask
