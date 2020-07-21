/*
* File Name / anpanman.js
* Created Date / July 21, 2020
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
    title.textContent = 'ANPANMAN / アンパンマン';

    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    var dist = 150;
    var ease = 0.3;
    var friction = 0.9;
    var diffX = dist / 2; 
    var diffY = dist / 4; 
    var shapeXNum = X / dist;
    var shapeYNum = Y / dist;
    var shapes = [];
    var style = {
      black: 'black',
      white: 'white',
      lineWidth: 2,
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
    
    function Shape(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }
    
    Shape.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.xi = rand(0, X);
      this.yi = rand(0, Y);
      this.i = i;
      this.r = dist / 2;
      this.v = {
        x: 0,
        y: 0
      };
      this.a = this.i * 10;
      this.rad = this.a * Math.PI / 180;
    };
    
    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineWidth = style.lineWidth;
      ctx.strokeStyle = style.white;
      ctx.fillStyle = style.black;
      ctx.globalAlpha = Math.sin(this.rad);
      ctx.beginPath();
      ctx.arc(this.xi, this.yi, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.stroke();
      // nose
      ctx.fillStyle = style.white;
      ctx.beginPath();
      ctx.arc(this.xi, this.yi, this.r / 3, 0, Math.PI * 2, false);
      ctx.stroke();
      // cheek left
      ctx.beginPath();
      ctx.arc(this.xi - this.r / 1.5, this.yi, this.r / 3, 270 * Math.PI / 180, 90 * Math.PI / 180, false);
      ctx.stroke();
      // cheek right
      ctx.beginPath();
      ctx.arc(this.xi + this.r / 1.5, this.yi, this.r / 3, 270 * Math.PI / 180, 90 * Math.PI / 180, true);
      ctx.stroke();
      // mouth
      ctx.beginPath();
      ctx.arc(this.xi, this.yi + this.r / 6, this.r / 2, 30 * Math.PI / 180, 150 * Math.PI / 180, false);
      ctx.stroke();
      // eye left
      ctx.translate(this.xi, this.yi);
      ctx.scale(1, 1.4);
      ctx.translate(-this.xi, -this.yi);
      ctx.beginPath();
      ctx.arc(this.xi - this.r / 4, this.yi - this.r / 3, this.r / 10, 0, Math.PI * 2, false);
      ctx.fill();
      // eye right
      ctx.beginPath();
      ctx.arc(this.xi + this.r / 4, this.yi - this.r / 3, this.r / 10, 0, Math.PI * 2, false);
      ctx.fill();
      // eyebrow left
      ctx.beginPath();
      ctx.arc(this.xi - this.r / 4, this.yi - this.r / 2.5, this.r / 5, 180 * Math.PI / 180, Math.PI * 2, false);
      ctx.stroke();
      // eyebrow right
      ctx.beginPath();
      ctx.arc(this.xi + this.r / 4, this.yi - this.r / 2.5, this.r / 5, 180 * Math.PI / 180, Math.PI * 2, false);
      ctx.stroke();
      ctx.restore();
    };

    Shape.prototype.render = function() {
      this.updateParams();
      this.updatePosition();
      this.draw();
    };

    Shape.prototype.updateParams = function() {
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.updatePosition = function() {
      this.v.x += (this.xi - this.x) * ease;
      this.v.y += (this.yi - this.y) * ease;
      this.v.x *= friction;
      this.v.y *= friction;
      this.xi -= this.v.x / 100;
      this.yi -= this.v.y / 100;
    };

    for (var i = 0; i < shapeYNum + 3; i++) {
      for (var j = 0; j < shapeXNum + 1; j++) {
        var s;
        if (i % 2 === 0) {
          s = new Shape(ctx, j * dist + diffX, i * dist - diffY * i, i);
        } else {
          s = new Shape(ctx, j * dist, i * dist - diffY * i, i);
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
      for (var i = 0; i < shapeYNum + 3; i++) {
        for (var j = 0; j < shapeXNum + 1; j++) {
          var s;
          if (i % 2 === 0) {
            s = new Shape(ctx, j * dist + diffX, i * dist - diffY * i, i);
          } else {
            s = new Shape(ctx, j * dist, i * dist - diffY * i, i);
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
