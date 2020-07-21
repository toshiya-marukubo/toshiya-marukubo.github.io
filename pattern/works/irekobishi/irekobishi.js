/*
* File Name / irekobishi.js
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
    title.textContent = 'IREKOBISHI / 入子菱';
    
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
      this.a = i * j * 10;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = style.lineWidth;
      Math.sin(this.rad / 5) < 0 ? ctx.globalAlpha = -Math.sin(this.rad / 5) : ctx.globalAlpha = Math.sin(this.rad / 5);
      for (var i = 0; i < 5; i++) {
        if (i === 0) ctx.strokeStyle = style.black;
        if (i !== 0) ctx.strokeStyle = style.white;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - (this.r - 20 * i));
        ctx.lineTo(this.x + (this.r - 20 * i) * 1.5, this.y);
        ctx.lineTo(this.x, this.y + (this.r - 20 * i));
        ctx.lineTo(this.x - (this.r - 20 * i) * 1.5, this.y);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();
    };

    Shape.prototype.updateParams = function() {
      this.a += 3;
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
