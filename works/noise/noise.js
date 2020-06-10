(function () {
  'use strict';
  window.addEventListener('load', function () {
    var canvas = document.getElementById('canvas');

    if (!canvas || !canvas.getContext) {
      return false;
    }

    // var

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var num = 1;
    var random = Math.random;

    // animation

    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(cb) {
        setTimeout(cb, 17);
      };

    // noise

    function createNoise() {
      var imageData = ctx.createImageData(X, Y);
      var dataArr = imageData.data;
      for (var i = 0; i < dataArr.length; i += num) {
        dataArr[i] = 255 * random();
      }
      ctx.putImageData(imageData, 0, 0);
    }
    
    // render
     
    function render() {
      ctx.clearRect(0, 0, X, Y);
      createNoise();
      requestAnimationFrame(render);
    }

    render();

    // event
     
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', function(){
      onResize();
    });

  });
  // Author
  console.log('File Name / noise.js\nCreated Date / Jun 10, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
