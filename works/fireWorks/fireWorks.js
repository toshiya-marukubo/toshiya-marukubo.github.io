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

    var count = document.getElementById('count');

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
    var ballNum = 10;
    var balls = [];
     
    function Ball(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Ball.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.r = rand(1, 3);
      this.v = {
        y: rand(0, -5)
      };
      this.bloomY = rand(0, Y / 2);
    };

    Ball.prototype.draw = function() {
      ctx = this.ctx;
      ctx.beginPath();
      ctx.fillStyle = 'rgb(153, 153, 153)';
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
    };

    Ball.prototype.wrapPosition = function() {
      if (this.y < this.bloomY) {
        bloomFire(ctx, this.x, this.y);
        this.y = Y;
        this.x = rand(0, X);
      }
    };

    Ball.prototype.updatePosition = function() {
      this.y += this.v.y;
    };

    Ball.prototype.resize = function() {
      this.x = rand(0, X);
    };

    Ball.prototype.render = function() {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < ballNum; i++) {
      var ball = new Ball(ctx, rand(0, X), Y);
      balls.push(ball);
    }

    /********************
      Fire
    ********************/
    
    // var
    var fireMaxNum = 1000;
    var fires = [];
    var fireGravity = 0.01;
     
    function Fire(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Fire.prototype.init = function(x, y, r) {
      this.rad = r * Math.PI / 180;
      this.x = x;
      this.y = y;
      this.r = rand(1, 2);
      this.l = rand(10, 30);
      this.v = {
        x: Math.cos(this.rad) * 1,
        y: Math.sin(this.rad) * 1,
      };
      this.c = {
        r: rand(128, 255),
        g: rand(128, 255),
        b: rand(128, 255)
      };
    };

    Fire.prototype.draw = function() {
      ctx = this.ctx;
      ctx.beginPath();
      ctx.globalAlpha = this.a;
      ctx.fillStyle = "rgb(" + this.c.r + ',' + this.c.g + ',' + this.c.b + ")";
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
    };

    Fire.prototype.updatePosition = function() { 
      this.v.y += fireGravity;
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Fire.prototype.updateParams = function() {
      this.l -= 0.1;
      this.a -= 0.1;
    };

    Fire.prototype.deleteFire = function(i) {
       if (this.l < 0) {
         fires.splice(i, 1);
       }
    };
    Fire.prototype.resize = function() {
      this.x = rand(0, X);
    };

    Fire.prototype.render = function(i) {
      this.updateParams();
      this.deleteFire(i);
      this.updatePosition();
      this.draw();
    };

    function bloomFire(c, x, y) {
      for (var i = 0; i < 36; i++) {
        var fire = new Fire(c, x, y, i * 10);
        fires.push(fire);
      }
    }
         
    /********************
      Render
    ********************/
    
    function render(){
      ctx.globalCompositeOperation = "darken";
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      for (var i = 0; i < balls.length; i++) {
        balls[i].render();
      }
      for (var i = 0; i < fires.length; i++) {
        fires[i].render(i);
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
      for (var i = 0; i < fires.length; i++) {
        fires[i].resize();
      }
    }

    count.addEventListener('change', function() {
      balls = [];
      var val = this.value;
      ballNum = val;
      for (var i = 0; i < ballNum; i++) {
        var ball = new Ball(ctx, rand(0, X), Y);
        balls.push(ball);
      }
    });

    window.addEventListener('resize', function() {
      onResize();
    });

  }); 
  // Author
  console.log('File Name / fireworks.js\nCreated Date / January 23, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
