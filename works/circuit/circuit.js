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
    var maxLength = Math.sqrt(X * X + Y * Y);
    var mouseX = X / 2;
    var mouseY = Y / 2;
    var dist = 20;
    var lw = dist / 2;
    var shapes = [];
    var shapeNum = X / dist;
    X > Y ? shapeNum = X / dist : shapeNum = Y / dist;

    // color
    var rangeMax = document.getElementById('rangeMax');
    var maxValue = rangeMax.value;

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
      this.i = i;
      this.v = {
        x: 0,
        y: 0
      };
      this.num = rand(0, 1);
      this.a = i * 0.1;
      this.rad = this.a * Math.PI / 180;
      this.color = rand(0, maxValue);
      this.par = 1;
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = lw;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'hsl(' + Math.sin(this.rad * 10) * this.color + ', ' + 80 + '%, ' + 60 + '%)';
      ctx.beginPath();
      if (this.num === 0) {
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + dist, this.y + dist);
      } else {
        ctx.moveTo(this.x, this.y + dist);
        ctx.lineTo(this.x + dist, this.y);
      }
      ctx.stroke();
      ctx.restore();
    };
    
    Shape.prototype.changeColor = function() {
      this.color = rand(0, 360);
      this.num = rand(0, 1);
    };

    Shape.prototype.updateParams = function() {
      this.a += 0.1;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.changeColor = function() {
      this.color = rand(0, maxValue);
    };

    Shape.prototype.render = function(i) {
      this.updateParams();
      this.draw();
    };
    
    for (var i = 0; i < shapeNum + 1; i++) {
      for (var j = 0; j < shapeNum + 1; j++) {
        var s = new Shape(ctx, i * dist, j * dist, i);
        shapes.push(s);
      }
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
      maxLength = Math.sqrt(X * X + Y * Y);
      shapes = [];
      shapeNum = X / dist;
      X > Y ? shapeNum = X / dist : shapeNum = Y / dist;
      for (var i = 0; i < shapeNum + 1; i++) {
        for (var j = 0; j < shapeNum + 1; j++) {
          var s = new Shape(ctx, i * dist, j * dist, i);
          shapes.push(s);
        }
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    canvas.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, false);

    canvas.addEventListener('click', function(e) {
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].changeColor();
      }
    }, false);

    rangeMax.addEventListener('change', function(e) {
      maxValue = this.value;
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].changeColor();
      }
    });

  });
  // Author
  console.log('File Name / circuit.js\nCreated Date / July 07, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
