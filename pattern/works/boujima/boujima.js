/*
* File Name / boujima.js
* Created Date / July 28, 2020
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
    title.textContent = 'BOUJIMA / 棒縞';

    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    var dist = 100;
    var lineDist = dist / 5;
    var shapeNumX = X / dist;
    var shapes = [];
    var ease = 0.1;
    var friction = 0.9;
    var style = {
      black: 'black',
      white: 'white',
      lineWidth: 50,
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
      this.cx = this.x;
      this.cy = this.y / 2;
      this.i = i;
      this.v = {
        x: 0,
        y: 0
      };
    };
    
    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = style.lineWidth;
      ctx.strokeStyle = style.white;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - 50);
      ctx.quadraticCurveTo(this.cx, this.cy, this.x, Y + 50);
      ctx.stroke();
      ctx.restore();
    };

    Shape.prototype.dist = function() {
      if (mouseX === null) return;
      var x = Math.abs(mouseX - this.cx);
      if (x < dist) {
        this.v.x += (mouseX - this.x) * ease;
        this.v.y += (mouseY - this.y) * ease;
        this.v.x *= friction;
        this.v.y *= friction;
        this.cx += this.v.x;
        this.cy += this.v.y;
      }
    };

    Shape.prototype.updatePosition = function() {
      this.v.x += (this.cx - this.x) * ease;
      this.v.y += (this.cy - this.y) * ease;
      this.v.x *= friction;
      this.v.y *= friction;
      this.cx -= this.v.x;
      this.cy -= this.v.y;
    };

    Shape.prototype.render = function(i) {
      this.updatePosition();
      this.dist();
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
      shapeNumX = X / dist;
      shapes = [];
      for (var i = 0; i < shapeNumX + 1; i++) {
        var s = new Shape(ctx, dist * i,  0, i);
        shapes.push(s);
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    canvas.addEventListener('mousemove', function(e){
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, false);

    canvas.addEventListener('touchstart', function(e) {
      var touch = e.targetTouches[0];
      mouseY = touch.pageY;
      mouseX = touch.pageX;
    }, false);

    canvas.addEventListener('touchmove', function(e) {
      var touch = e.targetTouches[0];
      mouseY = touch.pageY;
      mouseX = touch.pageX;
    }, false);

    canvas.addEventListener('touchend', function(e) {
      mouseY = null;
      mouseX = null;
    }, false);

  });
})();
