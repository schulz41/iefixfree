
'use strict';

/**
 * @constructor
 */

var FileHandler = function () {
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    new ErrorMessage('Your browser seems to not support file API');
  }

  var html = [],
    css = [],

    $htmlFileList = $('html-file-name-list'),
    $cssFileList = $('css-file-name-list'),
    $okButton = $('ok'),
    $back = $('back'),
    $input = $('files'),

    getExtension = function (filename) {
      return filename.split('.').pop().toLowerCase();
    },

    clearInput = function () {
      $input.value = '';
    },

    cutFileName = function (name) {
      var width = 165, // width of <p> element
        charWidth = 8, // width of single letter
        fromEnd = 8,
        outLen = Math.floor(width / charWidth),
        len = name.length;


      if(len < outLen) {
        return name;
      } else {
        return name.slice(0, outLen - 3 - fromEnd) + '...' + name.slice(-fromEnd);
      }
    },

    /**
     * remove html file from html - array and from the list in view html
     * @private
     */
    removeHtmlFile = function () {
      // number of the element which is clicked
      var n = index(this.parentNode),
        // li element
        node = $htmlFileList.children[n];

      // remove from an array
      html.splice(n, 1);
      // remove from html
      node.parentNode.removeChild(node);
      clearInput();
    },

    /**
     * remove css file from css array and from the list in view html
     * @private
     */
    removeCssFile = function () {
      // number of the element which is clicked
      var n = index(this.parentNode),
        // li element
        node = $cssFileList.children[n];

      // remove from array
      css.splice(n, 1);
      // remove from html
      node.parentNode.removeChild(node);
      clearInput();

      // if there's no css file then we can't continue
      if (!css.length) {
        $okButton.style.display = 'none';
        $back.style.display = 'none';
      }
    },

    /**
     * adds li - element to the corresponding (html or css) list
     * @private
     * @param name file name
     * @type file extension
     */
    putFileName = function (name, type) {
      var li = document.createElement('li'),
        // 'remove' - button
        span = document.createElement('span'),
        // contains file name
        p = document.createElement('p');

      span.setAttribute('title', 'remove');
      p.innerHTML = cutFileName(name);
      p.setAttribute('title', name);
      li.appendChild(p);
      li.appendChild(span);

      if (type === 'html') {
        span.addEventListener('click', removeHtmlFile, false);
        $htmlFileList.appendChild(li);
      } else {
        span.addEventListener('click', removeCssFile, false);
        $cssFileList.appendChild(li);
      }
    },

    /**
     * break source-attributes to avoid requests in frame
     * @private
     * @param s string contains html code
     * @returns html code without source-attributes
     */
    breakSource = function (s) {
      return s.replace(/ src=/g, ' fake_src=')
        .replace(/ source=/g, ' fake_source=')
        .replace(/ data=/g, ' fake_data=');
    },

    /**
     * add html or css file to the corresponding array
     * @private
     * @param file file from $input
     */
    readSingleFile = function (file, isLast) {
      var name = file.name,
        type = getExtension(name),

        /**
         * create a hidden iframe, insert html code into, 
         * add iframes body element to the html array
         * @private
         */
        onHtmlLoad = function () {
          var frame = document.createElement('iframe'),
            frameDoc;

          document.body.appendChild(frame);
          frameDoc = frame.contentWindow.document;
          frameDoc.body.innerHTML = breakSource(reader.result);
          html.push(frameDoc);
        },

        /**
         * create a ParserCSS object, add it to the css array
         * @private
         */
        onCssLoad = function () {
          css.push(new ParserCSS(reader.result));
        },

        reader = new FileReader();

      // check file extension
      if (type === 'html' || type === 'htm') {
        type = 'html';
      } else if (type !== 'css') {
        new LogMessage('unknown file extension: ' + type);
        return;
      }

      // read the file content
      reader.readAsText(file);
      reader.onloadend = function () {
        putFileName(name, type);

        if (type === 'html') {
          onHtmlLoad();
        } else {
          onCssLoad();
        }

        // if there's at least one css file and all files uploaded, then we can continue
        if (css.length && isLast) {
          $okButton.style.display = 'inline-block';
          $back.style.display = 'inline-block';
        }
      };
    },

    /**
     * @private
     * @param e event object
     */
    handleFileSelect = function (e) {
      var files = e.target.files,
        len = files.length,
        i;

      // can't continue while loading files
      if(len && !css.length) {
        $okButton.style.display = 'none';
        $back.style.display = 'none';
      }

      // for each file from $input
      for (i = 0; i < len; i++) {
        readSingleFile(files[i], i === len - 1);
      }
    },

    /**
     * read css from <style> elements
     * @private
     */
    readInternalStyles = function () {
      var len = html.length,
        styles,
        doc,
        css,
        htmlCnt,
        styleCnt;

      // for each html document
      for (htmlCnt = 0; htmlCnt < len; htmlCnt++) {
        // get all internal styles
        styles = html[htmlCnt].getElementsByTagName('style');

        // collect all styles to the single string
        css = '';
        for (styleCnt = 0; styleCnt < styles.length; styleCnt++) {
          css += ' ' + styles[styleCnt].innerHTML;
        }

        if (css !== '') {
          css.push(new ParserCSS(css));
        }
      }
    };

  this.getFiles = function () {
    return {html: html, css: css};
  };

  $input.addEventListener('change', handleFileSelect, false);
};
