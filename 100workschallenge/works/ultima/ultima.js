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
    var shapes = [];
    var shapeNum = Y / 1.5;
    var angle = 137.5;
    var settingAngle = document.getElementById('settingAngle');
    var settingAngleChil = settingAngle.children;
    var flg = false;

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
      this.r = 2 * i / 200;
      this.i = i;
      this.a = i;
      this.rad = this.a * Math.PI / 180; 
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(200, 255)
      };
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.translate(this.x, this.y);
      ctx.rotate(Math.sin(this.a * Math.PI / 180));
      if (flg === false) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.scale(Math.cos(this.a * Math.PI / 180), Math.sin(this.a * Math.PI / 180));
      } else {
        ctx.scale(Math.tan(this.a * Math.PI / 180), Math.tan(this.a * Math.PI / 180));
      }
      ctx.translate(-this.x, -this.y);
      ctx.beginPath();
      ctx.arc(Math.cos(angle * Math.PI / 180 * this.i) * this.i / 2 + X / 2, Math.sin(angle * Math.PI / 180 * this.i) * this.i / 2 + Y / 2, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };
    
    Shape.prototype.updateParams = function() {
      angle += 0.00001;
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
    };
    
    Shape.prototype.render = function() {
      this.updateParams();
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
      //ctx.clearRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "darken";
      ctx.globalAlpha = 0.03;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].render();
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
      shapes = [];
      for (var i = 0; i < shapeNum; i++) {
        var s = new Shape(ctx, X / 2, Y / 2, i);
        shapes.push(s);
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });

    canvas.addEventListener('click', function() {
      flg === true ? flg = false : flg = true;
    }, false);

    for(var i = 0; i < settingAngleChil.length; i++) {
      settingAngleChil[i].addEventListener('click', function() {
        angle = Number(this.textContent);
      }, false);
    }
    
    canvas.addEventListener('wheel', function(e) {
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].a += e.deltaY;
        shapes[i].i += e.deltaY;
      }
    });

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
      if (touchEndY > 0) {
        for (var i = 0; i < shapes.length; i++) {
          shapes[i].a += touchEndY / 100;
          shapes[i].i += touchEndY / 100;
        }
      }
      if (touchEndY < 0) {
        for (var i = 0; i < shapes.length; i++) {
          shapes[i].a += touchEndY / 100;
          shapes[i].i += touchEndY / 100;
        }
      }
    }, false);
    
    canvas.addEventListener('touchend', function(e) {
      touchStartY = null;
      touchMoveY = null;
      touchEndY = null;
    }, false);

  });
  // Author
  console.log('File Name / ultima.js\nCreated Date / Jun 07, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
