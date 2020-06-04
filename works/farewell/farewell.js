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

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    var ferrisWheels = [];
    var ferrisWheelNum = 1;
    var splitNum = 16;
    var splitAn = 360 / splitNum;
    var wheelRadius = 200;
    var baloonMax = 100;

    if (X < 768) {
      wheelRadius = 130;
      baloonMax = 50;
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
      FerrisWheel
    ********************/
    
    function FerrisWheel(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    FerrisWheel.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.r = wheelRadius;
      this.lw = 8;
      this.a = 45;
      this.rad = this.a * Math.PI / 180; 
      this.v = {
        x: 0,
        y: 0
      };
      this.c = {
        r: rand(1, 1),
        g: rand(1, 1),
        b: rand(1, 1)
      };
    };

    FerrisWheel.prototype.draw = function() {
      var ctx  = this.ctx;
      // base
      ctx.save();
      ctx.lineWidth = this.lw;
      ctx.strokeStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.r, Y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.r, Y);
      ctx.stroke();
      ctx.restore();
      // circle
      ctx.save();
      ctx.lineWidth = this.lw;
      ctx.strokeStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      for (var i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * i, 0, Math.PI * 2, false);
        ctx.stroke();
      }
      ctx.restore();
      // pillar
      ctx.save();
      ctx.lineWidth = this.lw;
      ctx.strokeStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rad);
      ctx.translate(-this.x, -this.y);
      for (var i = 0; i < splitNum; i++) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(Math.cos(splitAn * Math.PI / 180 * i) * this.r * 3 + this.x, Math.sin(splitAn * Math.PI / 180 * i) * this.r * 3 + this.y);
        ctx.stroke();
      }
      ctx.restore();
      // gondola
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rad);
      ctx.translate(-this.x, -this.y);
      for (var i = 0; i < splitNum; i++) {
        ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
        ctx.beginPath();
        ctx.arc(Math.cos(splitAn * Math.PI / 180 * i) * this.r * 3 + this.x, Math.sin(splitAn * Math.PI / 180 * i) * this.r * 3 + this.y, this.r / 3, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = 'rgb(' + this.c.r * 50 + ', ' + this.c.g * 50 + ', ' + this.c.b * 50 + ')';
        ctx.beginPath();
        ctx.arc(Math.cos(splitAn * Math.PI / 180 * i) * this.r * 3 + this.x, Math.sin(splitAn * Math.PI / 180 * i) * this.r * 3 + this.y, this.r / 4, Math.PI - this.rad, 0 - this.rad, false);
        ctx.fill();
      }
      ctx.restore();
    };

    FerrisWheel.prototype.updateParams = function() {
      this.a += 0.1;
      this.rad = this.a * Math.PI / 180;
    };

    FerrisWheel.prototype.render = function() {
      this.updateParams();
      this.draw();
    };
    
    for (var i = 0; i < ferrisWheelNum; i++) {
      var f = new FerrisWheel(ctx, X - X / 4, Y / 2);
      ferrisWheels.push(f);
    }

    /********************
      Particle
    ********************/
    
    var particleNum = 6;
    var particles = [];

    if (X < 768) {
      particleNum = 3;
    }

    function Particle(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Particle.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.r = rand(30, baloonMax);
      this.a = rand(0, 360);
      this.rad = this.a * Math.PI / 180;
      this.v = {
        x: 0,
        y: Math.random() * 2 + 0.2,
      };
      this.c = {
        r: rand(0, 50),
        g: rand(0, 50),
        b: rand(0, 50)
      };
      this.l = this.r * 1.5;
    };

    Particle.prototype.draw = function() {
      var ctx = this.ctx;
      // body
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = 'black';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = this.r / 30;
      ctx.beginPath();
      ctx.translate(this.x, this.y);
      ctx.scale(1, 1.3);
      ctx.translate(-this.x, -this.y);
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.beginPath();
      ctx.rect(this.x - this.r / 5 / 2, this.y + this.r - this.r / 20, this.r / 5, this.r / 10);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + this.r);
      ctx.quadraticCurveTo(Math.cos(this.rad) * 5 + this.x, Math.sin(this.rad) * 5 + this.y + this.r + this.l / 3, this.x, this.y + this.r + this.l);
      ctx.stroke();
      ctx.restore();
    };

    Particle.prototype.updateParams = function() {
      this.a += 0.5;
      this.rad = this.a * Math.PI / 180;
    };

    Particle.prototype.updatePosition = function() {
      this.y -= this.v.y;
    };

    Particle.prototype.wrapPosition = function() {
      if ((this.y + this.r + this.r + this.l) < 0) this.init(rand(0, X / 2), Y + this.r + this.r);
    };

    Particle.prototype.render = function(i) {
      this.updatePosition();
      this.wrapPosition();
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < particleNum; i++) {
      var particle = new Particle(ctx, rand(0, X / 2), rand(0, Y));
      particles.push(particle);
    }

    /********************
      Render
    ********************/
   
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < ferrisWheels.length; i++) {
        ferrisWheels[i].render();
      }
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

      if (X < 768) {
        wheelRadius = 130;
        baloonMax = 50;
        particleNum = 3;
      } else {
        wheelRadius = 200;
        baloonMax = 100;
        particleNum = 6;
      }
      ferrisWheels = [];
      for (var i = 0; i < ferrisWheelNum; i++) {
        var f = new FerrisWheel(ctx, X - X / 4, Y / 2, i);
        ferrisWheels.push(f);
      }
      particles = [];
      for (var i = 0; i < particleNum; i++) {
        var particle = new Particle(ctx, rand(0, X / 2), rand(0, Y));
        particles.push(particle);
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });
    
    canvas.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    canvas.addEventListener('wheel', function(e){
      for (var i = 0; i < ferrisWheels.length; i++) {
        if (ferrisWheels[i].r > 100) {
          ferrisWheels[i].r += e.deltaY / 100;
          ferrisWheels[i].lw += e.deltaY / 1000;
        }
        if (ferrisWheels[i].r < 100) {
          ferrisWheels[i].r -= e.deltaY / 100;
          ferrisWheels[i].lw -= e.deltaY / 1000;
        }
      }
      for (var i = 0; i < particles.length; i++) {
        if (particles[i].r > 30) {
          particles[i].r += e.deltaY / 100;
          particles[i].l += e.deltaY / 100;
        }
        if (particles[i].r < 30) {
          particles[i].r -= e.deltaY / 100;
          particles[i].l -= e.deltaY / 100;
        }
      }
    });

    canvas.addEventListener('click', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      var particle = new Particle(ctx, mouseX, mouseY);
      particles.push(particle);
    }, false);

  });
  // Author
  console.log('File Name / farewell.js\nCreated Date / Jun 04, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
