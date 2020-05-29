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
    var splitNum = 256;
    var xSplit = X / splitNum;
    var ySplit = Y / splitNum;
    var dragging = false;
    
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
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(0, 255)
      };
      this.a = i * 1;
      this.rad = this.a * Math.PI / 180;   
    };

    Line.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'black';
      //ctx.strokeStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      /*
      ctx.beginPath();
      ctx.moveTo(0, this.y);
      ctx.quadraticCurveTo(Math.cos(this.rad) * 100 + this.x, Math.sin(this.rad) * 100 + this.y, X, this.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(this.x, 0);
      ctx.quadraticCurveTo(Math.cos(this.rad) * 100 + this.x, Math.sin(this.rad) * 100 + this.y, this.x, Y);
      ctx.stroke();
      */
      ctx.translate(this.x, this.y);
      //ctx.rotate(Math.cos(this.rad) * 10);
      //ctx.scale(Math.cos(this.rad) * 5, Math.sin(this.rad) * 5);
      ctx.translate(-this.x, -this.y);
      ctx.beginPath();
      ctx.moveTo(0, this.y);
      ctx.quadraticCurveTo(Math.cos(this.rad) * 1 + this.cx, Math.sin(this.rad) * 1 + this.cy, X, this.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(this.x, 0);
      ctx.quadraticCurveTo(Math.cos(this.rad) * 1 + this.cx, Math.sin(this.rad) * 1 + this.cy, this.x, Y);
      ctx.stroke();
      ctx.restore();
    };

    Line.prototype.extendLine = function() {
      var x = mouseX - this.cx;
      var y = mouseY - this.cy;
      var d = x * x + y * y;
      var dist = Math.sqrt(d);
      this.v.x = x / dist * 5;
      this.v.y = y / dist * 5;
      this.cx += this.v.x;
      this.cy += this.v.y;
    };

    Line.prototype.updateParams = function(i) {
      if (i % 2 === 0) {
        this.a -= 1;
        this.rad = this.a * Math.PI / 180;
      } else {
        this.a += 1;
        this.rad = this.a * Math.PI / 180;
      }
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

    canvas.addEventListener('wheel', function(e) {
      for (var i = 0; i < lines.length; i++) {
        lines[i].a -= e.deltaY;
      }
    });

  });
  // Author
  console.log('File Name / crazyLine.js\nCreated Date / May 29, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
