(function() {
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

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    var ballNum = 10;
    var balls = [];
    var ease = 0.1;
    var friction = 0.1;

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

    var shapes = [];

    function Shape(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Shape.prototype.init = function(x, y) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.v = {
        x: rand(-5, 5) * Math.random(),
        y: rand(-5, -10) * Math.random()
      };
      this.r = rand(1, 10);
    };

    Shape.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.strokeStyle = 'white';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.stroke();
      ctx.restore();
    };

    Shape.prototype.updatePosition = function() {
      this.v.y += 0.1;
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Shape.prototype.removeShape = function(i) {
      if (this.y > Y + this.r) shapes.splice(i, 1);
    };

    Shape.prototype.render = function(i) {
      this.updatePosition();
      this.removeShape(i);
      this.draw();
    };
    
    /********************
      Ball
    ********************/
    
    function Ball(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Ball.prototype.init = function(x, y) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.v = {
        x: rand(-1, 1),
        y: rand(-1, 1)
      };
      this.c = 'white';
      this.r = 20;
      this.b = 3;
      this.a = rand(0, 360);
      this.rad = this.a * Math.PI / 180;
      this.d = Y / 2;
    };

    Ball.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.fillStyle = this.c;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
    };

    Ball.prototype.coll = function(i) {
      var j = i;
      for (var i = 0; i < balls.length; i++) {
        if (j !== i) {
          var sumRadius = this.r + balls[i].r;
          var a = this.x - balls[i].x;
          var b = this.y - balls[i].y;
          var c = a * a + b * b;
          if (c < sumRadius * sumRadius) {
            this.v.x = - this.v.x;
            this.v.y = - this.v.y;
            var colAngle = Math.atan2(this.y - balls[i].y, this.x - balls[i].x);
            this.v.x = Math.cos(colAngle) * this.b;
            this.v.y = Math.sin(colAngle) * this.b;
            var s = new Shape(ctx, this.x, this.y);
            shapes.push(s);
          }
        }
      }
    };

    Ball.prototype.targetPosition = function() {
      var x = X / 2 - this.x;
      var y = Y / 2 - this.y;
      var d = x * x + y * y;
      var dist = Math.sqrt(d);
      if (dist > this.d) {
        this.v.x += (X / 2 - this.x) * ease;
        this.v.y += (Y / 2 - this.y) * ease;
        this.v.x *= friction;
        this.v.y *= friction;
      }
    };

    Ball.prototype.updatePosition = function() {
      this.v.x *= 1.05;
      this.v.y *= 1.05;
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Ball.prototype.wrapPosition = function() {
      if (this.x - this.r < 0) {
        this.v.x *= -2;
      }
      if (this.x + this.r > X) {
        this.v.x *= -2;
      }
      if (this.y - this.r < 0) {
        this.v.y *= -2;
      }
      if (this.y + this.r > Y) {
        this.v.y *= -2;
      }
    };

    Ball.prototype.updateParams = function() {
      this.a += 10;
      this.rad = this.a * Math.PI / 180;
    };

    Ball.prototype.render = function(i) {
      this.updateParams();
      this.targetPosition();
      this.coll(i);
      this.updatePosition();
      //this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < ballNum; i++) {
      var b = new Ball(ctx, X / 2 + rand(-100, 100), Y / 2 + rand(-100, 100));
      balls.push(b);
    }

    /********************
      Render
    ********************/
    
    function render(i){
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < balls.length; i++) {
        balls[i].render(i);
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
    
    // resize
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', function() {
      onResize();
    });

    canvas.addEventListener('click', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      var b = new Ball(ctx, mouseX, mouseY);
      balls.push(b);
    }, false);

  }); 
  // Author
  console.log('File Name / fighting.js\nCreated Date / Jun 23, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
