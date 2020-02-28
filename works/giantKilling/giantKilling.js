(function() {
  'use strict';
  window.addEventListener('load', function() {
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

    // canvas 
    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    
    var speed = document.getElementById('speed');

    var splitNum = 8;

    if (X < 768) {
      splitNum = 4;
    }

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
      Circle
    ********************/
    
    // var
    var rowMax = splitNum;
    var colMax = splitNum;
    var circles = [];
    
    function Circle(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Circle.prototype.init = function(x, y) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.x1 = this.x;
      this.y1 = this.y;
      this.v = {
        x: rand(-10, 10) * Math.random(),
        y: rand(-10, 10) * Math.random()
      };
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(0, 255)
      };
      this.r = ySplit / 4;
    };

    Circle.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.fillStyle = 'rgb(' + this.c.r + ',' + this.c.g + ',' + this.c.b + ')';
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.fill();
    };

    Circle.prototype.updateParams = function() {
    };

    Circle.prototype.resize = function() {
      this.x = rand(0, X);
      this.y = rand(0, Y);
    };

    Circle.prototype.coll = function(i) {
      var j = i;
      for (var i = 0; i < circles.length; i++) {
        if (j !== i) {
          var a;
          var b;
          var c;
          var thatR = circles[i].r;
          var sumRadius = this.r + thatR;
          a = this.x - circles[i].x;
          b = this.y - circles[i].y;
          c = a * a + b * b;
          if (c < sumRadius * sumRadius) {
            if (this.r >= thatR) {
              this.updateParams();
              circles.splice(j, 1);
            } else {
              this.updateparams();
              circles.splice(i, 1);
            }
          }
        }
      }
    };
    
    Circle.prototype.updatePosition = function() {
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Circle.prototype.wrapPosition = function() {
      if (this.x - this.r < 0) {
        this.v.x *= -1;
      }
      if (this.x + this.r > X) {
        this.v.x *= -1;
      }
      if (this.y - this.r < 0) {
        this.v.y *= -1;
      }
      if (this.y + this.r > Y) {
        this.v.y *= -1;
      }
    };

    Circle.prototype.render = function(i) {
      this.updatePosition();
      this.coll(i);
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < colMax; i++) {
      for (var j = 0; j < rowMax; j++) {
        var circle = new Circle(ctx, xSplit * i + xSplit / 2, ySplit * j + ySplit / 2);
        circles.push(circle);
      }
    }

    /********************
      Render
    ********************/
    
    function render(i){
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < circles.length; i++) {
        circles[i].render(i);
      }
      requestAnimationFrame(render);
    }

    render();

    /********************
      Event
    ********************/
    
    // resize
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      for (var i = 0; i < circles.length; i++) {
        circles[i].resize();
      }
    }
    
    speed.addEventListener('change', function() {
      distance = this.value;
      for (var i = 0; i < circles.length; i++) {
        circles[i].updatePosition();
        circles[i].coll(i);
      }
    });
         
    window.addEventListener('mousemove', function(e) {
    }, false);
    
    window.addEventListener('resize', function() {
      onResize();
    });

  }); 
  // Author
  console.log('File Name / giantKilling.js\nCreated Date / January 22, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
