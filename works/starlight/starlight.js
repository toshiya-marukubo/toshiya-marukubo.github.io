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

    // star
    var starNum = 200;
    var stars = [];
    var brightNum = 50;

    /********************
      Star
    ********************/

    function Particle(ctx, x, y, radius) {
      this.ctx = ctx;
      this.init(x, y, radius);
    }

    Particle.prototype.init = function (x, y, radius) {
      this.ctx = ctx;
      this.x = x || 0;
      this.y = y || 0;
      this.color = '255, 255, 255';
      this.radius = radius || Math.random() * 8;
    };

    Particle.prototype.draw = function () {
      ctx = this.ctx;
      ctx.globalCompositeOperation = "lighten";
      ctx.beginPath();
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
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
      this.x = rand(0, X);
      this.y = rand(0, Y);
    };

    Particle.prototype.reradius = function () {
      this.radius = Math.random() * 3;
    }

    Particle.prototype.render = function () {
      this.draw();
    };

    for (var i = 0; i < starNum; i++) {
      var positionX = Math.random() * X;
      var positionY = Math.random() * Y;
      var radius = Math.random() * 8;
      var particle = new Particle(ctx, positionX, positionY, radius);
      stars.push(particle);
    }

    // render
    function render() {
      for (var i = 0; i < stars.length; i++) {
        stars[i].render();
      }
      var time = rand(10, 100);
      setTimeout(function() {
        ctx.clearRect(0, 0, X, Y);
        for (var i = 0; i < brightNum; i++) {
          stars[i].reradius();
        } 
        render();
      }, time);
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
      render();
    });

  });
  // Author
  console.log('File Name / starlight.js\nCreated Date / January 9, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
