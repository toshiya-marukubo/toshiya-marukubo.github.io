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
    var slimeNum = 1;
    var slimes = [];
    var circleSplit = 12;
    var angleSplit = 360 / circleSplit;
    var colors = ['rgb(23, 219, 172)'];
     
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
      this.v = rand(3, 8);
      this.rad = this.a * Math.PI / 180;
      this.points = [];
      this.setPoints();
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
      //ctx.globalCompositeOperation = 'xor';
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
        this.points[i][0] -= Math.sin(this.points[i][2] * Math.PI / 180);
        this.points[i][1] -= Math.cos(this.points[i][2] * Math.PI / 180);
        this.points[i][2] -= this.v;
      }
    };

    var surface = 1;

    Slime.prototype.updatePosition = function() {
      var maxY = 0;
      var maxIndex = 0;
      for (var i = 0; i < this.points.length; i++) {
        var y = this.points[i][1];
        if (y > maxY) {
          maxY = y;
          maxIndex = i;
        }
      }
      this.points[maxIndex][1] += 1;
      if (this.points[maxIndex][1] > Y) {
        ctx.save();
        ctx.fillStyle = this.c;
        ctx.fillRect(0, Y - surface, X, surface);
        ctx.restore();
        surface += 0.1;
      }
    };

    Slime.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 3;
    };

    Slime.prototype.render = function() {
      this.transform();
      this.updatePosition();
      this.draw();
    };

    for (var i = 0; i < slimeNum; i++) {
      var slime = new Slime(ctx, X / 2, Y / 3, rand(100, 150));
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
