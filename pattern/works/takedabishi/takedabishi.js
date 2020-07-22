/*
* File Name / takedabishi.js
* Created Date / July 22, 2020
* Aurhor / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
* Referenced 日本・中国の文様事典 (9784881081501)
*/

(function () {
  'use strict';
  window.addEventListener('load', function () {
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
      Change Title
    ********************/
    
    var title = document.getElementById('title');
    title.textContent = 'TAKEDABISHI / 武田菱';
    
    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    var height = 200;
    var diffX = height * 1.5; 
    var diffY = height / 2; 
    var shapes = [];
    var shapeXNum = X / diffX;
    var shapeYNum = Y / diffY;
    var style = {
      black: 'black',
      white: 'white',
      lineWidth: 8,
    };

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
      Shape
    ********************/
    
    function Shape(ctx, x, y, i, j) {
      this.ctx = ctx;
      this.init(x, y, i, j);
    }
    
    Shape.prototype.init = function(x, y, i, j) {
      this.x = x;
      this.y = y;
      this.i = i;
      this.r = height / 2;
      this.a = 0;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = style.lineWidth;
      ctx.strokeStyle = style.white;
      ctx.translate(this.x, this.y);
      ctx.scale(Math.sin(this.rad), Math.cos(this.rad * 3));
      ctx.translate(-this.x, -this.y);
      for (var i = 0; i < 2; i++) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - (this.r - 30 * i));
        ctx.lineTo(this.x + (this.r - 30 * i) * 1.5, this.y);
        ctx.lineTo(this.x, this.y + (this.r - 30 * i));
        ctx.lineTo(this.x - (this.r - 30 * i) * 1.5, this.y);
        ctx.closePath();
        ctx.stroke();
      }
      for (var i = 0; i < 4; i++) {
        var x = Math.sin(90 * i * Math.PI / 180) * this.r / 5 * 1.5 + this.x;
        var y = Math.cos(90 * i * Math.PI / 180) * this.r / 5 + this.y;
        ctx.beginPath();
        ctx.moveTo(x, y - (this.r - 80));
        ctx.lineTo(x + (this.r - 80) * 1.5, y);
        ctx.lineTo(x, y + (this.r - 80));
        ctx.lineTo(x - (this.r - 80) * 1.5, y);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();
    };

    Shape.prototype.updateParams = function() {
      this.a += 0.5;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.render = function(i) {
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < shapeYNum + 1; i++) {
      for (var j = 0; j < shapeXNum + 1; j++) {
        var s;
        if (i % 2 === 0) {
          s = new Shape(ctx, j * diffX, i * diffY, i, j);
        } else {
          s = new Shape(ctx, j * diffX + diffX / 2, i * diffY, i, j);
        }
        shapes.push(s);
      }
    }
   
    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].render(i);
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
      shapes = [];
      shapeXNum = X / diffX;
      shapeYNum = Y / diffY;
      for (var i = 0; i < shapeYNum + 1; i++) {
        for (var j = 0; j < shapeXNum + 1; j++) {
          var s;
          if (i % 2 === 0) {
            s = new Shape(ctx, j * diffX, i * diffY, i, j);
          } else {
            s = new Shape(ctx, j * diffX + diffX / 2, i * diffY, i, j);
          }
          shapes.push(s);
        }
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    }, false);

  });
})();
