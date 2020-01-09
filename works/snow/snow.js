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

    // canvas 
    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;

    // snow
    var snowNum = 100;
    var snows = [];

    // speed
    var snowSpeed = -0.01;

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

    function Particle(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Particle.prototype.init = function (x, y) {
      this.ctx = ctx;
      this.x = x - 0.1 || 0;
      this.y = y || 0;
      this.v = {
        x: snowSpeed,
        y: Math.random() * 1
      };
      this.color = {
        r: rand(200, 250),
        g: rand(200, 250),
        b: rand(200, 250),
        a: 1
      };
      this.radius = Math.random() * 30;
    };

    Particle.prototype.draw = function () {
      ctx = this.ctx;
      ctx.beginPath();
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    };

    Particle.prototype.updatePosition = function () {
      this.x += this.v.x + snowSpeed;
      this.y += this.v.y;
    };

    Particle.prototype.wrapPosition = function () {
      if (this.x < 0) this.x = X;
      if (this.x > X) this.x = 0;
      if (this.y < 0) this.y = Y;
      if (this.y > Y) this.y = 0;
    };

    Particle.prototype.gradient = function () {
      var col = this.color.r + "," + this.color.g + "," + this.color.b;
      var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      g.addColorStop(0, "rgba(" + col + ", " + (this.color.a * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (this.color.a * 0.2) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (this.color.a * 0) + ")");
      return g;
    };

    Particle.prototype.resize = function () {
      this.x = rand(0, X);
    };

    Particle.prototype.render = function () {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < snowNum; i++) {
      var positionX = Math.random() * X;
      var positionY = Math.random() * Y;
      var particle = new Particle(ctx, positionX, positionY);
      snows.push(particle);
    }

    // render
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < snows.length; i++) {
        snows[i].render();
      }
      requestAnimationFrame(render);
    }

    render();

    // resize
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      for (var i = 0; i < snows.length; i++) {
        snows[i].resize();
      }
    }

    /********************
      Event
    ********************/

    window.addEventListener('resize', function () {
      onResize();
    });

  });
  // Author
  console.log('File Name / snow.js\nAuthor / Toshiya Marukubo\nCreated Date / 2020.01.08');
})();
