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

    // particle
    var particleNum = 500;
    if (X < 768) {
      particleNum = 250;
    }
    var particles = [];

    // speed
    var particleSpeed = -0.01;

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
      Particle
    ********************/

    function Particle(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Particle.prototype.init = function (x, y) {
      this.ctx = ctx;
      this.x = x || 0;
      this.y = y || 0;
      this.v = {
        y: 1
      };
      this.color = '255, 255, 255';
      this.radius = Math.random() * 10;
    };

    Particle.prototype.draw = function () {
      ctx = this.ctx;
      ctx.beginPath();
      ctx.globalCompositeOperation = 'lignten';
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    };

    Particle.prototype.updatePosition = function () {
      var rad = this.y * Math.PI / 180;
      this.x -= Math.sin(rad * this.v.y) * 0.1;
      this.y -= this.v.y;
      /*
      this.x += this.v.x + particleSpeed;
      this.y -= this.v.y;
      */
    };

    Particle.prototype.wrapPosition = function () {
      if (this.x < 0) this.x = X;
      if (this.x > X) this.x = 0;
      if (this.y < 0) this.y = Y;
      if (this.y > Y) this.y = 0;
    };

    Particle.prototype.gradient = function () {
      var col = this.color;
      var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      g.addColorStop(0, "rgba(" + col + ", " + (1 * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (1 * 0.2) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (1 * 0) + ")");
      return g;
    };

    Particle.prototype.resize = function () {
      this.x = Math.random() * X / 5 + X / 5 * 2;
    };

    Particle.prototype.render = function () {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < particleNum; i++) {
      var positionX = Math.random() * X / 5 + X / 5 * 2;
      var positionY = Math.random() * Y;
      var particle = new Particle(ctx, positionX, positionY);
      particles.push(particle);
    }

    // render
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < particles.length; i++) {
        particles[i].render();
      }
      requestAnimationFrame(render);
    }

    render();

    // resize
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      for (var i = 0; i < particles.length; i++) {
        particles[i].resize();
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
  console.log('File Name / milkyWay.js\nCreated Date / January 10, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
