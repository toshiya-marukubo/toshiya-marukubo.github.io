(function () {
  'use strict';
  window.addEventListener('load', function () {
    var canvas = document.getElementById('canvas');
    var canvasBack = document.getElementById('canvasBack');

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
    var ctxBack = canvasBack.getContext('2d');
    var X = canvas.width = canvasBack.width = window.innerWidth;
    var Y = canvas.height = canvasBack.height = window.innerHeight / 2;

    var mouseX = null;
    var mouseY = null;

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
      Particle
    ********************/
    
    var particleNum = 1;
    var particles = [];
    var maxParticles = 400;

    if (X < 768) {
      maxParticles = 100;
    }

    function Particle(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Particle.prototype.init = function (x, y, r) {
      this.x = x;
      this.y = y;
      this.bX = this.x;
      this.bY = this.y;
      this.r = r;
      this.c = {
        r: rand(0, 255),
        g: rand(128, 255),
        b: rand(128, 255)
      };
      this.v = {
        x: rand(-1, 1),
        y: rand(-5, 1)
      };
      this.ga = Math.random() + 0.1;
    };

    function addCircle() {
      var newX = rand(0, X);
      var newY = rand(0, Y);
      var newR = rand(5, 10);
      var dist = Number.MAX_VALUE;
      var closestI = 0;
      for (var i = 0; i < particles.length; i++) {
        var x = Math.abs(newX - particles[i].x);
        var y = Math.abs(newY - particles[i].y);
        var d = x * x + y * y;
        var newDist = Math.floor(Math.sqrt(d));
        if (newDist < dist) {
          dist = newDist;
          closestI = i;
        }
      }
      var angle = Math.atan2(newY - particles[closestI].y, newX - particles[closestI].x);
      newX = particles[closestI].x + Math.cos(angle) * (particles[closestI].r + newR);
      newY = particles[closestI].y + Math.sin(angle) * (particles[closestI].r + newR);
      var particle = new Particle(ctx, newX, newY, newR);
      particles.push(particle);
    }

    Particle.prototype.updatePosition = function() {
      this.v.y += 0.1;
      this.x += this.v.x;
      this.y += this.v.y;
      if (this.y > Y - this.r) {
        this.v.y *= -0.5;
        this.y = Y - this.r;
      }
    };

    Particle.prototype.draw = function () {
      var ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = this.ga;
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    Particle.prototype.render = function () {
      if (particles.length >= maxParticles) {
        this.updatePosition();
      }
      this.draw();
    };

    for (var i = 0; i < particleNum; i++) {
      var particle = new Particle(ctx, X / 2, Y / 2, rand(5, 10));
      particles.push(particle);
    }
   
    ctxBack.translate(X, Y);
    ctxBack.rotate(180 / 180 * Math.PI);
    
    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      ctxBack.clearRect(0, 0, X, Y);
      for (var i = 0; i < particles.length; i++) {
        particles[i].render(i);
      }
      if (particles.length < maxParticles) {
        addCircle();
      }
      if (canvas.height !== 0) {
        ctxBack.drawImage(canvas, 0, 0);
      }
      requestAnimationFrame(render);
    }
    
    render();

    /********************
      Event
    ********************/
    
    function onResize() {
      X = canvas.width = canvasBack.width = window.innerWidth;
      Y = canvas.height = canvasBack.height = window.innerHeight / 2;
      ctxBack.translate(X, Y);
      ctxBack.rotate(180 / 180 * Math.PI);
    }

    window.addEventListener('click', function() {
      particles = [];
      for (var i = 0; i < particleNum; i++) {
        var particle = new Particle(ctx, X / 2, Y / 2, rand(5, 10));
        particles.push(particle);
      }
    }, false);
    
    window.addEventListener('resize', function() {
      onResize();
    });

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    window.addEventListener('touchmove', function(e) {
      if (e.targetTouches.length === 1) {
        var touch = event.targetTouches[0];
        mouseX = touch.pageX;
        mouseY = touch.pageY;
      }
    }, false);

  });
  // Author
  console.log('File Name / cell.js\nCreated Date / April 17, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
