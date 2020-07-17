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
    var ballNum = count.value;
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
        y: rand(1, 5)
      };
      this.bloomY = rand(0, Y / 2);
    };

    Ball.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.fillStyle = 'rgb(153, 153, 153)';
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
    };

    Ball.prototype.wrapPosition = function() {
      if (this.y < this.bloomY) {
        bloomFire(ctx, this.x, this.y, getColor(), rand(0.8, 3));
        this.y = Y;
        this.x = rand(0, X);
      }
    };

    Ball.prototype.updatePosition = function() {
      this.y -= this.v.y;
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
    var fires = [];
    var fireGravity = 0.01;

    function getColor() {
      var color = "rgb(" + rand(0, 255) + ',' + rand(0, 255) + ',' + rand(0, 255) + ")";
      return color;
    }
    function Fire(ctx, x, y, c, d, r) {
      this.ctx = ctx;
      this.init(x, y, c, d, r);
    }

    Fire.prototype.init = function(x, y, c, d, r) {
      this.rad = r * Math.PI / 180;
      this.x = x;
      this.y = y;
      this.r = 2;
      this.c = c;
      this.d = d;
      this.l = rand(10, 20);
      this.v = {
        x: Math.cos(this.rad) * this.d,
        y: Math.sin(this.rad) * this.d
      };
    };

    Fire.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = this.c;
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
      ctx.fill();
    };

    Fire.prototype.updatePosition = function() { 
      this.v.y += fireGravity;
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Fire.prototype.updateParams = function() {
      this.l -= 0.1;
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

    function bloomFire(ctx, x, y, c, d) {
      for (var i = 0; i < 36; i++) {
        var fire = new Fire(ctx, x, y, c, d, i * 10);
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
