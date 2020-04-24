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
    var flg = true;
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
      Particle
    ********************/
    
    var particleNum = 300;
    var particles = [];

    if (X < 768) {
      particleNum = 150;
    }

    function Particle(ctx, character, x, y, r) {
      this.ctx = ctx;
      this.init(character, x, y, r);
    }

    Particle.prototype.init = function(character, x, y, r) {
      this.character = character;
      this.x = x;
      this.y = y;
      this.x1 = this.x;
      this.y1 = this.y;
      this.r = r;
      this.s = Math.random();
      this.a = rand(0, 360);
      this.a1 = 0;
      this.rotate = true;
      this.rad = this.a * Math.PI / 180;
      this.z = Math.random() + 1;
      this.v = {
        x: 0,
        y: 0
      };
      this.c = {
        r: rand(0, 0),
        g: rand(255, 255),
        b: rand(255, 255)
      };
    };

    Particle.prototype.updatePosition = function() {
      if (flg === false) { 
        var x = this.x - this.x1;
        var y = this.y - this.y1;
        if (Math.abs(x) < 10 && Math.abs(y) < 10) {
          this.v.x = 0;
          this.v.y = 0;
          this.s = Math.random();
          this.r = 50;
          this.rotate = false;
        } else {
          var d = x * x + y * y;
          var newDist = Math.sqrt(d);
          this.v.x = x / newDist * (5 + this.s);
          this.v.y = y / newDist * (5 + this.s);
          //this.x = Math.sin(this.rad) * 2 + this.x;
          //this.y = Math.cos(this.rad) * 2 + this.y;
          this.x -= this.v.x;
          this.y -= this.v.y;
        }
      } else {
        var x = this.x - mouseX;
        var y = this.y - mouseY;
        var d = x * x + y * y;
        var newDist = Math.sqrt(d);
        this.v.x = x / newDist * (2 + this.s);
        this.v.y = y / newDist * (2 + this.s);
        this.x = Math.sin(this.rad) * this.z + this.x;
        this.y = Math.cos(this.rad) * this.z + this.y;
        this.x -= this.v.x;
        this.y -= this.v.y;
        if (Math.abs(this.x - mouseX) < 5 && Math.abs(this.y - mouseY) < 5) {
          this.x = rand(0, X);
          this.y = rand(0, Y);
          this.s = Math.random();
        }
      }
    };

    Particle.prototype.updateParams = function() {
      this.s += 0.001;
      this.rad += 0.01;
      this.a1 -= 1;
    };
    
    Particle.prototype.resize = function() {
      this.x = rand(0, X);
      this.y = rand(0, Y);
      this.x1 = this.x;
      this.y1 = this.y;
    };
    
    Particle.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      if (this.rotate === true) {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.a1 * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
      }
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.font = this.r + 'px sans';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.character, this.x, this.y);
      ctx.restore();
    };

    Particle.prototype.render = function() {
      this.updatePosition();
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < particleNum; i++) {
      var character = String.fromCharCode(20000 + Math.random() * 33);
      var particle = new Particle(ctx, character, rand(0, X), rand(0, Y), rand(10, 30));
      particles.push(particle);
    }
    
    function changeColor() {
      var time = rand(1000, 5000);
      var r = rand(0, 255);
      var g = rand(0, 255);
      var b = rand(0, 255);
      for (var i = 0; i < particles.length; i++) {
        particles[i].c  = {
          r: r,
          g: g,
          b: b
        };
      }
      setTimeout(changeColor, time);
    }

    changeColor();

    /********************
      Render
    ********************/
    
    function render() {
      //ctx.clearRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "darken";
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
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

    window.addEventListener('resize', function() {
      onResize();
    });

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    window.addEventListener('click', function() {
      flg === false ? flg = true : flg = false;
      for (var i = 0; i < particles.length; i++) {
        if (particles[i].rotate === false) {
          particles[i].rotate = true;
          particles[i].r = rand(10, 30);
        }
      }
    }, false);

    window.addEventListener('touchmove', function(e) {
      var touch = event.targetTouches[0];
      mouseX = touch.pageX;
      mouseY = touch.pageY;
      flg === false ? flg = true : flg = false;
      for (var i = 0; i < particles.length; i++) {
        if (particles[i].rotate === false) {
          particles[i].rotate = true;
          particles[i].r = rand(10, 30);
        }
      }
    }, false);

  });
  // Author
  console.log('File Name / simulationVer2.js\nCreated Date / April 24, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
