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

    var image = new Image(),
        offscreenCanvas = document.createElement('canvas'),
        offscreenContext = offscreenCanvas.getContext('2d'),
        fadeButton = document.getElementById('fadeButton'),
        imageData,
        imagedataOffscreen,
        interval = null;

    function increaseTransparency(imagedata, steps) {
      var alpha,
          currentAlpha,
          steps,
          length = imagedata.data.length;
      for (var i = 3; i < length; i+=4) {
        alpha = imagedataOffscreen.data[i];

        if (alpha > 0) {
          currentAlpha = imagedata.data[i];
          steps = Math.ceil(alpha / steps);
          
          if (currentAlpha + steps <= alpha) {
            imagedata.data[i] += steps;
          } else {
            imagedata.data[i] = alpha;
          }
        }
      }
    }

    function fadeIn (ctx, imagedata, steps, millisecondsPerStep) {
      var frame = 0;

      for (var i = 0; i < imagedata.data.length; i+=4) {
        imagedata.data[i] = 0;
      }

      interval = setInterval(function() {
        frame++;

        if (frame > steps) {
          clearInterval(interval);
        } else {
         increaseTransparency(imagedata, steps);
         ctx.putImageData(imagedata, 0, 0); 
        }
      }, millisecondsPerStep);
    }

    fadeButton.onclick = function() {
      imagedataOffscreen = offscreenContext.getImageData(0, 0, X, Y);

      fadeIn(ctx, offscreenContext.getImageData(0, 0, X, Y), 50, 1000 / 60);
    };
    
    image.src = 'image.jpeg';
    image.onload = function() {
      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;
      offscreenContext.drawImage(image, 0, 0);
    };
    
    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      requestAnimationFrame(render);
    }

    //render();

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
