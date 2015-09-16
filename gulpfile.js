var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat-util');
var fs = require('fs');

gulp.task('default', function() {
	// Parse Experimental features into a new file
	var NXBUFFER = "";
	var BUFFER = fs.readFileSync('./anti.js', { encoding: 'utf8' });
	var INBLOCK = false;
	for(var i=0; i<BUFFER.length; i++) {
		if(!INBLOCK) {
			if ((BUFFER[i] === '/') && (GET(BUFFER, i, 18) === "/*<EXPERIMENTAL>*/")) {
				INBLOCK = true;
			}else{
				NXBUFFER += (BUFFER[i]);
			}
		}else{
			if ((BUFFER[i] === '/') && (GET(BUFFER, i, 19) === "/*</EXPERIMENTAL>*/")) {
				INBLOCK = false;
				// Skip 18 Characters to remove the end tag
				i += 18;
			}
		}
	}
	// Remove all multi-line comments
	NXBUFFER = NXBUFFER.replace(/\*<\/EXPERIMENTAL>*\//g, '');
	BUFFER = BUFFER.replace(/\*<\/EXPERIMENTAL>*\//g, '');
	fs.writeFileSync('./build/anti.js', NXBUFFER);
	fs.writeFileSync('./build/anti.experimental.js', BUFFER);
	
	// Minify, rename and copy minified source + LICENSE
	gulp.src('./build/anti.js')
		.pipe(uglify())
		.pipe(concat('anti.min.js'))
    	.pipe(concat.header('/*\n' + fs.readFileSync('./LICENSE')  + '*/\n'))
		.pipe(gulp.dest('build'));
		
	// Minify, rename and copy minified source + LICENSE
	gulp.src('./build/anti.experimental.js')
		.pipe(uglify())
		.pipe(concat('anti.experimental.min.js'))
    	.pipe(concat.header('/*\n' + fs.readFileSync('./LICENSE')  + '*/\n'))
		.pipe(gulp.dest('build'));
});

function GET(buffer, pos, length) {
	var value = "";
	for(i=0; i<length; i++) {
		value += buffer[pos+i];
	}
	return value;
}