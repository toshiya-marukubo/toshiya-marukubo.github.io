/*
* File Name / yorokejima.js
* Created Date / July 29, 2020
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
    title.textContent = 'YOROKEJIMA / よろけ縞';

    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    var dist = 50;
    var shapeNumX = X / dist;
    var shapes = [];
    var style = {
      black: 'black',
      white: 'white',
      lineWidth: 4,
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
      this.a = rand(0, 360);
      this.rad = this.a * Math.PI / 180;
      this.r = rand(5, 10);
    };
    
    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = style.lineWidth;
      ctx.strokeStyle = style.white;
      ctx.fillStyle = style.white;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.bezierCurveTo(Math.sin(this.rad) * 20 + this.x, Y / 3, -Math.sin(this.rad) * 20 + this.x, Y - Y / 3, this.x, Y);
      ctx.stroke();
      ctx.restore();
    };

    Shape.prototype.updateParams = function() {
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.render = function() {
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < shapeNumX + 1; i++) {
      var s = new Shape(ctx, dist * i,  0, i);
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
      shapes = [];
      shapeNumX = X / dist;
      for (var i = 0; i < shapeNumX + 1; i++) {
        var s = new Shape(ctx, dist * i,  0, i);
        shapes.push(s);
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  });
})();
