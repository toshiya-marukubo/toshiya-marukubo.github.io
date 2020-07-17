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
    var shapes = [];
    var shapeNum = 36;
    var pointsNum = 3;
    var angle = 360 / pointsNum;
    var radian = angle * Math.PI / 180;

    if (X < 768) {
      shapeNum = 12;
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
      Shape
    ********************/
    
    function Shape(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }

    Shape.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.r = rand(5, 10);
      this.lw = this.r / 30;
      this.a = rand(0, 360);
      this.rad = this.a * Math.PI / 180;
      this.num = rand(5, 20);
      this.angles = [];
      this.getAngles();
      this.as = Math.random() * 2;
    };
    
    Shape.prototype.getAngles = function() {
      for (var i = 0; i < this.num; i++) {
        var sAngle = rand(0, 360) * Math.PI / 180;
        var eAngle = rand(sAngle, 360) * Math.PI / 180;
        var angle = [sAngle, eAngle];
        this.angles.push(angle);
      }
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = this.lw;
      ctx.strokeStyle = 'gray';
      ctx.beginPath();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rad);
      ctx.translate(-this.x, -this.y);
      for (var i = 0; i < this.num; i++) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * i, this.angles[i][0], this.angles[i][1], false);
        ctx.stroke();
      }
      ctx.restore();
      // aircraft
      ctx.save();
      ctx.lineWidth = this.lw;
      ctx.strokeStyle = 'gray';
      ctx.beginPath();
      ctx.translate(this.x, this.y);
      ctx.scale(Math.tan(this.rad), Math.tan(this.rad));
      ctx.translate(-this.x, -this.y);
      ctx.moveTo(Math.sin(radian * 1) * this.r + Math.cos(this.rad / 2) * 100 + this.x, Math.cos(radian * 1) * this.r + Math.sin(this.rad / 2) * 100 + this.y);
      for (var i = 2; i < pointsNum + 1; i++) {
        ctx.lineTo(Math.sin(radian * i) * this.r + Math.cos(this.rad / 2) * 100 + this.x, Math.cos(radian * i) * this.r + Math.sin(this.rad / 2) * 100 + this.y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    Shape.prototype.updateParams = function(i) {
      if (i % 2 === 0) {
        this.a += this.as;
      } else {
        this.a -= this.as;
      }
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.render = function(i) {
      this.updateParams(i);
      this.draw();
    };

    for (var i = 0; i < shapeNum; i++) {
      var s;
      if (i === 0) {
        s = new Shape(ctx, X / 2, Y / 2, i);
      } else {
        s = new Shape(ctx, rand(0, X), rand(0, Y), i);
      }
      shapes.push(s);
    }

    /********************
      Line
    ********************/
    
    function drawLine() {
      ctx.save();
      ctx.strokeStyle = 'gray';
      ctx.lineWidth = 0.1;
      for (var i = 0; i < shapes.length - 1; i++) {
      ctx.lineWidth = 0.1;
        ctx.beginPath();
        ctx.moveTo(shapes[i].x, shapes[i].y);
        ctx.lineTo(shapes[i + 1].x, shapes[i + 1].y);
        ctx.stroke();
      }
      ctx.restore();
    }

    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      drawLine();
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
      if (X < 768) {
        shapeNum = 12;
      } else {
        shapeNum = 36;
      }
      for (var i = 0; i < shapeNum; i++) {
        var s;
        if (i === 0) {
          s = new Shape(ctx, X / 2, Y / 2, i);
        } else {
          s = new Shape(ctx, rand(0, X), rand(0, Y), i);
        }
        shapes.push(s);
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, false);

    canvas.addEventListener('click', function(e) {
      shapes = [];
      for (var i = 0; i < shapeNum; i++) {
        var s;
        if (i === 0) {
          s = new Shape(ctx, X / 2, Y / 2, i);
        } else {
          s = new Shape(ctx, rand(0, X), rand(0, Y), i);
        }
        shapes.push(s);
      }
    });

  });
  // Author
  console.log('File Name / airfield.js\nCreated Date / July 01, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
