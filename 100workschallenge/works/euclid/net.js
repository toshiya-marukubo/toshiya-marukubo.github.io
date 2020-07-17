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
    var mouseX = null;
    var mouseY = null;
    var shapeNum;
    var shapes = [];

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
      RGB Random Color
    ********************/
    
    function getRandColor() {
      var r = rand(0, 255);
      var g = rand(0, 255);
      var b = rand(0, 255);
      var c = 'rgb(' + r + ', ' + g + ', ' + b + ')';
      return c;
    }

    /********************
      Shape
    ********************/
  
    var numA = 10;
    var numB = 7;
    var scalar = 50;
    
    numA *= scalar;
    numB *= scalar;

    var wd = numB;
    var xPos = 0;
    var yPos = 0;
    var itr = 0;

    while (wd > 0) {
      itr++;
      if (itr % 2 === 1) {
        while (xPos + wd <= numA) {
          ctx.beginPath();
          ctx.strokeStyle = getRandColor();
          ctx.fillStyle = getRandColor();
          ctx.rect(xPos, yPos, wd, wd);
          ctx.stroke();
          ctx.fill();
          xPos += wd;
        }
        wd = numA - xPos;
      } else {
        while (yPos + wd <= numB) {
          ctx.beginPath();
          ctx.strokeStyle = getRandColor();
          ctx.fillStyle = getRandColor();
          ctx.rect(xPos, yPos, wd, wd);
          ctx.stroke();
          ctx.fill();
          yPos += wd;
        }
        wd = numB - yPos;
      }
    }
    

    /********************
      Event
    ********************/
    
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
    }

  });
  // Author
  console.log('File Name / net.js\nCreated Date / July 11, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
