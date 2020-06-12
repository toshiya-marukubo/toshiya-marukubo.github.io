/*
  I am learning to deal image file on canvas. I referenced following url.
  http://www.generative-gestaltung.de/2/sketches/?01_P/P_4_1_2_01
*/

(function () {
  'use strict';
  window.addEventListener('load', function () {
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

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = X / 2;
    var mouseY = Y / 2;

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
      Image
    ********************/
    
    var img = new Image();
    img.src = 'image.jpg';
    
    function initImage() {
      ctx.drawImage(img, (X - img.width) / 2, (Y - img.height) / 2);
    }

    function noiseImage() {
      var x1 = 0;
      var y1 = rand(0, Y);
      var img = ctx.getImageData(x1, y1, X, rand(1, 5));
      ctx.putImageData(img, 0, rand(0, Y));
    }

    /* 
    function noiseImage2() {
      var x1 = rand(0, X);
      var y1 = 0;
      var img = ctx.getImageData(x1, y1, rand(1, 5), Y);
      ctx.putImageData(img, rand(0, X), 0);
    } 
    */

    /********************
      Render
    ********************/
    
    function render() {
      //ctx.clearRect(0, 0, X, Y);
      noiseImage();
      requestAnimationFrame(render);
    }

    img.onload = function() {
      initImage();
      render();
    }

    /********************
      Event
    ********************/
    
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      initImage();
    }

    window.addEventListener('resize', function(){
      onResize();
    });

    canvas.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    canvas.addEventListener('click', function(e) {
      initImage();
    });

  });
  // Author
  console.log('File Name / image.js\nCreated Date / Jun 11, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
