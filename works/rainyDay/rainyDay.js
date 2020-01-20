(function() {
  'use strict';
  window.addEventListener('load', function() {
    var canvas = document.getElementById('canvas');
    var amout = document.getElementById('amout');
    var direction = document.getElementById('direction');

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
    
    // var
    var cloudNum = 20;
    var cloudInt = 0;

    var firstClouds = [];
    var firstCloudSpeed = 0.1;
    
    var secondClouds = [];
    var secondCloudSpeed = 0.05;

    var thirdClouds = [];
    var thirdCloudSpeed = 0.025;

    function Cloud(ctx, x, y, r, c, s) {
      this.ctx = ctx;
      this.init(x, y, r, c, s);
    }

    Cloud.prototype.init = function(x, y, r, c, s) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.r = r;
      this.c = c;
      this.s = s;
    };

    Cloud.prototype.draw = function() {
      ctx = this.ctx;
      ctx.beginPath();
      ctx.fillStyle = this.c;
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    };

    Cloud.prototype.updatePosition = function() {
      this.x -= this.s;
    };

    Cloud.prototype.wrapPosition = function() {
      if (this.x + this.r < 0) {
        this.x = X + this.r;
      }
    };

    Cloud.prototype.resize = function() {
      this.x = rand(0, X);
    };

    Cloud.prototype.render = function() {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < cloudNum; i++) {
      var cloud = new Cloud(ctx, cloudInt, 0, rand(50, 80), '#999999', firstCloudSpeed);
      cloudInt += 80;
      firstClouds.push(cloud);
    }

    cloudInt = 0;

    for (var i = 0; i < cloudNum; i++) {
      var cloud = new Cloud(ctx, cloudInt, 40, rand(50, 80), '#666666', secondCloudSpeed);
      cloudInt += 80;
      secondClouds.push(cloud);
    }

    cloudInt = 0;
    
    for (var i = 0; i < cloudNum; i++) {
      var cloud = new Cloud(ctx, cloudInt, 80, rand(50, 80), '#4d4d4d', thirdCloudSpeed);
      cloudInt += 80;
      thirdClouds.push(cloud);
    }

    /********************
      Rain
    ********************/
    
    // var
    var rainNum = 500;
    var rains = [];
    var rainSpeed = 10;
    var windDirection = 0;
    
    function Rain(ctx, x, y, l) {
      this.ctx = ctx;
      this.init(x, y, l);
    }

    Rain.prototype.init = function(x, y, l) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.l = l;
      this.v = {
        x: windDirection,
        y: rainSpeed
      };
    };

    Rain.prototype.draw = function() {
      ctx = this.ctx;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.strokeStyle = '#FFFFFF';
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x, this.y + this.l);
      ctx.stroke();
      ctx.closePath();
    };

    Rain.prototype.updatePosition = function() {
      this.y += this.v.y;
      this.x += this.v.x;
    };

    Rain.prototype.wrapPosition = function() {
      if (this.y > Y) {
        this.y = 0;
      }
      if (this.x > X) {
        this.x = 0;
      }
      if (this.x < 0) {
        this.x = X
      }
    };

    Rain.prototype.resize = function() {
      this.x = rand(0, X);
    };

    Rain.prototype.changeWindDirection = function(val){
      this.v.x = val;
    };

    Rain.prototype.render = function() {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < rainNum; i++) {
      var rain = new Rain(ctx, rand(0, X), rand(0, Y), rand(0, 5));
      rains.push(rain);
    }

    function changeAmount(val) {
      rains = [];
      rainNum = val;
      for (var i = 0; i < rainNum; i++) {
        var rain = new Rain(ctx, rand(0, X), rand(0, Y), rand(0, 5));
        rains.push(rain);
      }
    }

    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < thirdClouds.length; i++) {
        thirdClouds[i].render();
      }
      for (var i = 0; i < secondClouds.length; i++) {
        secondClouds[i].render();
      }
      for (var i = 0; i < firstClouds.length; i++) {
        firstClouds[i].render();
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
    
    // resize
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      for (var i = 0; i < firstClouds.length; i++) {
        firstClouds[i].resize();
      }
      for (var i = 0; i < secondClouds.length; i++) {
        secondClouds[i].resize();
      }
      for (var i = 0; i < thirdClouds.length; i++) {
        thirdClouds[i].resize();
      }
    }

    amount.addEventListener('change', function() {
      changeAmount(this.value);
    }, false);

    window.addEventListener('resize', function() {
      onResize();
    });

  }); 
  // Author
  console.log('File Name / rainyDay.js\nCreated Date / January 20, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
