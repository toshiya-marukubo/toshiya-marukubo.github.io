(function() {
  'use strict';
  var loading = document.getElementsByClassName('loading')[0];
  var canvas = document.getElementById('canvas');
  var title = document.getElementById('title');
  window.addEventListener('load', function() {
    if (canvas) canvas.setAttribute('class', 'show');
    if (title) title.setAttribute('class', 'show');
    setTimeout(function() {
      loading.parentNode.removeChild(loading);
    }, 1600);
  }, false);
})();
