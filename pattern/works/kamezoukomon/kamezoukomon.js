/*
* File Name / kamezoukomon.js
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
    title.textContent = 'KAMEZOUKOMON / 亀蔵小紋';

    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    var size = 150;
    var diff = 75;
    var shapeNumX = X / size;
    var shapeNumY = Y / size;
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
    
    function Shape(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }
    
    Shape.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.a = 0;
      this.rad = this.a * Math.PI / 180;
    };
    
    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineWidth = style.lineWidth;
      ctx.strokeStyle = style.white;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      for (var i = 0; i < 380; i++) {
        var x = Math.cos(i * Math.sin(this.rad) * 5 * Math.PI / 180) * i * 0.2;
        var y = Math.sin(i * Math.sin(this.rad) * 5 * Math.PI / 180) * i * 0.2;
        ctx.lineTo(x + this.x, y + this.y);
      }
      ctx.stroke();
      ctx.restore();
    };

    Shape.prototype.updateParams = function() {
      this.a += 0.5;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.render = function(i) {
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < shapeNumX + 1; i++) {
      for (var j = 0; j < shapeNumY + 1; j++) {
        var s;
        if (j % 2 === 0) {
          s = new Shape(ctx, size * i + diff, size * j);
        } else {
          s = new Shape(ctx, size * i, size * j);
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
      shapeNumX = X / size;
      shapeNumY = Y / size;
      for (var i = 0; i < shapeNumX + 1; i++) {
        for (var j = 0; j < shapeNumY + 1; j++) {
          var s;
          if (j % 2 === 0) {
            s = new Shape(ctx, size * i + diff, size * j);
          } else {
            s = new Shape(ctx, size * i, size * j);
          }
          shapes.push(s);
        }
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  });
})();
