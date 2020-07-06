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
    var shapeNum = X / 6;
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
      Ground
    ********************/
    
    function Shape(ctx, x, y, i, c) {
      this.ctx = ctx;
      this.init(x, y, i, c);
    }

    Shape.prototype.init = function(x, y, i, c) {
      this.x = x;
      this.y = 0;
      this.c = c;
      this.a = i * 0.1;
      this.rad = this.a * Math.PI / 180;
      this.r = rand(10, 15);
      this.ina = 0.5;
      this.ga = Math.random() * Math.random();
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = this.c;
      ctx.beginPath();
      ctx.translate(this.x, this.y);
      ctx.scale(Math.sin(this.rad * 2) * 0.1, Math.sin(this.rad) * 50);
      ctx.translate(-this.x, -this.y);
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    Shape.prototype.updateParams = function() {
      this.a += this.ina;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.render = function(i) {
      this.updateParams();
      this.draw();
    };
    
    for (var i = 0; i < shapeNum; i++) {
      var s = new Shape(ctx, i * 6, Y / 2, i, 'rgb(62, 202, 181)');
      shapes.push(s);
    }

    for (var i = 0; i < shapeNum; i++) {
      var s = new Shape(ctx, i * 6, Y / 2, i * 5, 'rgb(171, 9, 221)');
      shapes.push(s);
    }

    for (var i = 0; i < shapeNum; i++) {
      var s = new Shape(ctx, i * 6, Y / 2, i * 10, 'rgb(57, 93, 253)');
      shapes.push(s);
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
  console.log('File Name / aurora.js\nCreated Date / July 06, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
