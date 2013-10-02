
'use strict';

var GeneratorJS = function (files) {
  var ie6js = '',
    js      = '',
    ie6css  = '',
    css     = '',

    generatedClassesCount = 0,

    // for all IEs
    rules = {
      'first-child':    [], 
      'last-child':     [],
      'nth-child':      [],
      'first-of-type':  [],
      'last-of-child':  [],
      'nth-of-type':    [],
      'nth-last-child': [],
      'empty':          [],
      'not':            [],
      'disabled':       [],
      'enabled':        [],
      'checked':        []
    },

    // for ie6 only
    rulesIE6 = {
      'before':         [],
      'after':          [],
      'attr':           [],
      'child':          [], // >
      'adjacent':       [], // ~
      'sibling':        []  // +
    },

    pairsAfter  = {},
    pairsBefore = {},
    pairsIE6    = {},
    pairs       = {},

    chooseSelectors = function () {
      var selector,
        s;

      // for each css file
      files.css.forEach(function (css) {
        // for each rule
        css.rules.forEach(function (rule) {
          s = rule.selector;

          // for each type of selectors ie6
          for (selector in rulesIE6) {
            // if is child selector (+, >, ~)
            if (selector.length === 1) {
              if (~s.indexOf(selector)) {
                rulesIE6[selector].push(rule);
              }
            } else if (~s.indexOf(':' + selector)) {
              rulesIE6[selector].push(rule);
            }
          }

          // for each type of selectors
          for (selector in rules) {
            if (~s.indexOf(':' + selector)) {
              rules[selector].push(rule);
            }
          }
        });
      });
    },

    generateCSS = function() {
      var selector,
        rulesCSS, // array of selectors
        prop,
        newClass,
        s;

      // css for IE6
      for (selector in rulesIE6) {
        rulesCSS = rulesIE6[selector];

        rulesCSS.forEach(function (rule) {
          s = rule.selector;
          newClass = 'iefixfree-' + generatedClassesCount++;

          if (~s.indexOf(':before')) {
            pairsBefore[s] = newClass;
          } else if (~s.indexOf(':after')) {
            pairsAfter[s] = newClass;
          } else {
            pairsIE6[s] = newClass;
          }

          ie6css += 'iefixfree-' + generatedClassesCount;
          ie6css += ' {\n';

          for (prop in rule.properties) {
            ie6css += '    ' + prop + ': ' + rule.properties[prop] + ';\n';
          }

          ie6css += '}\n\n';
        });
      }

      // css for all IEs
      for (selector in rules) {
        rulesCSS = rules[selector];
        rulesCSS.forEach(function (rule) {
          pairs[rule.selector] = 'iefixfree-' + generatedClassesCount++;
          css += 'iefixfree-' + generatedClassesCount;
          css += ' {\n';

          for (prop in rule.properties) {
            css += '    ' + prop + ': ' + rule.properties[prop] + ';\n';
          }

          css += '}\n\n';
        });
      }
    },

    generateJS = function() {
    },

    run = function() {
      chooseSelectors();
      generateCSS();

      ie6css += css;

      pairs = JSON.stringify(pairs);
      pairsIE6 = JSON.stringify(pairsIE6);
      pairsBefore = JSON.stringify(pairsBefore);
      pairsAfter = JSON.stringify(pairsAfter);

      log('js:');
      log(ie6css);
      log('pairs');
      log(pairs);
      log('before ie6');
      log(pairsBefore);
      log('after ie6');
      log(pairsAfter);
    };

  this.getCode = function () {
    return {ie6js: ie6js, js: js, ie6css: ie6css, css: css};
  };

  run();
  log('done');
};
