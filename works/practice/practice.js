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
    var range = document.getElementById('range');
    var offscreenCanvas = document.createElement('canvas');
    var offscreenContext = offscreenCanvas.getContext('2d');
    offscreenCanvas.width = X;
    offscreenCanvas.height = Y;
    var image = new Image();
    var scale = range.value;
    scale = 1;
    var maxScale = 3;
    var minScale = 1;

    // function
    function drawScaled() {
      var sw = X * scale;
      var sh = Y * scale;
      ctx.drawImage(offscreenCanvas,
        0, 
        0, 
        offscreenCanvas.width,
        offscreenCanvas.height,
        -sw / 2 + X / 2,
        -sh / 2 + Y / 2,
        sw,
        sh
      );
    }
    function drawWatermark(ctx) {
      var lineOne = 'Copyright';
      var lineTwo = 'Inc,';
      var textMetrics = null;
      var fontHeight = 128;
      ctx.save();
      ctx.fillStyle = 'rgba(100, 140, 230, 0.5)';
      ctx.strokeStyle = 'yellow';
      ctx.shadowColor = 'rgba(50, 50, 50, 1.0)';
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
      ctx.shadowBlur = 10;
      ctx.font = fontHeight + 'px Arial';
      textMetrics = ctx.measureText(lineOne);
      ctx.translate(X / 2, Y / 2);
      ctx.fillText(lineOne, -textMetrics.width / 2, 0);
      ctx.strokeText(lineOne, -textMetrics.width / 2, 0);
      textMetrics = ctx.measureText(lineTwo);
      ctx.fillText(lineTwo, -textMetrics.width / 2, fontHeight);
      ctx.strokeText(lineTwo, -textMetrics.width / 2, fontHeight);
      ctx.restore();
    }
    
    range.addEventListener('change', function(e) {
      scale = this.value;
      drawScaled();
    });

    image.src = 'og-shapeOfUniverse.png';
    image.addEventListener('load', function() {
      ctx.drawImage(image, 0, 0, X, Y);
      offscreenContext.drawImage(image, 0, 0, X, Y);
      drawWatermark(ctx);
      drawWatermark(offscreenContext);
    });

    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      drawScale();
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
