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

    /********************
      Star
    ********************/
    
    // star
    var starNum = 200;
    var stars = [];
    var brightNum = 50;

    function Star(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Star.prototype.init = function (x, y, r) {
      this.x = x || 0;
      this.y = y || 0;
      this.c = '255, 255, 255';
      this.r = r || Math.random() * 8;
    };

    Star.prototype.draw = function () {
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      ctx.fill();
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
      this.x = rand(0, X);
      this.y = rand(0, Y);
    };

    Star.prototype.reradius = function () {
      this.r = Math.random() * 3;
    }

    Star.prototype.render = function () {
      this.draw();
    };

    for (var i = 0; i < starNum; i++) {
      var particle = new Star(ctx, rand(0, X), rand(0, Y), rand(0, 8));
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
