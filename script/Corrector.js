
'use strict';
  
var Corrector = function () {
  var fileHandler = new FileHandler(),
    css,
    js,

    run = function () {
      css = new GeneratorCSS(fileHandler.getFiles());
      js = new GeneratorJS(fileHandler.getFiles());
    };

  $('ok').addEventListener('click', run, false);
};