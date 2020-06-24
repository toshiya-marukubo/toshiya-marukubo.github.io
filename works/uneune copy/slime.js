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
    var slimeNum = X / 8;
    var slimes = [];
    var circleSplit = 36;
    var angleSplit = 360 / circleSplit;
    var angles = [];
    for (var i = 0; i < slimeNum; i++) {
      angles.push(rand(0, 360));
    }
     
    function Slime(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }

    Slime.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.c = 'white';
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
        this.rad = this.a * Math.PI / 180;
        this.a += angleSplit;
      }
    };

    Slime.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      //ctx.translate(Math.cos(this.rad) * 300 + this.x, Math.cos(this.rad) * 300 + this.y);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rad);
      ctx.translate(-this.x, -this.y);
      //ctx.scale(Math.cos(this.rad), Math.sin(this.rad));
      //ctx.translate(-Math.cos(this.rad) * 300 - this.x, -Math.sin(this.rad) * 300 - this.y);
      ctx.strokeStyle = this.c;
      ctx.lineWidth = 0.5;
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

    Slime.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 2;
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
      for (var i = 0; i < slimes.length; i++) {
        slimes[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  }); 
  // Author
  console.log('File Name / slime.js\nCreated Date / April 28, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
