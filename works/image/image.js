/*
  I am learning to deal image file on canvas. I referenced following url.
  http://www.generative-gestaltung.de/2/sketches/?01_P/P_4_0_01
*/

(function () {
  'use strict';
  window.addEventListener('load', function () {
    var canvas = document.getElementById('canvas');

    if (!canvas || !canvas.getContext) {
      return false;
    }

    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX;
    var mouseY;

    /********************
      Image
    ********************/
    
    var img = new Image();
    img.src = 'image.jpg';
    
    function initImg() {
      ctx.drawImage(img, (X - img.width) / 2, (Y - img.height) / 2);
    }
     
    function splitImg() {
      ctx.clearRect(0, 0, X, Y);
      var xSplit = mouseX / 100 + 1;
      var ySplit = mouseY / 100 + 1;
      var stepX = X / xSplit;
      var stepY = Y / ySplit;
      for (var i = 0; i < Y; i += stepY) {
        for (var j = 0; j < X; j += stepX) {
          ctx.drawImage(img, j, i, stepX, stepY);
        }
      }
    }

    img.onload = function() {
      initImg();
    }

    /********************
      Event
    ********************/
    
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      initImg();
    }

    window.addEventListener('resize', function(){
      onResize();
    });

    canvas.addEventListener('click', function() {
      initImg();
    });

    canvas.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      splitImg();
    });

  });
  // Author
  console.log('File Name / image.js\nCreated Date / Jun 11, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
