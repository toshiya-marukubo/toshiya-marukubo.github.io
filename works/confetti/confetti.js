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
    var shapeNum = 1000;
    var xNum = 2;
    var yNum = 5;

    if (X < 768) {
      shapeNum = 500;
      xNum = 1;
      yNum = 4;
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
    
    function Shape(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }
    
    Shape.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.r = 1;
      this.c = rand(0, 360);
      this.a = rand(0, 360);
      this.rad = this.a * Math.PI / 180;
      this.inA = Math.random();
      this.inR = Math.random() * Math.random() * Math.random();
      this.v = {
        x: Math.sin(this.rad) * xNum,
        y: Math.cos(this.rad) * yNum
      };
      this.ga = Math.random();
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.fillStyle = 'hsl(' + this.c + ', ' + '80%, 80%)';
      ctx.globalCompositeOperation = 'xor';
      ctx.globalAlpha = this.ga;
      ctx.translate(this.x + this.r / 2, this.y + this.r / 2);
      ctx.rotate(this.rad * 1.5);
      ctx.scale(Math.sin(this.rad), Math.cos(this.rad));
      ctx.translate(-this.x - this.r / 2, -this.y - this.r / 2);
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.r, this.r);
      ctx.fill();
      ctx.restore();
    };

    Shape.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 2;
    };

    Shape.prototype.updatePosition = function() {
      this.v.y += 0.01;
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Shape.prototype.wrapPosition = function() {
      if (this.y - this.r > Y) {
        this.init(X / 2, Y / 2);
      }
    };
    
    Shape.prototype.updateParams = function(i) {
      if (i % 2 === 0) {
        this.a += this.inA;
      } else {
        this.a -= this.inA;
      }
      this.rad = this.a * Math.PI / 180;
      this.r += this.inR;
    };

    Shape.prototype.render = function(i) {
      this.updateParams(i);
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };
    
    for (var i = 0; i < 1; i++) {
      var s = new Shape(ctx, X / 2, Y / 2);
      shapes.push(s);
    }
    
    var clearId = setInterval(function() {
      var s = new Shape(ctx, X / 2, Y / 2);
      shapes.push(s);
      if (shapes.length > 1000) {
        clearInterval(clearId);
      }
    }, 60);

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
      if (X < 768) {
        shapeNum = 500;
        xNum = 1;
        yNum = 4;
      } else {
        shapeNum = 1000;
        xNum = 2;
        yNum = 5;
      }
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    canvas.addEventListener('wheel', function(e) {
      for (var i = 0; i < shapes.length; i++) {
      }
    }, false);

  });
  // Author
  console.log('File Name / confetti.js\nCreated Date / July 08, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
