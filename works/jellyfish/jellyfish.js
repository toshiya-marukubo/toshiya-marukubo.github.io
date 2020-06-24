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
    var slimeNum = 100;
    var slimes = [];
    var circleSplit = 36;
    var angleSplit = 360 / circleSplit;
    var angles = [];
    var dist = 300;
    for (var i = 0; i < slimeNum; i++) {
      angles.push(rand(0, 360));
    }

    if (X < 768) {
      slimeNum = 50;
      dist = 100;
    }
     
    function Slime(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }

    Slime.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.c = {
        r: rand(255, 255),
        g: rand(255, 255),
        b: rand(255, 255)
      };
      this.r = 1 + i * 5;
      this.v = 2;
      this.a = 0;
      this.rad = this.a * Math.PI / 180;
      this.points = [];
      this.setPoints();
    };

    Slime.prototype.setPoints = function() {
      for (var i = 0; i < circleSplit; i++) {
        var pointX = Math.cos(this.rad) * this.r;
        var pointY = Math.sin(this.rad) * this.r;
        var point = [pointX, pointY, angles[i]];
        this.points.push(point);
        this.a += angleSplit;
        this.rad = this.a * Math.PI / 180;
      }
    };

    Slime.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.strokeStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.lineWidth = 0.4;
      ctx.translate(Math.cos(this.rad) * dist + this.x, Math.cos(this.rad) * dist + this.y);
      ctx.rotate(this.rad);
      ctx.scale(Math.cos(this.rad), Math.sin(this.rad));
      ctx.translate(-Math.cos(this.rad) * dist - this.x, -Math.sin(this.rad) * dist - this.y);
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
      ctx.stroke();
      ctx.restore();
    };

    Slime.prototype.transform = function() {
      for (var i = 0; i < this.points.length; i++) {
        this.points[i][0] -= Math.sin(this.points[i][2] * Math.PI / 180);
        this.points[i][1] -= Math.cos(this.points[i][2] * Math.PI / 180);
        this.points[i][2] -= this.v;
      }
    };

    Slime.prototype.updateParams = function() {
      this.a += 0.1;
      this.rad = this.a * Math.PI / 180;
    };

    Slime.prototype.render = function() {
      this.transform();
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < slimeNum; i++) {
      var slime = new Slime(ctx, X / 2, Y / 2, i);
      slimes.push(slime);
    }

    /********************
      ChangeColor
    ********************/
    
    function changeColor() {
      var time = rand(1000, 5000);
      var r = rand(0, 255);
      var g = rand(0, 255);
      var b = rand(0, 255);
      for (var i = 0; i < slimes.length; i++) {
        slimes[i].c  = {
          r: r,
          g: g,
          b: b,
        };
      }
      setTimeout(changeColor, time);
    }

    changeColor();

    /********************
      Render
    ********************/
    
    function render(){
      //ctx.clearRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "darken";
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
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
      slimes = [];
      if (X  < 768) {
        slimeNum = 50;
        dist = 100;
      } else {
        slimeNum = 100;
        dist = 300;
      }
      for (var i = 0; i < slimeNum; i++) {
        var slime = new Slime(ctx, X / 2, Y / 2, i);
        slimes.push(slime);
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  }); 
  // Author
  console.log('File Name / jellyfish.js\nCreated Date / Jun 24, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
