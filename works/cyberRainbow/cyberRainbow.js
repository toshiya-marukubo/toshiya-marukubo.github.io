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
    var range = document.getElementById('range');
    var mouseX = X / 2;
    var mouseY = Y / 2;
    var shapeNum = range.value;
    var splitAngle = 360 / shapeNum;
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
    
    function Shape(ctx, x, y, a, i) {
      this.ctx = ctx;
      this.init(x, y, a, i);
    }
    
    Shape.prototype.init = function(x, y, a, i) {
      this.x = x;
      this.y = y;
      this.a = a;
      this.rad = this.a * Math.PI / 180;
      this.a2 = this.a + splitAngle;
      this.rad2 = this.a2 * Math.PI / 180;
      this.a3 = rand(0, 360);
      this.rad3 = this.a3 * Math.PI / 180;
      this.a4 = 0;
      this.rad4 = this.a4 * Math.PI / 180;
      this.color = i * splitAngle;
      this.r = Y / 4;
      this.inA = Math.random() + 1;
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.strokeStyle = 'hsl(' + this.color + ', 80%, 60%)';
      ctx.fillStyle = 'hsl(' + this.color + ', 80%, 60%)';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(Math.cos(this.rad) * this.r + this.x, Math.sin(this.rad) * this.r + this.y);
      ctx.lineTo(Math.cos(this.rad2) * this.r + this.x, Math.sin(this.rad2) * this.r + this.y);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    };

    Shape.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 2;
    };
   
    Shape.prototype.updateParams = function() {
      this.a3 += this.inA;
      this.rad3 = this.a3 * Math.PI / 180;
      this.a4 += 0.1;
      this.rad4 = this.a4 * Math.PI / 180;
      this.r = Math.sin(this.rad3) + this.r;
    };
    
    Shape.prototype.render = function(i) {
      this.updateParams();
      this.draw();
    };
    
    for (var i = 0; i < shapeNum; i++) {
      var s = new Shape(ctx, X / 2, Y / 2, splitAngle * i, i);
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
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    canvas.addEventListener('wheel', function(e) {
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].r += e.deltaY / 10;
      }
    }, false);
   
    var touchStartY;
    var touchMoveY;
    var touchEndY;

    canvas.addEventListener('touchstart', function(e) {
      var touch = e.targetTouches[0];
      touchStartY = touch.pageY;
    }, false);

    canvas.addEventListener('touchmove', function(e) {
      var touch = e.targetTouches[0];
      touchMoveY = touch.pageY;
      touchEndY = touchStartY - touchMoveY;
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].r += touchEndY / 100;
      }
    }, false);

    canvas.addEventListener('touchend', function(e) {
      touchStartY = null;
      touchMoveY = null;
      touchEndY = null;
    }, false);   
    
    range.addEventListener('change', function() {
      var val = this.value;
      shapeNum = range.value;
      splitAngle = 360 / shapeNum;
      shapes = [];
      for (var i = 0; i < shapeNum; i++) {
        var s = new Shape(ctx, X / 2, Y / 2, splitAngle * i, i);
        shapes.push(s);
      }
    }, false);

  });
  // Author
  console.log('File Name / cyberRainbow.js\nCreated Date / July 04, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
