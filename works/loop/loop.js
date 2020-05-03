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
    var radius = 200;
    var lineWidth = 10;
    if (X < 768) {
      radius = 150;
      lineWidth = 10;
    } 
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
    
    function drawText() {
      ctx.save();
      ctx.fillStyle = 'skyblue';
      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowColor = 'skyblue';
      ctx.shadowBlur = Math.sin(i * Math.PI / 180) * 50;
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('You have to relax.', X / 2, Y / 2);
      ctx.restore();
      i += 0.2;
    }

    /********************
      Particle
    ********************/
    
    var particleNum = 360;
    var particles = [];

    function Particle(ctx, r, i) {
      this.ctx = ctx;
      this.init(r, i);
    }

    Particle.prototype.init = function(r, i) {
      this.x = X / 2 + Math.sin(i * Math.PI / 180) * radius;
      this.y = Y / 2 + Math.cos(i * Math.PI / 180) * radius;
      this.r = r;
      this.c = 'skyblue';
      this.l = rand(10, 20);
      this.v = {
        x: rand(-1, 1) * Math.random() / 2,
        y: rand(-1, 1) * Math.random() / 2
      };
    };

    Particle.prototype.updatePosition = function() {
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Particle.prototype.spreadParticle = function() {
      this.v = {
        x: rand(-5, 5) * Math.random(),
        y: rand(-5, 5) * Math.random()
      };
    };
    
    Particle.prototype.updateParams = function(i) {
      this.l -= 0.1;
      if (this.l < 0) {
        this.init(rand(1, 2), i);
      }
    };

    Particle.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = this.c;
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    Particle.prototype.render = function(i) {
      this.updatePosition();
      this.updateParams(i);
      this.draw();
    };
    
    for (var i = 0; i < particleNum; i++) {
      var particle = new Particle(ctx, rand(1, 2), i);
      particles.push(particle);
    }

    /********************
      Slime
    ********************/
    
    // var
    var slimeNum = 5;
    var slimes = [];
    var circleSplit = 24;
    var angleSplit = 360 / circleSplit;
     
    function Slime(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Slime.prototype.init = function(x, y, r) {
      this.a = rand(0, 360);
      this.x = x;
      this.y = y;
      this.c = {
        r: rand(0, 100),
        g: rand(200, 255),
        b: rand(200, 255)
      };
      this.r = r;
      this.v = 8;
      this.rad = this.a * Math.PI / 180;
      this.points = [];
      this.setPoints();
    };

    Slime.prototype.setPoints = function() {
      for (var i = 0; i < circleSplit; i++) {
        var pointX = Math.cos(this.rad) * this.r;
        var pointY = Math.sin(this.rad) * this.r;
        var point = [pointX, pointY, rand(0, 360)];
        this.points.push(point);
        this.rad = this.a * Math.PI / 180;
        this.a += angleSplit;
      }
    };

    Slime.prototype.draw = function() {
      ctx = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowColor = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.shadowBlur = 30;
      ctx.strokeStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      var xav1 = (this.points[0][0] + this.points[circleSplit - 1][0]) / 2 + this.x;
      var yav1 = (this.points[0][1] + this.points[circleSplit - 1][1]) / 2 + this.y;
      ctx.moveTo(xav1, yav1);
      for (var i = 1; i < this.points.length - 1; i++) {
        var xav2 = (this.points[i][0] + this.points[i + 1][0]) / 2;
        var yav2 = (this.points[i][1] + this.points[i + 1][1]) / 2;
        ctx.quadraticCurveTo(this.points[i][0] + this.x, this.points[i][1] + this.y, xav2 + this.x, yav2 + this.y);
      }
      ctx.quadraticCurveTo(this.points[circleSplit - 1][0] + this.x, this.points[circleSplit - 1][1] + this.y, xav1, yav1);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    Slime.prototype.transform = function() {
      for (var i = 0; i < this.points.length; i++) {
        this.points[i][0] -= Math.sin(this.points[i][2] * Math.PI / 180);
        this.points[i][1] -= Math.cos(this.points[i][2] * Math.PI / 180);
        this.points[i][2] -= this.v;
      }
    };

    Slime.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 2;
    };

    Slime.prototype.render = function() {
      this.transform();
      this.draw();
    };

    for (var i = 0; i < slimeNum; i++) {
      var slime = new Slime(ctx, X / 2, Y / 2, radius);
      slimes.push(slime);
    }

    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < 3; i++) {
        drawText();
      }
      for (var i = 0; i < particles.length; i++) {
        particles[i].render(i);
      }
      for (var i = 0; i < slimes.length; i++) {
        slimes[i].render(i);
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
      for (var i = 0; i < slimes.length; i++) {
        slimes[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    window.addEventListener('click', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      for (var i = 0; i < particles.length; i++) {
        particles[i].spreadParticle();
      }
    }, false);

  }); 
  // Author
  console.log('File Name / slime.js\nCreated Date / April 28, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
