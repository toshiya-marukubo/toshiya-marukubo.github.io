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
    var squares = [];
    var squareNum = 36;
    var dist = 0;
    var lw = 1;

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
      Square
    ********************/
    
    function Square(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }

    Square.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.i = i;
      this.l = 10 + this.i * 10;
      this.c = {
        r: rand(0, 255),
        g: rand(100, 255),
        b: rand(200, 255)
      };
      this.a = this.i * 0;
      this.rad = this.a * Math.PI / 180; 
      this.points = this.getPoints();  
    };

    Square.prototype.getPoints = function() {
      var arr = [];
      for (var i = 0; i < 4; i++) {
        var a = rand(0, 360);
        var rad = a * Math.PI / 180;
        arr.push(rad);
      }
      return arr;
    };

    Square.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.strokeStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.translate(this.x, this.y);
      ctx.rotate(Math.sin(this.rad) * 1);
      //ctx.scale(Math.sin(this.rad), Math.cos(this.rad));
      ctx.translate(-this.x, -this.y);
      ctx.moveTo(Math.sin(this.points[0]) * dist + this.x - this.l, Math.cos(this.points[0]) * dist + this.y - this.l);
      ctx.lineTo(Math.sin(this.points[1]) * dist + this.x - this.l, Math.cos(this.points[1]) * dist + this.y + this.l);
      ctx.lineTo(Math.sin(this.points[2]) * dist + this.x + this.l, Math.cos(this.points[2]) * dist + this.y + this.l);
      ctx.lineTo(Math.sin(this.points[3]) * dist + this.x + this.l, Math.cos(this.points[3]) * dist + this.y - this.l);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    Square.prototype.updateParams = function() {
      for (var i = 0; i < this.points.length; i++) {
        this.points[i] += 0.1;
      }
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
      this.l = Math.sin(this.rad) * 1 + this.l;
    };

    Square.prototype.render = function(i) {
      this.updateParams();
      this.draw();
    };
    
    for (var i = 0; i < squareNum; i++) {
      var square = new Square(ctx, X / 2, Y / 2, i);
      squares.push(square);
    }

    /********************
      Render
    ********************/
   
    function render() {
      //ctx.clearrect(0, 0, X, Y);
      ctx.globalCompositeOperation = "darken";
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      for (var i = 0; i < squares.length; i++) {
        squares[i].render(i);
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
      squares = [];
      for (var i = 0; i < squareNum; i++) {
        var square = new Square(ctx, X / 2, Y / 2, i);
        squares.push(square);
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });

    canvas.addEventListener('click', function(e){
      dist = 0;
      lw = 1;
    }, false);
    
    canvas.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    canvas.addEventListener('wheel', function(e) {
      if (e.deltaY > 0) {
        dist += e.deltaY / 50;
      }
      if (e.deltaY < 0) {
        lw -= e.deltaY / 50;
      }
    });

    var touchStartY;
    var touchMoveY;
    var touchEndY;
    
    canvas.addEventListener('touchstart', function(e) {
      var touch = e.targetTouches[0];
      touchStartY = touch.pageY;
    }, false);
    canvas.addEventListener('touchmove', function(e) {
      var touch = e.targetTouches[0];
      touchMoveY = touch.pageY;
    }, false);
    canvas.addEventListener('touchend', function(e) {
      touchEndY = touchStartY - touchMoveY;
      if (touchEndY > 0) {
        dist += touchEndY / 10;
      }
      if (touchEndY < 0) {
        lw -= touchEndY / 10;
      }
    }, false);

  });
  // Author
  console.log('File Name / square.js\nCreated Date / Jun 01, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
