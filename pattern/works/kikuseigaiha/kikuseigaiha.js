/*
* File Name / kikuseigaiha.js
* Created Date / July 14, 2020
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
    title.textContent = 'KIKUSEIGAIHA / 菊青海波';

    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    var dist = 200;
    var diffX = dist / 2; 
    var diffY = dist / 1.5; 
    var shapeXNum = X / dist;
    var shapeYNum = Y / dist;
    var shapes = [];
    var style = {
      black: 'black',
      white: 'white',
      lineWidth: 5,
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
      this.r = dist / 2;
      this.a = 0;
      this.rad = this.a * Math.PI / 180;
      this.ss = i % 2 === 0 ? style.white : style.black;
      this.fs = i % 2 === 0 ? style.black : style.white;
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = style.lineWidth;
      ctx.strokeStyle = this.ss;
      ctx.fillStyle = this.fs;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rad);
      ctx.translate(-this.x, -this.y);
      for (var i = 18; i > 0; i--) {
        ctx.translate(this.x, this.y);
        ctx.rotate(20 * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.r / 6, this.y - this.r);
        ctx.quadraticCurveTo(this.x, this.y - this.r - this.r / 5, this.x + this.r / 6, this.y - this.r); 
        ctx.lineTo(this.x, this.y);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r / 10, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    Shape.prototype.updateParams = function() {
      if (this.i % 2 === 0) {
        this.a += 1;
        this.rad = this.a * Math.PI / 180;
      } else {
        this.a -= 1;
        this.rad = this.a * Math.PI / 180;
      }
    };
    
    Shape.prototype.render = function() {
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < shapeYNum * 2 * 1.5 + 1; i++) {
      for (var j = 0; j < shapeXNum + 1; j++) {
        var s;
        if (i % 2 === 0) {
          s = new Shape(ctx, j * dist + diffX, i * dist - diffY * i, j);
        } else {
          s = new Shape(ctx, j * dist, i * dist - diffY * i, j);
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
      shapeXNum = X / dist;
      shapeYNum = Y / dist;
      shapes = [];
      for (var i = 0; i < shapeYNum * 2 * 1.5 + 1; i++) {
        for (var j = 0; j < shapeXNum + 1; j++) {
          var s;
          if (i % 2 === 0) {
            s = new Shape(ctx, j * dist + diffX, i * dist - diffY * i, j);
          } else {
            s = new Shape(ctx, j * dist, i * dist - diffY * i, j);
          }
          shapes.push(s);
        }
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  });
})();
