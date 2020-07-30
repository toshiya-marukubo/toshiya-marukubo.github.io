/*
* File Name / kuruwatsunagi.js
* Created Date / July 30, 2020
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
    title.textContent = 'KURUWATSUNAGI / 曲輪繋ぎ';

    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    var dist = 200;
    var rad = Math.PI * 2 / 4;
    var shapeNumX = X / dist;
    var shapeNumY = Y / dist * 2;
    var shapes = [];
    var style = {
      black: 'black',
      white: 'white',
      lineWidth: 8
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
    
    function drawLine() {
      ctx.save();
      ctx.strokeStyle = style.white;
      ctx.beginPath();
      for (var i = 0; i < shapeNumX; i++) {
        ctx.lineWidth = style.lineWidth / 1.5;
        ctx.beginPath();
        ctx.moveTo(dist * i, 0);
        ctx.lineTo(dist * i, Y);
        ctx.stroke();
        ctx.lineWidth = style.lineWidth;
        ctx.beginPath();
        ctx.moveTo(dist * i - dist / 2, 0);
        ctx.lineTo(dist * i - dist / 2, Y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(dist * i - dist / 2 - style.lineWidth * 1.5, 0);
        ctx.lineTo(dist * i - dist / 2 - style.lineWidth * 1.5, Y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(dist * i - dist / 2 + style.lineWidth * 1.5, 0);
        ctx.lineTo(dist * i - dist / 2 + style.lineWidth * 1.5, Y);
        ctx.stroke();
      }
      ctx.restore();
    }
     
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
      this.r = dist / 3;
      this.v = {
        x: 0, 
        y: 1
      };
      this.a = i * j * 5;
      this.rad = this.a * Math.PI / 180;
    };
    
    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = style.lineWidth;
      ctx.strokeStyle = style.white;
      ctx.translate(this.x, this.y);
      ctx.scale(Math.sin(this.rad), 1);
      ctx.translate(-this.x, -this.y);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.stroke();
      ctx.restore();
    };

    Shape.prototype.updateParams = function() {
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.updatePosition = function() {
      this.y += Math.cos(this.rad) * 2;
    };

    Shape.prototype.render = function(i) {
      this.updateParams();
      //this.updatePosition();
      this.draw();
    };

    for (var i = 0; i < shapeNumX + 1; i++) {
      for (var j = 0; j < shapeNumY + 1; j++) {
        var s = new Shape(ctx, dist * i,  dist / 2 * j, i, j);
        shapes.push(s);
      }
    }
   
    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      drawLine();
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
      shapeNumY = Y / dist * 2;
      shapes = [];
      for (var i = 0; i < shapeNumX + 1; i++) {
        for (var j = 0; j < shapeNumY + 1; j++) {
          var s = new Shape(ctx, dist * i,  dist / 2 * j, i, j);
          shapes.push(s);
        }
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  });
})();
