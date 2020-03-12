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
      Moon
    ********************/
    
    var moonNum = 1;
    var moons = [];
    var radius = 150;

    if (X < 768) {
      radius = 100;
    }

    function Moon(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Moon.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.c = '147, 171, 79';
      this.r = radius;
    };
    
    Moon.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 2;
      this.r = radius;
    };

    Moon.prototype.render = function() {
      this.draw();
    };
    
    Moon.prototype.draw = function() {
      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = 0.8;
      var col = this.c;
      var g = ctx.createRadialGradient(this.x, this.y, this.r, X / 2 - this.r, Y / 2, 0);
      g.addColorStop(0, "rgba(" + col + ", " + (1 * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (1 * 0.2) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (1 * 0) + ")");
      ctx.fillStyle = g;
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    for (var i = 0; i < moonNum; i++) {
      var moon = new Moon(ctx, X / 2, Y / 2);
      moons.push(moon);
    }

    /********************
      Cloud
    ********************/
    
    var cloudNum = 20;
    var clouds = [];

    if (X < 768) {
      cloudNum = 10;
    }

    function Cloud(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Cloud.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.r = rand(100, 200);
      this.v = {
        x: 0.5,
        y: 0
      };
      this.color = {
        r: 180,
        g: 180,
        b: 180,
        a: 1
      };
    };
    
    Cloud.prototype.wrapPosition = function(){
      if (this.x - this.r > X) {
        this.x = 0 - this.r;
      }
    };
     
    Cloud.prototype.updatePosition = function() {
      this.x += this.v.x;
    };
    
    Cloud.prototype.resize = function() {
      this.x = rand(0 - 100, X + 100);
      this.y = rand(0, Y / 2);
    };

    Cloud.prototype.render = function() {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };
   
    Cloud.prototype.gradient = function () {
      var col = this.color.r + "," + this.color.g + "," + this.color.b;
      var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, "rgba(" + col + ", " + (this.color.a * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (this.color.a * 0.5) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (this.color.a * 0) + ")");
      return g;
    };
    
    Cloud.prototype.draw = function() {
      ctx.save();
      ctx.scale(2, 1);
      ctx.beginPath();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      ctx.fill();
      ctx.scale(0.5, 1);
      ctx.restore();
    };

    for (var i = 0; i < cloudNum; i++) {
      var cloud = new Cloud(ctx, rand(0 - 100, X + 100), rand(0, Y / 2));
      clouds.push(cloud);
    }

    /********************
      firefly
    ********************/
    
    var fireflyNum = 24;
    var fireflies = [];
    
    if (X < 768) {
      fireflyNum = 12;
    }

    function Firefly(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Firefly.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.c = 'rgb(147, 171, 79)';
      this.r = rand(3, 10);
      this.l = rand(10, 20);
      this.a = 1;
      this.v = {
        x: rand(-1, 1) * Math.random(),
        y: rand(-1, 1) * Math.random()
      };
    };
    
    Firefly.prototype.updateParams = function(){
      this.l -= 0.1;
      this.a -= 0.01 * Math.random();
      if (this.l < 0 || this.a < 0) {
        this.init(rand(0, X), rand(Y / 2, Y));
      }
    };
     
    Firefly.prototype.updatePosition = function() {
      this.x += this.v.x;
      this.y += this.v.y;
    };
    
    Firefly.prototype.resize = function() {
      this.x = rand(0, X);
      this.y = rand(Y / 2, Y);
    };

    Firefly.prototype.render = function() {
      this.updateParams();
      this.updatePosition();
      this.draw();
    };
    
    Firefly.prototype.draw = function() {
      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = this.a;
      ctx.fillStyle = this.c;
      ctx.shadowColor = this.c;
      ctx.shadowBlur = 10;
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    for (var i = 0; i < fireflyNum; i++) {
      var firefly = new Firefly(ctx, rand(0, X), rand(Y / 2, Y));
      fireflies.push(firefly);
    }

    /********************
      Grass
    ********************/
    
    // var
    var grassNum = 100;
    var grasses = [];

    if (X < 768) {
      grassNum = 30;
    }

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
      this.c = 'rgb(0, 0, 0)';
      this.v = {
        x: Math.cos(this.rad),
        y: Math.sin(this.rad)
      };
      this.xt = this.x + this.w;
      this.yt = this.y - this.t;
      this.xb = this.x + this.w;
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
      ctx.fillStyle = this.c;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.xt, this.yt);
      ctx.lineTo(this.xb, this.y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    Grass.prototype.resize = function() {
        this.init(rand(-10, X + 10), Y, rand(20, 30), rand(Y * 0.1, Y * 0.7));
    };

    Grass.prototype.render = function() {
      this.updateParams();
      this.updatePosition();
      this.draw();
    };

    for (var i = 0; i < grassNum; i++) {
      var grass = new Grass(ctx, rand(-10, X + 10), Y, rand(20, 30), rand(Y * 0.1, Y * 0.7));
      grasses.push(grass);
    }
    
    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < moons.length; i++) {
        moons[i].render();
      }
      for (var i = 0; i < clouds.length; i++) {
        clouds[i].render();
      }
      for (var i = 0; i < fireflies.length; i++) {
        fireflies[i].render();
      }
      for (var i = 0; i < grasses.length; i++) {
        grasses[i].render();
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
      if (X < 768) {
        radius = 100;
        cloudNum = 10;
        grassNum = 30;
        fireflyNum = 12;
      } else {
        radius = 150;
        cloudNum = 20;
        grassNum = 100;
        fireflyNum = 24;
      }
      for (var i = 0; i < moons.length; i++) {
        moons[i].resize();
      }
      for (var i = 0; i < clouds.length; i++) {
        clouds[i].resize();
      }
      for (var i = 0; i < fireflies.length; i++) {
        fireflies[i].resize();
      }
      for (var i = 0; i < grasses.length; i++) {
        grasses[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  });
  // Author
  console.log('File Name / fullMoon.js\nCreated Date / February 11, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
