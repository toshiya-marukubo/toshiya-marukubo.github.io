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

    // fire
    var fireNum = 50;
    var fires = [];

    var sizeMax = document.getElementById('sizeMax');
    var colorR = document.getElementById('colorR');
    var colorG = document.getElementById('colorG');
    var colorB = document.getElementById('colorB');

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

    function Fire(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Fire.prototype.init = function(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.l = rand(50, 100);
      this.startLife = this.l;
      this.v = {
        x: rand(-0.1, 0.1) * Math.random(),
        y: rand(1, 5)
      };
      this.c = {
        r: rand(0, Number(colorR.value)),
        g: rand(0, Number(colorG.value)),
        b: rand(0, Number(colorB.value)),
        a: 1
      };
    };

    Fire.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
    };

    Fire.prototype.updateParams = function() {
      this.l -= 1;
      if (this.l < 0) {
        this.l = this.startLife;
        this.r = rand(1, Number(sizeMax.value));
        this.c.r = rand(0, Number(colorR.value));
        this.c.g = rand(0, Number(colorG.value));
        this.c.b = rand(0, Number(colorB.value));
        this.y = Y - Y / 5;
        this.x = X / 2;
      }
    };

    Fire.prototype.updatePosition = function() {
      this.x += this.v.x;
      this.y -= this.v.y;
    };

    Fire.prototype.gradient = function() {
      var col = this.c.r + "," + this.c.g + "," + this.c.b;
      var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, "rgba(" + col + ", " + (this.c.a * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (this.c.a * 0.3) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (this.c.a * 0) + ")");
      return g;
    };

    Fire.prototype.resize = function() {
      this.x = X / 2;
    };

    Fire.prototype.render = function() {
      this.updatePosition();
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < fireNum; i++) {
      var fire = new Fire(ctx, X / 2, Y - Y / 5, rand(1, Number(sizeMax.value)));
      fires.push(fire);
    }

    // render
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < fires.length; i++) {
        fires[i].render();
      }
      requestAnimationFrame(render);
    }

    render();

    // resize
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      for (var i = 0; i < fires.length; i++) {
        fires[i].resize();
      }
    }

    /********************
      Event
    ********************/

    window.addEventListener('resize', function() {
      onResize();
    });

    /********************
      Menu
    ********************/

    var openController = document.getElementById('openController');
    var closeController = document.getElementById('closeController');
    var controller = document.getElementById('controller');

    openController.addEventListener('click', function(e) {
      e.preventDefault();
      controller.style.display = 'block';
    }, false);

    closeController.addEventListener('click', function(e) {
      e.preventDefault();
      controller.style.display = 'none';
    }, false);

  });
  // Author
  console.log('File Name / fireball.js\nCreated Date / January 11, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
