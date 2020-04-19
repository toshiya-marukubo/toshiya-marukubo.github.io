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
    var mouseX = X / 2;
    var mouseY = Y / 2;

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
    var radius = X / 2;

    if (X < 768) {
      radius = X / 2;
    }

    function Moon(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Moon.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.c = '255, 255, 255';
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
      var moon = new Moon(ctx, 0, 0);
      moons.push(moon);
    }

    /********************
      Particle
    ********************/
    
    var particleNum = 2000;
    var particles = [];
    var maxParticles = 1;

    var colors = ['rgb(54, 38, 112)', 'rgb(98, 98, 159)', 'rgb(0, 137, 190)', 'rgb(0, 108, 154)'];

    if (X < 768) {
      particleNum = 1000;
    }

    function Particle(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Particle.prototype.init = function (x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.s = 0.1;
      this.ga = rand(0, 1) + 0.1;
      this.v = {
        x: 0,
        y: 0
      };
      /*
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(0, 255)
      };
      */
      this.c = colors[rand(0, colors.length - 1)];
    };

    Particle.prototype.closest = function(i){
      var x = this.x - mouseX;
      var y = this.y - mouseY;
      var d = x * x + y * y;
      var newDist = Math.sqrt(d);
      this.v.x = x / newDist * (1 + this.s);
      this.v.y = y / newDist * (1 + this.s);
      this.r += 0.05;
      this.x += this.v.x;
      this.y += this.v.y;
      if (Math.abs(this.x - mouseX) < 10 && Math.abs(this.y - mouseY) < 10) {
        this.x = rand(0, X);
        this.y = rand(0, Y);
        this.s = 0.1;
        this.r = 1;
      }
      if (this.x < 0 || this.x > X) {
        this.x = rand(0, X);
        this.s = 0.1;
        this.r = 1;
      }
      if (this.y < 0 || this.y > Y) {
        this.y = rand(0, Y);
        this.s = 0.1;
        this.r = 1;
      }
    };

    Particle.prototype.updateParams = function() {
      this.s += 0.05;
    };

    Particle.prototype.resize = function() {
      this.x = rand(0, X);
      this.y = rand(0, Y);
    };
    
    Particle.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = this.ga;
      ctx.fillStyle = this.c;
      ctx.globalCompositeOperation = 'lighter';
      //ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    Particle.prototype.render = function (i) {
      this.closest(i);
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < particleNum; i++) {
      var particle = new Particle(ctx, rand(0, X), rand(0, Y), 1);
      particles.push(particle);
    }
    
    /********************
      Text
    ********************/
    
    var text = 'Please holding down the mouse.';

    function drawText() {
      ctx.save();
      ctx.fillStyle = 'rgb(0, 137, 190)';
      ctx.font = '16px "sans-serif"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, X / 2, Y / 2);
    }

    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      moons[0].render();
      drawText();
      for (var i = 0; i < particles.length; i++) {
        particles[i].render(i);
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
      moons[0].render();
      for (var i = 0; i < particles.length; i++) {
        particles[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    var clearId;

    window.addEventListener('mousedown', function() {
      clearId = setInterval(function() {
        for (var i = 0; i < particles.length; i++) {
          particles[i].s += 1;
          particles[i].r += 2;
        }
        text = 'Warp';
        moons[0].r += 0.5;
      }, 20);
    });

    window.addEventListener('mouseup', function() {
      clearInterval(clearId);
      text = 'Please holding down the mouse.';
    });

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    window.addEventListener('touchstart', function(e) {
      var touch = event.targetTouches[0];
      mouseX = touch.pageX;
      mouseY = touch.pageY;
      clearId = setInterval(function() {
        for (var i = 0; i < particles.length; i++) {
          particles[i].s += 1;
          particles[i].r += 3;
        }
        text = 'Warp';
        moons[0].r += 0.5;
      }, 20);
    }, false);

    window.addEventListener('touchend', function(e) {
      clearInterval(clearId);
      text = 'Please holding down the mouse.';
    });

  });
  // Author
  console.log('File Name / goToTheMoon.js\nCreated Date / April 19, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
