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

    // canvas 
    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = X / 2;
    var mouseY = Y / 2;
    var lightMin = 150;
    var lightMax = 200;

    if (X < 768) {
      lightMin = 100;
      lightMax = 150;
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
    
    // var
    var ballNum = 3;
    var balls = [];
    var circleSplit = 12;
    var angleSplit = 360 / circleSplit;
     
    function Ball(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Ball.prototype.init = function(x, y, r) {
      this.a = rand(0, 360);
      this.a1 = -0;
      this.rad1 = this.a1 * Math.PI / 180;
      this.x = x;
      this.y = y;
      this.r = r;
      this.v = rand(3, 5);
      this.rad = this.a * Math.PI / 180;
      this.points = [];
      this.setPoints();
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(0, 255)
      };
      this.v1 = {
        x: 0,
        y: 0
      };
    };

    Ball.prototype.setPoints = function() {
      for (var i = 0; i < circleSplit; i++) {
        var pointX = Math.cos(this.rad) * this.r;
        var pointY = Math.sin(this.rad) * this.r;
        var point = [pointX, pointY, rand(0, 360)];
        this.points.push(point);
        this.rad = this.a * Math.PI / 180;
        this.a += angleSplit;
      }
    };

    Ball.prototype.draw = function() {
      ctx = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowColor = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.shadowBlur = 100;
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.beginPath();
      var xav1 = (this.points[0][0] + this.points[circleSplit - 1][0]) / 2 + this.x;
      var yav1 = (this.points[0][1] + this.points[circleSplit - 1][1]) / 2 + this.y;
      ctx.moveTo(xav1, yav1);
      for (var i = 1; i < this.points.length - 1; i++) {
        var xav2 = (this.points[i][0] + this.points[i + 1][0]) / 2;
        var yav2 = (this.points[i][1] + this.points[i + 1][1]) / 2;
        ctx.quadraticCurveTo(this.points[i][0] + this.x, this.points[i][1] + this.y, xav2 + this.x, yav2 + this.y);
      }
      ctx.quadraticCurveTo(this.points[circleSplit - 1][0] + this.x, this.points[circleSplit - 1][1] + this.y, xav1, yav1);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    Ball.prototype.transform = function() {
      for (var i = 0; i < this.points.length; i++) {
        this.points[i][0] -= Math.sin(this.points[i][2] * Math.PI / 180);
        this.points[i][1] -= Math.cos(this.points[i][2] * Math.PI / 180);
        this.points[i][2] -= this.v;
      }
    };

    Ball.prototype.changeColor = function() {
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(0, 255)
      }; 
    };
    
    Ball.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 2;
    };

    Ball.prototype.render = function() {
      this.transform();
      this.draw();
    };

    for (var i = 0; i < ballNum; i++) {
      var ball = new Ball(ctx, X / 2, Y / 2, rand(lightMin, lightMax));
      balls.push(ball);
    }

    /********************
      Render
    ********************/
    
    function render(){
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
    
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      for (var i = 0; i < balls.length; i++) {
        balls[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    window.addEventListener('click', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      for (var i = 0; i < balls.length; i++) {
        balls[i].changeColor();
      }
    }, false);

    window.addEventListener('touchmove', function(e) {
      var touch = event.targetTouches[0];
      mouseX = touch.pageX;
      mouseY = touch.pageY;
      for (var i = 0; i < balls.length; i++) {
        balls[i].changeColor();
      }
    }, false);

  }); 
  // Author
  console.log('File Name / lightBall.js\nCreated Date / April 28, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
