/*
* File Name / gokuzushi.js
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
    title.textContent = 'GOKUZUSHI / 五崩し';

    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var shapeNum = X;
    var angle = 137.5;
    var shapes = [];

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
      this.r = 5;
      this.a = this.i;
      this.rad = this.a * Math.PI / 180;
    };
    
    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(
        Math.cos(angle * Math.PI / 180 * this.i) * this.i / 2 + X / 2,
        Math.sin(angle * Math.PI / 180 * this.i) * this.i / 2 + Y / 2,
        this.r,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
      ctx.restore();
    };

    Shape.prototype.updateParams = function() {
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.render = function(i) {
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < shapeNum; i++) {
      var s = new Shape(ctx, X / 2,  Y / 2, i);
      shapes.push(s);
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
      shapeNumX = X / split;
      shapeNumY = Y / split;
      shapes = [];
      for (var i = 0; i < split; i++) {
        for (var j = 0; j < split; j++) {
          var s = new Shape(ctx, shapeNumX * i,  shapeNumY * j, i, j);
          shapes.push(s);
        }
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    range.addEventListener('input', function() {
      shapes = [];
      mod = this.value;
      rangeVal = this.value;
      split = rangeVal;
      shapeNumX = X / split;
      shapeNumY = Y / split;
      for (var i = 0; i < split; i++) {
        for (var j = 0; j < split; j++) {
          var s = new Shape(ctx, shapeNumX * i,  shapeNumY * j, i, j);
          shapes.push(s);
        }
      }
    });

  });
})();
