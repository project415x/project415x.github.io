var gulp = require('gulp'),
		sass = require('gulp-sass'),
		gutil = require('gulp-util'),
		uglify = require('gulp-uglify'),
		source = require('vinyl-source-stream'),
		buffer = require('vinyl-buffer'),
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

	 return browserify(files)
    .bundle()
    .on('error', function(e) {
    	gutil.log(e) // logs an error if it occurs
    })
    .pipe(source('bundle.min.js')) // gives streaming vinyl file object
    .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
    .pipe(uglify()) // now gulp-uglify works 
    .pipe(gulp.dest('./dist/compressed/'));
});

gulp.task('sass', function() {
	return gulp.src('./css/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function() {
	gulp.watch('./css/**/*.scss', ['sass']);
});

gulp.task('watch', function() {
	gulp.watch('./css/**/*.scss', ['sass']);
	gulp.watch("./public/js/project/**/*.js", ["compress"],["default"]);
});

gulp.task('compress', function() {
	var files = glob.sync('./public/js/project/**/*.js') // clumps files
  return browserify(files)
    .bundle()
    .on('error', function(e) {
    	gutil.log(e) // logs an error if it occurs
    })
    .pipe(source('bundle.min.js')) // gives streaming vinyl file object
    .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
    .pipe(uglify()) // now gulp-uglify works 
    .pipe(gulp.dest('./dist/compressed/'));
});
