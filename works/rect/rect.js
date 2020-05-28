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
    var splitNum = 16;
    var xSplit = X / splitNum;
    var ySplit = Y / splitNum;
    
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
    
    function Rect(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Rect.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.a = 0;
      this.rad = this.a * Math.PI / 180;
    };

    Rect.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = 5;
      ctx.fillStyle = this.gradient();
      ctx.strokeStyle = 'black';
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rad);
      ctx.translate(-this.x, -this.y);
      ctx.fillRect(this.x, this.y, xSplit, ySplit);
      ctx.strokeRect(this.x, this.y, xSplit, ySplit);
      ctx.restore();
    };

    Rect.prototype.gradient = function () {
      var g = ctx.createLinearGradient(0, Y / 2, X, Y / 2);
      g.addColorStop(0, "rgba(255, 0, 0, 1)");
      g.addColorStop(0.17, "rgba(255, 255, 0, 1)");
      g.addColorStop(0.45, "rgba(0, 255, 0, 1)");
      g.addColorStop(0.50, "rgba(0, 255, 255, 1)");
      g.addColorStop(0.68, "rgba(0, 0, 255, 1)");
      g.addColorStop(0.85, "rgba(255, 0, 255, 1)");
      g.addColorStop(1, "rgba(255, 0, 0, 1)");
      return g;
    };

    Rect.prototype.updateParams = function() {
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
    };
    
    Rect.prototype.render = function(i) {
      this.updateParams();
      this.draw();
    };
    
    for (var i = 0; i < splitNum; i++) {
      for (var j = 0; j < splitNum; j++) {
        var rect = new Rect(ctx, xSplit * i, ySplit * j);
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
    
    canvas.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    canvas.addEventListener('touchmove', function(e) {
      var touch = event.targetTouches[0];
      mouseX = touch.pageX;
      mouseY = touch.pageY;
    }, false);

    canvas.addEventListener('wheel', function(e) {
    });

  });
  // Author
  console.log('File Name / illumina.js\nCreated Date / May 27, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
