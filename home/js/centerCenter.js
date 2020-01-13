(function() {
  'use strict';
  window.addEventListener('load', function() {
    var centerClasses = document.getElementsByClassName('centerCenter');
    var X = window.innerWidth;
    var Y = window.innerHeight;
    
    centerCenter();
    function centerCenter() {
      for (var i = 0; i < centerClasses.length; i++) {
        centerClasses[i].style.position = 'fixed';
        var elem = centerClasses[i].getBoundingClientRect();
        centerClasses[i].style.top = Y / 2 - elem.height / 2 + 'px';
        centerClasses[i].style.left = X / 2 - elem.width / 2 + 'px';
      }
    }

    // onresize.
    window.addEventListener('resize', function() {
      X = window.innerWidth;
      Y = window.innerHeight;
      centerCenter();
    }, false);
  }, false);
  console.log('File Name / centerCenter.js\nAuthor / Toshiya Marukubo\nCreated Date / 2019.12.10');
})();
