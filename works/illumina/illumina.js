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
    var ellipses = [];
    var ellipseNum = X / 10 + 1;
    
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
      Ellipse
    ********************/
    
    function Ellipse(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }

    Ellipse.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.i = i;
      this.r = Y / 40;
      this.v = {
        x: 0,
        y: 0
      };
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(200, 255),
        a: 1
      };
      this.a = i * 2;
      this.rad = this.a * Math.PI / 180;
    };

    Ellipse.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.translate(this.x, this.y);
      ctx.scale(1.2, 20);
      ctx.fillStyle = this.gradient();
      ctx.translate(-this.x, -this.y);
      ctx.arc(Math.cos(this.rad) * 20 + this.x, Math.sin(this.rad) * 1 + this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    Ellipse.prototype.gradient = function () {
      var col = this.c.r + "," + this.c.g + "," + this.c.b;
      var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, "rgba(" + col + ", " + (this.c.a * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (this.c.a * 0.7) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (this.c.a * 0) + ")");
      return g;
    };

    Ellipse.prototype.updateParams = function() {
      this.a += 0.7;
      this.rad = this.a * Math.PI / 180;
    };
    
    Ellipse.prototype.render = function() {
      this.updateParams();
      this.draw();
    };
    
    for (var i = 0; i < ellipseNum; i++) {
      var e = new Ellipse(ctx, 0 + i * 10, Y / 2, i);
      ellipses.push(e);
    }

    /********************
      Render
    ********************/
   
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < ellipses.length; i++) {
        ellipses[i].render();
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
      ellipses = [];
      ellipseNum = X / 10 + 1;
      for (var i = 0; i < ellipseNum; i++) {
        var e = new Ellipse(ctx, 0 + i * 10, Y / 2, i);
        ellipses.push(e);
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });
    
    canvas.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      for (var i = 0; i < ellipses.length; i++) {
        ellipses[i].y += rand(-5, 5);
      }
    });

    canvas.addEventListener('touchmove', function(e) {
      var touch = event.targetTouches[0];
      mouseX = touch.pageX;
      mouseY = touch.pageY;
      for (var i = 0; i < ellipses.length; i++) {
        ellipses[i].y += rand(-5, 5);
      }
    }, false);

    canvas.addEventListener('wheel', function(e) {
      for (var i = 0; i < ellipses.length; i++) {
        ellipses[i].a += e.deltaX;
      }
    });

  });
  // Author
  console.log('File Name / illumina.js\nCreated Date / May 27, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
