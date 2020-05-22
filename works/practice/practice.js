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
    var resetButton = document.getElementById('resetButton');
    var image = new Image();
    var imageData;
    var mousedown = {};
    var rubberbandRectangle = {};
    var dragging = false;

    function windowToCanvas(canvas, x, y) {
      var canvasRectangle = canvas.getBoundingClientRect();
      return {
        x: x - canvasRectangle.left,
        y: y - canvasRectangle.top
      };
    }

    function captureRubberbandPixels() {
      imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
    
    function restoreRubberbandPixels() {
      var deviceWidthOverCSSPixels = imageData.width / canvas.width;
      var deviceHeightOverCSSPixels = imageData.height / canvas.height;
      ctx.putImageData(
        imageData,
        0,
        0,
        rubberbandRectangle.left,
        rubberbandRectangle.top,
        rubberbandRectangle.width * deviceWidthOverCSSPixels,
        rubberbandRectangle.height * deviceHeightOverCSSPixels
      );
    }

    function drawRubberband() {
      ctx.strokeRect(
        rubberbandRectangle.left + ctx.lineWidth,
        rubberbandRectangle.top + ctx.lineWidth,
        rubberbandRectangle.width - 2 * ctx.lineWidth,
        rubberbandRectangle.height - 2 * ctx.lineWidth,
      );
    }

    function setRubberbandRectangle(x, y) {
      rubberbandRectangle.left = Math.min(x, mousedown.x);
      rubberbandRectangle.top = Math.min(y, mousedown.y);
      rubberbandRectangle.width = Math.abs(x - mousedown.x);
      rubberbandRectangle.height = Math.abs(y - mousedown.y);
    }

    function updateRubberband() {
      captureRubberbandPixels();
      drawRubberband();
    }

    function rubberbandStart(x, y) {
      mousedown.x = x;
      mousedown.y = y;
      rubberbandRectangle.left = mousedown.x;
      rubberbandRectangle.top = mousedown.y;
      dragging = true;
    }

    function rubberbandStretch(x, y) {
      if (rubberbandRectangle.width > 2 * ctx.lineWidth && rubberbandRectangle.height > 2 * ctx.lineWidth) {
        if (imageData !== undefined) {
          restoreRubberbandPixels();
        }
      }
      setRubberbandRectangle(x, y);

      if (rubberbandRectangle.width > 2 * ctx.lineWidth && rubberbandRectangle.height > 2 * ctx.lineWidth) {
        updateRubberband();
      }
    }

    function rubberbandEnd() {
      ctx.drawImage(
        canvas,
        rubberbandRectangle.left + ctx.lineWidth * 2,
        rubberbandRectangle.top + ctx.lineWidth * 2,
        rubberbandRectangle.width - 4 * ctx.lineWidth,
        rubberbandRectangle.height - 4 * ctx.lineWidth,
        0,
        0,
        canvas.width,
        canvas.height
      );
      dragging = false;
      imageData = undefined;
    }

    // event

    canvas.onmousedown = function(e) {
      var loc = windowToCanvas(canvas, e.clientX, e.clientY);
      e.preventDefault();
      rubberbandStart(loc.x, loc.y);
    };
    canvas.onmousemove = function(e) {
      var loc;
      if(dragging) {
        loc = windowToCanvas(canvas, e.clientX, e.clientY);
        rubberbandStretch(loc.x, loc.y);
      }
    };

    canvas.onmouseup = function(e) {
      rubberbandEnd();
    };

    image.src = 'og-shapeOfUniverse.png';
    image.onload = function() {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    
    resetButton.onclick = function(e) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    
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
