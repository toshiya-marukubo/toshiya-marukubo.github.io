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
    var starNum = 500;
    if (X < 768) {
      starNum = 250;
    }
    var stars = [];

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
      Star
    ********************/

    function Star(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Star.prototype.init = function (x, y, r) {
      this.x = x || 0;
      this.y = y || 0;
      this.r = r;
      this.v = {
        y: 1
      };
      this.c = '255, 255, 255';
    };

    Star.prototype.draw = function () {
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
    };

    Star.prototype.updatePosition = function () {
      var rad = this.y * Math.PI / 180;
      this.x -= Math.sin(rad) * 0.2;
      this.y -= this.v.y;
    };

    Star.prototype.wrapPosition = function() {
      if (this.x < 0 - this.r) this.x = X + this.r;
      if (this.x > X + this.r) this.x = 0 - this.r;
      if (this.y < 0 - this.r) this.y = Y + this.r;
      if (this.y > Y + this.r) this.y = 0 - this.r;
    };

    Star.prototype.gradient = function () {
      var col = this.c;
      var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, "rgba(" + col + ", " + (1 * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (1 * 0.2) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (1 * 0) + ")");
      return g;
    };

    Star.prototype.resize = function () {
      this.y = rand(0, Y);
      this.x = rand(X / 5 + X / 5, X / 5 * 3);
    };

    Star.prototype.render = function () {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < starNum; i++) {
      var star = new Star(ctx, rand(X / 5 + X / 5, X / 5 * 3), rand(0, Y), rand(1, 10));
      stars.push(star);
    }

    // render
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < stars.length; i++) {
        stars[i].render();
      }
      requestAnimationFrame(render);
    }

    render();

    // resize
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      for (var i = 0; i < stars.length; i++) {
        stars[i].resize();
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
