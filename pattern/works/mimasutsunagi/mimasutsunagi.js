/*
* File Name / mimasutsunagi.js
* Created Date / Aug 04, 2020
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
    title.textContent = 'MIMASUTSUNAGI / 三枡繋ぎ';

    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    var dist = 200;
    var vDist = dist * 0.8;
    var rad = Math.PI * 2 / 4;
    var shapeNumX = X / dist;
    var shapeNumY = Y / vDist;
    var shapes = [];
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
      this.j = j;
      this.r = dist / 2;
      this.v = {
        x: 0, 
        y: 0
      };
      this.a = 0;
      this.rad = this.a * Math.PI / 180;
    };
    
    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = style.lineWidth;
      ctx.strokeStyle = style.white;
      ctx.translate(this.x, this.y);
      ctx.rotate(45 * Math.PI / 180);
      if (Math.tan(this.rad) < 0) ctx.rotate(Math.tan(this.rad));
      ctx.translate(-this.x, -this.y);
      for (var j = 0; j < 3; j++) {
        ctx.beginPath();
        for (var i = 0; i < 4; i++) {
          var x = Math.sin(rad * i) * (this.r - this.r / 3 * j) + this.x;
          var y = Math.cos(rad * i) * (this.r - this.r / 3 * j) + this.y;
          if (i === 0) ctx.moveTo(x, y);
          ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();
    };

    Shape.prototype.updateParams = function() {
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
      this.r = Math.cos(this.rad) * dist / 2;
    };

    Shape.prototype.render = function(i) {
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < shapeNumX + 1; i++) {
      for (var j = 0; j < shapeNumY + 1; j++) {
        var s = new Shape(ctx, dist * i,  vDist * j, i, j);
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
      shapeNumY = Y / vDist;
      shapes = [];
      for (var i = 0; i < shapeNumX + 1; i++) {
        for (var j = 0; j < shapeNumY + 1; j++) {
          var s = new Shape(ctx, dist * i,  vDist * j, i, j);
          shapes.push(s);
        }
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  });
})();
