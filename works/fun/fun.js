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
    var shapeNum = 360;
    var shapeMax = 70;
    var xRatio = 2;
    var yRatio = 4;
    var zRatio = 1.5;

    if (X < 768) {
      shapeMax = 35;
      xRatio = 3;
      yRatio = 1;
      zRatio = 2;
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
      this.r = rand(5, shapeMax);
      this.ir = this.r / 2;
      this.i = i;
      this.v = {
        x: 0,
        y: 0
      };
      this.a = i;
      this.rad = this.a * Math.PI / 180;
      this.rx = rand(Y / 15, Y / xRatio);
      this.ry = rand(X / yRatio, X / zRatio);
      this.ga = Math.random() * Math.random();
    };
 
    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.fillStyle = 'white';
      ctx.globalAlpha = this.ga;
      ctx.translate(this.x, this.y);
      ctx.rotate(-90 * Math.PI / 180);
      ctx.translate(-this.x, -this.y);
      ctx.beginPath();
      ctx.arc(
        Math.cos(this.rad) * this.rx + this.x,
        Math.sin(this.rad) * this.ry + this.y,
        Math.sin(this.rad / 2) < 0 ? -Math.sin(this.rad / 2) * this.r + this.ir : Math.sin(this.rad / 2) * this.r + this.ir,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
      ctx.restore();
    };

    Shape.prototype.updateParams = function() {
      this.a += 0.4;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 2;
    };

    Shape.prototype.render = function(i) {
      this.updateParams();
      this.draw();
    };
    
    for (var i = 0; i < shapeNum; i++) {
      var s = new Shape(ctx, X / 2, Y / 2, i);
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
      Change Color
    ********************/
    
    var colors = ['#FE7F7E', '#FED57F', '#B5E2B4', '#ACE8FE', '#BAB3EB'];
    
    function changeColor() {
      var time = rand(1000, 5000);
      canvas.style.background = colors[rand(0, colors.length - 1)];
      setTimeout(changeColor, time);
    }

    changeColor();

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

    window.addEventListener('resize', function(){
      onResize();
    });

    canvas.addEventListener('wheel', function(e) {
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].rx -= e.deltaY / 10;
        shapes[i].a += e.deltaX / 100;
      }
    }, false);

    var touchStartY;
    var touchMoveY;
    var touchEndY;
    var touchStartX;
    var touchMoveX;
    var touchEndX;

    canvas.addEventListener('touchstart', function(e) {
      var touch = e.targetTouches[0];
      touchStartY = touch.pageY;
      touchStartX = touch.pageX;
    }, false);

    canvas.addEventListener('touchmove', function(e) {
      var touch = e.targetTouches[0];
      touchMoveY = touch.pageY;
      touchMoveX = touch.pageX;
      touchEndY = touchStartY - touchMoveY;
      touchEndX = touchStartX - touchMoveX;
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].rx -= touchEndY / 100;
        shapes[i].a += touchEndX / 100;
      }
    }, false);

    canvas.addEventListener('touchend', function(e) {
      touchStartY = null;
      touchMoveY = null;
      touchEndY = null;
      touchStartX = null;
      touchMoveX = null;
      touchEndX = null;
    }, false);

  });
  // Author
  console.log('File Name / eyesight.js\nCreated Date / Jun 18, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
