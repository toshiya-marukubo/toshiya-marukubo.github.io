(function() {
  'use strict';
  window.addEventListener('load', function() {
    var canvasThunder = document.getElementById('canvasThunder');
    var canvasCloud = document.getElementById('canvasCloud');
    var canvasRain = document.getElementById('canvasRain');

    if (!canvasThunder || !canvasThunder.getContext) {
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

    var canvasThunderCtx = canvasThunder.getContext('2d');
    var canvasCloudCtx = canvasCloud.getContext('2d');
    var canvasRainCtx = canvasRain.getContext('2d');
    var X = canvasThunder.width = canvasRain.width = canvasCloud.width = window.innerWidth;
    var Y = canvasThunder.height = canvasRain.height = canvasCloud.height = window.innerHeight;

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
      Thunder
    ********************/
    
    var thunderNum = 10;  
    var thunders = [];
     
    function Thunder(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Thunder.prototype.init = function(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.l = rand(Y, Y * 3);
      this.c = 'rgb(201, 162, 198)';
    };

    Thunder.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.lineWidth = this.r;
      ctx.strokeStyle = this.c;
      ctx.moveTo(this.x, this.y);
      this.x += rand(-10, 10);
      this.y += rand(10, 15);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
    };

    Thunder.prototype.updateParams = function() {
      if (this.y > this.l) { 
        this.init(rand(0, X), rand(0, Y / 3), rand(1, 5));
      }
    };
    
    Thunder.prototype.render = function() {
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < thunderNum; i++) {
      var thunder = new Thunder(canvasThunderCtx, rand(0, X), rand(0, Y / 3), rand(1, 5));
      thunders.push(thunder);
    }

    /********************
      Rain
    ********************/
    
    var rainNum = 100;
    var rains = [];
    var rainSpeed = 10;
    
    function Rain(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Rain.prototype.init = function(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.c = 'rgb(179, 203, 255)';
      this.v = {
        y: rainSpeed
      };
    };

    Rain.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.fillStyle = this.c;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
    };

    Rain.prototype.updatePosition = function() {
      this.y += this.v.y;
    };

    Rain.prototype.wrapPosition = function() {
      if (this.y > Y) {
        this.y = 0;
      }
    };

    Rain.prototype.resize = function() {
      this.x = rand(0, X);
      this.y = rand(0, Y);
    };

    Rain.prototype.render = function() {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < rainNum; i++) {
      var rain = new Rain(canvasRainCtx, rand(0, X), rand(0, Y), 1);
      rains.push(rain);
    }

    /********************
      Cloud
    ********************/
    
    var cloudNum = 50;
    var clouds = [];

    function Cloud(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Cloud.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.c = 'rgb(201, 162, 198)';
      this.r = rand(100, 200);
      this.v = {
        x: 0.5,
        y: 0
      };
      this.color = {
        r: 0,
        g: 0,
        b: 0,
        a: 1
      };
    };
    
    Cloud.prototype.wrapPosition = function(){
      if (this.x - this.r > X) {
        this.x = 0 - this.r;
      }
    };
     
    Cloud.prototype.updatePosition = function() {
      this.x += this.v.x;
    };
    
    Cloud.prototype.resize = function() {
      this.x = rand(0 - 100, X + 100);
      this.y = rand(0, Y / 2);
    };

    Cloud.prototype.render = function() {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };
   
    Cloud.prototype.gradient = function () {
      var col = this.color.r + "," + this.color.g + "," + this.color.b;
      var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, "rgba(" + col + ", " + (this.color.a * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (this.color.a * 0.5) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (this.color.a * 0) + ")");
      return g;
    };
    
    Cloud.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.scale(2, 1);
      ctx.beginPath();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      ctx.fill();
      ctx.scale(0.5, 1);
      ctx.restore();
    };

    for (var i = 0; i < cloudNum; i++) {
      var cloud = new Cloud(canvasCloudCtx, rand(0 - 100, X + 100), rand(0, Y / 2));
      clouds.push(cloud);
    }

    /********************
      Clear
    ********************/

    function clearCanvasThunder () {
      canvasThunderCtx.globalCompositeOperation = "darken";
      canvasThunderCtx.globalAlpha = 0.01;
      canvasThunderCtx.fillStyle = "rgb(19, 16, 65)";
      canvasThunderCtx.fillRect(0, 0, X, Y);
      canvasThunderCtx.globalCompositeOperation = "source-over";
      canvasThunderCtx.globalAlpha = 1;
      if (Math.random() < 0.01) {
        canvasThunderCtx.fillStyle = 'rgb(128, 128, 128)';
        canvasThunderCtx.fillRect(0, 0, X, Y);
      }
    }

    function clearCanvasRain () {
      canvasRainCtx.clearRect(0, 0, X, Y);
    }

    function clearCanvasCloud () {
      canvasCloudCtx.clearRect(0, 0, X, Y);
    }

    /********************
      Render
    ********************/
    
    function render(){
      clearCanvasThunder();
      clearCanvasCloud();
      clearCanvasRain();
      for (var i = 0; i < thunders.length; i++) {
        thunders[i].render();
      }
      for (var i = 0; i < clouds.length; i++) {
        clouds[i].render();
      }
      for (var i = 0; i < rains.length; i++) {
        rains[i].render();
      }
      requestAnimationFrame(render);
    }

    render();

    /********************
      Event
    ********************/
    
    function onResize() {
      X = canvasThunder.width = canvasRain.width = canvasCloud.width = window.innerWidth;
      Y = canvasThunder.height = canvasRain.height = canvasCloud.height = window.innerHeight;
      for (var i = 0; i < rains.length; i++) {
        rains[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  }); 
  // Author
  console.log('File Name / mamaragan.js\nCreated Date / February 16, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
