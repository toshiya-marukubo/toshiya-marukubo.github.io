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
        fadeButton = document.getElementById('fadeButton'),
        originalImageData = null,
        interval = null;

    /*
      function
    */

    function increaseTransparency(imagedata, steps) {
      var alpha, currentAlpham, step, length = imagedata.data.length;

      for (var i = 0; i < length; i += 4) {
        alpha = originalImageData.data[i];

        if (alpha > 0 && imagedata.data[i] > 0) {
          currentAlpha = imagedata.data[i];
          step = Math.ceil(alpha / steps);

          if (curreentAlpha - step > 0) {
            imagedata.data[i] -= step;
          } else {
            imagedata.data[i] = 0;
          }
        }
      }
    }

    function fadeOut(ctx, imagedatam, x, y, steps, millisecondsPerStep) {
      var frame = 0,
          length = imagedata.data.length;

      interval = setInterval(function() {
        frame++;

        if (frame > steps) {
          clearInterval(interval);
          animationComplete();
        } else {
          increaseTransparency(imagedata, steps);
          ctx.putImageData(imagedata, x, y);
        }
      }, millisecondsPerStep);
    }

    function animationComplete() {
      setTimeout(function() {
        ctx.drawImage(image, 0, 0, X, Y);
      }, 1000);
    }

    fadeButton.onclick = function() {
      fadeOut(ctx, ctx.getImageData(0, 0, X, Y), 0, 0, 20, 1000 /60);
    };

    image.src = 'image.jpeg';
    image.onload = function() {
      ctx.drawImage(image, 0, 0, X, Y);
      originalImageData = ctx.getImageData(0, 0, X, Y);
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
