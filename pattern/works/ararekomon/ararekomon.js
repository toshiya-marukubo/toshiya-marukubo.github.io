/*
* File Name / ararekomon.js
* Created Date / July 26, 2020
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
    title.textContent = 'ARAREKOMON / 霰小紋';

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
    
    function Shape(ctx, x, y, r, i) {
      this.ctx = ctx;
      this.init(x, y, r, i);
    }
    
    Shape.prototype.init = function(x, y, r, i) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.i = i;
      this.a = this.i * 10;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      Math.sin(this.rad) < 0 ? ctx.globalAlpha = -Math.sin(this.rad) : ctx.globalAlpha = Math.sin(this.rad);
      ctx.fillStyle = style.white;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    Shape.prototype.updateParams = function() {
      this.a += 0.5;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.render = function(i) {
      addShape();
      this.updateParams();
      this.draw();
    };
   
    for (var i = 0; i < 1; i++) {
      var s = new Shape(ctx, rand(0, X), rand(0, Y), Math.random() < 0.2 ? rand(30, 50) : rand(5, 10), i);
      shapes.push(s);
    }

    // Add Shape.
    function addShape() {
      var overlap = false;
      var setX = rand(0, X);
      var setY = rand(0, Y);
      var setR;
      Math.random() < 0.2 ? setR = rand(30, 50) : setR = rand(5, 10);
      for (var i = 0; i < shapes.length; i++) {
        var x = Math.abs(setX - shapes[i].x);
        var y = Math.abs(setY - shapes[i].y);
        var d = x * x + y * y;
        var dist = Math.floor(Math.sqrt(d));
        if (dist < setR + shapes[i].r + 10) {
          overlap = true;
          break;
        }
      }
      if (overlap === true) {
        return;
      }
      var s = new Shape(ctx, setX, setY, setR, shapes.length);
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
      for (var i = 0; i < 1; i++) {
        var s = new Shape(ctx, rand(0, X), rand(0, Y), Math.random() < 0.2 ? rand(30, 50) : rand(5, 10), i);
        shapes.push(s);
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  });
})();
