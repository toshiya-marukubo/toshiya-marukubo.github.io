(function() {
  'use strict';
  window.addEventListener('load', function() {
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
    var ease = 0.2;
    var friction = 0.9;
    var flg = false;
    var radius = 300;
     
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

    if (X < 768) {
      particleNum = 1;
    }

    function Particle(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }
    Particle.prototype.init = function(x, y) {
      this.a = rand(0, 360);
      this.rad = this.a * Math.PI / 180;
      this.x = x;
      this.y = y;
      this.x1 = this.x;
      this.y1 = this.y;
      this.r = rand(5, 10);
      this.v = {
        x: 0,
        y: 0
      };
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(200, 255)
      };
    };
    Particle.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };
    var mouseX1;
    var mouseY1;
    Particle.prototype.updatePosition = function(i) {
      this.v.x += (mouseX1 - this.x) * ease;
      this.v.y += (mouseY1 - this.y) * ease;
      this.v.x *= friction;
      this.v.y *= friction;
      this.x += this.v.x;
      this.y += this.v.y;
    };
    Particle.prototype.returnPosition = function() {
      this.v.x += (this.x1 - this.x) * ease;
      this.v.y += (this.y1 - this.y) * ease;
      this.v.x *= friction;
      this.v.y *= friction;
      this.x += this.v.x;
      this.y += this.v.y;
    };
    Particle.prototype.resize =function() {
      this.x = rand(0, X);
      this.y = rand(0, Y);
      this.x1 = this.x;
      this.y1 = this.y;
    };
    Particle.prototype.render = function(i) {
      if (flg === true) this.updatePosition(i);
      this.draw();
    };

    for (var i = 0; i < particleNum; i++) {
      var particle = new Particle(ctx, rand(0, X), rand(0, Y));
      particles.push(particle);
    }

    /********************
      Render
    ********************/
    
    function render(){
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
      X < 768 ? particleNum = 100 : particleNum = 200;
      particles = [];
      for (var i = 0; i < particleNum; i++) {
        var particle = new Particle(ctx, rand(0, X), rand(0, Y));
        particles.push(particle);
      }
      for (var i = 0; i < particles.length; i++) {
        particles[i].resize();
      }
    }
    window.addEventListener('resize', function() {
      onResize();
    });
    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    window.addEventListener('mousedown', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      flg = false;
    });
    window.addEventListener('mouseup', function(e) {
      mouseX1 = e.clientX;
      mouseY1 = e.clientY;
      flg = true;
    });
    window.addEventListener('click', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

  }); 
  // Author
  console.log('File Name / springBubble.js\nCreated Date / May 13, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();