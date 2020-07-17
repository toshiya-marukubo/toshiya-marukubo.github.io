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
    var shapes = [];
    var shapeNum = Y / 1.5;
    var angle = 137.5;
    var flg = true;

    if (X < 768) {
      shapeNum = X;
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
      this.r = 2 * i / 200;
      this.i = i;
      this.c = {
        r: rand(255, 255),
        g: rand(255, 255),
        b: rand(255, 255)
      };
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.beginPath();
      ctx.arc(Math.cos(angle * Math.PI / 180 * this.i) * this.i / 2 + X / 2, Math.sin(angle * Math.PI / 180 * this.i) * this.i / 2 + Y / 2, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };
    
    Shape.prototype.updateParams = function() {
      angle += 0.0001;
    };
    
    Shape.prototype.render = function() {
      if (flg === true) this.updateParams();
      this.draw();
    };
    
    for (var i = 0; i < shapeNum; i++) {
      var s = new Shape(ctx, X / 2, Y / 2, i);
      shapes.push(s);
    }

    /********************
      Text
    ********************/
    
    function drawText() {
      ctx.save();
      ctx.fillStyle = 'white';
      ctx.font = '16px "Impact"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Angle / ' + angle.toFixed(2), X / 2, Y - Y / 10);
      ctx.restore();
    }

    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].render();
      }
      drawText();
      requestAnimationFrame(render);
      if (angle > 360) angle = 0;
      if (angle < 0) angle = 360;
    }

    render();

    /********************
      Event
    ********************/
    
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      X < 768 ? shapeNum = X : shapeNum = Y / 1.5;
      shapes = [];
      for (var i = 0; i < shapeNum; i++) {
        var s = new Shape(ctx, X / 2, Y / 2, i);
        shapes.push(s);
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });
    
    canvas.addEventListener('click', function(e) {
      flg === true ? flg = false : flg = true;
    }, false);
     
    canvas.addEventListener('wheel', function(e) {
      angle += e.deltaY / 100;
    });

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
      if (touchEndY > 0) {
        angle += touchEndY / 1000;
      }
      if (touchEndY < 0) {
        angle += touchEndY / 1000;
      }
    }, false);
    
    canvas.addEventListener('touchend', function(e) {
      touchStartY = null;
      touchMoveY = null;
      touchEndY = null;
    }, false);

  });
  // Author
  console.log('File Name / angle.js\nCreated Date / Jun 06, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
