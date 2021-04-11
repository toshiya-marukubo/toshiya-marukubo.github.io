(function() {
  'use strict';
  var loading = document.getElementsByClassName('loading')[0];
  window.addEventListener('load', function() {
    setTimeout(function() {
      loading.parentNode.removeChild(loading);
    }, 1600);
  }, false);
})();
