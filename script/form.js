
'use strict';

(function() {
  
  var okButton = $('ok'),
    form = $('custom-form'),
    input = $('file-input'),
    back = $('back'),
    caption = $('files-caption'),
    inputs = $('input'),

    initForm = function () {
      // check cookies
    },

    initHelps = function () {
      var help = document.querySelectorAll('em.form-help'),
        helpLen = help.length,
        helpCnt;

      for (helpCnt = 0; helpCnt < helpLen; helpCnt++) {
        help[helpCnt].addEventListener('click', function(e) {
          log(e.target.getAttribute('data-title'));
          e.preventDefault();
          e.stopPropagation();
        });

        help[helpCnt].addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
        });
      }
    },

    initNotes = function () {
      var help = document.querySelectorAll('em.form-note'),
        helpLen = help.length,
        helpCnt;

      for (helpCnt = 0; helpCnt < helpLen; helpCnt++) {
        help[helpCnt].addEventListener('click', function(e) {
          log(e.target.getAttribute('data-title'));
          e.preventDefault();
          e.stopPropagation();
        });

        help[helpCnt].addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
        });
      }
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
}());