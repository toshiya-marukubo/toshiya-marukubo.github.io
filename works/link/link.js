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
    
    var particleNum = 20;
    var particles = [];

    var colors = ['rgb(157, 195, 226)', 'rgb(157, 210, 216)', 'rgb(255, 181, 204)', 'rgb(226, 137, 219)'];

    if (X < 768) {
      particleNum = 10;
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
        x: rand(-2, 2) * Math.random() / 2,
        y: rand(-2, 2) * Math.random() / 2
      };
      this.c = {
        circle: colors[rand(0, colors.length - 1)],
        text: 'rgb(25, 149, 173)'
      };
      this.ga = Math.random();
    };

    Particle.prototype.draw = function (i) {
      var ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = this.ga;
      ctx.fillStyle = this.c.circle;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    Particle.prototype.updatePosition = function () {
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Particle.prototype.coll = function(i) {
      var j = i;
      for (var i = 0; i < particles.length; i++) {
        if (j !== i) {
          var a;
          var b;
          var c;
          var thatR = particles[i].r;
          var thatC = particles[i].c.circle;
          var sumRadius = this.r + thatR;
          a = this.x - particles[i].x;
          b = this.y - particles[i].y;
          c = a * a + b * b;
          if (c < sumRadius * sumRadius) {
            this.init(rand(0 + 80, X - 80), rand(0 + 80, Y - 80), rand(20, 50));
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
      this.x = rand(0 + 80, X - 80);
      this.y = rand(0 + 80, Y - 80);
    };

    Particle.prototype.render = function (i) {
      this.updatePosition();
      this.wrapPosition();
      //this.coll(i);
      this.draw(i);
    };
    
    for (var i = 0; i < particleNum; i++) {
      var particle = new Particle(ctx, X / 2, Y / 2, rand(50, 100));
      particles.push(particle);
    }
     
    function drawLine() {
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgb(161, 214, 226)';
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(particles[0].x, particles[0].y);
      for (var i = 0; i < particles.length; i++) {
        ctx.lineTo(particles[i].x, particles[i].y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < particles.length; i++) {
        particles[i].render(i);
      }
      drawLine();
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
      var num = rand(1, 20);
      for (var i = 0; i < num; i++) {
        var particle = new Particle(ctx, rand(mouseX - 50, mouseX + 50), rand(mouseY - 50, mouseY + 50), rand(50, 100));
        particles.push(particle);
      }
    }, false);

    window.addEventListener('touchmove', function(e) {
      if (e.targetTouches.length === 1) {
        var touch = event.targetTouches[0];
        mouseX = touch.pageX;
        mouseY = touch.pageY;
        var num = rand(1, 20);
        for (var i = 0; i < num; i++) {
          var particle = new Particle(ctx, rand(mouseX - 50, mouseX + 50), rand(mouseY - 50, mouseY + 50), rand(50, 100));
          particles.push(particle);
        }
      }
    }, false);

  });
  // Author
  console.log('File Name / link.js\nCreated Date / April 14, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
