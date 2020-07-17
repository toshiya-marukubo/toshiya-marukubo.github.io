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
    var dist = 5;
    var shapeNum = X / dist;
    var shapes = [];
    var ease = 0.1;
    var friction = 0.9;
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
      Ground
    ********************/
    
    function Shape(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }
    
    Shape.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.cx = this.x;
      this.cy = this.y / 2;
      this.c = i * 10; 
      this.v = {
        x: 0,
        y: 0
      };
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.c;
      ctx.strokeStyle = 'hsl(' + this.c + ', 80%, 60%)';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.quadraticCurveTo(this.cx, this.cy, this.x, Y);
      ctx.stroke();
      ctx.restore();
    };

    Shape.prototype.draggingShape = function() {
      this.cx = mouseX;
      this.cy = mouseY;
    };

    Shape.prototype.dist = function() {
      if (mouseX === null) return;
      var x = Math.abs(mouseX - this.cx);
      if (x < 50) {
        this.v.x += (mouseX - this.x) * ease;
        this.v.y += (mouseY - this.y) * ease;
        this.v.x *= friction;
        this.v.y *= friction;
        this.cx += this.v.x;
        this.cy += this.v.y;
      }
    };

    Shape.prototype.updatePosition = function() {
      this.v.x += (this.cx - this.x) * ease;
      this.v.y += (this.cy - this.y) * ease;
      this.v.x *= friction;
      this.v.y *= friction;
      this.cx -= this.v.x;
      this.cy -= this.v.y;
    };
   
    Shape.prototype.render = function(i) {
      if (dragging === false) {
        this.updatePosition();
        this.dist();
      }
      this.draw();
    };
    
    for (var i = 0; i < shapeNum + 1; i++) {
      var s = new Shape(ctx, i * dist, 0, i);
      shapes.push(s);
    }

    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
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
      shapeNum = X / dist;
      shapes = [];
      for (var i = 0; i < shapeNum + 1; i++) {
        var s = new Shape(ctx, i * dist, 0, i);
        shapes.push(s);
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    canvas.addEventListener('mousedown', function(e) {
      dragging = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].draggingShape();
      }
    });

    canvas.addEventListener('mousemove', function(e){
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dragging === false) {
        return;
      }
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].draggingShape();
      }
    }, false);

    canvas.addEventListener('mouseup', function(e){
      dragging = false;
    });

    canvas.addEventListener('touchstart', function(e) {
      dragging = true;
      var touch = e.targetTouches[0];
      mouseY = touch.pageY;
      mouseX = touch.pageX;
    }, false);

    canvas.addEventListener('touchmove', function(e) {
      var touch = e.targetTouches[0];
      mouseY = touch.pageY;
      mouseX = touch.pageX;
      if (dragging === false) {
        return;
      }
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].draggingShape();
      }
    }, false);

    canvas.addEventListener('touchend', function(e) {
      dragging = false;
      mouseY = null;
      mouseX = null;
    }, false);   

  });
  // Author
  console.log('File Name / string.js\nCreated Date / July 05, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
