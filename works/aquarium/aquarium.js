(function () {
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
    var mouseX = null;
    var mouseY = null;

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
      Wave
    ********************/
    var waves = [];
     
    function Wave(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Wave.prototype.init = function(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.l = rand(100, 150);
    };
    
    Wave.prototype.draw = function() {
      ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = 'rgb(149, 188, 249)';
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.stroke();
      ctx.restore();
    };

    Wave.prototype.updateParams = function() {
      this.r += 1;
    };

    Wave.prototype.deleteWave = function(i) {
      if (this.r > this.l) {
        waves.splice(i, 1);
      }
    };

    Wave.prototype.render = function(i) {
      this.updateParams();
      this.deleteWave(i);
      this.draw();
    };

    /********************
      Fish
    ********************/

    var fishes = [];
    var fishDir = [true, false];
    var fishColors = ['255, 111, 147', '49, 194, 243', '255, 158, 0', '107, 136, 255'];

    function Fish(ctx, x, y, r, d, c) {
      this.ctx = ctx;
      this.init(x, y, r, d, c);
    }

    Fish.prototype.init = function(x, y, r, d, c) {
      this.d = d;
      this.x = x;
      this.y = y;
      this.r = r;
      this.c = c;
      this.rad = this.a * Math.PI / 180;
      if (this.d === true) {
        this.v = {
          x: rand(1, 2) * 0.5,
          y: rand(-1, 1) * 0.5
        };
      } else {
        this.v = {
          x: rand(-2, -1) * 0.5,
          y: rand(-1, 1) * 0.5
        };
      }
    };
    
    Fish.prototype.draw = function() {
      ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = 'rgb(' + this.c + ')';
      ctx.scale(2, 1);
      ctx.arc(this.x / 2, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.beginPath();
      if (this.d === true) {
        ctx.moveTo(this.x / 2 + this.r / 2, this.y);
        ctx.lineTo(this.x / 2 + this.r + this.r / 2, this.y + this.r / 2);
        ctx.lineTo(this.x / 2 + this.r + this.r / 2, this.y - this.r / 2);
      } else {
        ctx.moveTo(this.x / 2 - this.r / 2, this.y);
        ctx.lineTo(this.x / 2 - this.r - this.r / 2, this.y + this.r / 2);
        ctx.lineTo(this.x / 2 - this.r - this.r / 2, this.y - this.r / 2);
      }
      ctx.fill();
      ctx.restore();
    };

    Fish.prototype.updatePosition = function() {
      this.x -= this.v.x;
      this.y += this.v.y;
    };

    Fish.prototype.wrapPosition = function() {
      if (this.x + this.r + this.r > X) {
        this.v.x *= -1;
        this.d = true;
      }
      if (this.x - this.r - this.r < 0) {
        this.v.x *= -1;
        this.d = false;
      }
      if (this.y + this.r > Y) {
        this.v.y *= -1;
      }
      if (this.y - this.r < 0) {
        this.v.y *= -1;
      }
    };

    Fish.prototype.resize = function() {
      this.x = rand(0, X);
      this.y = rand(0, Y);
    };

    Fish.prototype.render = function() {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };

    /********************
      Grass
    ********************/
    
    // var
    var grassNum = 200;
    var grasses = [];

    function Grass(ctx, x, y, w, t) {
      this.ctx = ctx;
      this.init(x, y, w, t);
    }

    Grass.prototype.init = function(x, y, w, t) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.t = t;
      this.a = 0;
      this.rad = this.a * Math.PI / 180;
      this.c = '255, 255, 255';
      this.v = {
        x: Math.cos(this.rad),
        y: Math.sin(this.rad)
      };
      this.xt = this.x + this.w;
      this.yt = this.y - this.t;
      this.xb = this.x + this.w + this.w;
    };
    
    Grass.prototype.updateParams = function() {
      this.a += Math.random();
      this.rad = this.a * Math.PI / 180;
      this.v.x = Math.cos(this.rad) * 0.3;
      this.v.y = Math.sin(this.rad) * 0.3;
    };

    Grass.prototype.updatePosition = function() {
      this.xt += this.v.x;
    };
    
    Grass.prototype.draw = function() {
      ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = 'rgb(86, 116, 25)';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.xt, this.yt);
      ctx.lineTo(this.xb, this.y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    Grass.prototype.resize = function() {
      for (var i = 0; i < grassNum; i++) {
        grasses[i].init(rand(-10, X + 10), Y, rand(2.5, 5), rand(100, 200));
      }
    };

    Grass.prototype.render = function() {
      this.updateParams();
      this.updatePosition();
      this.draw();
    };

    for (var i = 0; i < grassNum; i++) {
      var grass = new Grass(ctx, rand(-10, X + 10), Y, rand(2.5, 5), rand(100, 200));
      grasses.push(grass);
    }
   
    /********************
      Bubble
    ********************/
    
    // var
    var bubbleNum = 30;
    var bubbles = [];

    function Bubble(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Bubble.prototype.init = function(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.a = rand(1, 10);
      this.dist = rand(1, 10);
      this.rad = this.a * Math.PI / 180;
      this.c = '255, 255, 255';
      this.v = {
        x: Math.sin(this.rad),
        y: Math.cos(this.rad)
      };
    };
    
    Bubble.prototype.updateParams = function() {
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
      this.y -= 1;
    };

    Bubble.prototype.wrapPosition = function() {
      if (this.x - this.r > X) {
        this.x = 0;
      }
      if (this.x + this.r < 0) {
        this.x = X;
      }
      if (this.y - this.r > Y) {
        this.y = 0;
      }
      if (this.y + this.r < 0) {
        this.y = Y;
      }
    };
    
    Bubble.prototype.draw = function() {
      ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.arc(Math.cos(this.rad) * this.dist + this.x, Math.sin(this.rad) * this.dist + this.y, this.r, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    };

    Bubble.prototype.resize = function() {
      this.x = rand(0, X);
      this.y = rand(0, Y);
    };

    Bubble.prototype.render = function() {
      this.updateParams();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < bubbleNum; i++) {
      var bubble = new Bubble(ctx, rand(0, X), rand(0, Y), rand(1, 10));
      bubbles.push(bubble);
    }

    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < grasses.length; i++) {
        grasses[i].render();
      }
      for (var i = 0; i < bubbles.length; i++) {
        bubbles[i].render();
      }
      for (var i = 0; i < fishes.length; i++) {
        fishes[i].render();
      }
      for (var i = 0; i < waves.length; i++) {
        waves[i].render(i);
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
      for (var i = 0; i < grasses.length; i++) {
        grasses[i].resize();
      }
      for (var i = 0; i < bubbles.length; i++) {
        bubbles[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    canvas.addEventListener('click', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      var fish = new Fish(ctx, mouseX, mouseY, rand(5, 15), fishDir[rand(0, 1)], fishColors[rand(0, fishColors.length - 1)]);
      fishes.push(fish);
      var wave = new Wave(ctx, mouseX, mouseY, 0);
      waves.push(wave);
    }, false);

  });
  // Author
  console.log('File Name / aquarium.js\nCreated Date / February 2, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
