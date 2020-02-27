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

    var rainFlg = true;

    function Cloud(ctx, x, y, r, c, s) {
      this.ctx = ctx;
      this.init(x, y, r, c, s);
    }

    Cloud.prototype.init = function(x, y, r, c, s) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.c = c;
      this.s = s;
    };

    Cloud.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.fillStyle = this.c;
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      ctx.fill();
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
      var cloud = new Cloud(ctx, cloudInt, 0, rand(50, 80), 'rgb(153, 153, 153)', firstCloudSpeed);
      cloudInt += 80;
      firstClouds.push(cloud);
    }

    cloudInt = 0;

    for (var i = 0; i < cloudNum; i++) {
      var cloud = new Cloud(ctx, cloudInt, 40, rand(50, 80), 'rgb(102, 102, 102)', secondCloudSpeed);
      cloudInt += 80;
      secondClouds.push(cloud);
    }

    cloudInt = 0;
    
    for (var i = 0; i < cloudNum; i++) {
      var cloud = new Cloud(ctx, cloudInt, 80, rand(50, 80), 'rgb(77, 77, 77)', thirdCloudSpeed);
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
      this.x = x;
      this.y = y;
      this.l = l;
      this.v = {
        x: windDirection,
        y: rainSpeed
      };
    };

    Rain.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgb(255, 255, 255)';
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x, this.y + this.l);
      ctx.stroke();
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
    };

    Rain.prototype.render = function() {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < rainNum; i++) {
      var rain = new Rain(ctx, rand(0, X), rand(0, Y), rand(1, 10));
      rains.push(rain);
    }

    function changeAmount(val) {
      rains = [];
      rainNum = val;
      if (rainFlg === false) {
        startRain();
      }
      if (val == 0) {
        stopRain();
      }
      for (var i = 0; i < rainNum; i++) {
        var rain = new Rain(ctx, rand(0, X), rand(0, Y), rand(1, 10));
        rains.push(rain);
      }
    }

    function stopRain() {
      rainFlg = false;
      canvas.style.background = '#0052d4';
      canvas.style.background = '-webkit-gradient(linear, left top, left bottom, from(#2980B9), to(#FFFFFF))';
      thirdClouds = [];
      secondClouds = [];
      firstClouds = [];
    }

    function startRain() {
      rainFlg = true;
      canvas.style.background = '#000000';
      canvas.style.background = '-webkit-gradient(linear, left top, left bottom, from(#434343), to(#000000))';
      cloudInt = 0;
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
    }

    /********************
      Sun
    ********************/
    
    function drawSun() {
      ctx.beginPath();
      ctx.fillStyle = 'rgb(242, 201, 76)';
      ctx.arc(X - 30, 0 + 30, 100, 0, Math.PI * 2, false);
      ctx.fill();
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
      this.l = l;
      this.r = r;
      this.rad = r * Math.PI / 180;
    };

    Beam.prototype.draw = function() {
      ctx = this.ctx;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.strokeStyle = '#F2C94C';
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(Math.cos(this.rad) * this.l + this.x, this.y - Math.sin(this.rad) * this.l);
      ctx.stroke();
    };

    Beam.prototype.resize = function() {
      this.x = X - 30;
      this.y = 0 + 30;
    };

    Beam.prototype.rotate = function() {
      this.rad += -0.01;
    };

    Beam.prototype.render = function() {
      this.rotate();
      this.draw();
    };

    for (var i = 0; i < beamNum; i++) {
      var beam = new Beam(ctx, X - 30, 0 + 30, 120, i * 10);
      beams.push(beam);
    }

    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      drawSun();
      for (var i = 0; i < beams.length; i++) {
        beams[i].render();
      }
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
      for (var i = 0; i < beams.length; i++) {
        beams[i].resize();
      }
      for (var i = 0; i < firstClouds.length; i++) {
        firstClouds[i].resize();
      }
      for (var i = 0; i < secondClouds.length; i++) {
        secondClouds[i].resize();
      }
      for (var i = 0; i < thirdClouds.length; i++) {
        thirdClouds[i].resize();
      }
      for (var i = 0; i < rains.length; i++) {
        rains[i].resize();
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
