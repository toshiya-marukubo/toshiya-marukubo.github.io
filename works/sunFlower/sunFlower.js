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

    /********************
      Sun
    ********************/
    var sunSize = 100;
     
    function drawSun() {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = 'rgb(253, 217, 0)';
      ctx.arc(X / 2, Y / 3, sunSize, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    }
    
    var beamNum = 36;
    var beams = [];
    
    function Beam(ctx, x, y, l, r) {
      this.ctx = ctx;
      this.init(x, y, l, r);
    }

    Beam.prototype.init = function(x, y, l, r) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.c = 'rgb(253, 217, 0)';
      this.l = l;
      this.r = r;
      this.rad = r * Math.PI / 180;
    };

    Beam.prototype.draw = function() {
      ctx = this.ctx;
      ctx.save();
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.strokeStyle = this.c;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(Math.cos(this.rad) * this.l + this.x, this.y - Math.sin(this.rad) * this.l);
      ctx.stroke();
      ctx.restore();
    };

    Beam.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 3;
    };

    Beam.prototype.rotate = function() {
      this.rad += -0.01;
    };

    Beam.prototype.render = function() {
      this.rotate();
      this.draw();
    };

    for (var i = 0; i < beamNum; i++) {
      var beam = new Beam(ctx, X / 2, Y / 3, sunSize + 30, i * 10);
      beams.push(beam);
    }
    
    /********************
      Cloud
    ********************/
    
    var cloudNum = 10;
    var clouds = [];

    if (X < 768) {
      cloudNum = 5;
    }

    function Cloud(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Cloud.prototype.init = function(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.c = {
        cloud: 'rgb(196, 230, 242)',
      };
      this.v = {
        x: Math.random() * 0.5
      };
    };

    Cloud.prototype.draw = function() {
      var ctx = this.ctx;
      var dist = 0;
      var r = rand(20, 50);
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.c.cloud;
      for (var i = 0; i < 3; i++) {
        ctx.arc(this.x + dist, this.y, this.r, 0, Math.PI * 2, false);
        ctx.fill();
        dist += this.r * 1.2;
      }
      ctx.fill();
      ctx.restore();
    };

    Cloud.prototype.updatePosition = function() {
      this.x += this.v.x;
    };

    Cloud.prototype.wrapPosition = function() {
      if (this.x - this.r > X) {
        this.x = 0 - this.r * 1.2 * 3;
      }
    };

    Cloud.prototype.resize = function() {
      this.x = rand(0, X);
      this.y = rand(0, Y / 5);
    };

    Cloud.prototype.render = function() {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < cloudNum; i++) {
      var cloud = new Cloud(ctx, rand(0, X), rand(0, Y / 5), rand(30, 50));
      clouds.push(cloud);
    }

    /********************
      SunFlower
    ********************/
    
    var sunFlowerNum = 100;
    var sunFlowers = [];

    if (X < 768) {
      sunFlowerNum = 50;
    }

    function SunFlower(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    var petalColors = ['rgb(253, 217, 0)', 'rgb(254, 191, 0)'];
    var leafColors = ['rgb(51, 151, 61)', 'rgb(98, 188, 61)'];

    SunFlower.prototype.init = function (x, y, r) {
      this.x = x;
      this.y = y;
      this.x1 = this.x;
      this.y1 = this.y;
      this.r = r;
      this.a = 0;
      this.rad = this.a * Math.PI / 180;
      this.v = {
        x: Math.cos(this.rad),
        y: Math.sin(this.rad)
      };
      this.c = {
        eye: 'rgb(85, 50, 25)',
        seeds: 'rgb(166, 104, 61)',
        stem: leafColors[rand(0, leafColors.length - 1)],
        petal: petalColors[rand(0, petalColors.length - 1)]
      };
    };

    SunFlower.prototype.draw = function () {
      var ctx = this.ctx;
      // stem
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = this.r / 3;
      ctx.strokeStyle = this.c.stem;
      ctx.moveTo(this.x1, this.y);
      ctx.lineTo(this.x, Y);
      ctx.stroke();
      ctx.restore();
      // leaf left
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.c.stem;
      ctx.translate(this.x1, this.y);
      ctx.rotate(-50 / 180 * Math.PI);
      ctx.translate(-this.x1, -this.y);
      ctx.scale(1.5, 1);
      ctx.arc(this.x1 / 1.5 - this.r, this.y / 1, this.r / 2, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
      // leaf right
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.c.stem;
      ctx.translate(this.x1, this.y);
      ctx.rotate(50 / 180 * Math.PI);
      ctx.translate(-this.x1, -this.y);
      ctx.scale(1.5, 1);
      ctx.arc(this.x1 / 1.5 + this.r, this.y / 1, this.r / 2, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
      // petal
      for (var i = 20; i <= 360; i += 20) {
        ctx.save();
        ctx.beginPath()
        ctx.fillStyle = this.c.petal;
        ctx.translate(this.x1, this.y);
        ctx.rotate(i / 180 * Math.PI);
        ctx.translate(-this.x1, -this.y);
        ctx.scale(1.7, 0.3);
        ctx.arc(this.x1 / 1.7, this.y / 0.3, this.r, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.restore();
      }
      // seeds
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.c.seeds;
      ctx.arc(this.x1, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
      // eyes
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.c.eye;
      ctx.arc(this.x1 - this.r / 3, this.y - this.r / 3, this.r / 10, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.c.eye;
      ctx.arc(this.x1 + this.r / 3, this.y - this.r / 3, this.r / 10, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
      // mouth
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = this.r / 10;
      ctx.lineCap = 'round';
      ctx.strokeStyle = this.c.eye;
      ctx.arc(this.x1, this.y, this.r / 2, 0, Math.PI, false);
      ctx.stroke();
      ctx.restore();
    };

    SunFlower.prototype.updateParams = function() {
      this.a += Math.random();
      this.rad = this.a * Math.PI / 180;
      this.v.x = Math.cos(this.rad) * 0.1;
      this.v.y = Math.sin(this.rad) * 0.1;
      this.x1 += this.v.x;
    };
   
    SunFlower.prototype.resize = function () {
      this.x = rand(0, X);
      this.y = rand(Y - Y / 3, Y);
      this.x1 = this.x;
      this.y1 = this.y;
    };

    SunFlower.prototype.render = function () {
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < sunFlowerNum; i++) {
      var sunFlower = new SunFlower(ctx, rand(0, X), rand(Y - Y / 3, Y), rand(20, 50));
      sunFlowers.push(sunFlower);
    }
    
    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < beams.length; i++) {
        beams[i].render();
      }
      drawSun();
      for (var i = 0; i < clouds.length; i++) {
        clouds[i].render();
      }
      for (var i = 0; i < sunFlowers.length; i++) {
        sunFlowers[i].render();
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
      for (var i = 0; i < beams.length; i++) {
        beams[i].resize();
      }
      for (var i = 0; i < clouds.length; i++) {
        clouds[i].resize();
      }
      for (var i = 0; i < sunFlowers.length; i++) {
        sunFlowers[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

  });
  // Author
  console.log('File Name / sunFlower.js\nCreated Date / April 10, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
