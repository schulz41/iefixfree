
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
          newClass = 'iefixfree-' + generatedClassesCount++;
          pairs[rule.selector] = newClass;
          css += newClass;
          css += ' {\n';

          for (prop in rule.properties) {
            css += '    ' + prop + ': ' + rule.properties[prop] + ';\n';
          }

          css += '}\n\n';
        });
      }
    },

    generateJS = function() {
      if (pairs.length > 2) {
        js += 'var pairs = ' + pairs + ';\n';
        js += 'var setClasses = ' + setClasses + ';\n';
        js += 'setClasses();\n\n';
      }
      if (pairsIE6.length > 2) {
        ie6js += 'var pairsIE6 = ' + pairsIE6 + ';\n';
        ie6js += 'var setIE6Classes = ' + setIE6Classes + ';\n\n';
        ie6js += 'setIE6Classes();\n\n';
      }
      if (pairsBefore.length > 2) {
        ie6js += 'var pairsBefore = ' + pairsBefore + ';\n';
        ie6js += 'var setBefore = ' + setBefore + ';\n\n';
        ie6js += 'setBefore();\n\n';
      }
      if (pairsAfter.length > 2) {
        ie6js += 'var pairsAfter = ' + pairsAfter + ';\n';
        ie6js += 'var setAfter = ' + setAfter + ';\n\n';
        ie6js += 'setAfter();\n\n';
      }

      ie6js += js;

      js += 'var polyfill = ' + polyfill + ';\npolyfill();\n\n';
      ie6js += 'var polyfill = ' + polyfill + ';\npolyfill();\n\n';
    },

    run = function() {
      chooseSelectors();
      generateCSS();

      ie6css += css;

      pairs       = JSON.stringify(pairs);
      pairsIE6    = JSON.stringify(pairsIE6);
      pairsBefore = JSON.stringify(pairsBefore);
      pairsAfter  = JSON.stringify(pairsAfter);

      generateJS();

      log('js-css:');
      log(ie6css);
      log('js-js:');
      log(ie6js);
    };

  this.getCode = function () {
    return {ie6js: ie6js, js: js, ie6css: ie6css, css: css};
  };

  run();
  log('done');
};
