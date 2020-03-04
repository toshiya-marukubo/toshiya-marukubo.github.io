(function(){
  'use strict';
  window.addEventListener('load', function() {
    var worksBtn = document.getElementById('worksBtn');
    var works = document.getElementById('works');
    var about = document.getElementById('about');
    var closeBtn = document.getElementsByClassName('close');
    
    worksBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (works.style.display === 'none') {
        works.style.display = 'block';
        about.style.display = 'none';
        works.firstElementChild.firstElementChild.focus();
      } else {
        works.style.display = 'none';
        worksBtn.firstElementChild.focus();
      }
    }, false);
    
    for (var i = 0; i < closeBtn.length; i++) {
      closeBtn[i].addEventListener('click', function(e) {
        e.preventDefault();
        works.style.display = 'none';
        worksBtn.firstElementChild.focus();
      }, false);
    }
     
  });
})();
