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
    var height = 100;
    var dist = Math.cos(30 * Math.PI / 180) * height;
    var rad = Math.PI * 2 / 6;
    X > Y ? shapeNum = X / dist : shapeNum = Y / height;

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
      Shape
    ********************/
    
    function Shape(ctx, x, y, i, j) {
      this.ctx = ctx;
      this.init(x, y, i, j);
    }
    
    Shape.prototype.init = function(x, y, i, j) {
      this.x = x;
      this.y = y;
      this.r = height / 2;
      this.dia = Math.sqrt(this.r * this.r + this.r * this.r);
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'white';
      ctx.beginPath();
      for (var i = 0; i < 6; i++) {
        var x = Math.sin(i * rad);
        var y = Math.cos(i * rad);
        if (i === 0) ctx.moveTo(x * this.r + this.x, y * this.r + this.y);
        ctx.lineTo(x * this.r + this.x, y * this.r + this.y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    };

    Shape.prototype.render = function(i) {
      this.draw();
    };

    var vec = {
      x: Math.PI / 2,
      y: Math.PI / 6
    };

    for (var i = 0; i < shapeNum + 1; i++) {
      for (var j = 0; j < shapeNum; j++) {
        if (j * height > Y) break;
        var s;
        if (j % 2 !== 0) {
          s = new Shape(ctx, dist * i + dist / 2, (height / 2 + height / 4) * j);
        } else {
          s = new Shape(ctx, dist * i, (height / 2 + height / 4) * j);
        }
        shapes.push(s);
      }
    }

    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].render(i);
      }
      requestAnimationFrame(render);
    }

    render();

    /********************
      Event
    ********************/
    
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  });
  // Author
  console.log('File Name / net.js\nCreated Date / July 11, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
