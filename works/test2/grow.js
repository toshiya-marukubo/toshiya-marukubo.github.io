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
    var maxParticles = 1;

    if (X < 768) {
      particleNum = 1;
    }

    function Particle(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Particle.prototype.init = function (x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.v = {
        x: 0,
        y: 0
      };
      /*
      this.c = {
        r: rand(0, 0),
        g: rand(0, 0),
        b: rand(0, 0)
      };
      /*/
      this.c = 'black';
    };

    Particle.prototype.closest = function(i){
      /*
      var j = i;
      var dist = Number.MAX_VALUE;
      var closestI = 0;
      for (var i = 0; i < particles.length; i++) {
        if (j != i) {
          var x = Math.abs(this.x - particles[i].x);
          var y = Math.abs(this.y - particles[i].y);
          var d = x * x + y * y;
          var newDist = Math.floor(Math.sqrt(d));
          if (newDist < dist) {
            dist = newDist;
            closestI = i;
          }
        }
      }
      var x = particles[closestI].x - this.x;
      var y = particles[closestI].y - this.y;
      */
      var x = this.x - X / 2;
      var y = this.y - Y / 2;
      var d = x * x + y * y;
      var newDist = Math.sqrt(d);
      this.v.x = x / newDist * 1;
      this.v.y = y / newDist * 1;
      this.x -= this.v.x;
      this.y -= this.v.y;
      /*
      if (Math.abs(this.x - particles[closestI].x) < this.r + particles[closestI].r && Math.abs(this.y - particles[closestI].y) < this.r + particles[closestI].r) {
        this.v.x = 0;
        this.v.y = 0;
        } else {
        this.x += this.v.x;
        this.y += this.v.y;
      }
      */
    };
    
    Particle.prototype.draw = function () {
      var ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      //ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.fillStyle = this.c;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    Particle.prototype.render = function (i) {
      this.closest(i);
      this.draw();
    };

    for (var i = 0; i < particleNum; i++) {
      var particle = new Particle(ctx, rand(0, X), rand(0, Y), rand(5, 10));
      particles.push(particle);
    }
    
    function addParticle() {
      var particle = new Particle(ctx, rand(0, X), rand(0, Y), rand(5, 10));
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
      //addParticle();
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
    window.addEventListener('click', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      var particle = new Particle(ctx, mouseX, mouseY, rand(5, 20));
      particles.push(particle);
    }, false);

    window.addEventListener('resize', function() {
      onResize();
    });

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      var particle = new Particle(ctx, mouseX, mouseY, rand(1, 5));
      particles.push(particle);
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
  console.log('File Name / grow.js\nCreated Date / April 17, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
