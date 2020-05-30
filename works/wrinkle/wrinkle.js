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
    var mouseX = null;
    var mouseY = null;
    var lines = [];
    var splitNum = 512;
    var xSplit = X / splitNum;
    var ySplit = Y / splitNum;
    var dragging = false;
    var dim = 50;

    if (X < 768) {
      splitNum = 256;
      xSplit = X / splitNum;
      ySplit = Y / splitNum;
    }
    
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
      Line
    ********************/
    
    function Line(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }

    Line.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.cx = this.x;
      this.cy = this.y;
      this.i = i;
      this.v = {
        x: 0,
        y: 0
      };
      this.a = this.i * 1;
      this.rad = this.a * Math.PI / 180;   
    };

    Line.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = 0.3;
      ctx.strokeStyle = 'gray';
      ctx.beginPath();
      ctx.moveTo(0, Math.cos(this.rad) * dim + this.y);
      ctx.quadraticCurveTo(Math.cos(this.rad) * dim + this.cx, Math.sin(this.rad) * dim + this.cy, X, this.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(Math.sin(this.rad) * dim + this.x, 0);
      ctx.quadraticCurveTo(Math.cos(this.rad) * dim + this.cx, Math.sin(this.rad) * dim + this.cy, this.x, Y);
      ctx.stroke();
      ctx.restore();
    };

    Line.prototype.extendLine = function() {
      var x = mouseX - this.cx;
      var y = mouseY - this.cy;
      var d = x * x + y * y;
      var dist = Math.sqrt(d);
      this.v.x = x / dist * 3;
      this.v.y = y / dist * 3;
      this.cx += this.v.x;
      this.cy += this.v.y;
    };

    Line.prototype.updateParams = function(i) {
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
    };

    Line.prototype.render = function(i) {
      this.updateParams(i);
      if (dragging === true) this.extendLine();
      this.draw();
    };
    
    for (var i = 1; i < splitNum; i++) {
      var line = new Line(ctx, xSplit * i, ySplit * i, i);
      lines.push(line);
    }

    /********************
      Render
    ********************/
   
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < lines.length; i++) {
        lines[i].render(i);
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
      lines = [];
      if (X < 768) {
        splitNum = 256;
        xSplit = X / splitNum;
        ySplit = Y / splitNum;
      } else {
        splitNum = 512;
        xSplit = X / splitNum;
        ySplit = Y / splitNum;
      }
      for (var i = 1; i < splitNum; i++) {
        var line = new Line(ctx, xSplit * i, ySplit * i, i);
        lines.push(line);
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });
    
    canvas.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    canvas.addEventListener('mousedown', function(e) {
      dragging = true;
    });

    canvas.addEventListener('mouseup', function(e) {
      dragging = false;
    });

    var touchStartY;
    var touchMoveY;
    var touchEndY;

    canvas.addEventListener('touchstart', function(e) {
      dragging = true;
      var touch = e.targetTouches[0];
      mouseX = touch.pageX;
      mouseY = touch.pageY;
      touchStartY = touch.pageY;
    }, false);
    canvas.addEventListener('touchmove', function(e) {
      var touch = e.targetTouches[0];
      mouseX = touch.pageX;
      mouseY = touch.pageY;
      touchMoveY = touch.pageY;
    }, false);
    canvas.addEventListener('touchend', function(e) {
      dragging = false;
      touchEndY = touchStartY - touchMoveY;
      if (touchEndY > 50) {
        dim += touchEndY / 10;
        for (var i = 0; i < lines.length; i++) {
          lines[i].a += touchEndY;
        }
      }
      if (touchEndY < -50) {
        dim -= touchEndY / 10;
        for (var i = 0; i < lines.length; i++) {
          lines[i].a -= touchEndY;
        }
      }
    }, false);

    canvas.addEventListener('wheel', function(e) {
      var y = e.deltaY / 10;
      dim -= y;
      for (var i = 0; i < lines.length; i++) {
        lines[i].a -= y;
      }
    });

  });
  // Author
  console.log('File Name / wrinkle.js\nCreated Date / May 30, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
