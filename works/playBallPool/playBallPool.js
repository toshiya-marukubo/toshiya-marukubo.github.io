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
    var mouseX = X / 2;
    var mouseY = Y * 2;
    var ballNum = 500;
    var balls = [];
    var colors = [
      'rgb(68, 169, 199)',
      'rgb(24, 85, 130)',
      'rgb(199, 72, 142)',
      'rgb(196, 206, 66)'
    ];

    if (X < 768) {
      ballNum = 100;
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
    
    function Ball(ctx, x, y, c) {
      this.ctx = ctx;
      this.init(x, y, c);
    }

    Ball.prototype.init = function(x, y, c) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.v = {
        x: Math.random(),
        y: 1
      };
      this.c = c;
      this.r = 20;
      this.b = 1;
    };

    Ball.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.fillStyle = this.c;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
    };

    Ball.prototype.bounce = function() {
      this.v.y -= rand(1, 5);
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
          }
        }
      }
    };

    Ball.prototype.collMouse = function() {
      var a = mouseX - this.x;
      var b = mouseY - this.y;
      var d = a * a + b * b;
      var dist = Math.sqrt(d);
      if (dist < 100) {
        this.v.x = + this.v.x;
        this.v.y = + this.v.y;
        var colAngle = Math.atan2(mouseY - this.y, mouseX - this.x);
        this.v.x = -Math.cos(colAngle) * 5;
        this.v.y = -Math.sin(colAngle) * 5;
      }
    };
    
    Ball.prototype.updatePosition = function() {
      this.v.y += 0.1;
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Ball.prototype.wrapPosition = function() {
      if (this.x - this.r < 0) {
        this.v.x *= -1;
      }
      if (this.x + this.r > X) {
        this.v.x *= -1;
      }
      /*
      if (this.y - this.r < 0) {
        this.v.y *= -1;
      }
      */
      if (this.y + this.r > Y) {
        this.v.y *= -1;
      }
    };


    Ball.prototype.render = function(i) {
      this.updatePosition();
      this.coll(i);
      this.collMouse();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < ballNum; i++) {
      var b = new Ball(ctx, rand(0, X), rand(0 - Y, 0), colors[rand(0, colors.length - 1)]);
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
      balls = [];
      if (X < 768) {
        ballNum = 100;
      } else {
        ballNum = 500;
      }
      for (var i = 0; i < ballNum; i++) {
        var b = new Ball(ctx, rand(0, X), rand(0 - Y, 0), colors[rand(0, colors.length - 1)]);
        balls.push(b);
      }
    }
    
    window.addEventListener('resize', function() {
      onResize();
    });

    canvas.addEventListener('click', function(e) {
      for (var i = 0; i < balls.length; i++) {
        balls[i].bounce();
      }
    }, false);

    canvas.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    canvas.addEventListener('touchmove', function(e) {
      var touch = e.targetTouches[0];
      mouseY = touch.pageY;
      mouseX = touch.pageX;
    }, false);

    canvas.addEventListener('touchend', function() {
      mouseY = X / 2;
      mouseX = Y * 2;
    }, false);

  }); 
  // Author
  console.log('File Name / playBallPool.js\nCreated Date / Jun 23, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
