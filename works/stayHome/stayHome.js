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

    var resetBtn = document.getElementById('resetBtn');
    var stayBtn = document.getElementById('stayBtn');
    var stay = false;
    var countSick = document.getElementById('countSick'); 
    // canvas 
    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    
    var splitNum = 16;

    if (X < 768) {
      splitNum = 8;
    }

    var xSplit = X / splitNum;
    var ySplit = Y / splitNum;
    var sick = 1;
    var healthy = splitNum * splitNum - 1;

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
    
    function Circle(ctx, x, y, c) {
      this.ctx = ctx;
      this.init(x, y, c);
    }

    Circle.prototype.init = function(x, y, c) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.x1 = this.x;
      this.y1 = this.y;
      this.v = {
        x: rand(-1, 1),
        y: rand(-1, 1)
      };
      this.c = c;
      this.r = ySplit / 8;
    };

    Circle.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.fillStyle = this.c;
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.fill();
    };

    Circle.prototype.stayHome = function() {
      this.v.x = 0;
      this.v.y = 0;
    };

    function countSickSick() {
      for (var i = 0; i < circles.length; i++) {
        if (circles[i].c == 'rgb(255, 57, 57)') {
          countSick.textContent = sick;
          countHealthy.textContent = healthy;
          sick++;
          healthy--;
        }
      }
    }

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
          var thatC = circles[i].c;
          var sumRadius = this.r + thatR;
          a = this.x - circles[i].x;
          b = this.y - circles[i].y;
          c = a * a + b * b;
          if (c < sumRadius * sumRadius) {
            if (this.c !== thatC) {
              this.c = 'rgb(255, 57, 57)';
            }
            this.v.x *= -1;
            this.v.y *= -1;
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
      if (stay === true) this.stayHome();
      this.updatePosition();
      this.coll(i);
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < colMax; i++) {
      for (var j = 0; j < rowMax; j++) {
        var color;
        i === colMax / 2  && j === rowMax  / 2 ? color = 'rgb(255, 57, 57)' : color = 'rgb(193, 242, 95)';
        var circle = new Circle(ctx, xSplit * i + xSplit / 2, ySplit * j + ySplit / 2, color);
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
      countSickSick();
      sick = 1;
      healthy = splitNum * splitNum - 1;
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
    
    window.addEventListener('resize', function() {
      onResize();
    });

    resetBtn.addEventListener('click', function() {
      circles = [];
      stay = false; 
      stayBtn.textContent = 'Stay Home';
      for (var i = 0; i < colMax; i++) {
        for (var j = 0; j < rowMax; j++) {
          var color;
          i === colMax / 2  && j === rowMax  / 2 ? color = 'rgb(255, 57, 57)' : color = 'rgb(193, 242, 95)';
          var circle = new Circle(ctx, xSplit * i + xSplit / 2, ySplit * j + ySplit / 2, color);
          circles.push(circle);
        }
      }
    }, false);

    stayBtn.addEventListener('click', function() {
      if (stay === true) {
        stay = false;
        stayBtn.textContent = 'Stay Home';
        for (var i = 0; i < circles.length; i++) {
          circles[i].v.x = rand(-1, 1);
          circles[i].v.y = rand(-1, 1);
        }
      } else {
        stay = true;
        stayBtn.textContent = 'Go Out';
      }
    }, false);

  }); 
  // Author
  console.log('File Name / stayHome.js\nCreated Date / April 12, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
