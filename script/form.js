(function () {
  'use strict';

  var okButton = $('ok'),
    form = $('custom-form'),
    input = $('file-input'),
    back = $('back'),
    caption = $('files-caption'),

    initForm = function () {
      // check cookies
    },

    stopEvent = function (e) {
      e.preventDefault();
      e.stopPropagation();
    },

    initHelps = function () {
      var help = document.querySelectorAll('em.form-help'),
        helpLen = help.length,
        helpCnt;

      for (helpCnt = 0; helpCnt < helpLen; helpCnt++) {
        help[helpCnt].addEventListener('click', stopEvent);
      }
    },

    initNotes = function () {
      var help = document.querySelectorAll('em.form-note'),
        helpLen = help.length,
        helpCnt;

      for (helpCnt = 0; helpCnt < helpLen; helpCnt++) {
        help[helpCnt].addEventListener('click', stopEvent);
      }
    },

    initLinks = function () {
      var links = document.querySelectorAll('a.external');

      Array.prototype.forEach.call(links, function (e) {
        e.setAttribute('target', '_blank');
      });
    };

  okButton.addEventListener('click', function () {
    var xs = document.querySelectorAll('.file-name-section span');

    form.style.display = 'inline-block';
    input.children[0].setAttribute('disabled', '');
    input.children[1].setAttribute('disabled', '');
    back.style.display = 'inline-block';
    back.removeAttribute('disabled');
    caption.style.opacity = 0;

    Array.prototype.forEach.call(xs, function (e) {
      e.style.display = 'none';
    });
  });

  okButton.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

  back.addEventListener('click', function () {
    var removeButtons = document.querySelectorAll('.file-name-section span');

    Array.prototype.forEach.call(removeButtons, function (e) {
      e.style.display = 'inline-block';
    });


    input.children[0].removeAttribute('disabled');
    input.children[1].removeAttribute('disabled');
    form.style.display = 'none';
    input.style.display = 'inline-block';
    back.setAttribute('disabled');
    caption.style.opacity = 1;
  });

  back.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

  initHelps();
  initNotes();
  initLinks();
}());
