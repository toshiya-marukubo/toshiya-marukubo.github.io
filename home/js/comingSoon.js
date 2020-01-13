(function() {
  'use strict';
  window.addEventListener('load', function() {
    var comingSoons = document.getElementsByClassName('comingSoon');
    
    for (var i = 0; i < comingSoons.length; i++) {
      comingSoons[i].addEventListener('click', elemOver, false);
      comingSoons[i].style.textDecoration = 'line-through';
    }

    function elemOver(e) {
      e.preventDefault();
    }
  });
})();
