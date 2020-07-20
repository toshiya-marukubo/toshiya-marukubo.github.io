/*
* File Name / sankuzushi.js
* Created Date / July 20, 2020
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
    title.textContent = 'SANKUZUSHI / 三崩し';

    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    var ease = 0.3;
    var friction = 0.9;
    var dist = 50;
    var lineDist = dist / 4;
    var shapeNumX = X / dist;
    var shapeNumY = Y / dist;
    var shapes = [];
    var angle = 0;
    var style = {
      black: 'black',
      white: 'white',
      lineWidth: 6,
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
      this.xi = rand(0, X);
      this.yi = rand(0, Y);
      this.i = i;
      this.j = j;
      this.r = dist / 10;
      this.v = {
        x: 0, 
        y: 0
      };
      this.a = rand(0, 360);
      this.rad = this.a * Math.PI / 180;
    };
    
    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = style.lineWidth;
      ctx.strokeStyle = style.white;
      for (var i = 1; i < 4; i++) {
        ctx.beginPath();
        if (this.i % 2 === 0 && this.j % 2 === 0) {
          ctx.moveTo(this.xi, this.yi + i * lineDist);
          ctx.bezierCurveTo(this.xi + dist / 3, this.yi + i * lineDist - Math.sin(this.rad) * 10, this.xi + dist / 3 + dist / 3, this.yi + i * lineDist - Math.cos(this.rad) * 10, this.xi + dist, this.yi + i * lineDist);
        }
        if (this.i % 2 !== 0 && this.j % 2 === 0) {
          ctx.moveTo(this.xi + i * lineDist, this.yi);
          ctx.lineTo(this.xi + i * lineDist, this.yi + dist);
        }
        if (this.i % 2 === 0 && this.j % 2 !== 0) {
          ctx.moveTo(this.xi + i * lineDist, this.yi);
          ctx.lineTo(this.xi + i * lineDist, this.yi + dist);
        }
        if (this.i % 2 !== 0 && this.j % 2 !== 0) {
          ctx.moveTo(this.xi, this.yi + i * lineDist);
          ctx.lineTo(this.xi + dist, this.yi + i * lineDist);
        }
        ctx.stroke();
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
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.render = function(i) {
      this.updateParams();
      this.updatePosition();
      this.draw();
    };

    for (var i = 0; i < shapeNumX + 1; i++) {
      for (var j = 0; j < shapeNumY + 1; j++) {
        var s = new Shape(ctx, dist * i,  dist * j, i, j);
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
      shapeNumX = X / dist;
      shapeNumY = Y / dist;
      shapes = [];
      for (var i = 0; i < shapeNumX + 1; i++) {
        for (var j = 0; j < shapeNumY + 1; j++) {
          var s = new Shape(ctx, dist * i,  dist * j, i, j);
          shapes.push(s);
        }
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  });
})();
