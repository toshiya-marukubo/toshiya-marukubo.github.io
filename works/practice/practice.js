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

    var image = new Image();
    var embossButton = document.getElementById('embossButton');
    var embossed = false;

    // function

    function emboss() {
      var imagedata, data, length, width, index=3;

      imagedata = ctx.getImageData(0, 0, X, Y);
      data = imagedata.data;
      width = imagedata.width;
      length = data.length;

      for (var i = 0; i < length; i++) {
        if (i < length - width * 4) {
          if ((i + 1) % 4 !== 0) {
            if ((i + 4) % (width * 4) == 0) {
              data[i] = data[i - 4];
              data[i + 1] = data[i - 3];
              data[i + 2] = data[i - 2];
              data[i + 3] = data[i - 1];
              i += 3;
            } else {
              data[i] = 255 / 2 + 2 * data[i] - data[i + 4] - data[i + width * 4];
            }
          }
        } else {
          if ((i + 1) % 4 !== 0) {
            data[i] = data[i - width * 4];
          }
        }
      }
      ctx.putImageData(imagedata, 0, 0);
    }

    function drawOriginalImage() {
      ctx.drawImage(
        image, 0,  0,
        image.width, image.height,
        0, 0, X, Y
      );
    }

    embossButton.onclick = function() {
      if (embossed) {
        embossButton.value = 'Emboss';
        drawOriginalImage();
        embossed = false;
      } else {
        embossButton.value = 'Original Image';
        emboss();
        embossed = true;
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
