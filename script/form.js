
'use strict';

(function() {
  
  var okButton = $('ok'),
    form = $('custom-form'),
    input = $('file-input'),
    back = $('back'),
    scriptTop = $('i10'),
    scriptBottom = $('i11'),
    caption = $('files-caption'),
    inputs = $('input'),

    initForm = function () {
      // check cookies
    },

    initHelps = function() {
      var help = document.querySelectorAll('em.form-help'),
        helpLen = help.length,
        helpCnt;

      for (helpCnt = 0; helpCnt < helpLen; helpCnt++) {
        help[helpCnt].addEventListener('click', function(e) {
          log(e.target.getAttribute('title'));
          e.preventDefault();
          e.stopPropagation();
        });

        help[helpCnt].addEventListener('mousedown', function(e) {
          e.preventDefault();
          e.stopPropagation();
        });
      }
    };

  okButton.addEventListener('mousedown', function () {
    var xs = document.querySelectorAll('.file-name-section span');

    //form.style.display = 'inline-block';
    form.style.opacity = 1;
    input.children[0].setAttribute('disabled', '');
    input.children[1].setAttribute('disabled', '');
    back.style.display = 'inline-block';
    back.removeAttribute('disabled');
    //caption.style.visibility = 'hidden';
    caption.style.opacity = 0;

    Array.prototype.forEach.call(xs, function (e) {
      e.style.display = 'none';
    });
  });

  back.addEventListener('mousedown', function () {
    var xs = document.querySelectorAll('.file-name-section span');

    Array.prototype.forEach.call(xs, function (e) {
      e.style.display = 'inline-block';
    });


    input.children[0].removeAttribute('disabled');
    input.children[1].removeAttribute('disabled');
    //form.style.display = 'none';
    form.style.opacity = 0;
    //input.style.display = 'inline-block';
    input.style.opacity = 1;
    back.setAttribute('disabled');
    //caption.style.visibility = 'visible';
    caption.style.opacity = 1;
  });

  scriptTop.addEventListener('click', function () {
    scriptBottom.checked = false;
  });

  scriptBottom.addEventListener('click', function () {
    scriptTop.checked = false;;
  });

  initHelps();
}());