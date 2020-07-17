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
    var mouseX = X / 2;
    var mouseY = Y / 2;
    var shapes = [];
    var shapeNum = 1500;
    var windmills = [];
    var windmillNum = 5;
    var xSplit = X / 4;

    if (X < 768) {
      shapeNum = 700;
      windmillNum = 3;
      xSplit = X / 2;
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
      Shape
    ********************/
    
    function Shape(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }
    
    Shape.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.i = i;
      this.r = rand(50, 150);
      this.c = rand(40, 60);
      this.a = i;
      this.rad = this.a * Math.PI / 180;
      this.lw = Math.random();
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'hsl(' + this.c + ', 90%, 70%)';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.quadraticCurveTo(Math.cos(this.rad) * 10 + this.x, this.y - this.r / 2, Math.sin(this.rad) * 10 + this.x, this.y - this.r);
      ctx.stroke();
      ctx.restore();
    };

    Shape.prototype.updateParams = function() {
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.render = function() {
      this.updateParams();
      this.draw();
    };
    
    for (var i = 0; i < shapeNum; i++) {
      var s = new Shape(ctx, rand(0, X), rand(Y - Y / 5, Y), i);
      shapes.push(s);
    }
   
    /********************
      Windmill
    ********************/
    
    function Windmill(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Windmill.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.r = Y / 5;
      this.a = 0;
      this.rad = this.a * Math.PI / 180;
      this.inA = 1;
    };
    
    Windmill.prototype.draw = function() {
      var ctx = this.ctx;
      // wing
      ctx.save();
      ctx.fillStyle = 'rgb(253, 248, 192)';
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rad);
      ctx.translate(-this.x, -this.y);
      for (var i = 0; i < 3; i++) {
        ctx.translate(this.x, this.y);
        ctx.rotate(120 * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
        ctx.fillRect(this.x, this.y - this.r / 10 / 2, this.r, this.r / 10);
      }
      ctx.restore();
      ctx.save();
      ctx.fillStyle = 'rgb(253, 248, 192)';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.r / 10, Y - Y / 3);
      ctx.lineTo(this.x - this.r / 10, Y - Y / 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    Windmill.prototype.updateParams = function() {
      this.a += this.inA;
      this.rad = this.a * Math.PI / 180;
    };

    Windmill.prototype.render = function() {
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < windmillNum; i++) {
      var w = new Windmill(ctx, xSplit * i, rand(Y / 10, Y / 2));
      windmills.push(w);
    }
    
    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < windmills.length; i++) {
        windmills[i].render();
      }
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
      shapes = [];
      windmills = [];
      if (X < 768) {
        shapeNum = 700;
        windmillNum = 3;
        xSplit = X / 2;
      } else {
        shapeNum = 1500;
        windmillNum = 5;
        xSplit = X / 4;
      }
      for (var i = 0; i < windmillNum; i++) {
        var w = new Windmill(ctx, xSplit * i, rand(Y / 10, Y / 2));
        windmills.push(w);
      }
      for (var i = 0; i < shapeNum; i++) {
        var s = new Shape(ctx, rand(0, X), rand(Y - Y / 5, Y), i);
        shapes.push(s);
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  });
  // Author
  console.log('File Name / harvest.js\nCreated Date / July 10, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
