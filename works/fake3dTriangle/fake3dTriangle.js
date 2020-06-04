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

    var range = document.getElementById('range');
    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    var triangles = [];
    var triangleNum = range.value;
    var angle = 120;
    var radian = angle * Math.PI / 180;
    var ease = 0.5;
    var friction = 0.5;
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
      Triangle
    ********************/
    
    function Triangle(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }

    Triangle.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.x1;
      this.y1;
      this.r = 50;
      this.lw = 5;
      this.a = 30 * i;
      this.rad = this.a * Math.PI / 180; 
      this.points = [];
      this.getPoints(); 
      this.closestIndex = 0;
      this.v = {
        x: 0,
        y: 0
      };
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(200, 255)
      };
    };

    Triangle.prototype.getPoints = function() {
      for (var i = 0; i < 3; i++) {
        var x = Math.cos(radian * i) * this.r + this.x;
        var y = Math.sin(radian * i) * this.r + this.y;
        var a = rand(0, 360);
        var rad = a * Math.PI / 180;
        var point = [x, y, rad];
        this.points.push(point);
      }
    };

    var dist = 50;
    Triangle.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = this.lw;
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      if (flg === true) {
        ctx.translate(this.x, this.y);
        ctx.scale(Math.cos(this.rad) * 2, Math.sin(this.rad) * 2);
        ctx.translate(-this.x, -this.y);
      }
      ctx.beginPath();
      ctx.moveTo(Math.cos(this.points[0][2]) * dist + this.points[0][0], Math.sin(this.points[0][2]) * dist + this.points[0][1]);
      for (var i = 1; i < this.points.length; i++) {
        ctx.lineTo(Math.cos(this.points[i][2]) * dist + this.points[i][0], Math.sin(this.points[i][2]) * dist + this.points[i][1]);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    Triangle.prototype.closestPoint = function() {
      var ci = 0;
      var dist = Number.MAX_VALUE;
      for (var i = 0; i < this.points.length; i++) {
        var x = mouseX - this.points[i][0];
        var y = mouseY - this.points[i][1];
        var d = x * x + y * y;
        var newDist = Math.floor(Math.sqrt(d));
        if (newDist < dist) {
          dist = newDist;
          ci = i;
        }
      }
      this.closestIndex = ci;
    };

    Triangle.prototype.changePoint = function() {
      this.closestPoint();
      var x = this.points[this.closestIndex][0];
      var y = this.points[this.closestIndex][1];
      this.v.x = (mouseX - x) * ease;
      this.v.y = (mouseY - y) * ease;
      this.v.x *= friction;
      this.v.y *= friction;
      this.points[this.closestIndex][0] += this.v.x;
      this.points[this.closestIndex][1] += this.v.y;
    };

    Triangle.prototype.updateParams = function() {
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
      for (var i = 0; i < this.points.length; i++) {
        this.points[i][2] += 0.01;
      }
    };

    Triangle.prototype.render = function(i) {
      this.updateParams();
      this.draw();
    };
    
    for (var i = 0; i < triangleNum; i++) {
      var t = new Triangle(ctx, X / 2, Y / 2, i);
      triangles.push(t);
    }

    /********************
      Render
    ********************/
   
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < triangles.length; i++) {
        triangles[i].render(i);
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
      triangles = [];
      for (var i = 0; i < triangleNum; i++) {
        var t = new Triangle(ctx, X / 2, Y / 2, i);
        triangles.push(t);
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });
    
    canvas.addEventListener('click', function(e){
      if (flg === true) {
        flg = false;
      } else {
        flg = true;
      }
    });
     
    canvas.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      for (var i = 0; i < triangles.length; i++) {
        triangles[i].changePoint();
      }
    });

    canvas.addEventListener('wheel', function(e){
      for (var i = 0; i < triangles.length; i++) {
        triangles[i].lw += e.deltaY / 100;
      }
    });

    canvas.addEventListener('touchmove', function(e) {
      var touch = event.targetTouches[0];
      mouseX = touch.pageX;
      mouseY = touch.pageY;
      for (var i = 0; i < triangles.length; i++) {
        triangles[i].changePoint();
      }
    }, false);

    range.addEventListener('change', function() {
      triangleNum = this.value;
      triangles = [];
      for (var i = 0; i < triangleNum; i++) {
        var t = new Triangle(ctx, X / 2, Y / 2, i);
        triangles.push(t);
      }
    }, false);

  });
  // Author
  console.log('File Name / fake3dTriangle.js\nCreated Date / Jun 03, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
