(function(){
  'use strict';
  window.addEventListener('load', function() {
    var main = document.getElementById('main');
    var footer = document.getElementById('footer');
    var loading = document.getElementById('loading');
    loading.style.display = 'none';
    main.style.display = 'block';
    if (footer) {
      footer.style.display = 'block';
    }
  }, false);
})();
