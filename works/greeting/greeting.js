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
      Greet
    ********************/
    
    // var
    var greetNum = 1;
    var greets = [];
    var text = 'Nice to meet you. ';
    var textNum = text.length;
    var circleSplit = textNum;
    var angleSplit = 360 / circleSplit;
    
    function Greet(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Greet.prototype.init = function(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.v = 1;
      this.a = 0;
      this.rad = this.a * Math.PI / 180;
      this.points = [];
      this.setPoints();
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(0, 255)
      };
    };

    Greet.prototype.setPoints = function() {
      for (var i = 0; i < circleSplit; i++) {
        var pointX = Math.cos(this.rad) * this.r;
        var pointY = Math.sin(this.rad) * this.r;
        var point = [pointX, pointY, rand(0, 360)];
        this.points.push(point);
        this.a += angleSplit;
        this.rad = this.a * Math.PI / 180;
      }
    };

    Greet.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.beginPath();
      ctx.translate(this.x, this.y);
      ctx.rotate(Math.sin(this.rad) * 3);
      ctx.translate(-this.x, -this.y);
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
      ctx.save();
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.font = '36px "Hiragino Kaku Gothic Std"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.translate(this.x, this.y);
      ctx.rotate(Math.sin(this.rad) * 3);
      ctx.translate(-this.x, -this.y);
      for (var i = 0; i < text.length; i++) {
        ctx.save();
        ctx.translate(this.points[i][0] * 1 + this.x, this.points[i][1] * 1 + this.y);
        ctx.rotate((angleSplit * i + 90) * Math.PI / 180);
        ctx.translate(-this.points[i][0] * 1 - this.x, -this.points[i][1] * 1 - this.y);
        ctx.fillText(text[i], this.points[i][0] * 1 + this.x, this.points[i][1] * 1 + this.y);
        ctx.restore();
      }
      ctx.restore();
    };

    Greet.prototype.transform = function() {
      for (var i = 0; i < this.points.length; i++) {
        this.points[i][0] -= Math.sin(this.points[i][2] * Math.PI / 180 * 5);
        this.points[i][1] -= Math.cos(this.points[i][2] * Math.PI / 180 * 8);
        this.points[i][2] -= this.v;
      }
    };

    Greet.prototype.updateParams = function() {
      this.a += 0.3;
      this.rad = this.a * Math.PI / 180;
    };

    Greet.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 2;
    };

    Greet.prototype.render = function() {
      this.updateParams();
      this.transform();
      this.draw();
    };

    for (var i = 0; i < greetNum; i++) {
      var g = new Greet(ctx, X / 2, Y / 2, 110);
      greets.push(g);
    }

    function changeColor() {
      var time = rand(1000, 5000);
      var r = rand(0, 255);
      var g = rand(0, 255);
      var b = rand(0, 255);
      for (var i = 0; i < greets.length; i++) {
        greets[i].c  = {
          r: r,
          g: g,
          b: b
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
      for (var i = 0; i < greets.length; i++) {
        greets[i].render(i);
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
      for (var i = 0; i < greets.length; i++) {
        greets[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });
  
  }); 
  // Author
  console.log('File Name / greeting.js\nCreated Date / Jun 25, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
