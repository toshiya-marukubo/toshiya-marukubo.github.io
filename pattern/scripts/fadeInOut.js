/*
* File Name / fadeInOut.js
* Created Date / Jun 15, 2020
* Auther / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
*/

(function() {
  'use strict';
  window.addEventListener('DOMContentLoaded', function() {
    var body = document.getElementsByTagName('body')[0];
    var header = document.getElementsByTagName('header')[0];
    var h2 = document.getElementsByTagName('h2')[0];
    var a = document.getElementsByTagName('a');
    
    body.style.display = 'block';
    body.setAttribute('class', 'fadeIn');
    header.setAttribute('class', 'onloadHeader');
    if (h2) h2.setAttribute('class', 'onloadH2');
    
    for (var i = 0; i < a.length; i++) {
      a[i].addEventListener('click', function(e) {
        e.preventDefault();
        var url =  this.href;
        fadeOut(url);
      }, false);
    }

    function fadeOut(url) {
      body.setAttribute('class', 'fadeOut');
      setTimeout(function() {
      //body.style.display = 'none';
        location.href = url;
      }, 300);
    }

  });
})();
