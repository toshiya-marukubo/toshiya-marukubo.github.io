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
    var max = Math.sqrt(X * X + Y * Y);
    var shapes = [];
    var shapeNum = 10;
    var pointsNum = 6;
    var angle = 360 / pointsNum;
    var radian = angle * Math.PI / 180;
    var splitNum = 24;
    var split = X / splitNum;
    var yNum = Y / split; 
    var lw = 6;

    if (X < 768) {
      splitNum = 6;
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
      this.i = i;
      this.r = split / 2;
      this.a = i;
      this.rad = this.a * Math.PI / 180;
      this.par = 100;
      this.lw = lw;
      this.c = {
        r: rand(0, 360),
        g: rand(0, 360),
        b: rand(200, 360)
      };
    };
    
    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = lw;
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.beginPath();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rad * this.par);
      ctx.translate(-this.x, -this.y);
      ctx.moveTo(Math.sin(radian * 1) * this.r * this.par + this.x, Math.cos(radian * 1) * this.r * this.par + this.y);
      for (var i = 2; i < pointsNum + 1; i++) {
        ctx.lineTo(Math.sin(radian * i) * this.r * this.par + this.x, Math.cos(radian * i) * this.r * this.par + this.y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    Shape.prototype.dist = function() {
      var x = mouseX - this.x;
      var y = mouseY - this.y;
      var d = x * x + y * y;
      var dist = Math.sqrt(d);
      //this.par = 100 - (dist / max * 100);
      this.par = 1 - dist / max;
    };

    Shape.prototype.updateParams = function() {
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
    };


    Shape.prototype.render = function() {
      this.updateParams();
      this.dist();
      this.draw();
    };
    
    for (var i = 0; i < yNum + 1; i++) {
      for (var j = 0; j < splitNum + 2; j++) {
        var s;
        if (i % 2 === 0) {
          s = new Shape(ctx, split * j - split, split * i, i);
        } else {
          s = new Shape(ctx, split * j - split / 2, split * i, i);
        }
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
      max = Math.sqrt(X * X + Y * Y);
      shapes = [];
      if (X < 768) {
        splitNum = 6;
        split = X / splitNum;
        yNum = Y / split; 
      } else {
        splitNum = 24;
        split = X / splitNum;
        yNum = Y / split; 
      }
      for (var i = 0; i < yNum + 1; i++) {
        for (var j = 0; j < splitNum + 2; j++) {
          var s;
          if (i % 2 === 0) {
            s = new Shape(ctx, split * j - split, split * i, i);
          } else {
            s = new Shape(ctx, split * j - split / 2, split * i, i);
          }
          shapes.push(s);
        }
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, false);

    function repRandomNum() {
      var beforeNum = pointsNum;
      var newNum = rand(2, 6);
      if (newNum === beforeNum) {
        repRandomNum();
      } else {
        pointsNum = newNum;
      }
    }

    canvas.addEventListener('click', function(e){
      repRandomNum();
      angle = 360 / pointsNum;
      radian = angle * Math.PI / 180;
    }, false);
    
    canvas.addEventListener('wheel', function(e) {
      lw += e.deltaY / 100;
    });

    function repRandomNum() {
      var beforeNum = pointsNum;
      var newNum = rand(2, 6);
      if (newNum === beforeNum) {
        repRandomNum();
      } else {
        pointsNum = newNum;
      }
    }

    var touchStartY;
    var touchMoveY;
    var touchEndY;

    canvas.addEventListener('touchstart', function(e) {
      var touch = e.targetTouches[0];
      touchStartY = touch.pageY;
    }, false);

    canvas.addEventListener('touchmove', function(e) {
      var touch = e.targetTouches[0];
      mouseX = touch.pageX;
      mouseY = touch.pageY;
      touchMoveY = touch.pageY;
      touchEndY = touchStartY - touchMoveY;
      lw += touchEndY / 100;
    }, false);

    canvas.addEventListener('touchend', function(e) {
      touchStartY = null;
      touchMoveY = null;
      touchEndY = null;
    }, false);


  });
  // Author
  console.log('File Name / toSix.js\nCreated Date / Jun 30, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
