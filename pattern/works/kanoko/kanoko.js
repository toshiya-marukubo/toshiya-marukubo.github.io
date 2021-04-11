/*
* File Name / kanoko.js
* Created Date / July 23, 2020
* Aurhor / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
* Referenced 日本・中国の文様事典 (9784881081501)
* Referenced http://javait.hatenablog.com/entry/2016/01/23/231004
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
    title.textContent = 'KANOKO / 鹿子';
    
    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    var height = 50;
    var diffX = height * 1.5; 
    var diffY = height / 2; 
    var shapes = [];
    var shapeXNum = X / diffX;
    var shapeYNum = Y / diffY;
    var poly = Math.PI * 2 / 4;
    var mouseDist = 50;
    var ease = 0.3;
    var friction = 0.9;
    var style = {
      black: 'black',
      white: 'white',
      lineWidth: 4
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
      this.xi = this.x;
      this.yi = this.y;
      this.i = i;
      this.r = rand(height / 2.5, height / 2);
      this.a = j * 10;
      this.rad = this.a * Math.PI / 180;
      this.v = {
        x: 0,
        y: 0
      };
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      Math.sin(this.rad / 5) < 0 ? ctx.globalAlpha = -Math.sin(this.rad / 5) : ctx.globalAlpha = Math.sin(this.rad / 5);
      ctx.fillStyle = style.white;
      ctx.translate(this.x, this.y);
      ctx.rotate(45 * Math.PI / 180);
      ctx.translate(-this.x, -this.y);
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + this.r / 1.4);
      for(var i = 1; i < 4 + 1; i++) {
        var cX = Math.sin((i - 0.5) * poly) * this.r + this.x;
        var cY = Math.cos((i - 0.5) * poly) * this.r + this.y;
        var x = Math.sin(i * poly) * this.r / 1.4 + this.x;
        var y = Math.cos(i * poly) * this.r / 1.4 + this.y; 
        ctx.quadraticCurveTo(cX, cY, x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = style.black;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + this.r / 8);
      for(var i = 1; i < 4 + 1; i++) {
        var cX = Math.sin((i - 0.5) * poly) * this.r / 5 + this.x;
        var cY = Math.cos((i - 0.5) * poly) * this.r / 5 + this.y;
        var x = Math.sin(i * poly) * this.r / 8 + this.x;
        var y = Math.cos(i * poly) * this.r / 8 + this.y; 
        ctx.quadraticCurveTo(cX, cY, x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    Shape.prototype.updateParams = function() {
      this.a -= 3;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.mouseDist = function() {
      var x = mouseX - this.x;
      var y = mouseY - this.y;
      var d = x * x + y * y;
      var dist = Math.sqrt(d);
      if (dist < mouseDist) {
        this.v.x = +this.v.x;
        this.v.y = +this.v.y;
        var colAngle = Math.atan2(mouseY - this.y, mouseX - this.x);
        this.v.x = -Math.cos(colAngle) * 5;
        this.v.y = -Math.sin(colAngle) * 5;
        this.x += this.v.x;
        this.y += this.v.y;
      } else if (dist > mouseDist && dist < mouseDist + 10) {
        this.v.x = 0;
        this.v.y = 0;
      } else {
        this.v.x += (this.xi - this.x) * ease;
        this.v.y += (this.yi - this.y) * ease;
        this.v.x *= friction;
        this.v.y *= friction;
        this.x += this.v.x;
        this.y += this.v.y;
      }
    };

    Shape.prototype.render = function(i) {
      //if (mouseX !== null) this.mouseDist();
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

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, false);

    canvas.addEventListener('touchmove', function(e) {
      var touch = e.targetTouches[0];
      mouseX = touch.pageX;
      mouseY = touch.pageY;
    });

  });
})();
