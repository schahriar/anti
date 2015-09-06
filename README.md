![Anti](https://raw.githubusercontent.com/schahriar/anti/master/Anti.png)

Anti is an Cross-site Scripting (**XSS**) protection module for the Browser & NodeJS. It uses DOMParser (or NodeJS equivalent [XMLDom](https://github.com/jindw/xmldom)) rather than *Regular expressions* (RegEx) to process DOM just as a browser would. This makes Anti safe to many XSS workarounds by nature.

## Installation
```javascript
npm install anti
```

## Usage
You can use Anti in a browser or in NodeJS, pass it an unsanitized string of DOM and get a sanitized string (or a DOM object) in return. Note that the returned String/DOMObject will be wrapped around a div with class="anti".
```javascript
var XSSParser = new Anti();
var result = XSSParser.parse('<div class="hello world">!</div><script>alert("xss")</script>');
console.log(result);
// Output: <div class="anti"><div class="hello world">!</div></div>
```
#### > Browsers
Anti includes full support for browsers. It does not use Regular Expressions (RegEx) but rather the browser's internal method **DOMParser**. Support for this method is approximately 97% of all browsers (http://caniuse.com/#feat=xml-serializer) and provides superior security compared to innerHTML method. You can include **anti.js** or **anti.min.js** from the **build** folder like so:
```html
...
<body>
...
<script src="build/anti.min.js"></script>
</body>
```
Or using [**Browserify**](http://browserify.org/)
```javascript
// Install (refer to installation)
var Anti = require('anti');
// Refer to Usage
```
Alternatively when using [**Bower**](http://bower.io/)
```javascript
bower install anti
// Include bower_components/anti/build/anti.min.js
```

## Filters
You can modify default filter lists that are extended to every instance of Anti. Filters are an array of lowercase strings that are compared for parsing. If an element tag is a part of the filter it will be kept in the final results. (e.g. script tag is not part of the ACCEPTABLE_BLOCK_ELEMENTS). Instance Filters are as follows:
- **ACCEPTABLE_BLOCK_ELEMENTS** all acceptable DOM elements (e.g. div, table, nav, etc.)
- **ACCEPTABLE_SANITARY_ATTRIBUTES** all acceptable DOM attributes *which do not include a URL* (e.g. title, height, align, etc.)
- **ACCEPTABLE_UNSANITARY_ATTRIBUTES** all acceptable DOM attributes *which include a URL* (e.g. href, src, style, etc.)

As Filters are JS arrays you can modify them using Push, Pop, Shift, Unshift methods or you can modify them entirely to your liking:

```javascript
var XSSParser = new Anti();
// Only allow div, span tags <div>, <span>
XSSParser.ACCEPTABLE_BLOCK_ELEMENTS = ['div', 'span'];

// Only allow title attribute <div title="test">
XSSParser.ACCEPTABLE_SANITARY_ATTRIBUTES = ['title'];
XSSParser.ACCEPTABLE_UNSANITARY_ATTRIBUTES = [];

var result = XSSParser.parse('<div title="test" style="display:none">Hello World!</div><section>This will be excluded</section>');
console.log(result);
// Output: <div class="anti"><div title="test">Hello World!</div></div>
```

## Options
You can pass options while creating an Anti instance or by modifying the Options attribute in that specific instance.
e.g.
```javascript
// Forces Anti to return a DOM object instead of a serialized string, hence you will be able to directly append the output
var options = { serialize: false };

var XSSParser = new Anti(options);
// Alternatively XSSParses.Options.serialize = false
var result = XSSParser.parse('<div>test</div>');
console.log(result);
// Output: [object HTMLDivElement]
```

## Experimental -> Inline CSS Parser
This feature allows for filtering of inline CSS styles (e.g. style="font-size: 2px; color: red;"). You can enable this feature by passing { experimentalInlineCSS: true } options to the Anti constructor. Note that this method uses an internal parsing function with only one RegEx test to test for validity of url() values. The filter for this method is defined as **ACCEPTABLE_CSS_PROPERTIES**.

## Disclaimer:
This module utilizes a doze of insanity and a drop of blood from the Black Witch of the North to bring joy to your divs and html elements without the hassle of unwanted magic spells and bacteria incorporated with your non-sanitary method of sanitization. Thus it is highly experimental to the extent that even this sentence is currently being tested in our non-existent laboratory which I will assure you is experimental itself. Use it at your own risk.

## License
MIT &copy; Schahriar SaffarShargh - [Full License](https://github.com/schahriar/anti/blob/master/README.md)