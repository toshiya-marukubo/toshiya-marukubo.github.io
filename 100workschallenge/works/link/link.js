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
    var colors = ['rgb(157, 195, 226)', 'rgb(157, 210, 216)', 'rgb(255, 181, 204)', 'rgb(226, 137, 219)'];

    if (X < 768) {
      particleNum = 50;
    }

    function Particle(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }
    Particle.prototype.init = function(x, y, r) {
      this.x = x;
      this.y = y;
      this.x1 = this.x;
      this.y1 = this.y;
      this.r = r;
      this.v = {
        x: rand(-2, 2) * Math.random(),
        y: rand(-2, 2) * Math.random()
      };
      this.c = {
        circle: colors[rand(0, colors.length - 1)],
      };
    };
    Particle.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.c.circle;
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
            ctx.globalAlpha = 0.3;
            ctx.strokeStyle = 'rgb(161, 214, 226)';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
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
      this.x = rand(0 + 5, X - 5);
      this.y = rand(0 + 5, Y - 5);
    };
    Particle.prototype.render = function (i) {
      this.updatePosition();
      this.wrapPosition();
      this.nearParticle(i);
      this.draw();
    };
    
    for (var i = 0; i < particleNum; i++) {
      var particle = new Particle(ctx, rand(0 + 5, X - 5), rand(0 + 5, Y - 5), 5);
      particles.push(particle);
    }
     
    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
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

    canvas.addEventListener('click', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      var num = rand(1, 10);
      for (var i = 0; i < num; i++) {
        var particle = new Particle(ctx, rand(mouseX - 5, mouseX + 5), rand(mouseY - 5, mouseY + 5), 5);
        particles.push(particle);
      }
    }, false);

  });
  // Author
  console.log('File Name / link.js\nCreated Date / April 14, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
