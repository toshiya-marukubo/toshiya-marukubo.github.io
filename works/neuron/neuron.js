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

    var mouseX = null;
    var mouseY = null;

    /********************
      Particle
    ********************/
    
    var particleNum = 150;
    var particles = [];

    if (X < 768) {
      particleNum = 30;
    }

    function Particle(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Particle.prototype.init = function(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.a = rand(0, 360);
      this.rad = this.a * Math.PI / 180;
      this.v = {
        x: rand(-5, 5),
        y: rand(-5, 5),
      };
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(0, 255)
      };
      this.g = 1;
    };

    Particle.prototype.draw = function(i) {
      var ctx = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    Particle.prototype.updatePosition = function() {
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Particle.prototype.nearParticle = function(i) {
      var j = i;
      for (var i = 0; i < particles.length; i++) {
        if (j !== i) {
          var x = this.x - particles[i].x;
          var y = this.y - particles[i].y;
          var d = x * x + y * y;
          var dist = Math.floor(Math.sqrt(d));
          if (dist < 100) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.strokeStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.stroke();
            ctx.restore();
            this.v.x = - x / dist;
            this.v.y = - y / dist; 
            this.x = Math.sin(this.rad) * this.g + this.x;
            this.y = Math.cos(this.rad) * this.g + this.y;
            this.x -= this.v.x / 2;
            this.y -= this.v.y / 2;
            this.rad += 0.01;
          }
          if (dist < 2) {
            this.init(rand(0, X), rand(0, Y), 5);
          }
        }
      }
    };

    Particle.prototype.wrapPosition = function() {
      if (this.x + this.r < 0) {
        this.x = X + this.r;
      }
      if (this.x - this.r > X) {
        this.x = 0 - this.r;
      }
      if (this.y + this.r < 0) {
        this.y = Y + this.r;
      }
      if (this.y - this.r > Y) {
        this.y = 0 - this.r;
      }
    };

    Particle.prototype.resize = function () {
      this.x = rand(0, X);
      this.y = rand(0, Y);
    };

    Particle.prototype.render = function (i) {
      this.updatePosition();
      this.nearParticle(i);
      this.wrapPosition();
      this.draw();
    };
    
    for (var i = 0; i < particleNum; i++) {
      var particle = new Particle(ctx, rand(0, X), rand(0, Y), 5);
      particles.push(particle);
    }
     
    /********************
      Render
    ********************/
    
    function render() {
      //ctx.clearRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "darken";
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;      
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
      for (var i = 0; i < particles.length; i++) {
        particles[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    window.addEventListener('click', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      var num = rand(5, 20);
      for (var i = 0; i < num; i++) {
        var particle = new Particle(ctx, mouseX, mouseY, 5);
        particles.push(particle);
      }
    }, false);

  });
  // Author
  console.log('File Name / neuron.js\nCreated Date / May 03, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
