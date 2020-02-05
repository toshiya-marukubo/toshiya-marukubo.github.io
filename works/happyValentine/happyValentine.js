(function () {
  'use strict';
  window.addEventListener('load', function () {
    var canvas = document.getElementById('canvas');

    if (!canvas || !canvas.getContext) {
      return false;
    }

    /********************
      Animation
    ********************/

    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (cb) {
        setTimeout(cb, 17);
      };

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

    // heart
    var miniHeartNum = 100;
    var miniHearts =[];

    var rad = Math.PI / 180;
    var GRAVITY = 0.01;

    /********************
      Text
    ********************/
    
    var fontSize = '64px Arial';
    
    if (X < 768) {
      fontSize = '24px Arial';
    }
     
    function drawtext() {
      ctx.fillStyle = 'rgb(255, 3, 131)';
      ctx.globalAlpha = 0.7;
      ctx.textBaseline = 'middle';
      ctx.font = fontSize;
      ctx.textAlign = 'center';
      ctx.fillText("Happy Valentine's Day", X / 2, Y / 2);
    }

    /********************
      Particle
    ********************/
    
    // var
    var particleNum = 50;
    var particles = [];
    var particleColors = ['rgb(0, 172, 176)', 'rgb(253, 191, 16)', 'rgb(237, 26, 36)', 'rgb(241, 87, 49)', 'rgb(246, 149, 153)'];

    function Particle(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Particle.prototype.init = function(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.l = rand(0, 5);
      this.a = 0.5;
      this.c = particleColors[rand(0, particleColors.length - 1)];
      this.v = {
        x: rand(-2, 2) * Math.random(),
        y: rand(-2, 2) * Math.random()
      };
    };

    Particle.prototype.updateParams = function() {
      this.l -= 0.1;
      this.r += 0.1;
    };
    
    Particle.prototype.updatePosition = function() {
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Particle.prototype.wrapPosition = function() {
      if (this.l < 0) {
        var miniHeart = new MiniHeart(ctx, this.x, this.y, this.r, this.c);
        miniHearts.push(miniHeart);
        this.x = mouseX;
        this.y = mouseY;
        this.l = rand(10, 20);
        this.r = 1;
      }
    };
    
    Particle.prototype.draw = function() {
      ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = this.a;
      ctx.fillStyle = this.c;
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    };

    Particle.prototype.resize = function() {
      this.x = rand(0, X);
      this.y = rand(0, Y);
    };

    Particle.prototype.render = function() {
      this.updatePosition();
      this.updateParams();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < particleNum; i++) {
      var particle = new Particle(ctx, mouseX, mouseY, 1);
      particles.push(particle);
    }

    /********************
      MiniHeart
    ********************/
    
    function MiniHeart(ctx, x, y, r, c) {
      this.ctx = ctx;
      this.init(x, y, r, c);
    }

    MiniHeart.prototype.init = function (x, y, r, c) {
      this.ctx = ctx;
      this.r = r;
      this.x1 = x;
      this.y1 = y;
      this.a = -90;
      this.c = c;
      this.num = 22.5;
      this.l = rand(10, 20);
      this.alpha = 0.8;
      this.v = {
        x: 0,
        y: 2
      };
      this.x2 = this.x1 + this.r * Math.cos(this.a * rad);
      this.y2 = this.y1 + this.r * Math.sin(this.a * rad);
      this.cx1 = this.x1 + this.r * Math.cos((this.a + this.num) * rad);
      this.cy1 = this.y1 + this.r * Math.sin((this.a + this.num) * rad);
      this.cx2 = this.x1 + this.r * Math.cos((this.a - this.num) * rad);
      this.cy2 = this.y1 + this.r * Math.sin((this.a - this.num) * rad);
      this.chord = 2 * this.r * Math.sin(this.num * rad / 2);
    };

    MiniHeart.prototype.draw = function () {
      ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.fillStyle = this.c;
      ctx.strokeStyle = this.c;
      ctx.globalAlpha = this.alpha;
      ctx.moveTo(this.x2, this.y2);
      ctx.arc(this.cx1, this.cy1, this.chord, (270 + this.a) * rad, (270 + this.a + 225) * rad);
      ctx.lineTo(this.x1, this.y1);
      ctx.moveTo(this.x2, this.y2);
      ctx.arc(this.cx2, this.cy2, this.chord, (90 + this.a) * rad, (90 + this.a + 135) * rad, true);
      ctx.lineTo(this.x1, this.y1);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    MiniHeart.prototype.updateParams = function() {
      this.l -= 0.1;
      this.r += 0.05;
      this.x2 = this.x1 + this.r * Math.cos(this.a * rad);
      this.y2 = this.y1 + this.r * Math.sin(this.a * rad);
      this.cx1 = this.x1 + this.r * Math.cos((this.a + this.num) * rad);
      this.cy1 = this.y1 + this.r * Math.sin((this.a + this.num) * rad);
      this.cx2 = this.x1 + this.r * Math.cos((this.a - this.num) * rad);
      this.cy2 = this.y1 + this.r * Math.sin((this.a - this.num) * rad);
      this.chord = 2 * this.r * Math.sin(this.num * rad / 2);
    };
    
    MiniHeart.prototype.deleteHeart = function(i) {
      if (this.y < 0) {
        miniHearts.splice(i, 1);
      }
    };
    
    MiniHeart.prototype.updatePosition = function() {
      this.y1 -= this.v.y;
      this.y2 -= this.v.y;
      this.cy1 -= this.v.y;
      this.cy2 -= this.v.y;
    };

    MiniHeart.prototype.render = function (i) {
      this.updateParams();
      this.updatePosition();
      this.deleteHeart(i);
      this.draw();
    };

    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < particles.length; i++) {
        particles[i].render();
      }
      for (var i = 0; i < miniHearts.length; i++) {
        miniHearts[i].render();
      }
      drawtext();
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
        fontSize = '24px Arial';
      } else {
        fontSize = '64px Arial';
      }
    }

    window.addEventListener('resize', function () {
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
  console.log('File Name / happyValentine.js\nCreated Date / February 5, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
