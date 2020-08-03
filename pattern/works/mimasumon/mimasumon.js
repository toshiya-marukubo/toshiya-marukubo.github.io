/*
* File Name / mimasumon.js
* Created Date / Aug 03, 2020
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
    title.textContent = 'MIMASUMON / 三枡文';

    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var shapeNum = 50;
    var rad = Math.PI * 2 / 4;
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
    
    function Shape(ctx, x, y, r, i) {
      this.ctx = ctx;
      this.init(x, y, r, i);
    }
    
    Shape.prototype.init = function(x, y, r, i) {
      this.x = x;
      this.y = y;
      this.i = i;
      this.r = r;
      this.a = rand(0, 360);
      this.rad = this.a * Math.PI / 180;
      this.a1 = rand(0, 360);
      this.rad1 = this.a1 * Math.PI / 180;
    };
    
    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      Math.sin(this.rad1) < 0 ? ctx.globalAlpha = -Math.sin(this.rad1) : ctx.globalAlpha = Math.sin(this.rad1);
      ctx.strokeStyle = style.white;
      ctx.lineWidth = this.r / 10;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rad);
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
      this.a1 += 1;
      this.rad1 = this.a1 * Math.PI / 180;
    };

    Shape.prototype.render = function(i) {
      this.updateParams();
      this.draw();
      addShape();
    };

    // Add Shape.
    function addShape() {
      var overlap = false;
      var setX = rand(0, X);
      var setY = rand(0, Y);
      var setR;
      Math.random() < 0.3 ? setR = rand(50, 100) : setR = rand(10, 50);
      for (var i = 0; i < shapes.length; i++) {
        var x = Math.abs(setX - shapes[i].x);
        var y = Math.abs(setY - shapes[i].y);
        var d = x * x + y * y;
        var dist = Math.floor(Math.sqrt(d));
        if (dist < setR + shapes[i].r) {
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

    for (var i = 0; i < 1; i++) {
      var s = new Shape(ctx, rand(0, X),  rand(0, Y), rand(50, 100), i);
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
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  });
})();
