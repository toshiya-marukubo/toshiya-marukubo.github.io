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

    var dist = 100;
    var mouseX1;
    var mouseX2;
    var mouseY1;
    var mouseY2;
    
    if (X < 768) {
      dist = 50;
    }

    /********************
      Animation
    ********************/

    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (cb) {
        setTimeout(cb, 17);
      };

    /********************
      Snow
    ********************/

    var snowNum = 200;
    var snows = [];
    
    if (X < 768) {
      snowNum = 50;
    }
     
    function Snow(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Snow.prototype.init = function (x, y) {
      this.x = x || 0;
      this.y = y || 0;
      this.r = rand(10, 20);
      this.e = this.r;
      this.c = {
        r: rand(200, 250),
        g: rand(200, 250),
        b: rand(200, 250),
        a: 1
      };
      this.a = 0;
      this.rad = this.a * Math.PI / 180;
      this.v = {
        y: Math.random()
      };
    };

    Snow.prototype.draw = function () {
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
    };

    Snow.prototype.updatePosition = function () {
      this.a += Math.random();
      this.rad = this.a * Math.PI / 180;
      this.x += Math.sin(this.rad);
      this.y += this.v.y + 1;
    };

    Snow.prototype.wrapPosition = function() {
      if (this.x < 0 - this.r) this.x = X + this.r;
      if (this.x > X + this.r) this.x = 0 - this.r;
      if (this.y < 0 - this.r) this.y = Y + this.r;
      if (this.y > Y + this.r) this.y = 0 - this.r;
    };

    Snow.prototype.gradient = function () {
      var col = this.c.r + "," + this.c.g + "," + this.c.b;
      var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, "rgba(" + col + ", " + (this.c.a * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (this.c.a * 0.2) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (this.c.a * 0) + ")");
      return g;
    };

    Snow.prototype.expandSnow = function (i) {
      if (this.x > mouseX1 && this.x < mouseX2 && this.y > mouseY1 && this.y < mouseY2) {
        this.r = 100;
      } else {
        this.r = this.e;
      }
    };

    Snow.prototype.resize = function () {
      this.x = rand(0, X);
      this.y = rand(0, Y);
    };

    Snow.prototype.render = function (i) {
      this.updatePosition();
      this.wrapPosition();
      this.expandSnow(i);
      this.draw();
    };

    for (var i = 0; i < snowNum; i++) {
      var snow = new Snow(ctx, rand(0, X), rand(0, Y));
      snows.push(snow);
    }

    /********************
      Render
    ********************/
    
    function render(i) {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < snows.length; i++) {
        snows[i].render();
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
        dist = 50;
      } else {
        dist = 100;
      }
      snows = [];
      if (X < 768) {
        snowNum = 50;
      } else {
        snowNum = 200;
      }
      for (var i = 0; i < snowNum; i++) {
        var snow = new Snow(ctx, rand(0, X), rand(0, Y));
        snows.push(snow);
      }
    }

    window.addEventListener('resize', function () {
      onResize();
    });

    canvas.addEventListener('mousemove', function(e) {  
      var x = e.clientX;
      var y = e.clientY;
      mouseX1 = x - dist;
      mouseX2 = x + dist;
      mouseY1 = y - dist;
      mouseY2 = y + dist;
    }, false);

  });
  // Author
  console.log('File Name / jewelrySnow.js\nCreated Date / January 8, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
