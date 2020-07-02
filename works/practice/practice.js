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
    var shapeNum = 10;
    var walls = [];
    var wallNum = 1;
    var gravity = 0.3;

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
      this.a = 0;
      this.rad = this.a * Math.PI / 180;
      this.v = {
        x: rand(-10, 10) * Math.random() * Math.random(),
        y: rand(-10, 10) * Math.random() * Math.random()
      };
      this.angle = 0;
      this.radian = this.angle * Math.PI / 180;
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(200, 255)
      };
      this.friction = Math.random() * Math.random();
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    Shape.prototype.wrapPosition = function() {
      if (this.x - this.r < 0) {
        //this.v.x = - this.v.x;
      }
      if (this.x + this.r > X) {
        //this.v.x = - this.v.x;
      }
      if (this.y - this.r < 0) {
        //this.v.y = - this.v.y;
      }
      if (this.y + this.r > Y) {
        this.v.y *= - this.friction;
        this.y = Y - this.r;
      }
    };

    Shape.prototype.collisionWall = function() {
      for (var i = 0; i < walls.length; i++) {
        var wall = walls[i];
        // left top
        if (this.r * this.r > (this.x - wall.x) * (this.x - wall.x) + (this.y - wall.y) * (this.y - wall.y)) {
          this.v.y *= - this.friction;
          this.y = wall.y - this.r;
          break;
        }
        // left down
        if (this.r * this.r > (this.x - wall.x) * (this.x - wall.x) + (this.y - wall.y - wall.wi) * (this.y - wall.y - wall.wi)) {
          this.v.y = - this.v.y;
          this.v.x = - this.v.x;
          break;
        }
        // right top
        if (this.r * this.r > (this.x - wall.x - wall.len) * (this.x - wall.x - wall.len) + (this.y - wall.y) * (this.y - wall.y)) {
          this.v.y *= - this.friction;
          this.y = wall.y - this.r;
          break;
        }
        // right down
        if (this.r * this.r > (this.x - wall.x - wall.len) * (this.x - wall.x - wall.len) + (this.y - wall.y - wall.wi) * (this.y - wall.y - wall.wi)) {
          this.v.y = - this.v.y;
          this.v.x = - this.v.x;
          break;
        }
        if (this.x + this.r > wall.x && this.x - this.r < wall.x + wall.len && this.y + this.r > wall.y && this.y - this.r < wall.y + wall.wi) {
          if (this.y < wall.y + wall.wi / 2) {
            this.v.y *= - this.friction;
            this.y = wall.y - this.r;
          }
          if (this.y > wall.y + wall.wi/ 2) {
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
            this.v.x = Math.cos(colAngle) * 1;
            this.v.y = Math.sin(colAngle) * 1;
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


    setInterval(function() {
      var s = new Shape(ctx, X / 2, Y / 2, i);
      shapes.push(s);
    }, 500);

    /********************
      Render
    ********************/
    
    function Wall(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }

    Wall.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.i = i;
      this.len = width;
      this.wi = 20;
    };

    Wall.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.len, this.wi);
      ctx.fill();
      ctx.restore();
    };

    Wall.prototype.render = function() {
      this.draw();
    };

    var width;
    X < 768 ? width = 200 : width = 300;

    for (var i = 0; i < 1; i++) {
      var w = new Wall(ctx, X / 2 - width / 2, Y - Y / 3, i);
      walls.push(w);
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
    }

    window.addEventListener('resize', function(){
      onResize();
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
  console.log('File Name / practice.js\nCreated Date / July 02, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
