(function(){
  'use strict';
  window.addEventListener('load', function() {
    var aboutBtn = document.getElementById('aboutBtn');
    var about = document.getElementById('about');
    var works = document.getElementById('works');
    var closeBtn = document.getElementsByClassName('close');
    
    aboutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (about.style.display === 'none') {
        about.style.display = 'block';
        works.style.display = 'none';
        about.firstElementChild.firstElementChild.focus();
      } else {
        about.style.display = 'none';
        aboutBtn.firstElementChild.focus();
      }
    }, false);

    for (var i = 0; i < closeBtn.length; i++) {
      closeBtn[i].addEventListener('click', function(e) {
        e.preventDefault();
        about.style.display = 'none';
        aboutBtn.firstElementChild.focus();
      }, false);
    }
    
  });
})();
