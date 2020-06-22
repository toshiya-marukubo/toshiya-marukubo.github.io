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
    var shapeNum = 360;
    var dist = Y / 2;
    var ease = 0.3;
    var friction = 0.7;
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
      Shape
    ********************/
    
    function Shape(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }

    Shape.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.i = i;
      this.v = {
        x: 0,
        y: 0
      };
      this.a = i;
      this.rad = this.a * Math.PI / 180;
    };
 
    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = 0.4;
      ctx.strokeStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.quadraticCurveTo(this.x, this.y, Math.cos(this.rad) * 200 + this.x, Math.sin(this.rad) * 200 + this.y);
      ctx.stroke();
      ctx.restore();
    };

    Shape.prototype.updateParams = function() {
      this.a += 0.01;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.updatePosition = function() {
      this.v.x = mouseX - this.x * ease;
      this.v.y = mouseY - this.y * ease;
      this.v.x *= friction;
      this.v.y *= friction;
      this.x -= this.v.x;
      this.y -= this.v.y;
    };

    Shape.prototype.render = function(i) {
      this.updateParams();
      this.updatePosition();
      this.draw();
    };
    
    for (var i = 0; i < shapeNum; i++) {
      var s = new Shape(ctx, X / 2, Y / 2, i);
      shapes.push(s);
    }

    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      /*
      ctx.globalCompositeOperation = "darken";
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      */
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
    }

    window.addEventListener('resize', function(){
      onResize();
    });

    canvas.addEventListener('mousedown', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
     dragging = true;
    }, false);
    
    canvas.addEventListener('mouseup', function() {
     dragging = false;
    }, false);

    canvas.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, false);

  });
  // Author
  console.log('File Name / eyesight.js\nCreated Date / Jun 18, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
