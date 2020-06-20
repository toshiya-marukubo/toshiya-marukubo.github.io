(function () {
  'use strict';
  window.addEventListener('load', function () {

    /********************
      Random Number
    ********************/

    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /********************
      Var
    ********************/
    
    var main = document.getElementById('main');
    var X = window.innerWidth;
    var Y = window.innerHeight;

    /********************
      Animation
    ********************/

    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(cb) {
        setTimeout(cb, 17);
      };

    /********************
      meaningless
    ********************/
   
    var ranges;
    var divs;
    var spans;
    var valVal = 50;
    var angle = 0;

    function createRange() {
      var input = document.createElement('input');
      var span = document.createElement('span');
      var div = document.createElement('div');
      input.setAttribute('type', 'range');
      input.setAttribute('value', valVal);
      input.setAttribute('min', '0');
      input.setAttribute('max', '100');
      input.setAttribute('step', '0.1');
      main.appendChild(input);
      main.appendChild(div);
      div.appendChild(span);
    }
    
    function addRange() {
      for (var i = 0; i < 36; i++) {
        createRange();
      }
      getRange();
    }
    
    function getRange() {
      ranges = document.getElementsByTagName('input');
      divs = document.getElementsByTagName('div');
      spans = document.getElementsByTagName('span');
      addStyle();
      interval();
    }
    
    function addStyle() {
      for (var i = 0; i < ranges.length; i++) {
        ranges[i].style.transform = 'rotate(' + i * 10 + 'deg)';
        divs[i].style.transform = 'rotate(' + i * 10 + 'deg)';
        spans[i].style.transform = 'rotate(' + -i * 10 + 'deg)';
      }
    }

    function interval() {
      for (var i = 0; i < ranges.length; i++) {
        var val = Math.floor(Math.sin((angle + i * 3) * Math.PI / 180) * valVal + valVal);
        ranges[i].setAttribute('value', val);
        spans[i].textContent = val;
      }
      requestAnimationFrame(interval);
      angle -= 1;
    }

    addRange();

  });
  // Author
  console.log('File Name / range.js\nCreated Date / Jun 20, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
