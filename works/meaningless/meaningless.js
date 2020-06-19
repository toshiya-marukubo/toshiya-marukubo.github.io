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
   
    var checkBoxes;

    function createCheckBox() {
      var elem = document.createElement('input');
      elem.setAttribute('type', 'checkbox');
      elem.checked = true;
      main.appendChild(elem);
    } 
    
    function culcQuantity() {
      var x = X / 15;
      var y = Y / 15;
      var z = x * y;
      return z;
    }

    function addCheckBox() {
      for (var i = 0; i < culcQuantity(); i++) {
        createCheckBox();
      }
      getCheckBox();
    }

    function getCheckBox() {
      checkBoxes = document.getElementsByTagName('input');
      interval();
    }
    
    function interval() {
      var num = rand(0, checkBoxes.length - 1);
      if (checkBoxes[num].checked === true) {
        checkBoxes[num].checked = false;
      } else {
        checkBoxes[num].checked = true;
      }
      requestAnimationFrame(interval);
    }

    addCheckBox();

  });
  // Author
  console.log('File Name / meaningless.js\nCreated Date / Jun 19, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
