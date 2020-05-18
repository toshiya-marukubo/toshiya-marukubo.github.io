(function () {
  'use strict';
  window.addEventListener('load', function() {
    var canvas = document.getElementById('canvas');

    if (!canvas || !canvas.getContext) {
      return false;
    }

    /********************
      Random Number
    ********************/

    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /********************
      Var
    ********************/

    // canvas 
    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;

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
      Practice
    ********************/
    
    var image = new Image();
    var range = document.getElementById('range');
    var scale = range.value;
    image.src = 'og-shapeOfUniverse.png';
    
    function drawImage() {
      var sw = X * scale;
      var sh = Y * scale;
      ctx.clearRect(0, 0, X, Y);
      ctx.drawImage(image, - sw / 2 + X / 2, - sh / 2 + Y / 2, sw, sh);
    }

    range.addEventListener('change', function(e) {
      scale = this.value;
      drawImage();
    }, false);
       
    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      drawImage();
      requestAnimationFrame(render);
    }

    render();

    /********************
      Event
    ********************/
    
    // resize
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
    }

  });
  // Author
  console.log('File Name / practice.js\nCreated Date / February 2, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
