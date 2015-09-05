var fs = require("fs");
var path = require("path");
var chai = require("chai");
var ANTI = require("../anti");
var inspect = require("util").inspect;

var should = chai.should();
var expect = chai.expect;

// Load all test files
var PathToTestDirectory = path.resolve(__dirname);
var TestFiles = [];
fs.readdirSync(PathToTestDirectory).forEach(function(file) {
	// Fast check for file extension instead of fs.stat
	if(file.split('.')[file.split('.').length-1] === 'html') {
		TestFiles.push({
			name: file.split('_').join(' '),
			buffer: fs.readFileSync(path.resolve(PathToTestDirectory, file), { encoding: 'utf8' }).replace(/\r?\n|\r/g, "").replace( new RegExp( "\>[\n\t ]+\<" , "g" ) , "><" ),
			input: function() {
				return this.buffer.split("<!-- EXPECT -->")[0];
			},
			expects: function() {
				return this.buffer.split("<!-- EXPECT -->")[1];
			}
		})
	}
});


var anti = new ANTI({ serialize: true });

describe('XSS Test Suite', function(){
	TestFiles.forEach(function(test) {
		it(test.name || "Unknown", function(done){
			anti.parse(test.input(), function(result) {
				expect(result).to.be.equal(test.expects());
				done();
			})
		})
	})
});

describe('CSS Test Suite', function() {
	it('should parse inline css', function(){
		var result = anti._parseInlineCss("font-size: 12px; line-height: 2!important; color: #222; background-color: white; background: url(javascript:alert('XSS')); unknown-property: exp;");
		expect(result).to.deep.equal("font-size:12px; line-height:2!important; color:#222; background-color:white; background:url('http%3A%2F%2Fwww.example.com%2Fimg.png');")
	})
})