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
    var splitNum = 128;
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
      this.a = this.i * 1;
      this.rad = this.a * Math.PI / 180;   
    };

    Line.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'gray';
      ctx.translate(X / 2, this.y);
      ctx.rotate(this.rad);
      //ctx.scale(Math.cos(this.rad) * 1, Math.sin(this.rad) * 1);
      ctx.translate(- X / 2, -this.y);
      ctx.beginPath();
      ctx.moveTo(0, this.y);
      ctx.lineTo(X, this.y);
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'gray';
      ctx.translate(this.x, Y / 2);
      ctx.rotate(this.rad);
      //ctx.scale(Math.cos(this.rad) * 5 + 5, Math.sin(this.rad) * 5 + 5);
      ctx.translate(- this.x, - Y / 2);
      ctx.beginPath();
      ctx.moveTo(this.x, 0);
      ctx.lineTo(this.x, Y);
      ctx.stroke();
      ctx.restore();
    };

    Line.prototype.updateParams = function(i) {
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
    };

    Line.prototype.render = function(i) {
      this.updateParams(i);
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

    canvas.addEventListener('wheel', function(e) {
      var y = e.deltaY / 10;
      for (var i = 0; i < lines.length; i++) {
        lines[i].a -= y;
      }
    });

  });
  // Author
  console.log('File Name / wrinkle.js\nCreated Date / May 30, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
