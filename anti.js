/*
  The MIT License (MIT)
  
  Copyright (c) 2015 Schahriar SaffarShargh
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
/*
  - Anti XSS Protection Module - --------------------
  Author: Schahriar SaffarShargh <info@schahriar.com>
  - ---------------------------- --------------------
  Disclaimer:
  This module utilizes a doze of insanity and a drop of blood from the Black Witch of the North to bring joy to your divs and html elements without the hassle of unwanted magic spells and bacteria incorporated with your non-sanitary method of sanitization. Thus it is highly experimental to the extent that even this sentence is currently being tested in our non-existent laboratory which I will assure you is experimental itself. Use it at your own risk.
  - -------------------------- - --------------------
*/

"use strict";

(function () {
  // Define a unique variable for DOMParser & XMLSerializer to prevent collisions
  var ANTI_DOM_PARSER, ANTI_DOM_SERIALIZER;
  // Determines which Parser (NodeJS:xmldom->DOMParser, Browsers:DOMParser) to attach to our unique variable
  if (typeof DOMParser === "undefined") ANTI_DOM_PARSER = require('xmldom').DOMParser;
  else ANTI_DOM_PARSER = DOMParser;
  // Determines which Serializer (NodeJS:xmldom->XMLSerializer, Browsers:XMLSerializer) to attach to our unique variable
  if (typeof XMLSerializer === "undefined") ANTI_DOM_SERIALIZER = require('xmldom').XMLSerializer;
  else ANTI_DOM_SERIALIZER = XMLSerializer || Function;
  
  // Weirdly wrap Anti around Module definition
  var Module = (function () {
    var Anti = function ANTI_LOCAL(options) {
      this.Options = options || {};
      this.Parser = new ANTI_DOM_PARSER({
        errorHandler: {
          warning: new Function,
          error: new Function,
          fatalError: new Function
        }
      });
      /* Should throw if method serializeToString does not exist */
      this.Serializer = new ANTI_DOM_SERIALIZER();
      
      /// - DOM SAFELIST - ///
      /* Add support for SVG */
      /* Kills data attributes */
      this.ACCEPTABLE_BLOCK_ELEMENTS = ["#text", "a", "abbr", "acronym", "address", "article", "aside", "b", "bdi", "bdo", "big", "blockquote", "br", "caption", "center", "cite", "code", "colgroup", "dd", "del", "del", "dfn", "dir", "div", "dl", "dt", "em", "figcaption", "figure", "font", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "i", "img", "ins", "ins", "kbd", "label", "li", "map", "map", "mark", "menu", "nav", "ol", "p", "pre", "q", "rp", "rt", "ruby", "s", "samp", "section", "small", "span", "strike", "strong", "sub", "sup", "table", "tbody", "td", "tfoot", "th", "thead", "time", "tr", "tt", "u", "ul", "var"];
      this.ACCEPTABLE_SANITARY_ATTRIBUTES = ["abbr", "align", "alt", "axis", "bgcolor", "border", "cellpadding", "cellspacing", "class", "clear", "color", "cols", "colspan", "compact", "coords", "dir", "face", "headers", "height", "hreflang", "hspace", "ismap", "lang", "language", "nohref", "nowrap", "rel", "rev", "rows", "rowspan", "rules", "scope", "scrolling", "shape", "size", "span", "start", "summary", "tabindex", "target", "title", "type", "valign", "value", "vspace", "width"];

      this.ACCEPTABLE_UNSANITARY_ATTRIBUTES = ["background", "cite", "href", "longdesc", "src", "usemap", "style", "xlink:href"];
      /// - ------------ - ///
      /// - CSS SAFELIST - ///
      // This list is derived from document.createElement('div').style
      this.ACCEPTABLE_CSS_PROPERTIES = ["align-content", "align-items", "align-self", "alignment-baseline", "all", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "backface-visibility", "background", "background-attachment", "background-blend-mode", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-position-x", "background-position-y", "background-repeat", "background-repeat-x", "background-repeat-y", "background-size", "baseline-shift", "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-shadow", "box-sizing", "buffered-rendering", "caption-side", "clear", "clip", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-rendering", "content", "counter-increment", "counter-reset", "css-text", "cursor", "cx", "cy", "direction", "display", "dominant-baseline", "empty-cells", "enable-background", "fill", "fill-opacity", "fill-rule", "filter", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "flood-color", "flood-opacity", "font", "font-family", "font-kerning", "font-size", "font-stretch", "font-style", "font-variant", "font-variant-ligatures", "font-weight", "glyph-orientation-horizontal", "glyph-orientation-vertical", "height", "image-rendering", "isolation", "justify-content", "left", "length", "letter-spacing", "lighting-color", "line-height", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marker", "marker-end", "marker-mid", "marker-start", "mask", "mask-type", "max-height", "max-width", "max-zoom", "min-height", "min-width", "min-zoom", "mix-blend-mode", "object-fit", "object-position", "opacity", "order", "orientation", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "page-break-inside", "paint-order", "parent-rule", "null", "perspective", "perspective-origin", "pointer-events", "position", "quotes", "r", "resize", "right", "rx", "ry", "shape-image-threshold", "shape-margin", "shape-outside", "shape-rendering", "size", "speak", "src", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "tab-size", "table-layout", "text-align", "text-anchor", "text-decoration", "text-indent", "text-overflow", "text-rendering", "text-shadow", "text-transform", "top", "touch-action", "transform", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "unicode-bidi", "unicode-range", "user-zoom", "vector-effect", "vertical-align", "visibility", "white-space", "widows", "width", "will-change", "word-break", "word-spacing", "word-wrap", "writing-mode", "x", "y", "z-index", "zoom"];
      /// - ------------ - ///
    };

    Anti.prototype.parse = function ANTI_PARSER(HTML_STRING, callback) {
      var ReturnAttributes = [];
      // Context
      var _this = this;
      
      // Clean Context
      this._DOCUMENT_ = null;
      this.root = null;
      
      // Populates this.root, this._DOCUMENT_
      this._parseToImmediateDOM(HTML_STRING.toString());
      
      // Copies all childen into variable DOM
      // Since the object above is not a simple JS Array (Should have a DOM-like structure on Browsers)
      // I took the liberty to copy only what we need into a clean Array
      this._cleanDOM(this.root, this._(this.root).children());
      this.root.attributes = {};
      
      /* Output a fixed root */

      var e = (this.Options.serialize) ? this.Serializer.serializeToString(this.root) : this.root;

      ReturnAttributes.push(e);
      
      // Allows for Async/Sync calls
      /* implement async functionality to forEach loops */
      if ((callback) && (callback.constructor === Function)) callback.apply(null, ReturnAttributes);
      else return (ReturnAttributes.length > 1) ? ReturnAttributes : ReturnAttributes[0];
    }

    Anti.prototype._parseToImmediateDOM = function ANTI_TO_IMMEDIATE(HTML_STRING) {
      this._DOCUMENT_ = this.Parser.parseFromString(HTML_STRING, "text/html");

      /* Test if this works in every case & if an attacker could confuse it */
      // Decide root from given document
      if (this._(this._DOCUMENT_.documentElement).tag === 'html') {
        /// ROOT TAG -> HTML
        var _this = this;
        // Find Body -> This works better on Browsers as they tend to
        // wrap the DOMParser output in a #document object
        this._(this._DOCUMENT_.documentElement).children().forEach(function (node) {
          if (node.tag === 'body') _this.root = node.node;
        })
      } else if (this._(this._DOCUMENT_.documentElement).tag === 'body') {
        /// ROOT TAG -> BODY
        this.root = this._DOCUMENT_.documentElement;
      } else {
        /// ROOT TAG -> ROOT
        this.root = this._DOCUMENT_;
      }
    };

    Anti.prototype._cleanDOM = function ANTI_TO_CLEAN(ROOT, DIRTYDOM) {
      var _this = this;
      
      /* Improve performance and reduce resources */
      // Poor man's cache solution (bad for GC, I know)
      var EL_ATTRIBUTES_CACHE = [];
      var CLEANDOM = [];
      
      /* Implement async method */
      // Heavily recursive
      DIRTYDOM.forEach(function (node, index) {
        // Check if element is acceptable
        if (_this._lookup(_this.ACCEPTABLE_BLOCK_ELEMENTS, node.tag)) {
          // CLEAN BLOCK : *Attributes might still be dirty
          EL_ATTRIBUTES_CACHE = node.attr();
          EL_ATTRIBUTES_CACHE.forEach(function (attr, index) {
            // REMOVE UNSANITARY ATTRIBUTES
            if (_this._lookup(_this.ACCEPTABLE_SANITARY_ATTRIBUTES, attr.name)) {
              // DO NOTHING FOR NOW - ATTR is acceptable
            } else if (_this._lookup(_this.ACCEPTABLE_UNSANITARY_ATTRIBUTES, attr.name)) {
              /* Add target:_blank to all a links */
              /* Add option for cross site linking/replacement */
              // Re-assign attribute with URL encoding
              node.removeAttribute(attr.name);
              /* Replace with inline-css xss protection */
              if (attr.name === 'style') {
                // If InlineCSS is enabled
                if(this.Options.experimentalInlineCSS) node.setAttribute(attr.name, _this._parseInlineCSS(attr.value));
              } else {
                node.setAttribute(attr.name, encodeURIComponent(attr.value));
              }
            } else {
              node.removeAttribute(attr.name);
            }
          })
          // Recursively clean children
          _this._cleanDOM(node, node.children());
          // PUSH CLEAN BLOCK
          CLEANDOM.push(node);
        } // -> Else ignore the element (Wouldn't be included in CleanDOM)
      })

      _this._(ROOT).children(CLEANDOM);
    }

    Anti.prototype._lookup = function ANTI_PARAM_LOOKUP(ARRAY, NAME_STRING) {
      if (!NAME_STRING || !ARRAY) return false;
      // Returns True if STRING is a part of the Array or False if it isn't
      return (ARRAY.indexOf(NAME_STRING.toLowerCase()) >= 0);
    }

    Anti.prototype._parseInlineCss = function ANTI_CSS_INLINE(CSS_STRING, OUTPUT) {
      // PERFORMANCE COMPARISON OF CHAR SELECTION http://jsperf.com/charat-vs-regex-vs-prop/3 & LATER REVISIONS
      // PROP (STRING[index]) WAS SELECTED DUE TO CONSISTENT PERFORMANCE
      var CSSOM_KEY_VALUE_STORE = new Object;
      
      // Buffers
      var PROPERTY_BUFFER = "";
      var VALUE_BUFFER = "";

      // Scope Indicators
      var PROPERTY_OPEN = true;
      var VALUE_OPEN = false;

      // Determines validity of CSS values/URLs
      var VALUE_URL = "";      
      var IS_VALID = true;

      // Characters that we ignore in the for loop
      var IGNORED_CHARS = " ,\n,\t".split(',');

      for (var i = 0; i < CSS_STRING.length; i++) {
        // If Char is not part of the ACCEPTABLE_CHARS
        if (this._lookup(IGNORED_CHARS, CSS_STRING[i].toLowerCase())) continue;

        if (PROPERTY_OPEN) {
          if (CSS_STRING[i] === ':') {
            /// Switch to Value Mode
            PROPERTY_OPEN = false;
            VALUE_OPEN = true;
            ///
          } else {
            // Buffer property
            PROPERTY_BUFFER += CSS_STRING[i];
          }
        } else {
          if (CSS_STRING[i] === ';') { /* ALL CSS VALUES MUST END WITH A SEMI-COLON, Make a pull request if this is not valid it would be easy to do a EOL validation here */
            /// Switch to Property Mode
            PROPERTY_OPEN = true;
            VALUE_OPEN = false;
            ///
            // if property is part of the list
            if (this._lookup(this.ACCEPTABLE_CSS_PROPERTIES, PROPERTY_BUFFER)) {
              // Check if property contains a url value
              if (VALUE_BUFFER.substring(0, 3) === 'url') {
                // Determine format of the css value
                if (VALUE_BUFFER[4] === "'") {
                  // FORMAT = url('http://example.com')
                  VALUE_URL = VALUE_BUFFER.substring(4,VALUE_BUFFER.length-2);
                } else {
                  // FORMAT = url(http://example.com)
                  VALUE_URL = VALUE_BUFFER.substring(3,VALUE_BUFFER.length-1);
                }
                // Validate through *REGEX
                IS_VALID = this._isValidURL(VALUE_URL);
                VALUE_URL = "";
              }
              // If Property is Valid : Assign properties to the Store
              if (IS_VALID) CSSOM_KEY_VALUE_STORE[PROPERTY_BUFFER.toLowerCase()] = VALUE_BUFFER;
              else IS_VALID = true;
            }
            // Reset buffers
            PROPERTY_BUFFER = VALUE_BUFFER = "";
          } else {
            // Buffer value
            VALUE_BUFFER += CSS_STRING[i];
          }
        }
      }
      
      // Covert back to inline string
      var OUTPUT_STRING = "";
      for (var key in CSSOM_KEY_VALUE_STORE) {
        // Format = css-property: value;
        OUTPUT_STRING += key + ':' + CSSOM_KEY_VALUE_STORE[key] + '; ';
      }

      // An Output argument to this function
      // determines whether CSSOM or String returns
      return (OUTPUT === "OBJECT") ? CSSOM_KEY_VALUE_STORE : OUTPUT_STRING;
    }
    
    Anti.prototype._isValidURL = function ANTI_VALID_URL(URL_STRING) {
      // Credits to Diego Perini https://gist.github.com/dperini/729294
      // MIT License found at CREDITS file
      var URL_TEST = new RegExp(
        "^" +
          // protocol identifier
          "(?:(?:https?|ftp)://)" +
          // user:pass authentication
          "(?:\\S+(?::\\S*)?@)?" +
          "(?:" +
            // IP address exclusion
            // private & local networks
            "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
            "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
            "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
            // IP address dotted notation octets
            // excludes loopback network 0.0.0.0
            // excludes reserved space >= 224.0.0.0
            // excludes network & broacast addresses
            // (first & last IP address of each class)
            "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
            "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
            "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
          "|" +
            // host name
            "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
            // domain name
            "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
            // TLD identifier
            "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
            // TLD may end with dot
            "\\.?" +
          ")" +
          // port number
          "(?::\\d{2,5})?" +
          // resource path
          "(?:[/?#]\\S*)?" +
        "$", "i"
      );
      return URL_TEST.test(URL_STRING);
    }
    
    // Helper functions (jQuery like)
    Anti.prototype._ = function ANTI_NODE_EXT(node) {
      if (node.ANTI_WRAPPED) node = node.node;

      var _this = this;
      return {
        tag: node.nodeName.toLowerCase() || null,
        remove: function ANTI_DOM_REMOVE() {
          // Removes Current Node
          node.parentNode.removeChild(node)
        },
        attr: function ANTI_DOM_ATTR() {
          var NODE_ATTRIBUTES = [];
          // Allow for #text elements
          if (!node.attributes) return NODE_ATTRIBUTES;
          for (var i = 0; i < node.attributes.length; i++) {
            NODE_ATTRIBUTES[i] = {
              name: node.attributes[i].name,
              value: node.attributes[i].value
            }
          }
          // Returns/Sets Node Attributes
          return NODE_ATTRIBUTES;
        },
        removeAttribute: function ANTI_ATTR_REMOVE(ATTR) {
          node.removeAttribute(ATTR);
        },
        setAttribute: function ANTI_ATTR_SET(ATTR, VALUE) {
          node.setAttribute(ATTR, VALUE);
        },
        children: function ANTI_DOM_CHILDREN(children, native) {
          // Returns/Sets Node Children
          if (!children) {
            var NODE_CHILDREN = [];
            // Allow for #text elements
            if (!node.childNodes) return NODE_CHILDREN;
            // Wrap every child around _
            for (var i = 0; i < node.childNodes.length; i++) {
              if (!native) NODE_CHILDREN[i] = _this._(node.childNodes[i]);
              else NODE_CHILDREN[i] = node.childNodes[i];
            }
            return NODE_CHILDREN;
          } else {
            var NODE_CHILDREN = [];
            /* Nodes removed without cloning will append removed/null elements
               This requires Cloning of all children
               * If you find a better method for this please create a pull request
               I would be glad to avoid 3 loops in a recursive function
            */
            for (var i = 0; i < children.length; i++) {
              NODE_CHILDREN[i] = children[i].node.cloneNode(true);
            }
            // Remove all current children
            while (node.lastChild) {
              node.removeChild(node.lastChild);
            }
            // Append allowed/cloned children
            for (var i = 0; i < NODE_CHILDREN.length; i++) {
              node.appendChild(NODE_CHILDREN[i]);
            }

            return node.childNodes;
          }
        },
        parent: function ANTI_DOM_PARENT() {
          // Returns parent node
          return _this._(node.parentNode);
        },
        node: node,
        ANTI_WRAPPED: true
      }
    }

    return Anti;
  })();

  // Support for NODEJS, AMD, BROWSERS Thanks to http://www.matteoagosti.com/blog/2013/02/24/writing-javascript-modules-for-both-browser-and-node/
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Module;
  }
  else {
    if (typeof define === 'function' && define.amd) {
      define([], function () {
        return Module;
      });
    }
    else {
      window.Anti = Module;
    }
  }
})();