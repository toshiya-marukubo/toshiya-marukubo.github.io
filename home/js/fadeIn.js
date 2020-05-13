(function() {
  'use strict';
  window.addEventListener('DOMContentLoaded', function() {
    var body = document.getElementsByTagName('body')[0];
    body.style.display = 'block';
    body.setAttribute('class', 'fadeIn');
  });
  window.addEventListener('load', function() {
    var imgs = document.getElementsByTagName('img');
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].style.display = 'block';
      imgs[i].setAttribute('class', 'faseIn');
    }
  });
})();
