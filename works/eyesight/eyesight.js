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
    var shapeNum = 150;
    var lw = 5;

    if (X < 768) {
      shapeNum = 80;
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
      this.r = this.i * 5;
      this.i % 2 === 0 ? this.c = 'rgb(21, 182, 212)' : this.c = 'rgb(214, 45, 120)';
      this.s = rand(0, 360) * Math.PI / 180;
      this.e = rand(this.s, 360) * Math.PI /180;
      this.a = rand(0, 360);
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineWidth = lw;
      ctx.strokeStyle = this.c;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rad * 10);
      ctx.scale(Math.tan(this.rad), Math.tan(this.rad));
      ctx.translate(-this.x, -this.y);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, this.s, this.e, false);
      ctx.stroke();
      ctx.restore();
    };

    Shape.prototype.updateParams = function(i) {
      i % 2 === 0 ? this.a += 0.1 : this.a -= 0.1;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.render = function(i) {
      this.updateParams(i);
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
      Event
    ********************/
    
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      if (X < 768) {
        shapeNum = 80;
      } else {
        shapeNum = 150;
      }
      shapes = [];
      for (var i = 0; i < shapeNum; i++) {
        var s = new Shape(ctx, X / 2, Y / 2, i);
        shapes.push(s);
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });

    canvas.addEventListener('wheel', function(e) {
        lw += e.deltaY / 100;
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
      if (touchEndY > 0) {
        lw += touchEndY / 100;
      }
      if (touchEndY < 0) {
        lw += touchEndY / 100;
      }
    }, false);

    canvas.addEventListener('touchend', function(e) {
      touchStartY = null;
      touchMoveY = null;
      touchEndY = null;
    }, false);

  });
  // Author
  console.log('File Name / eyesight.js\nCreated Date / Jun 18, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
