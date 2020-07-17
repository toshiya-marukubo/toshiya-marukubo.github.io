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
    // ground
    var shapes = [];
    var shapeNum = 360;
    var split = X / 360;
    // ball
    var ballNum = 72;
    var balls = [];
    var gravity = 0.1;
    var friction = 1;

    if (X < 768) {
      ballNum = 36;
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
      Ball
    ********************/
    
    function Ball(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }
    
    Ball.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.r = 10;
      this.v = {
        x: rand(-10, 10) * Math.random() * Math.random(),
        y: rand(-10, 10) * Math.random() * Math.random()
      };
      this.color = rand(0, 360);
    };
    
    Ball.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.fillStyle = 'hsl(' + this.color + ', 80%, 60%)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    Ball.prototype.wrapPosition = function() {
      if (this.x - this.r < 0) {
        this.x = 0 + this.r;
        this.v.x = - this.v.x;
      }
      if (this.x + this.r > X) {
        this.x = X - this.r;
        this.v.x = - this.v.x;
      }
      if (this.y - this.r < 0) {
        //this.v.y = - this.v.y;
      }
      if (this.y - this.r > Y) {
        this.y = 0 - this.r;
        //this.v.y = - this.v.y;
      }
    };

    Ball.prototype.collisionWall = function() {
      for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        if (this.r * this.r > (this.x - shape.x) * (this.x - shape.x) + (this.y - shape.y) * (this.y - shape.y)) {
          this.y = shape.y - this.r;
          this.v.y *= friction;
          this.v.y = - this.v.y;
        }
      }
    };

    Ball.prototype.collisionBall = function(i) {
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
            this.v.x = Math.cos(colAngle) * 1;
            this.v.y = Math.sin(colAngle) * 5;
          }
        }
      }
    };

    Ball.prototype.updatePosition = function() {
      this.v.y += gravity;
      this.x += this.v.x;
      this.y += this.v.y;
    };
    
    Ball.prototype.render = function(i) {
      this.updatePosition();
      this.collisionBall(i);
      this.collisionWall();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < ballNum; i++) {
      var b = new Ball(ctx, rand(0, X), 0, i);
      balls.push(b);
    }

    /********************
      Ground
    ********************/
    
    function Shape(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }
    
    Shape.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.a = i;
      this.rad = this.a * Math.PI / 180;
      this.color = i;
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = split + 1;
      ctx.strokeStyle = 'hsl(' + this.color + ', 80%, 60%)';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x, Y);
      ctx.stroke();
      ctx.restore();
    };
    
    Shape.prototype.updateParams = function() {
      this.a += 5;
      this.rad = this.a * Math.PI / 180;
      this.y = Math.sin(this.rad) + this.y;
    };

    Shape.prototype.render = function(i) {
      this.updateParams();
      this.draw();
    };
    
    for (var i = 0; i < shapeNum; i++) {
      var s = new Shape(ctx, split * i + split / 2, Y - Y / 3, i);
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
      for (var i = 0; i < balls.length; i++) {
        balls[i].render(i);
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
      balls = [];
      split = X / 360;
      if (X < 768) {
        ballNum = 36;
      } else {
        ballNum = 72;
      }
      for (var i = 0; i < shapeNum; i++) {
        var s = new Shape(ctx, split * i + split / 2, Y - Y / 3, i);
        shapes.push(s);
      }
      for (var i = 0; i < ballNum; i++) {
        var b = new Ball(ctx, rand(0, X), 0, i);
        balls.push(b);
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    canvas.addEventListener('wheel', function(e) {
    }, false);
    
  });
  // Author
  console.log('File Name / jump.js\nCreated Date / July 04, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
