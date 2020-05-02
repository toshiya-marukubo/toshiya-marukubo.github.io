(function(){
  'use strict';
  window.addEventListener('DOMContentLoaded', function() {
    var main = document.getElementById('main');
    var footer = document.getElementById('footer');
    var loading = document.getElementById('loading');
    setTimeout(function() {
      loading.style.display = 'none';
      main.style.display = 'block';
      if (footer) {
        footer.style.display = 'block';
      }
    }, 800);
  }, false);
})();
