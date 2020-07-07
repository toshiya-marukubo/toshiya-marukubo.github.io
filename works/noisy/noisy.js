// pic by Raphael Brasileiro (https://www.instagram.com/raphael.brasileiroo/)
// site https://www.pexels.com/ja-jp/@phael
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
      Var
    ********************/

    var offscreenCanvas = document.createElement('canvas');
    var offscreenCtx = offscreenCanvas.getContext('2d');
    var ctx = canvas.getContext('2d');
    var X = canvas.width = offscreenCanvas.width = window.innerWidth;
    var Y = canvas.height = offscreenCanvas.height = window.innerHeight;
    var mouseX = X / 2;
    var mouseY = Y / 2;
    var curIndex = 0;
    var data;

    /********************
      Image
    ********************/
    
    var images = [];
    var files = [
      'image.jpg'
    ];
    
    for (var i = 0; i < files.length; i++) {
      var img = new Image();
      img.src = files[i];
      img.crossOrigin = "anonymous";
      images.push(img);
    }

    /********************
      Init
    ********************/
    
    var dataArr = [];
    var angles = [];
    var splitY = Y / 100;
    
    for (var i = 0; i < 100; i++) {
      var angle = rand(0, 360);
      var gap = rand(100, 300);
      var arr = [angle, gap];
      
      angles.push(arr);
    }
    
    // load image - init.
    function loadImage() {
      var load = 0;
      for (var i = 0; i < images.length; i++) {
        images[i].addEventListener('load', function() {
          load++;
          if (load === images.length) {
            init();
          }
        });
      }
    }
    
    function init() {
      offscreenCtx.drawImage(images[curIndex], (X - images[curIndex].width) / 2, (Y - images[curIndex].height) / 2);
      data = offscreenCtx.getImageData(0, 0, X, Y); 
      for (var i = 0; i < 100; i++) {
        var d = offscreenCtx.getImageData(0, splitY * i, X, splitY + 1); 
        dataArr.push(d);
      }
      render();
    };

    loadImage();
    
    // function in render
    function randomImage() {
      for (var i = 0; i < dataArr.length; i++) {
        ctx.putImageData(dataArr[i], Math.sin(angles[i][0] * Math.PI / 180) * angles[i][1], splitY * i);
      }
    }

    function changeAngle() {
      for (var i = 0; i < angles.length; i++) {
        angles[i][0] += rand(-10, 10);
      }
    }

    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      ctx.putImageData(data, 0, 0);
      if (Math.random() < 0.9) randomImage();
      changeAngle();
      requestAnimationFrame(render);
    }

    /********************
      Event
    ********************/
    
    function onResize() {
      X = canvas.width = offscreenCanvas.width = window.innerWidth;
      Y = canvas.height = offscreenCanvas.height = window.innerHeight;
      dataArr = [];
      offscreenCtx.drawImage(images[curIndex], (X - images[curIndex].width) / 2, (Y - images[curIndex].height) / 2);
      data = offscreenCtx.getImageData(0, 0, X, Y); 
      for (var i = 0; i < 100; i++) {
        var d = offscreenCtx.getImageData(0, splitY * i, X, splitY + 1); 
        dataArr.push(d);
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });

  });
  // Author
  console.log('File Name / noisy.js\nCreated Date / July 07, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
