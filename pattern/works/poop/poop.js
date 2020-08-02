/*
* File Name / poop.js
* Created Date / Aug 02, 2020
* Aurhor / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
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
    title.textContent = "not poop / うんこじゃない。";

    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var range = document.getElementById('range');
    var mouseX = null;
    var mouseY = null;
    var ease = 0.3;
    var friction = 0.9;
    var dist = range.value;
    var shapeNumX = X / dist;
    var shapeNumY = Y / dist;
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
      this.x = rand(0, X);
      this.y = rand(0, Y);
      this.xi = x;
      this.yi = y;
      this.i = i;
      this.j = j;
      this.r = dist / 4;
      this.hover = false;
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
      ctx.strokeStyle = style.black;
      ctx.fillStyle = style.white;
      ctx.translate(this.x, this.y);
      ctx.scale(2, 1);
      ctx.translate(-this.x, -this.y);
      // bottom
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      // middle
      ctx.beginPath();
      ctx.arc(this.x, this.y - this.r * 1.1, this.r / 1.2, 0, Math.PI * 2, false);
      ctx.fill();
      // top
      ctx.beginPath();
      ctx.arc(this.x, this.y - this.r * 2, this.r / 1.5, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(this.x - this.r / 2, this.y - this.r * 2);
      ctx.lineTo(this.x, this.y - this.r * 2 - this.r);
      ctx.quadraticCurveTo(this.x, this.y - this.r - this.r * 1.5, this.x + this.r / 2, this.y - this.r * 2);
      ctx.closePath();
      ctx.fill();
      // eye
      ctx.translate(this.x, this.y);
      ctx.scale(1 / 2, 1);
      ctx.translate(-this.x, -this.y);
      ctx.fillStyle = style.black;
      ctx.beginPath();
      ctx.arc(this.x - this.r / 2, this.y - this.r * 1.1, this.r / 8, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x + this.r / 2, this.y - this.r * 1.1, this.r / 8, 0, Math.PI * 2, false);
      ctx.fill();
      // mouth
      ctx.lineCap = 'round';
      ctx.lineWidth = this.r / 10;
      if (Math.sin(this.rad) < 0) {
        ctx.beginPath();
        ctx.arc(this.x, this.y - this.r / 2, this.r / 5, 0, Math.PI * 2, false);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y - this.r / 2, this.r / 2, 0, Math.PI, false);
        ctx.stroke();
      }
      ctx.restore();
    };

    Shape.prototype.updatePosition = function() {
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Shape.prototype.updatePosition = function() {
      this.v.x += (this.x - this.xi) * ease;
      this.v.y += (this.y - this.yi) * ease;
      this.v.x *= friction;
      this.v.y *= friction;
      this.x -= this.v.x / 100;
      this.y -= this.v.y / 100;
    };

    Shape.prototype.updateParams = function() {
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
      //Math.sin(this.rad) < 0 ? this.r = -Math.sin(this.rad) * dist / 4 : this.r = Math.sin(this.rad) * dist / 4;
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

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, false);

    range.addEventListener('input', function() {
      dist = this.value;
      shapeNumX = X / dist;
      shapeNumY = Y / dist;
      shapes = [];
      for (var i = 0; i < shapeNumX + 1; i++) {
        for (var j = 0; j < shapeNumY + 1; j++) {
          var s = new Shape(ctx, dist * i,  dist * j, i, j);
          shapes.push(s);
        }
      }
    }, false);

  });
})();
