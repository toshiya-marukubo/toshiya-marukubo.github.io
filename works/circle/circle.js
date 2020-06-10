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
    var splitNum = 18;
    var xSplit = X / splitNum;
    var ySplit = Y / splitNum;
    var flg = true;

    if (X < 768) {
      splitNum = 12;
      xSplit = X / splitNum;
      ySplit = Y / splitNum;
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
    
    function Shape(ctx, x, y, r, d, i) {
      this.ctx = ctx;
      this.init(x, y, r, d, i);
    }

    Shape.prototype.init = function(x, y, r, d, i) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.d = d;
      this.c = {
        r: rand(0, 0),
        g: rand(0, 0),
        b: rand(0, 0),
        a: 1
      };
      this.a = j * 5;
      this.rad = this.a * Math.PI / 180;
      this.ua = 2;
      this.angle = 0;
      this.radian = this.angle * Math.PI / 180;
      this.dist = this.measureDist();
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'xor';      
      if (flg === true) ctx.globalAlpha = Math.sin(this.rad) * this.c.a + 1;
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.beginPath();
      ctx.arc(this.x, Math.cos(this.rad * 2) * this.d + this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
      ctx.save();
      if (flg === true) ctx.globalAlpha = Math.sin(this.rad) * this.c.a + 1;
      ctx.fillStyle = this.gradient();
      ctx.translate(this.x, this.y + this.d + this.r);
      ctx.scale(1, 0.3);
      ctx.translate(-this.x, -this.y - this.d - this.r);
      ctx.beginPath();
      ctx.arc(this.x, this.y + this.d + this.r, Math.sin(this.rad) < 0 ? -Math.sin(this.rad) * this.r : Math.sin(this.rad) * this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    Shape.prototype.measureDist = function() {
      var x = X / 2 - this.x;
      var y = Y - this.y;
      var d = x * x + y * y;
      var dist = Math.sqrt(d);
      return dist;
    };

    Shape.prototype.changeColor = function() {
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(0, 255),
        a: 1 
      };
    };

    Shape.prototype.gradient = function() {
      var col = this.c.r + "," + this.c.g + "," + this.c.b;
      var g = this.ctx.createRadialGradient(this.x, this.y + this.d + this.r, 0, this.x, this.y + this.d + this.r, Math.sin(this.rad) < 0 ? -Math.sin(this.rad) * this.r : Math.sin(this.rad) * this.r);
      g.addColorStop(0, "rgba(" + col + ", " + (this.c.a * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (this.c.a * 0.5) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (this.c.a * 0) + ")");
      return g;
    };

    Shape.prototype.updateParams = function() {
      this.a += this.ua;
      this.rad = this.a * Math.PI / 180;
    };
    
    Shape.prototype.render = function() {
      this.updateParams();
      this.draw();
    };
    
    for (var i = 0; i < splitNum + 1; i++) {
      for (var j = 0; j < splitNum + 1; j++) {
        var s = new Shape(ctx, xSplit * i, ySplit * j, j * 1.2 + xSplit / 20, j * 1.2 + ySplit / 20, i);
        shapes.push(s);
      }
    }

    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].render();
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
        splitNum = 12;
        xSplit = X / splitNum;
        ySplit = Y / splitNum;
      } else {
        splitNum = 18;
        xSplit = X / splitNum;
        ySplit = Y / splitNum;
      }
      shapes = [];
      for (var i = 0; i < splitNum + 1; i++) {
        for (var j = 0; j < splitNum + 1; j++) {
          var s = new Shape(ctx, xSplit * i, ySplit * j, j * 1.2 + xSplit / 20, j * 1.2 + ySplit / 20, i);
          shapes.push(s);
        }
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });

    canvas.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    canvas.addEventListener('click', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      flg === true ? flg = false : flg = true;
    }, false);

    canvas.addEventListener('wheel', function(e) {
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].r += e.deltaY / 100;
        shapes[i].d += e.deltaX / 100;
        if (shapes[i].r < 0) {
          shapes[i].r *= -1;
        }
        if (shapes[i].d < 0) {
          shapes[i].d *= -1;
        }
      }
    });


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
      touchEndY = touchStartY - touchMoveY;
      touchMoveX = touch.pageX;
      touchEndX = touchStartX - touchMoveX;
      if (touchEndY > 0) {
        for (var i = 0; i < shapes.length; i++) {
          shapes[i].r += touchEndY / 1000;
        }
      }
      if (touchEndX > 0) {
        for (var i = 0; i < shapes.length; i++) {
          shapes[i].d += touchEndX / 1000;
        }
      }
      if (touchEndY < 0) {
        for (var i = 0; i < shapes.length; i++) {
          shapes[i].r += touchEndY / 1000;
          if (shapes[i].r < 0) {
            shapes[i].r *= -1;
          }
        }
      }
      if (touchEndX < 0) {
        for (var i = 0; i < shapes.length; i++) {
          shapes[i].d += touchEndX / 1000;
          if (shapes[i].d < 0) {
            shapes[i].d *= -1;
          }
        }
      }
    }, false);
    
    canvas.addEventListener('touchend', function(e) {
      touchStartY = null;
      touchMoveY = null;
      touchEndY = null;
    }, false);

  });
  // Author
  console.log('File Name / circle.js\nCreated Date / Jun 10, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
