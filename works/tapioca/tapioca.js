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
      this.a = i;
      this.rad = this.a * Math.PI / 180;
      this.x = Math.sin(this.rad) * 1 + x;
      this.y = Math.cos(this.rad) * 1 + y;
      this.r = rand(15, 30);
      this.lw = this.r / 3;
      this.v = {
        x: rand(-1, 1) * Math.random() * Math.random(),
        y: rand(-1, 1) * Math.random() * Math.random()
      };
      this.as = rand(0, 360) * Math.PI / 180;
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.beginPath();
      ctx.lineWidth = this.lw;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'dimgray';
      ctx.arc(this.x, this.y, this.r * 0.6, this.as, this.as + 1, false);
      ctx.stroke();
      ctx.restore();
    };

    Shape.prototype.wrapPosition = function() {
      if (this.x - this.r < 0) {
        this.x = 0 + this.r;
      }
      if (this.x + this.r > X) {
        this.x = X - this.r;
      }
      if (this.y - this.r < 0) {
        this.y = 0 + this.r;
      }
      if (this.y + this.r > Y) {
        this.y = Y - this.r;
      }
    };

    Shape.prototype.collisionShape = function(i) {
      var j = i;
      for (var i = 0; i < shapes.length; i++) {
        if (j !== i) {
          var sumRadius = this.r + shapes[i].r;
          var a = this.x - shapes[i].x;
          var b = this.y - shapes[i].y;
          var c = a * a + b * b;
          if (c < sumRadius * sumRadius) {
            this.v.x = - this.v.x;
            this.v.y = - this.v.y;
            var colAngle = Math.atan2(this.y - shapes[i].y, this.x - shapes[i].x);
            this.v.x = Math.cos(colAngle);
            this.v.y = Math.sin(colAngle);
            this.x += this.v.x;
            this.y += this.v.y;
          }
        }
      }
    };

    Shape.prototype.render = function(i) {
      this.collisionShape(i);
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < shapeNum; i++) {
      var s = new Shape(ctx, X / 2, Y / 2, i);
      shapes.push(s);
    }

    setInterval(function() {
      var s = new Shape(ctx, X / 2, Y / 2, 0);
      shapes.push(s);
    }, 100);

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
    }

    window.addEventListener('resize', function(){
      onResize();
      shapes = [];
      for (var i = 0; i < shapeNum; i++) {
        var s = new Shape(ctx, X / 2, Y / 2, i);
        shapes.push(s);
      }
    });

    canvas.addEventListener('click', function(e) {
      var num = rand(5, 20);
      for (var i = 0; i < num; i++) {
        var s = new Shape(ctx, e.clientX, e.clientY, i);
        shapes.push(s);
      }
    }, false);

  });
  // Author
  console.log('File Name / tapioca.js\nCreated Date / July 02, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
