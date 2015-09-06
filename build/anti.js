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
      // Default options
      if(!this.Options.serialize) this.Options.serialize = true;
      if(!this.Options.wrapper) this.Options.wrapper = "<div class='anti'></div>";
      
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
      /* v0.2: Allow for individual attribute filtering per block && value per property */
      this.ACCEPTABLE_BLOCK_ELEMENTS = ["#text", "a", "abbr", "acronym", "address", "article", "aside", "b", "bdi", "bdo", "big", "blockquote", "br", "caption", "center", "cite", "code", "colgroup", "dd", "del", "del", "dfn", "dir", "div", "dl", "dt", "em", "figcaption", "figure", "font", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "i", "img", "ins", "ins", "kbd", "label", "li", "map", "map", "mark", "menu", "nav", "ol", "p", "pre", "q", "rp", "rt", "ruby", "s", "samp", "section", "small", "span", "strike", "strong", "sub", "sup", "table", "tbody", "td", "tfoot", "th", "thead", "time", "tr", "tt", "u", "ul", "var"];
      this.ACCEPTABLE_SANITARY_ATTRIBUTES = ["abbr", "align", "alt", "axis", "bgcolor", "border", "cellpadding", "cellspacing", "class", "clear", "color", "cols", "colspan", "compact", "coords", "dir", "face", "headers", "height", "hreflang", "hspace", "ismap", "lang", "language", "nohref", "nowrap", "rel", "rev", "rows", "rowspan", "rules", "scope", "scrolling", "shape", "size", "span", "start", "summary", "tabindex", "target", "title", "type", "valign", "value", "vspace", "width"];

      this.ACCEPTABLE_UNSANITARY_ATTRIBUTES = ["background", "cite", "href", "longdesc", "src", "usemap", "style", "xlink:href"];
      /*</EXPERIMENTAL>*/
    };

    Anti.prototype.parse = function ANTI_PARSER(HTML_STRING, callback) {
      var ReturnAttributes = [];
      
      // Get document and is root
      var ParsedROOT = this._parseToImmediateDOM(HTML_STRING.toString());
      
      /* HTML xmlns tag is retained on the wrapper */
      // Wrapper element
      var WRAPPER = this.Parser.parseFromString(this.Options.wrapper, "text/html").documentElement;
      // Browser Fix (Browsers wrap the element in an HTML parent)
      if (WRAPPER.nodeName.toLowerCase() === 'html') WRAPPER = (WRAPPER.childNodes[1])?WRAPPER.childNodes[1].childNodes[0]:WRAPPER;
      
      // Copies all childen into variable DOM
      // Since the object above is not a simple JS Array (Should have a DOM-like structure on Browsers)
      // I took the liberty to copy only what we need into a clean Array
      this._cleanDOM(ParsedROOT, this._(ParsedROOT).children());
      
      // Clean Root
      var BODY_CHILDREN = this._(ParsedROOT).children();
      this._(WRAPPER).children(BODY_CHILDREN);

      return (this.Options.serialize) ? this.Serializer.serializeToString(WRAPPER) : WRAPPER;
    }

    Anti.prototype._parseToImmediateDOM = function ANTI_TO_IMMEDIATE(HTML_STRING) {
      var _ROOT_ = null;
      var _DOCUMENT_ = this.Parser.parseFromString(HTML_STRING, "text/html");

      /* Test if this works in every case & if an attacker could confuse it */
      // Decide root from given document
      if (this._(_DOCUMENT_.documentElement).tag === 'html') {
        /// ROOT TAG -> HTML
        // Find Body -> This works better on Browsers as they tend to
        // wrap the DOMParser output in a #document object
        this._(_DOCUMENT_.documentElement).children().forEach(function (node) {
          if (node.tag === 'body') _ROOT_ = node.node;
        })
      } else if (this._(_DOCUMENT_.documentElement).tag === 'body') {
        /// ROOT TAG -> BODY
        _ROOT_ = _DOCUMENT_.documentElement;
      } else {
        /// ROOT TAG -> ROOT
        _ROOT_ = _DOCUMENT_;
      }
      
      return _ROOT_;
    };

    Anti.prototype._cleanDOM = function ANTI_TO_CLEAN(ROOT, DIRTYDOM) {
      var _this = this;
      
      /* Improve performance and reduce resources */
      // Cache solution
      var EL_ATTRIBUTES_CACHE = [];
      var CLEANDOM = [];
      
      // Heavily recursive
      DIRTYDOM.forEach(function (node, index) {
        // Check if element is acceptable || #text
        if ((_this._lookup(_this.ACCEPTABLE_BLOCK_ELEMENTS, node.tag)) || (node.tag === "#text")) {
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
              if (attr.name === 'style') {
                // If InlineCSS is enabled
                if(_this.Options.experimentalInlineCSS && _this._parseInlineCSS) node.setAttribute(attr.name, _this._parseInlineCSS(attr.value));
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

    /*</EXPERIMENTAL>*/
    
    // Helper functions (jQuery like)
    Anti.prototype._ = function ANTI_NODE_EXT(node) {
      if (node.ANTI_WRAPPED) node = node.node;

      var _this = this;
      return {
        tag: (node.nodeName)?node.nodeName.toLowerCase():node.tagName,
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
              NODE_CHILDREN[i] = (children[i].node)?children[i].node.cloneNode(true):children[i].cloneNode(true);
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