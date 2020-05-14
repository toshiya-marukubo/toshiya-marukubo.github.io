(function() {
  'use strict';
  window.addEventListener('DOMContentLoaded', function() {
    var body = document.getElementsByTagName('body')[0];
    body.style.display = 'block';
    body.setAttribute('class', 'fadeIn');
  });
  var imgs = document.getElementsByTagName('img');
  for (var i = 0; i < imgs.length; i++) {
    imgs[i].addEventListener('load', function() {
      this.style.visibility = 'visible';
      this.setAttribute('class', 'fadeIn');
    });
  }
})();
