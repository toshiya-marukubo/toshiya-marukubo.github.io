/*
* File Name / loadedImage.js
* Created Date / Jun 19, 2020
* Auther / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
*/

(function() {
  'use strict';
  window.addEventListener('load', function() {
    var imgs = document.getElementsByTagName('img');
    for (var i = 0; i < imgs.length; i++) {
      (function(j) {
        setTimeout(function() {
          imgs[j].setAttribute('class', 'loadedImg');
        }, 100 * j);
      })(i);
    }
  }, false);
})();
