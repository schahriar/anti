var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat-util');
var fs = require('fs');

gulp.task('default', function() {
	// Copy main source
	gulp.src('./anti.js')
		.pipe(gulp.dest('build'));
	// Minify, rename and copy minified source + LICENSE
	gulp.src('./anti.js')
		.pipe(uglify())
		.pipe(concat('anti.min.js'))
    	.pipe(concat.header('/*\n' + fs.readFileSync('./LICENSE')  + '*/\n'))
		.pipe(gulp.dest('build'));
});