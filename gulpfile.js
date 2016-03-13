var gulp = require('gulp'),
		gutil = require('gulp-util'),
		uglify = require('gulp-uglify'),
		source = require('vinyl-source-stream'),
		glob = require('glob'),
		browserify = require('browserify');

gulp.task('default', function() {
	var files = glob.sync('./public/js/project/**/*.js')
	browserify(files)
		.bundle()
		.on('error', function(e) {
			gutil.log(e)
		})
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('./dist'))
})

gulp.task('watch', function() {
	gulp.watch("./public/js/project/**/*.js", ["browserify"]);
})