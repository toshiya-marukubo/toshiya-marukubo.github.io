/*
* File Name / matsubamaru.js
* Created Date / Aug 06, 2020
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
    title.textContent = 'MATSUBAMARU / 松葉丸';

    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var shapeNum = 1;
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
    
    function Shape(ctx, x, y, r, i) {
      this.ctx = ctx;
      this.init(x, y, r, i);
    }
    
    Shape.prototype.init = function(x, y, r, i) {
      this.x = x;
      this.y = y;
      this.i = i;
      this.r = r;
      this.ri = this.r;
      this.lw = this.r / 15;
      this.a = rand(0, 360);
      this.rad = this.a * Math.PI / 180;
      this.a1 = rand(0, 360);
      this.rad1 = this.a1 * Math.PI / 180;
    };
    
    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      Math.sin(this.rad1) < 0 ? ctx.globalAlpha = -Math.sin(this.rad1) : ctx.globalAlpha = Math.sin(this.rad1);
      ctx.lineWidth = this.lw;
      ctx.fillStyle = style.white;
      ctx.strokeStyle = style.white;
      ctx.lineCap = 'round';
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rad);
      ctx.translate(-this.x, -this.y);
      for (var i = 0; i < 36; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.cos(i * 10 * Math.PI / 180) * this.r / 5 + this.x, Math.sin(i * 10 * Math.PI / 180) * this.r / 5 + this.y);
        ctx.lineTo(Math.cos(i * 10 * Math.PI / 180) * this.r + this.x, Math.sin(i * 10 * Math.PI / 180) * this.r + this.y);
        ctx.stroke();
      }
      for (var i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(Math.cos(i * 120 * Math.PI / 180) * this.r / 15 + this.x, Math.sin(i * 120 * Math.PI / 180) * this.r / 15 + this.y, this.r / 20, 0, Math.PI * 2, false);
        ctx.fill();
      }
      ctx.restore();
    };

    Shape.prototype.updateParams = function() {
      this.a1 += 1;
      this.rad1 = this.a1 * Math.PI / 180;
    };

    Shape.prototype.render = function() {
      this.updateParams();
      this.draw();
      addShape();
    };

    // Add Shape
    function addShape() {
      var overlap = false;
      var setX = rand(0, X);
      var setY = rand(0, Y);
      var setR;
      Math.random() < 0.6 ? setR = rand(80, 100) : setR = rand(30, 50);
      for (var i = 0; i < shapes.length; i++) {
        var x = Math.abs(setX - shapes[i].x);
        var y = Math.abs(setY - shapes[i].y);
        var d = x * x + y * y;
        var dist = Math.floor(Math.sqrt(d));
        if (dist < setR + shapes[i].ri - 10) {
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

    for (var i = 0; i < shapeNum; i++) {
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
      shapes = [];
      for (var i = 0; i < shapeNum; i++) {
        var s = new Shape(ctx, rand(0, X),  rand(0, Y), rand(50, 100), i);
        shapes.push(s);
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  });
})();
