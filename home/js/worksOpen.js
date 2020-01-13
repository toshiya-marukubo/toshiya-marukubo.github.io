(function(){
  'use strict';
  window.addEventListener('load', function() {
    var worksBtn = document.getElementById('worksBtn');
    var works = document.getElementById('works');
    var closeBtn = document.getElementById('close');
    
    worksBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (works.style.display === 'none') {
        works.style.display = 'block';
        closeBtn.firstElementChild.focus();
      } else {
        works.style.display = 'none';
        worksBtn.firstElementChild.focus();
      }
    }, false);
    
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      works.style.display = 'none';
      worksBtn.firstElementChild.focus();
    }, false);
  });
})();
