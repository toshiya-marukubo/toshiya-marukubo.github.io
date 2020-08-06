/*
* File Name / kozakura.js
* Created Date / Aug 07, 2020
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
    title.textContent = 'KOZAKURA / 小桜';

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
      this.r = 1;
      this.ri = r;
      this.lw = 4;
      this.a = rand(0, 360);
      this.rad = this.a * Math.PI / 180;
      this.a1 = rand(0, 360);
      this.rad1 = this.a1 * Math.PI / 180;
      this.ga = Math.random();
    };
    
    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.globalAlpha = this.ga;
      ctx.strokeStyle = style.black;
      ctx.fillStyle = style.white;
      ctx.lineWidth = this.lw;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rad1);
      ctx.translate(-this.x, -this.y);
      for (var i = 0; i < 5; i++) {
        ctx.translate(this.x, this.y);
        ctx.rotate(72 * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.quadraticCurveTo(this.x - this.r / 2, this.y - this.r / 2, this.x - this.r / 4, this.y - this.r);
        ctx.lineTo(this.x, this.y - this.r / 1.2);
        ctx.lineTo(this.x + this.r / 4, this.y - this.r);
        ctx.quadraticCurveTo(this.x + this.r / 2, this.y - this.r / 2, this.x, this.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    };

    Shape.prototype.updateParams = function() {
      if (this.r < this.ri) {
        this.r += 0.5;
      }
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
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
      Math.random() < 0.3 ? setR = rand(50, 70) : setR = rand(30, 50);
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
      var s = new Shape(ctx, rand(0, X),  rand(0, Y), rand(50, 70), i);
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
        var s = new Shape(ctx, rand(0, X),  rand(0, Y), rand(50, 70), i);
        shapes.push(s);
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  });
})();
