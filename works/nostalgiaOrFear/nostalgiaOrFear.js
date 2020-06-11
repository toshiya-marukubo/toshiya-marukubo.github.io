(function () {
  'use strict';
  window.addEventListener('load', function () {
    var canvas = document.getElementById('canvas');
    var canvasNoise = document.getElementById('canvasNoise');

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
    var ctxNoise = canvasNoise.getContext('2d');
    var X = canvas.width = canvasNoise.width = window.innerWidth;
    var Y = canvas.height = canvasNoise.height  = window.innerHeight;
    var num = 1;
    var random = Math.random;
    var mouseX = null;
    var mouseY = null;
    var size = 80;

    if (X < 768) {
      size = 60;
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
      Noise
    ********************/
    
    function createNoise() {
      var imageData = ctxNoise.createImageData(X, Y);
      var dataArr = imageData.data;
      for (var i = 0; i < dataArr.length; i += num) {
        dataArr[i] = 255 * random();
      }
      ctxNoise.putImageData(imageData, 0, 0);
    }
    /********************
      Particle
    ********************/
    
    var particleNum = 1;
    var particles = [];

    function Particle(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Particle.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.r = size;
      this.a = 0;
      this.rad = this.a * Math.PI / 180;
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
      ctx.translate(this.x, Y);
      ctx.rotate(Math.cos(this.rad) * 0.1);
      ctx.translate(-this.x, -Y);
      ctx.fillStyle = 'red';
      ctx.strokeStyle = 'white';
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
      ctx.quadraticCurveTo(Math.cos(this.rad) * 5 + this.x, Math.sin(this.rad) * 5 + this.y + this.r + this.l / 3, Math.cos(this.rad) * 5 + this.x, Y);
      ctx.stroke();
      ctx.restore();
    };

    Particle.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 2;
    };

    Particle.prototype.updateParams = function() {
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
    };

    Particle.prototype.render = function(i) {
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < particleNum; i++) {
      var particle = new Particle(ctx, X / 2, Y / 2);
      particles.push(particle);
    }

    /********************
      Render
    ********************/ 
    
    function render() {
      ctxNoise.clearRect(0, 0, X, Y);
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < particles.length; i++) {
        particles[i].render();
      }
      createNoise(); 
      requestAnimationFrame(render);
    }

    render();

    /********************
      Event
    ********************/
    
    function onResize() {
      X = canvas.width = canvasNoise.width = window.innerWidth;
      Y = canvas.height = canvasNoise.height  = window.innerHeight;
      for (var i = 0; i < particles.length; i++) {
        particles[i].resize();
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });

  });
  // Author
  console.log('File Name / nostalgiaOrFear.js\nCreated Date / Jun 11, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
