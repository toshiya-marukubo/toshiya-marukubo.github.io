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
        sunglassButton = document.getElementById('sunglassButton'),
        sunglassesOn = false;
        sunglassFilter = new Worker('sunglassFilter.js');
    
    // function
    
    function putSunglassesOn () {
      sunglassFilter.postMessage(
        ctx.getImageData(0, 0, X, Y)
      );
      sunglassFilter.onmessage = function(event) {
        ctx.putImageData(event.data, 0, 0);
      };
    }

    function drawOriginalImage() {
      ctx.drawImage(
        image, 0, 0,
        image.width, image.height, 0, 0,
        X, Y
      );
    }

    // event

    sunglassButton.onclick = function() {
      if (sunglassesOn) {
        sunglassButton.value = 'Sunglasses';
        drawOriginalImage();
        sunglassesOn = false;
      } else {
        sunglassButton.value = 'Original picture';
        putSunglassesOn();
        sunglassesOn = true;
      }
    };

    // init

    image.src = 'image.jpeg';
    image.onload = function() {
      drawOriginalImage();
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
