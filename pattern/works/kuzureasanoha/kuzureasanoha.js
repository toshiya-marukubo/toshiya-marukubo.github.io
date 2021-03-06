/*
* File Name / kuzureasanoha.js
* Created Date / July 24, 2020
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
    title.textContent = 'KUZUREASANOHA / 崩れ麻の葉';

    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    var shapeNum;
    var shapes = [];
    var height = 200;
    var dist = Math.cos(30 * Math.PI / 180) * height;
    var rad = Math.PI * 2 / 6;
    var rad2 = Math.PI * 2 / 12;
    var style = {
      black: 'black',
      white: 'white',
      lineWidth: 4
    };
    X > Y ? shapeNum = X / dist : shapeNum = Y / (height / 2 + height / 4);

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
      this.r = height / 2;
      this.dia = Math.sqrt(this.r * this.r + this.r * this.r);
      this.v = {
        x: 0,
        y: 0
      };
      this.a = 0;
      this.rad = this.a * Math.PI / 180;
      this.random = Math.random();
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.strokeStyle = style.white;
      ctx.lineWidth = style.lineWidth;
      ctx.translate(this.x, this.y);
      ctx.rotate(90 * Math.PI / 180);
      ctx.translate(-this.x, -this.y);
      for (var i = 1; i < 7; i++) {
        ctx.translate(this.x, this.y);
        ctx.rotate(60 * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
        ctx.beginPath();
        ctx.moveTo(this.x + this.r, this.y);
        ctx.lineTo(Math.sin(this.rad) * this.r / 5 + this.r / 1.3 + this.x, this.y);
        ctx.stroke();
      }
      ctx.translate(this.x, this.y);
      ctx.rotate(15 * Math.PI / 180);
      ctx.translate(-this.x, -this.y);
      for (var i = 0; i < 12; i++) {
        ctx.translate(this.x, this.y);
        ctx.rotate(30 * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + Math.sin(this.rad) * this.r / 5 + this.r / 5, Math.sin(this.rad) * this.r / 5 + this.y + this.r / 5);
        ctx.stroke();
      }
      ctx.restore();
    };

    Shape.prototype.updateParams = function() {
      this.a += 2;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.render = function() {
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < shapeNum + 1; i++) {
      for (var j = 0; j < shapeNum + 1; j++) {
        if (X > Y) {
          if (j * dist - dist - dist > Y) break;
        } else {
          if (j * (height / 2 + height / 4) - (height / 2 + height / 4) > Y) break;
        }
        var s;
        if (j % 2 !== 0) {
          s = new Shape(ctx, dist * i + dist / 2, (height / 2 + height / 4) * j, i, j);
        } else {
          s = new Shape(ctx, dist * i, (height / 2 + height / 4) * j, i, j);
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
      X > Y ? shapeNum = X / dist : shapeNum = Y / (height / 2 + height / 4);
      shapes = [];
      for (var i = 0; i < shapeNum + 1; i++) {
        for (var j = 0; j < shapeNum + 1; j++) {
          if (X > Y) {
            if (j * dist - dist - dist > Y) break;
          } else {
            if (j * (height / 2 + height / 4) - (height / 2 + height / 4) > Y) break;
          }
          var s;
          if (j % 2 !== 0) {
            s = new Shape(ctx, dist * i + dist / 2, (height / 2 + height / 4) * j, i, j);
          } else {
            s = new Shape(ctx, dist * i, (height / 2 + height / 4) * j, i, j);
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

