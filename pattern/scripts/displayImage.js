(function() {
  'use strict';
  var H = window.innerHeight;
  var imgs = document.getElementsByTagName('img');
  var displayImage = function () {
    for (var i = 0; i < imgs.length; i++) {
      var s = imgs[i].getBoundingClientRect().top - 100;
      if (H > s) {
        imgs[i].classList.add('show');
      } else {
        imgs[i].classList.remove('show');
      }
    }
  };
  window.addEventListener('load', function() {
    displayImage();
  }, false);
  window.addEventListener('scroll', function() {
    displayImage();
  }, false);
})();
