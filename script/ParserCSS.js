
'use strict';

/**
 * @constructor
 */
var Rule = function (selector, properties) {
  this.selector = selector;
  this.properties = properties;
};

/**
 * @constructor
 */
var ParserCSS = function (code, isInline) {
  this.rules = [];

  var self = this,
    index = 0,
    size = code.length,

    parse = function () {
      var start;

      skip();
      while (!eof()) {
        start = curr();

        if (start === '@') {
          skipAtRule();
        } else if (start === '/') {
          skipComment();
        } else {
          readRule();
        }
        skip();
      }
    },

    // TODO: maybe split to the read sel & read prop
    readRule = function () {
      // index pointed on the first char of selector
      var selectors = '',
        insideString = false, // if inside of 'content' or url
        properties = [],
        value = '',
        name = '',
        c = '',
        len,
        i;

      // read all selectors
      while (!eof() && c !== '{') {
        selectors += c;
        c = curr();
        index++;
      }

      // for every selector make a special rule
      selectors = selectors.split(',');
      len = selectors.length;
      for (i = 0; i < len; i++) {
        selectors[i] = trim(selectors[i]);
      }

      if (eof()) {
        error('selectors');
      }

      // read properties
      while (!eof() && (c !== '}' || insideString)) {
        // read name
        name = '';
        c = '';
        // check '}' to trace empty rules
        // otherwise await for colon
        while (!eof() && c !== ':' && c !== '}') {
          name += c;
          c = curr();
          index++;

          if (c === '\'' || c === '"') {
            insideString = !insideString;
          }
        }

        if (eof() && c !== '}') {
          error('name');
        } else if (c === '}') {
          break;
        }

        // read value
        value = '';
        c = '';
        // check '}' to trace empty rules
        // if insideString then continue
        // otherwise await for semicolon
        while (!eof() && (c !== ';' && c !== '}' || insideString)) {
          value += c;
          c = curr();
          index++;

          if (c === '\'' || c === '"') {
            insideString = !insideString;
          }
        }

        // if there's '}' symbols so there's something wrong
        if (eof() && c !== '}') {
          error('value');
        }

        properties[trim(name)] = trim(value);
      }

      len = selectors.length;
      for (i = 0; i < len; i++) {
        self.rules.push(new Rule(selectors[i], properties));
      }
    },    

    skipComment = function () {
      var prevChar,
        currChar;
      // index pointed to the '/' symbol

      if (index === size - 1) {
        // if it's last char
        error('comment 1');
      }
      prevChar = curr();
      index++;
      currChar = curr();

      while (!eof() && !(currChar === '/' && prevChar === '*')) {
        prevChar = currChar;
        currChar = curr();
        index++;
      }

      if (eof() && (currChar !== '/' || prevChar !== '*')) {
        error('comment 2');
      }
    },

    skipAtRule = function () {
      // index pointed to the '@' symbol
      var insideString = false,
        c,
        depth;

      // reading whole @import-rule or first part of (@media or @font-face)
      do {
        c = curr();
        index++;

        if (c === '\'' || c === '"') {
          insideString = !insideString;
        }
      } while (!eof() && (c !== ';' && c !== '{' || insideString));

      if (eof()) {
        if (c !== ';' && c !== '{') {
          // if there's no ';' or '{' symbols after '@' so there's something wrong
          error();
        } else {
          // otherwise it's just eof
          return;
        }
      }

      // index pointed on the next char after selector (';' or '{')

      if (c === ';') {
        // @import
        return;
      } else {
        // @media or @font-face
        depth = 1; // count of start brackets
        while (!eof() && depth !== 0) {
          c = curr();
          if (c === '{' && !insideString) {
            depth++;
          } else if (c === '}' && !insideString) {
            if (depth <= 0) {
              error();
            }
            depth--;
          }
          index++;

          if (c === '\'' || c === '"') {
            insideString = !insideString;
          }
        }

        if (eof()) {
          if (depth !== 0) {
            error();
          } else {
            return;
          }
        }
      }
    },

    skip = function () {
      var c;

      do {
        c = curr();
        index++;
      } while (!eof() && c.match(/\s/));

      if (eof()) {
        return;
      }
      // index pointed on the next char after first non space element or it's eof
      index--; // now it's ok, just skip the spaces
    },

    eof = function () {
      return (index >= size);
    },

    curr = function () {
      return code[index];
    },

    dump = function () {
      var out = document.createElement('output'),
        s = '',
        key,
        i;

      for (i = 0; i < self.rules.length; i++) {
        s += '<br>' + self.rules[i].selector + ' {<br>';
        for (key in self.rules[i].properties) {
          s += '&nbsp;&nbsp;&nbsp;&nbsp;' + key + ': ' + self.rules[i].properties[key] + ';<br>';
        }
        s += '}<br>';
      }

      out.innerHTML = s;
      document.body.appendChild(out);
    },

    error = function (s) {
      if (s) {
        alert(s);
        throw new Error(s);
      } else {
        alert('invalid css document');
        throw new Error('invalid css document');
      }
    };

  parse();
};
