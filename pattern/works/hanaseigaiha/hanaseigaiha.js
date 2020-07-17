/*
* File Name / hanaseigaiha.js
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
    title.textContent = 'HANASEIGAIHA / 花青海波';

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
    var ease = 0.3;
    var friction = 0.9;
    var style = {
      black: 'black',
      white: 'white',
      lineWidth: 3,
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
      this.xi = rand(0, X);
      this.yi = rand(0, Y);
      this.r = dist / 2;
      this.v = {
        x: 0,
        y: 0
      };
      this.a = this.i;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = style.lineWidth;
      ctx.fillStyle = style.black;
      ctx.translate(this.xi, this.yi);
      ctx.rotate(this.rad);
      ctx.translate(-this.xi, -this.yi);
      for (var i = 0; i < 3; i++) {
        if (i === 1) {
          ctx.fillStyle = style.white;
        } else {
          ctx.fillStyle = style.black;
        }
        ctx.beginPath();
        ctx.arc(this.xi, this.yi, this.r - 20 * i, 0, Math.PI * 2, false);
        ctx.fill();
      }
      ctx.strokeStyle = style.white;
      ctx.fillStyle = style.white;
      for (var i = 0; i < 12; i++) {
        ctx.translate(this.xi, this.yi);
        ctx.rotate(30 * Math.PI / 180);
        ctx.translate(-this.xi, -this.yi);
        ctx.beginPath();
        ctx.moveTo(this.xi, this.yi);
        ctx.lineTo(this.xi, this.yi + this.r / 2.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.xi, this.yi + this.r / 2.5, this.r / 20, 0, Math.PI * 2, false);
        ctx.fill();
      }
      ctx.restore();
    };

    Shape.prototype.updatePosition = function() {
      this.v.x += (this.xi - this.x) * ease;
      this.v.y += (this.yi - this.y) * ease;
      this.v.x *= friction;
      this.v.y *= friction;
      this.xi -= this.v.x / 100;
      this.yi -= this.v.y / 100;
    };
    
    Shape.prototype.updateParams = function() {
      if (this.i % 2 === 0) {
        this.a += 0.3;
      } else {
        this.a -= 0.3;
      }
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.render = function() {
      this.updateParams();
      this.updatePosition();
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