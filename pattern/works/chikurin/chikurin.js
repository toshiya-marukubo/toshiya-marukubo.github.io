/*
* File Name / chikurin.js
* Created Date / Aug 09, 2020
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
    title.textContent = 'CHIKURIN / 竹林';

    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
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
    
    function Shape(ctx, x, y, w, h, n) {
      this.ctx = ctx;
      this.init(x, y, w, h, n);
    }
    
    Shape.prototype.init = function(x, y, w, h, n) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.n = n;
      this.d = 3;
      this.a = rand(-5, 5) * Math.random();
      this.rad = this.a * Math.PI / 180;
      this.random = Math.random();
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.globalAlpha = this.random;
      ctx.fillStyle = style.white;
      ctx.translate(this.x, this.y);
      //ctx.rotate(0.01 * Math.sin(this.rad));
      ctx.rotate(this.rad);
      ctx.translate(-this.x, -this.y);
      for (var i = 0; i < this.n; i++) {
        ctx.beginPath();
        ctx.moveTo(this.x - this.w / 2, this.y - this.h * i - this.d * i);
        ctx.quadraticCurveTo(this.x - this.w / 5, this.y - this.h * i - this.d * i - this.h / 2, this.x - this.w / 2, this.y - this.h * i - this.d * i - this.h);
        ctx.lineTo(this.x + this.w / 2, this.y - this.h * i - this.d * i- this.h);
        ctx.quadraticCurveTo(this.x + this.w / 5, this.y - this.h * i - this.d * i - this.h / 2, this.x + this.w / 2, this.y - this.h * i - this.d * i);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    };

    Shape.prototype.render = function() {
      this.draw();
    };

    for (var xPos = 0; xPos < X;) {
      var dist = rand(10, 50);
      var width = rand(10, 30);
      var height = rand(100, 300);
      var maxNum = Y / height;
      xPos += dist + width;
      var s = new Shape(ctx, xPos, Y, width, height, maxNum);
      shapes.push(s);
    }
   
    /********************
      Leaf
    ********************/
    
    var leafs = [];
    var leafNum = 100;

    if (X < 768) {
      leafNum = 50;
    }

    function Leaf(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Leaf.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.r = rand(50, 150);
      this.a = rand(60, 180);
      this.rad = this.a * Math.PI / 180;
      this.c = rand(0, 100);
    };

    Leaf.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.lineWidth = this.r / 200;
      //ctx.strokeStyle = style.black;
      ctx.fillStyle = 'hsl(' + 0 + ', 0%, ' + this.c + '%)';
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rad);
      ctx.translate(-this.x, -this.y);
      for (var i = 0; i < 3; i++) {
        var r;
        if (i === 0 || i === 2) r = this.r * 0.7;
        if (i === 1) r = this.r;
        ctx.translate(this.x, this.y);
        ctx.rotate(30 * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y)
        ctx.quadraticCurveTo(this.x - r / 20, this.y - r / 20, this.x, this.y - r);
        ctx.quadraticCurveTo(this.x + r / 20, this.y - r / 20, this.x, this.y);
        ctx.closePath();
        ctx.fill();
        //ctx.stroke();
      }
      ctx.restore();
    };

    Leaf.prototype.render = function() {
      this.draw();
    };

    for (var i = 0; i < leafNum; i++) {
      var l = new Leaf(ctx, rand(0, X), rand(0, Y / 2));
      leafs.push(l);
    }
    
    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].render();
      }
      for (var i = 0; i < leafs.length; i++) {
        leafs[i].render();
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
      leafs = [];
      if (X < 768) {
        leafNum = 50;
      } else {
        leafNum = 100;
      }
      for (var xPos = 0; xPos < X;) {
        var dist = rand(10, 50);
        var width = rand(10, 30);
        var height = rand(100, 300);
        var maxNum = Y / height;
        xPos += dist + width;
        var s = new Shape(ctx, xPos, Y, width, height, maxNum);
        shapes.push(s);
      }
      for (var i = 0; i < leafNum; i++) {
        var l = new Leaf(ctx, rand(0, X), rand(0, Y / 2));
        leafs.push(l);
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  });
})();
