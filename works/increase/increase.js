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

    var colors = ['rgb(1, 1, 1)', 'rgb(78, 196, 193)', 'rgb(236, 86, 107)', 'rgb(229, 227, 53)'];
    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    // shape
    var shapeMax = 1000;
    var shapes = [];
    var shapeNum = 1;
    var gravity = 0.3;
    var friction = 0.8;
    // wall
    var walls = [];
    var splitNum = 8;
    var split = X / splitNum;
    var yNum = Y / split;
    
    if (X < 768) {
      splitNum = 3;
      split = X / splitNum;
      yNum = Y / split;
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
      this.r = 10;
      this.c = colors[rand(0, colors.length - 1)];
      this.v = {
        x: rand(-10, 10) * Math.random() * Math.random(),
        y: rand(-10, 10) * Math.random() * Math.random()
      };
    };
    
    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.fillStyle = this.c; 
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    Shape.prototype.wrapPosition = function() {
      if (this.x - this.r < 0) {
        this.x = 0 + this.r;
        this.v.x = - this.v.x;
      }
      if (this.x + this.r > X) {
        this.x = X - this.r;
        this.v.x = - this.v.x;
      }
      if (this.y - this.r < 0) {
        //this.v.y = - this.v.y;
      }
      if (this.y - this.r > Y) {
        this.y = 0 - this.r;
        //this.v.y *= friction;
        //this.v.y = - this.v.y;
        this.v = {
          x: rand(-10, 10) * Math.random() * Math.random(),
          y: rand(-10, 10) * Math.random() * Math.random()
        };
        if (shapeMax < 1000) {
          var s = new shape(ctx, rand(0, x), 0 - 100, i);
          shapes.push(s);
        }
      }
    };

    Shape.prototype.collisionWall = function() {
      for (var i = 0; i < walls.length; i++) {
        var wall = walls[i];
        // left top
        if (this.r * this.r > (this.x - wall.x) * (this.x - wall.x) + (this.y - wall.y) * (this.y - wall.y)) {
          this.y = wall.y - this.r;
          this.v.y *= friction;
          this.v.y = - this.v.y;
          break;
        }
        // left down
        if (this.r * this.r > (this.x - wall.x) * (this.x - wall.x) + (this.y - wall.y - wall.wi) * (this.y - wall.y - wall.wi)) {
          this.x = wall.x - this.r;
          //this.v.y = - this.v.y;
          this.v.x = - this.v.x;
          break;
        }
        // right top
        if (this.r * this.r > (this.x - wall.x - wall.len) * (this.x - wall.x - wall.len) + (this.y - wall.y) * (this.y - wall.y)) {
          this.y = wall.y - this.r;
          this.v.y *= friction;
          this.v.y = - this.v.y;
          break;
        }
        // right down
        if (this.r * this.r > (this.x - wall.x - wall.len) * (this.x - wall.x - wall.len) + (this.y - wall.y - wall.wi) * (this.y - wall.y - wall.wi)) {
          this.x = wall.x + wall.len + this.r;
          //this.v.y = - this.v.y;
          this.v.x = - this.v.x;
          break;
        }
        if (this.x + this.r > wall.x && this.x - this.r < wall.x + wall.len && this.y + this.r > wall.y && this.y - this.r < wall.y + wall.wi) {
          if (this.y < wall.y + wall.wi / 2) {
            this.y = wall.y - this.r;
            this.v.y *= friction;
            this.v.y = - this.v.y;
          }
          if (this.y > wall.y + wall.wi/ 2) {
            this.y = wall.y + wall.wi + this.r;
            this.v.y = - this.v.y;
          }
          if (this.x - this.r > wall.x) {
            this.v.y = - this.v.y;
          }
          if (this.x + this.r < wall.x + wall.len) {
            this.v.y = - this.v.y;
          }
        }
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
            this.v.x = Math.cos(colAngle) * 5;
            this.v.y = Math.sin(colAngle) * 5;
          }
        }
      }
    };

    Shape.prototype.updatePosition = function() {
      this.v.y += gravity;
      this.x += this.v.x;
      this.y += this.v.y;
    };
    
    Shape.prototype.render = function(i) {
      this.updatePosition();
      this.collisionShape(i);
      this.collisionWall();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < shapeNum; i++) {
      var s = new Shape(ctx, rand(0, X), 0 - 50, i);
      shapes.push(s);
    }

    /********************
      Wall
    ********************/
    
    function Wall(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }
    
    Wall.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.i = i;
      this.len = split / 2;
      this.wi = split / 6;
      this.c = colors[rand(0, colors.length - 1)];
    };

    Wall.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = this.c; 
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.len, this.wi);
      ctx.fill();
      ctx.restore();
    };

    Wall.prototype.render = function() {
      this.draw();
    };

    for (var i = 1; i < yNum; i++) {
      for (var j = 0; j < splitNum + 1; j++) {
        var s;
        if (i % 2 === 0) {
          s = new Wall(ctx, split * j - split, split * i, i);
        } else {
          s = new Wall(ctx, split * j - split / 2, split * i, i);
        }
        walls.push(s);
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
      for (var i = 0; i < walls.length; i++) {
        walls[i].render();
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
      walls = [];
      if (X < 768) {
        splitNum = 3;
        split = X / splitNum;
        yNum = Y / split;
      } else {
        splitNum = 8;
        split = X / splitNum;
        yNum = Y / split;
      }
      for (var i = 1; i < yNum; i++) {
        for (var j = 0; j < splitNum + 1; j++) {
          var s;
          if (i % 2 === 0) {
            s = new Wall(ctx, split * j - split, split * i, i);
          } else {
            s = new Wall(ctx, split * j - split / 2, split * i, i);
          }
          walls.push(s);
        }
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });

    canvas.addEventListener('click', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      var s = new Shape(ctx, e.clientX, e.clientY, i);
      shapes.push(s);
    }, false);

    canvas.addEventListener('wheel', function(e) {
      gravity += e.deltaY / 10000;
    }, false);

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
      touchEndY = touchStartY - touchMoveY;
      gravity += touchEndY / 10000;
    }, false);

    canvas.addEventListener('touchend', function(e) {
      touchStartY = null;
      touchMoveY = null;
      touchEndY = null;
    }, false);

  });
  // Author
  console.log('File Name / increase.js\nCreated Date / July 03, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
