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
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = X / 2;
    var mouseY = Y / 2;
    var rects = [];
    var splitNum = 14;
    var xSplit = X / splitNum;
    var ySplit = Y / splitNum;
    var rotateNum = 0;
    var scaleNum = 5;
    var multi = 3;
    
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
      Rect
    ********************/
    
    function Rect(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }

    Rect.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.w = xSplit;
      this.h = ySplit;
      this.i = i;
      this.a = i * 5;
      this.rad = this.a * Math.PI / 180;   
    };

    Rect.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'black';
      if (this.i === 0) ctx.fillStyle = 'rgb(255, 0, 0)';
      if (this.i === 1) ctx.fillStyle = 'rgb(255, 0, 0)';
      if (this.i === 2) ctx.fillStyle = 'rgb(255, 255, 0)';
      if (this.i === 3) ctx.fillStyle = 'rgb(255, 255, 0)';
      if (this.i === 4) ctx.fillStyle = 'rgb(0, 255, 0)';
      if (this.i === 5) ctx.fillStyle = 'rgb(0, 255, 0)';
      if (this.i === 6) ctx.fillStyle = 'rgb(0, 255, 255)';
      if (this.i === 7) ctx.fillStyle = 'rgb(0, 255, 255)';
      if (this.i === 8) ctx.fillStyle = 'rgb(0, 0, 255)';
      if (this.i === 9) ctx.fillStyle = 'rgb(0, 0, 255)';
      if (this.i === 10) ctx.fillStyle = 'rgb(255, 0, 255)';
      if (this.i === 11) ctx.fillStyle = 'rgb(255, 0, 255)';
      if (this.i === 12) ctx.fillStyle = 'rgb(255, 0, 0)';
      if (this.i === 13) ctx.fillStyle = 'rgb(255, 0, 0)';
      ctx.translate(this.x + xSplit / 2, this.y + ySplit / 2);
      this.trans(ctx); 
      ctx.translate(-this.x - xSplit / 2, -this.y - ySplit / 2);
      ctx.fillRect(this.x, this.y, xSplit, ySplit);
      ctx.strokeRect(this.x, this.y, xSplit, ySplit);
      ctx.restore();
    };

    Rect.prototype.updateParams = function() {
      this.a += 0.5;
      this.rad = this.a * Math.PI / 180;
    };

    Rect.prototype.trans = function(ctx) {
      if (rotateNum === 0) ctx.rotate(Math.sin(this.rad) * multi);
      if (rotateNum === 1) ctx.rotate(Math.cos(this.rad) * multi);
      if (rotateNum === 2) ctx.rotate(Math.tan(this.rad) * multi);
      if (scaleNum === 0) ctx.scale(Math.sin(this.rad) * multi, 1);
      if (scaleNum === 1) ctx.scale(Math.cos(this.rad) * multi, 1);
      if (scaleNum === 2) ctx.scale(Math.tan(this.rad) * multi, 1);
      if (scaleNum === 3) ctx.scale(1, Math.sin(this.rad) * multi);
      if (scaleNum === 4) ctx.scale(1, Math.cos(this.rad) * multi);
      if (scaleNum === 5) ctx.scale(1, Math.tan(this.rad) * multi);
      if (scaleNum === 6) ctx.scale(Math.sin(this.rad) * multi, Math.sin(this.rad) * multi);
      if (scaleNum === 7) ctx.scale(Math.cos(this.rad) * multi, Math.cos(this.rad) * multi);
      if (scaleNum === 8) ctx.scale(Math.tan(this.rad) * multi, Math.tan(this.rad) * multi);
    };

    Rect.prototype.wrapPosition = function() {
      if (this.x < 0) this.x = X;
      if (this.x > X) this.x = 0;
      if (this.y < 0) this.y = Y;
      if (this.y > Y) this.y = 0; 
    };
    
    Rect.prototype.render = function() {
      this.updateParams();
      this.wrapPosition();
      this.draw();
    };
    
    for (var i = 0; i < splitNum; i++) {
      for (var j = 0; j < splitNum; j++) {
        var rect = new Rect(ctx, xSplit * i, ySplit * j, i);
        rects.push(rect);
      }
    }

    /********************
      Render
    ********************/
   
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < rects.length; i++) {
        rects[i].render(i);
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

    window.addEventListener('resize', function(){
      onResize();
    });
    
    canvas.addEventListener('click', function(e) {
      rotateNum = rand(0, 2); 
      scaleNum = rand(0, 8);
      multi = rand(1, 5);
    }, false);
    
    canvas.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    canvas.addEventListener('wheel', function(e) {
      for (var i = 0; i < rects.length; i++) {
        rects[i].a += e.deltaY / 10;
      }
    });

  });
  // Author
  console.log('File Name / crazyRect.js\nCreated Date / May 29, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
