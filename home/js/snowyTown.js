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

    // speed
    var builSpeed = 0.1;
    var builBackSpeed = 0.05;
    var snowSpeedX = 0.01;
    
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
      Building
    ********************/
    
    var buildingsBack = [];
    var buildings = []; 
    var builBackNum = Math.ceil(X / 100); 
    var builNum = Math.ceil(X / 50);   
    var builOffset = 0;
      
    function Building(ctx, x, y, bW, bH, winSize, builCol, winCol, back) {
      this.ctx = ctx;
      this.init(x, y, bW, bH, winSize, builCol, winCol, back);
    }
    
    Building.prototype.init = function(x, y, bW, bH, winSize, builCol, winCol, back) {
      this.x = x || 0;
      this.y = y || 0;
      this.bW = bW || 0;
      this.bH = bH || 0;
      this.winSize = winSize || 0;
      this.winOffset = winSize;
      this.builCol = builCol;
      this.winCol = winCol;
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(0, 255)
      };
      this.back = back;
    };

    Building.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.builCol;
      ctx.fillRect(this.x, Y - this.bH, this.bW, this.bH);
      ctx.fillStyle = this.winCol;
      var winCountX = this.bW / this.winSize - 1;
      var winCountY = this.bH / this.winSize - 2;
      for (var i = 1; i < winCountX; i++) {
        if (i % 2 !== 0) {
          for (var j = 1; j < winCountY; j++) {
            if (j % 2 !== 0) {
              ctx.fillRect(this.x + i * this.winSize, Y - this.bH + j * this.winSize, this.winSize, this.winSize);
            } 
          }
        } 
      }
      ctx.restore();
    };

    Building.prototype.updatePosition = function() {
      if (this.back) {
        this.x -= builBackSpeed;
      } else {
        this.x -= builSpeed;  
      }
    };

    Building.prototype.wrapPosition = function(i) {
      var firstX = buildings[0].x;
      if (firstX > X) {
        flg = true;
      }
      if (this.back === true && this.x < 0 - this.bW) {
        buildingsBack.splice(i, 1);
        var builWidth = rand(100, 150);
        var lastX = buildingsBack[buildingsBack.length - 1].x;
        var lastW = buildingsBack[buildingsBack.length - 1].bW;
        var builBack = new Building(ctx, lastX + lastW + rand(5, 10), 0, builWidth, rand(Y * 0.3, Y * 0.4), rand(5, 10), 'rgb(13, 13, 13)', 'rgb(179, 179, 179)', true);
        buildingsBack.push(builBack);
      }
      if (this.back === false && this.x < 0 - this.bW) {
        buildings.splice(i, 1);
        var builWidth = rand(50, 100);
        var lastX = buildings[buildings.length - 1].x;
        var lastW = buildings[buildings.length - 1].bW;
        var buil = new Building(ctx, lastX + lastW + rand(5, 10), 0, builWidth, rand(Y * 0.1, Y * 0.2), rand(5, 15), 'rgb(64, 64, 64)', 'rgb(254, 254, 254)', false);
        buildings.push(buil);
      }
    };
     
    Building.prototype.render = function(i) {
      this.updatePosition();
      this.wrapPosition(i);
      this.draw();
    };
     
    for (var i = 0; i < builBackNum; i++) {
      var builWidth = rand(100, 150);
      var builBack = new Building(ctx, builOffset, 0, builWidth, rand(Y * 0.4, Y * 0.5), rand(5, 10), 'rgb(13, 13, 13)', 'rgb(179, 179, 179)', true);
      buildingsBack.push(builBack);
      builOffset += builWidth + rand(5, 10);
    }
     
    builOffset = 0;

    for (var i = 0; i < builNum; i++) {
      var builWidth = rand(50, 100);
      var buil = new Building(ctx, builOffset, 0, builWidth, rand(Y * 0.2, Y * 0.3), rand(5, 15), 'rgb(64, 64, 64)', 'rgb(254, 254, 254)', false);
      buildings.push(buil);
      builOffset += builWidth + rand(5, 10);
    }

    /********************
      Snow
    ********************/
    
    var snowNum = 100;
    var snows = [];

    if (X < 768) {
      snowNum = 50;
    }
    
    function Snow(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Snow.prototype.init = function(x, y) {
      this.ctx = ctx;
      this.x = x || 0;
      this.y = y || 0;
      this.r = rand(5, 30);
      this.v = {
        x: snowSpeedX,
        y: Math.random() * 0.5
      };
      this.color = {
        r: rand(200, 255),
        g: rand(200, 255),
        b: rand(200, 255),
        a: 1
      };
    };

    Snow.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    };

    Snow.prototype.updatePosition = function() {
      this.x -= snowSpeedX;
      this.y += this.v.y;
    };

    Snow.prototype.wrapPosition = function() {
      if (this.x < 0 - this.r) this.x = X + this.r;
      if (this.x > X + this.r) this.x = 0 - this.r;
      if (this.y < 0 - this.r) this.y = Y + this.r;
      if (this.y > Y + this.r) this.y = 0 - this.r;
    };

    Snow.prototype.gradient = function() {
      var col = this.color.r + "," + this.color.g + "," + this.color.b;
      var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, "rgba(" + col + ", " + (this.color.a * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (this.color.a * 0.2) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (this.color.a * 0) + ")");
      return g;
    };

    Snow.prototype.render = function() {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < snowNum; i++) {
      var snow = new Snow(ctx, rand(0, X), rand(0, Y));
      snows.push(snow);
    }

    /********************
      render
    ********************/

    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < buildingsBack.length; i++) {
        buildingsBack[i].render(i);
      }
      for (var i = 0; i < buildings.length; i++) {
        buildings[i].render(i);
      }
      for (var i = 0; i < snows.length; i++) {
        snows[i].render();
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
      //buil
      builOffset = 0;
      buildingsBack = [];
      buildings = []; 
      builBackNum = Math.ceil(X / 100); 
      builNum = Math.ceil(X / 50);   
      for (var i = 0; i < builBackNum; i++) {
        var builWidth = rand(100, 150);
        var builBack = new Building(ctx, builOffset, 0, builWidth, rand(Y * 0.4, Y * 0.5), rand(5, 10), 'rgb(13, 13, 13)', 'rgb(179, 179, 179)', true);
        buildingsBack.push(builBack);
        builOffset += builWidth + rand(5, 10);
      }
      builOffset = 0;
      for (var i = 0; i < builNum; i++) {
        var builWidth = rand(50, 100);
        var buil = new Building(ctx, builOffset, 0, builWidth, rand(Y * 0.2, Y * 0.3), rand(5, 15), 'rgb(64, 64, 64)', 'rgb(254, 254, 254)', false);
        buildings.push(buil);
        builOffset += builWidth + rand(5, 10);
      }
      //snow
      snows = [];
      if (X < 768) {
        snowNum = 50;
      } else {
        snowNum = 100;
      }
      for (var i = 0; i < snowNum; i++) {
        var snow = new Snow(ctx, rand(0, X), rand(0, Y));
        snows.push(snow);
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    window.addEventListener('mousemove', function(e) {
      var mouseX = e.clientX;
      if (mouseX < X * 0.2) {
        builSpeed = 0.1;
        builBackSpeed = 0.05;
        snowSpeedX = 0.01;
      } else {
        builSpeed += mouseX / 100000;
        builBackSpeed += mouseX / 100000;
        snowSpeedX += mouseX / 100000;
      }
    }, false);
 
   window.addEventListener('touchmove', function(e) {
      if (e.targetTouches.length === 1) {
        var touch = event.targetTouches[0];
        var touchX = touch.pageX;
        if (touchX < X * 0.2) {
          builSpeed = 0.1;
          builBackSpeed = 0.05;
          snowSpeedX = 0.01;
        } else {
          builSpeed += touchX / 100000;
          builBackSpeed += touchX / 100000;
          snowSpeedX += touchX / 100000;
        }
      }
    }, false);
  
  });
  // Author
  console.log('File Name / snowyTown.js\nCreated Date / 2019.12.10\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
