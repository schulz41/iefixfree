
'use strict';

/**
 * @constructor
 * @param files FileBuilder object
 */

var GeneratorCSS = function (files) {
  // contains css code for each browser
  var ie6css = '',
    ie7css  = '',
    ie8css  = '',

    // contains the css selectors of elements that need fixes

    selectors = {
      'display':         [],
      'float':           [],
      'innerFloatLeft':  [],
      'innerFloatRight': [],
      'textAlign':       [],
      'smallHeight':     [],
      'height':          [],
      'minHeight':       [],
      'cursor':          [],
      'position':        [],
      'overflow':        [],
      'opacity':         [],
      'color':           []
    },

    /**
     * @private
     * @param selector selector of elements whose parents are searched
     * @param which bug is fixed
     * @param filter selector to compare
     */
    addParents = function (selector, which, filter) {
      /**
       * @param s selectors to check
       * @param filter selector to compare
       */
      var matches = function (s) {
          // just check element
          return s.split(' ').pop() === filter;
        },
        usedSelectors = [],
        elements,
        s;

      // for each .html document, if any
      files.html.forEach(function (html) {
        // get all elements that mathed
        elements = html.querySelectorAll(selector);
        if (!elements) {
          return;
        }

        Array.prototype.forEach.call(elements, function (e) {
          // get its parent selector
          s = getSelector(e.parentNode);
          if (usedSelectors[s]) {
            return;
          }
          usedSelectors[s] = 1;
          // add new selector
          if (!filter || matches(s)) {
            selectors[which].push(s);
          }
        });
      });
    },

    /**
     * @private
     * @param rgba string represents color in decimal rgba format
     * @returns string represents color in hexadecimal rgba format
     */
    rgba2hex = function (rgba) {
      var values = rgba.slice(5, -1).split(','),
        result = '#',
        tmp,
        i;

      for (i = 0; i < 3; i++) {
        tmp = parseInt(values[i], 10).toString(16);
        if (tmp.length === 1) {
          tmp = '0' + tmp;
        }
        result += tmp;
      }

      tmp = Math.floor(parseFloat(values[3], 10) * 100).toString(16);
      if (tmp.length === 1) {
        tmp = '0' + tmp;
      }
      result += tmp;

      return result;
    },

    // each method may to add selector to the 'selectors' array
    methods = {
      'display': function (value, selector) {
        if (value === 'inline-block') {
          selectors.display.push(selector);
        }
      },
      'float': function (value, selector) {
        var len = files.html.length,
          // innerFloatLeft or innerFloatRight, if has float
          s;

        // if has float
        if (value !== 'none') {
          s = 'innerFloat' + value[0].toUpperCase() + value.slice(1);
          addParents(selector, s, 'li');
          selectors.float.push(selector);
        }
      },
      'text-align': function (value, selector) {
        if (value === 'justify') {
          selectors.textAlign.push(selector);
        }
      },
      'height': function (value, selector) {
        if (!parseInt(value)) {
          selectors.smallHeight.push(selector);
        } else {
          selectors.height.push(selector);
        }
      },
      'min-height': function (value, selector) {
        selectors.minHeight.push({selector: selector, value: value});
      },
      'cursor': function (value, selector) {
        if (value === 'pointer') {
          selectors.cursor.push(selector);
        }
      },
      'position': function (value, selector) {
        if (value === 'fixed') {
          selectors.position.push(selector);
        }
      },
      'overflow': function (value, selector) {
        if (value === 'hidden') {
          addParents(selector, 'overflow');
        }
      },
      'opacity': function (value, selector) {
        if (value !== 1) {
          selectors.opacity.push({selector: selector, value: value * 100});
        }
      },
      'color': function (value, selector) {
        if (value.slice(0, 4) === 'rgba') {
          selectors.color.push({selector: selector, value: rgba2hex(value)});
        }
      }
    },

    /**
     * @private
     * @param css ParserCSS object
     */

    processSingleFile = function (css) {
      var selector,
        value,
        prop;

      // for each Rule in the css file
      css.rules.forEach(function (rule) {
        // for each property
        for (prop in rule.properties) {
          value = rule.properties[prop];
          selector = rule.selector;

          // if this may cause a bug
          if (methods[prop]) {
            // call method that will add selector to the 'selectors' array
            methods[prop](value, selector);
          }
        }
      });
    },

    /**
     * @private
     */
    chooseSelectors = function () {
      // add some permanent fixes
      ie6css += 'html {\n  filter: expression(document.execCommand("BackgroundImageCache", false, true));\n}\n\n';
      ie6css += 'li {\n  display: list-item;\n}\n\n';
      ie6css += 'ul {\n  position: relative;\n}\n\n';

      // for each css file (internal styles too)
      files.css.forEach(function (css) {
        processSingleFile(css);
      });
    },

    /**
     * generate ie*css strings from selectors and fix-strings
     * @private
     */
    generate = function () {
      var processSingleFix = function (selectors, text) {
          var len = selectors.length,
            usedSelectors = {},
            result = '',
            s,
            i;

          if (!len) {
            return result;
          }

          // iterate over the all selectors and add it to the result strings
          // each selector is added just once

          // if there's just a selector (value is some keyword)
          if (typeof selectors[0].value === 'undefined') {
            // for each selector except last
            for (i = 0; i < len - 1; i++) {
              s = selectors[i];
              if (usedSelectors[s]) {
                continue;
              }
              // put the colon after every selector
              result += s + ', \n';
              usedSelectors[s] = 1;
            }

            // add the last selector
            result += selectors[len - 1];
            // add the text from 'fixes' array
            result += text;
          } else { // if there's a selector and special value
            // just the same, but css text adds for every selector with its special value
            for (i = 0; i < len; i++) {
              s = selectors[i];
              if (usedSelectors[s.selector]) {
                continue;
              }
              result += s.selector;
              usedSelectors[s.selector] = 1;
              result += text.replace(/%value%/g, s.value);
            }
          }

          return result;
        },

        // strings to append to the result css
        // '%value%' must be replaced by actual value
        fixes = {
          'display':         ' {\n  display: inline;\n  zoom: 1;\n}\n\n',
          'float':           ' {\n  display: inline;\n}\n\n',
          'innerFloatLeft':  ' {\n  float: left;\n  display: inline;\n}\n\n',
          'innerFloatRight': ' {\n  float: right;\n  display: inline;\n}\n\n',
          'textAlign':       ' {\n  text-justify: newspaper;\n}\n\n',
          'smallHeight':     ' {\n  overflow: hidden;\n}\n\n',
          'height':          ' {\n  overflow: hidden;\n}\n\n',
          'minHeight':       ' {\n  height: %value%;\n}\n\n',
          'cursor':          ' {\n  cursor: hand;\n}\n\n',
          'position':        ' {\n  position: absolute;\n  top: expression(parseInt(document.body.scrollTop, 10) + "px");\n}\n\n',
          'overflow':        ' {\n  position: relative;\n}\n\n',
          'opacity':         ' {\n  filter:progid:DXImageTransform.Microsoft.Alpha(opacity=%value%);\n  zoom: 1;\n}\n',
          'color':           ' {\n  background: transparent;\n  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=%value%, endColorstr=%value%);\n}\n\n'
        },

        buffer,
        i;

      // for each possible problem (css property) generate some css
      for (i in selectors) {
        buffer = processSingleFix(selectors[i], fixes[i]);
        ie6css += buffer;
      }

      log('css: ');
      log(ie6css);
    },

    run = function () {
      chooseSelectors();
      generate();

      // and new css rules to fix there the Cntt supported selectors
      files.css.push(new ParserCSS(ie6css));
      files.css.push(new ParserCSS(ie7css));
      files.css.push(new ParserCSS(ie8css));

      // log('ie6:');
      // log(ie6css);
    };

  this.getCode = function () {
    return {ie6: ie6css, ie7: ie7css, ie8: ie8css};
  };

  run();
};