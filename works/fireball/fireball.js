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
    var fireNum = 100;
    var fires = [];
    var lifeMax = 150;

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

    function Fire(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Fire.prototype.init = function (x, y) {
      this.ctx = ctx;
      this.x = x || 0;
      this.y = y || 0;
      this.v = {
        x: rand(-0.1, 0.1),
        y: rand(1, 5)
      };
      this.color = {
        r: rand(102, 255),
        g: rand(0, 128),
        b: rand(0, 0),
        a: 1
      };
      this.radius = rand(50, 70) || 0;
      this.startLife = Math.ceil(lifeMax * Math.random());
      this.life = this.startLife;
      this.stoLife = this.startLife;
    };

    Fire.prototype.draw = function () {
      ctx = this.ctx;
      ctx.beginPath();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    };

    Fire.prototype.updateParams = function() {
      this.life -= 1;
      if (this.life === 0) {
        //this.init(Math.random() * X / 9 + X / 9 * 4, Math.random() * Y / 9 + Y / 9 * 7, this.radius - 1);
        this.life = this.stoLife;
        this.y = Math.ceil(Math.random() * Y / 9 + Y / 9 * 7);
        this.x = Math.random() * X / 9 + X / 9 * 4;;
      }
    };

    Fire.prototype.updatePosition = function () {
      this.x += this.v.x;
      this.y -= this.v.y;
    };

    Fire.prototype.gradient = function () {
      var col = this.color.r + "," + this.color.g + "," + this.color.b;
      var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      g.addColorStop(0, "rgba(" + col + ", " + (this.color.a * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (this.color.a * 0.3) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (this.color.a * 0) + ")");
      return g;
    };

    Fire.prototype.resize = function () {
      this.x = Math.random() * X / 9 + X / 9 * 4;
    };

    Fire.prototype.render = function () {
      this.updatePosition();
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < fireNum; i++) {
      var positionX = Math.random() * X / 9 + X / 9 * 4;
      var positionY = Math.random() * Y / 9 + Y / 9 * 7;
      var fire = new Fire(ctx, positionX, positionY);
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

    window.addEventListener('resize', function () {
      onResize();
    });

  });
  // Author
  console.log('File Name / fireball.js\nCreated Date / January 11, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
