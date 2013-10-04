
var setBefore = function () {
  
},

setAfter = function () {
},

setClasses = function () {
  var selector,
    nodes,
    len,
    i;

  for (selector in pairs) {
    nodes = document.querySelectorAll(selector);

    len = nodes.length;
    for (i = 0; i < len; i++) {
      nodes[i].className += pairs[selector];
    }
  }
},

setIEClasses = function () {
  var selector,
    nodes,
    len,
    i;

  for (selector in pairsIE6) {
    nodes = document.querySelectorAll(selector);

    len = nodes.length;
    for (i = 0; i < len; i++) {
      nodes[i].className += pairsIE6[selector];
    }
  }
},

polyfill = function() {
  document.querySelectorAll = document.querySelectorAll || Sizzle;
};