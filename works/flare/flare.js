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
    var lines = [];
    var splitNum = 256;
    var xSplit = X / splitNum;
    var ySplit = Y / splitNum;
    var flg = true;
    
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
      this.v = {
        x: 0,
        y: 0
      };
      this.c = {
        r: rand(200, 200),
        g: rand(200, 200),
        b: rand(200, 200)
      };
      this.a = i * 1;
      this.rad = this.a * Math.PI / 180;   
    };

    Line.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = 0.1;
      ctx.strokeStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      if (flg === true) {
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.sin(this.rad));
        ctx.scale(Math.cos(this.rad) * 3, Math.sin(this.rad) * 3);
        ctx.translate(-this.x, -this.y);
      }
      ctx.beginPath();
      ctx.moveTo(0, this.y);
      ctx.quadraticCurveTo(Math.cos(this.rad) * 100 + this.cx, Math.sin(this.rad) * 100 + this.cy, X, this.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(this.x, 0);
      ctx.quadraticCurveTo(Math.cos(this.rad) * 100 + this.cx, Math.sin(this.rad) * 100 + this.cy, this.x, Y);
      ctx.stroke();
      ctx.restore();
    };

    Line.prototype.closerLine = function() {
      var x = mouseX - this.cx;
      var y = mouseY - this.cy;
      var d = x * x + y * y;
      var dist = Math.sqrt(d);
      this.v.x = x / dist * 100;
      this.v.y = y / dist * 100;
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
      this.closerLine();
      this.updateParams(i);
      this.draw();
    };
    
    for (var i = 1; i < splitNum; i++) {
      var line = new Line(ctx, xSplit * i, ySplit * i, i);
      lines.push(line);
    }
    
    /********************
      ChangeColor
    ********************/
    
    function changeColor() {
      var time = rand(1000, 5000);
      var r = rand(0, 255);
      var g = rand(0, 255);
      var b = rand(0, 255);
      for (var i = 0; i < lines.length; i++) {
        lines[i].c  = {
          r: r,
          g: g,
          b: b
        };
      }
      setTimeout(changeColor, time);
    }

    changeColor();

    /********************
      Render
    ********************/
   
    function render() {
      ctx.globalCompositeOperation = "darken";
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
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
      xSplit = X / splitNum;
      ySplit = Y / splitNum;
      lines = [];
      for (var i = 1; i < splitNum; i++) {
        var line = new Line(ctx, xSplit * i, ySplit * i, i);
        lines.push(line);
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });
   
    canvas.addEventListener('click', function() {
      if (flg === true) {
        flg = false;
      } else {
        flg = true;
      }
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
      for (var i = 0; i < lines.length; i++) {
        lines[i].a -= e.deltaY;
      }
    });

  });
  // Author
  console.log('File Name / flare.js\nCreated Date / May 30, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
