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
    var mouseX = X / 2;
    var mouseY = Y / 2;

    var count = document.getElementById('count');
    
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
      Slime
    ********************/
    
    // var
    var slimeNum = 2;
    var slimes = [];
    var circleSplit = 12;
    var angleSplit = 360 / circleSplit;
    var colors = ['rgb(101, 255, 103)'];
     
    function Slime(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Slime.prototype.init = function(x, y, r) {
      this.a = rand(0, 360);
      this.x = x;
      this.y = y;
      this.c = colors[rand(0, colors.length - 1)];
      this.r = r;
      this.f = rand(5, 8);
      this.rad = this.a * Math.PI / 180;
      this.points = [];
      this.setPoints();
      this.v = {
        x: 0,
        y: 0
      };
    };

    Slime.prototype.setPoints = function() {
      for (var i = 0; i < circleSplit; i++) {
        var pointX = Math.cos(this.rad) * this.r;
        var pointY = Math.sin(this.rad) * this.r;
        var point = [pointX, pointY, rand(0, 360)];
        this.points.push(point);
        this.rad = this.a * Math.PI / 180;
        this.a += angleSplit;
      }
    };

    Slime.prototype.draw = function() {
      ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = this.c;
      ctx.beginPath();
      var xav1 = (this.points[0][0] + this.points[circleSplit - 1][0]) / 2 + this.x;
      var yav1 = (this.points[0][1] + this.points[circleSplit - 1][1]) / 2 + this.y;
      ctx.moveTo(xav1, yav1);
      for (var i = 1; i < this.points.length - 1; i++) {
        var xav2 = (this.points[i][0] + this.points[i + 1][0]) / 2;
        var yav2 = (this.points[i][1] + this.points[i + 1][1]) / 2;
        ctx.quadraticCurveTo(this.points[i][0] + this.x, this.points[i][1] + this.y, xav2 + this.x, yav2 + this.y);
      }
      ctx.quadraticCurveTo(this.points[circleSplit - 1][0] + this.x, this.points[circleSplit - 1][1] + this.y, xav1, yav1);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    Slime.prototype.transform = function() {
      for (var i = 0; i < this.points.length; i++) {
        this.points[i][0] -= Math.sin(this.points[i][2] * Math.PI / 180) / 2;
        this.points[i][1] -= Math.cos(this.points[i][2] * Math.PI / 180) / 2;
        this.points[i][2] -= this.f;
      }
    };

    Slime.prototype.wrapPosition = function() {
      if (this.x - this.r < 0) {
        this.v.x *= -1;
      }
      if (this.x + this.r > X) {
        this.v.x *= -1;
      }
      if (this.y - this.r < 0) {
        this.v.y *= -1;
      }
      if (this.y + this.r > Y) {
        this.v.y *= -1;
      }
    };

    Slime.prototype.updatePosition = function(i) {
      var j = i;
      var dist = Number.MAX_VALUE;
      var closestIndex = 0;
      for (var i = 0; i < slimes.length; i++) {
        if (j !== i) {
          var x = Math.abs(this.x - slimes[i].x);
          var y = Math.abs(this.y - slimes[i].y);
          var d = x * x + y * y;
          var newDist = Math.floor(Math.sqrt(d));
          if (newDist < dist) {
            dist = newDist;
            closestIndex = i;
          }
        }
      }
      var x = this.x - slimes[closestIndex].x;
      var y = this.y - slimes[closestIndex].y;
      var d = x * x + y * y;
      var newDist = Math.sqrt(d);
      this.v.x = x / newDist * 1 / 2;
      this.v.y = y / newDist * 1 / 2;
      this.x -= this.v.x;
      this.y -= this.v.y;
      if (newDist < this.r + slimes[closestIndex].r) {
        if (this.r > slimes[closestIndex].r) {
          this.points = this.points.concat(slimes[closestIndex].points);
          circleSplit = 24;
          this.r += slimes[closestIndex].r;
          this.setPoints();
          console.log(this.points);
          slimes.splice(closestIndex, 1);
          /*
          slimes.splice(closestIndex, 1);
          this.r *= 1.1;
          this.points = [];
          this.setPoints();
          */
        }
      }
    };

    /*
    Slime.prototype.extendPoint = function(j, closestIndex) {
      var dist = Number.MAX_VALUE;
      for (var i = 0; i < this.points.length; i++) {
        var y = this.points[i][1];
        if (y > maxY) {
          maxY = y;
          maxIndex = i;
        }
      }
      this.points[maxIndex][1] += 1;
    };
    */

    Slime.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 3;
    };

    Slime.prototype.render = function(i) {
      this.transform();
      if (slimes.length > 1) this.updatePosition(i);
      //this.wrapPosition();
      this.draw();
    };
    
    for (var i = 0; i < slimeNum; i++) {
      var slime = new Slime(ctx, rand(0, X), rand(0, Y), rand(30, 50));
      slimes.push(slime);
    }
    
    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      /*
      ctx.globalCompositeOperation = "darken";
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      */
      for (var i = 0; i < slimes.length; i++) {
        slimes[i].render(i);
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
      for (var i = 0; i < slimes.length; i++) {
        slimes[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    window.addEventListener('click', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      var slime = new Slime(ctx, mouseX, mouseY, rand(50, 80));
      slimes.push(slime);
    }, false);

  }); 
  // Author
  console.log('File Name / slime.js\nCreated Date / April 28, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
