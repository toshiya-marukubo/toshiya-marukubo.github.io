(function () {
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
    var mouseX;
    var mouseY;

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
      Cloud
    ********************/
    
    var cloudNum = 200;
    var clouds = [];
    var radiusMin = 150;
    var radiusMax = 300;

    if (X < 768) {
      cloudNum = 100;
      radiusMin = 100;
      radiusMax = 150;
    }

    function Cloud(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Cloud.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.r = rand(radiusMin, radiusMax);
      this.l = rand(50, 100);
      this.v = {
        x: rand(-2, 2) * Math.random(),
        y: rand(-2, 2) * Math.random()
      };
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(0, 255),
        a: 1
      };
    };
    
    Cloud.prototype.wrapPosition = function() {
      if (this.x + this.r < 0) {
        this.x = X + this.r;
      }
      if (this.x - this.r > X) {
        this.x = 0 - this.r;
      }
      if (this.y + this.r < 0) {
        this.y = Y + this.r;
      }
      if (this.y - this.r > Y) {
        this.y = 0 - this.r;
      }
    };
     
    Cloud.prototype.updatePosition = function() {
      this.x += this.v.x;
      this.y += this.v.y;
    };
    
    Cloud.prototype.updateParams = function() {
      this.l -= 0.1;
      if (this.l < 0) {
        this.v.x = rand(-2, 2) * Math.random();
        this.v.y = rand(-2, 2) * Math.random();
        this.l = rand(50, 100);
      }
    };
    
    Cloud.prototype.resize = function() {
      this.x = rand(0 - 100, X + 100);
      this.y = rand(0 - 100, Y + 100);
    };

    Cloud.prototype.render = function() {
      this.updatePosition();
      this.updateParams();
      this.wrapPosition();
      this.draw();
    };
   
    Cloud.prototype.gradient = function () {
      var col = this.c.r + "," + this.c.g + "," + this.c.b;
      var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, "rgba(" + col + ", " + (this.c.a * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (this.c.a * 0.5) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (this.c.a * 0) + ")");
      return g;
    };
    
    Cloud.prototype.draw = function() {
      ctx.save();
      ctx.beginPath();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    for (var i = 0; i < cloudNum; i++) {
      var cloud = new Cloud(ctx, rand(0 -100, X + 100), rand(0 - 100, Y + 100));
      clouds.push(cloud);
    }

    /********************
      text
    ********************/
    
    function drawText() {
      ctx.save();
      ctx.fillStyle = 'black';
      ctx.globalAlpha = 0.3;
      ctx.font = '100px impact';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('FOG', X / 2, Y / 2);
      ctx.restore();
    }
    
    /********************
      Render
    ********************/
    
    function changeColor() {
      var time = rand(1000, 5000);
      var r = rand(0, 255);
      var g = rand(0, 255);
      var b = rand(0, 255);
      for (var i = 0; i < clouds.length; i++) {
        clouds[i].c  = {
          r: r,
          g: g,
          b: b,
          a: 1
        };
      }
      setTimeout(changeColor, time);
    }

    changeColor();
    
    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < clouds.length; i++) {
        clouds[i].render();
      }
     　drawText();
      requestAnimationFrame(render);
    }

    render();

    /********************
      Event
    ********************/
    
    // resize
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      if (X < 768) {
        cloudNum = 200;
      } else {
        cloudNum = 100;
      }
      for (var i = 0; i < clouds.length; i++) {
        clouds[i].resize();
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
  console.log('File Name / fog.js\nCreated Date / May 14, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
