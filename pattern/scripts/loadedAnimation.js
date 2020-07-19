/*
* File Name / loadedAnimation.js
* Created Date / Jun 19, 2020
* Auther / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
*/

(function() {
  'use strict';
  window.addEventListener('DOMContentLoaded', function() {
    var header = document.getElementsByTagName('header')[0];
    var h2 = document.getElementsByTagName('h2')[0];
    header.setAttribute('class', 'onloadHeader');
    if (h2) {
      h2.setAttribute('class', 'onloadH2');
    }
  });
})();
