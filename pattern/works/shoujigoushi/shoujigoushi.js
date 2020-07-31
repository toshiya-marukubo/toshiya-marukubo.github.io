/*
* File Name / shoujigoushi.js
* Created Date / July 31, 2020
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
    title.textContent = 'SHOUJIGOUSHI / 障子格子';

    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    var dist = 100;
    var distV = 150;
    var shapeNumX = X / dist;
    var shapeNumY = Y / distV;
    var shapes = [];
    var ease = 0.1;
    var friction = 0.9;
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
    
    function Shape(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }
    
    Shape.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.cpx1 = this.x;
      this.cpy1 = Y / 2;
      this.cpx2 = X / 2;
      this.cpy2 = this.y;
      this.v = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
      };
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.strokeStyle = style.white;
      ctx.lineWidth = style.lineWidth;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      if (this.y === 0) ctx.quadraticCurveTo(this.cpx1, this.cpy1, this.x, Y);
      if (this.x === 0) ctx.quadraticCurveTo(this.cpx2, this.cpy2, X, this.y);
      ctx.stroke();
      ctx.beginPath();
      if (this.y === 0) {
        ctx.moveTo(this.x + style.lineWidth * 3, this.y);
        ctx.quadraticCurveTo(this.cpx1 + style.lineWidth * 3, this.cpy1, this.x + style.lineWidth * 3, Y);
      }
      ctx.stroke();
      ctx.restore();
    };

    Shape.prototype.dist = function() {
      if (mouseX === null) return;
      var x = Math.abs(mouseX - this.cpx1);
      var y = Math.abs(mouseY - this.cpy2);
      if (x < 100) {
        this.v.x1 += (mouseX - this.cpx1) * ease;
        this.v.y1 += (mouseY - this.cpy1) * ease;
        this.v.x1 *= friction;
        this.v.y1 *= friction;
        this.cpx1 += this.v.x1;
        this.cpy1 += this.v.y1;
      }
      if (y < 100) {
        this.v.x2 += (mouseX - this.cpx2) * ease;
        this.v.y2 += (mouseY - this.cpy2) * ease;
        this.v.x2 *= friction;
        this.v.y2 *= friction;
        this.cpx2 += this.v.x2;
        this.cpy2 += this.v.y2;
      }
    };

    Shape.prototype.updatePosition = function() {
      // vertical
      this.v.x1 += (this.cpx1 - this.x) * ease;
      this.v.y1 += (this.cpy1 - this.y) * ease;
      this.v.x1 *= friction;
      this.v.y1 *= friction;
      this.cpx1 -= this.v.x1;
      this.cpy1 -= this.v.y1;
      // width
      this.v.x2 += (this.cpx2 - this.x) * ease;
      this.v.y2 += (this.cpy2 - this.y) * ease;
      this.v.x2 *= friction;
      this.v.y2 *= friction;
      this.cpx2 -= this.v.x2;
      this.cpy2 -= this.v.y2;
    };

    Shape.prototype.render = function(i) {
      this.updatePosition();
      this.dist();
      this.draw();
    };

    for (var i = 1; i < shapeNumX + 1; i++) {
      var s = new Shape(ctx, dist * i, 0);
      shapes.push(s);
    }

    for (var j = 1; j < shapeNumY + 1; j++) {
      var s = new Shape(ctx, 0, distV * j);
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
      shapeNumY = Y / distV;
      shapes = [];
      for (var i = 1; i < shapeNumX + 1; i++) {
        var s = new Shape(ctx, dist * i, 0, i, j);
        shapes.push(s);
      }

      for (var j = 1; j < shapeNumY + 1; j++) {
        var s = new Shape(ctx, 0, distV * j, i, j);
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
