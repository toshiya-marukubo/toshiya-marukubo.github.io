/*
  I am learning to deal image file on canvas. I referenced following url.
  https://editor.p5js.org/generative-design/sketches/P_4_1_2_01
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
    
    var angle = 0;
    var radian = angle * Math.PI / 180;
    var splitNum = 12;
    var xSplit = X / splitNum;
    var ySplit = Y / splitNum;

    function initImage() {
      ctx.clearRect(0, 0, X, Y);
      ctx.drawImage(img, (X - img.width) / 2, (Y - img.height) / 2);
    }

    function splitImage() {
      var x1 = xSplit * rand(0, splitNum - 1);
      var y1 = ySplit * rand(0, splitNum - 1);
      var img = ctx.getImageData(x1, y1, xSplit, ySplit);
      ctx.putImageData(img, xSplit * rand(0, splitNum - 1), ySplit * rand(0, splitNum - 1));
      angle += 1;
    } 

    /********************
      Render
    ********************/
    
    function render() {
      splitImage();
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
    }

    window.addEventListener('resize', function(){
      onResize();
    });

    canvas.addEventListener('click', function(e) {
      initImage();
    });

  });
  // Author
  console.log('File Name / image2.js\nCreated Date / Jun 11, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
