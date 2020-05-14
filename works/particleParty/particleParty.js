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

    var flg = true;
    var mouseX = null;
    var mouseY = null;

    /********************
      Particle
    ********************/
    
    var particleNum = 500;
    var particles = [];

    if (X < 768) {
      particleNum = 250;
    }

    function Particle(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Particle.prototype.init = function (x, y, r) {
      this.x = x;
      this.y = y;
      this.x1 = this.x;
      this.y1 = this.y;
      this.r = r;
      this.v = {
        x: rand(-10, 10) * Math.random() * 0.5,
        y: rand(-10, 10) * Math.random() * 0.5
      };
      this.c = {
        r: rand(128, 255),
        g: rand(128, 255),
        b: rand(128, 255)
      };
    };

    Particle.prototype.draw = function () {
      var ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    Particle.prototype.updatePosition = function () {
      if (mouseX !== null) {
        if (flg) {
          var angle = Math.atan2(this.y1 - mouseY, this.x1 -  mouseX);
          this.x -= Math.cos(angle) * 5;
          this.y -= Math.sin(angle) * 5;
          this.x1 = this.x;
          this.y1 = this.y;
        }
      }
      this.x += this.v.x;
      this.y += this.v.y;
    };
   
    Particle.prototype.wrapPosition = function() {
      if (this.x - this.r < 0) {
        this.v.x *= -1;
      }
      if (this.x + this.r > X) {
        this.v.x *= -1;
      }
      if (this.y - this.r < 0) {
        this.v.y *= -1;
      }
      if (this.y + this.r > Y) {
        this.v.y *= -1;
      }
    };

    Particle.prototype.resize = function () {
      this.x = rand(0, X);
      this.y = rand(0, Y);
    };

    Particle.prototype.render = function () {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < particleNum; i++) {
      var particle = new Particle(ctx, rand(0, X), rand(0, Y), rand(1, 20));
      particles.push(particle);
    }
    
    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < particles.length; i++) {
        particles[i].render();
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
      for (var i = 0; i < particles.length; i++) {
        particles[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    canvas.addEventListener('click', function(e) {
      if (flg) {
        flg = false;
      } else {
        flg = true;
      }
    }, false);

    canvas.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

  });
  // Author
  console.log('File Name / particleParty.js\nCreated Date / February 20, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
