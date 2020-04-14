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
    
    var particleNum = 2;
    var particles = [];

    if (X < 768) {
      particleNum = 2;
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
        x: rand(-2, 2) * Math.random() / 1.5,
        y: rand(-2, 2) * Math.random() / 1.5
      };
      this.c = {
        circle: 'rgb(161, 214, 226)',
        text: 'rgb(25, 149, 173)'
      };
      this.ga = Math.random();
    };

    Particle.prototype.draw = function () {
      var ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      //ctx.globalCompositeOperation = 'xor';
      ctx.globalAlpha = this.ga;
      ctx.fillStyle = this.c.circle;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.fillStyle = this.c.text;
      ctx.font = '8px "sans-serif"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('r:' + this.r, this.x, this.y, this.r * 2);
      ctx.restore();
    };

    Particle.prototype.updatePosition = function () {
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Particle.prototype.drawLines = function() {
      ctx.save();
      ctx.strokeStyle = 'rgb(161, 214, 226)';
      for (var i = 0; i < particles.length; i++) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(particles[i].x, particles[i].y);
        ctx.stroke();
      }
      ctx.restore();
    };

    Particle.prototype.distance = function(i) {
      var j = i;
      ctx.save();
      ctx.fillStyle = this.c.text;
      ctx.font = '8px "sans-serif"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (var i = 0; i < particles.length; i++) {
        if (j !== i) {
          var x = Math.abs(this.x - particles[i].x);
          var y = Math.abs(this.y - particles[i].y);
          var h = x * x + y * y;
          var distance = Math.floor(Math.sqrt(h));
          ctx.fillText(distance, this.x - (this.x - particles[i].x) / 2, this.y - (this.y - particles[i].y) / 2, this.r * 2);
        }
      }
      ctx.restore();
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
            particles.splice(j, 1);
          }
          if (c < sumRadius * sumRadius * 2) {
            this.v.x *= -1;
            this.v.y *= -1;
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
      this.coll(i);
      this.drawLines();
      this.distance(i);
      this.draw();
    };
    
    particles.push(new Particle(ctx, X / 2, Y / 3, rand(20, 50)));
    particles.push(new Particle(ctx, X / 2, Y - Y / 3, rand(20, 50)));
    
    /* 
    function drawLine() {
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgb(161, 214, 226)';
      ctx.beginPath();
      ctx.moveTo(particles[0].x, particles[0].y);
      for (var i = 0; i < particles.length; i++) {
        ctx.lineTo(particles[i].x, particles[i].y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
    */

    function drawText() {
      ctx.save();
      ctx.fillStyle = 'rgb(25, 149, 173)';
      ctx.font = '16px "sans-serif"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Please click vacant space.', X / 2, Y / 2);
    }

    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < particles.length; i++) {
        particles[i].render(i);
      }
      //drawLine();
      drawText();
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
      var particle = new Particle(ctx, mouseX, mouseY, rand(20, 50));
      particles.push(particle);
    }, false);

    window.addEventListener('touchmove', function(e) {
      if (e.targetTouches.length === 1) {
        var touch = event.targetTouches[0];
        mouseX = touch.pageX;
        mouseY = touch.pageY;
        var particle = new Particle(ctx, mouseX, mouseY, rand(20, 50));
        particles.push(particle);
      }
    }, false);

  });
  // Author
  console.log('File Name / socialDistance.js\nCreated Date / April 13, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
