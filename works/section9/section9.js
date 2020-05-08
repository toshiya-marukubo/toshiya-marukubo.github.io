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
    var mouseX = X / 2;
    var mouseY = Y / 2;
     
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
      Text
    ********************/
    
    var text = '#9'; 
    var textSize = '48px';
    function drawText() {
      ctx.save();
      ctx.fillStyle = color;
      ctx.font = textSize + " impact";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, X / 2, Y / 2);
      ctx.restore();
    }

    /********************
      Line
    ********************/
    
    function drawLine() {
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, mouseY);
      ctx.lineTo(X, mouseY);
      ctx.stroke();
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(mouseX, 0);
      ctx.lineTo(mouseX, Y);
      ctx.stroke();
      ctx.restore();
    }

    /********************
      Circle
    ********************/

    var circleNum = 3;
    var circles = [];
    var radius = 80; 
    var diff = radius / 100;
    var lw = 5;
    var blur = 10;
    var color = 'rgb(71, 255, 255)';
    if (X < 768) {
      radius = 50;
      textSize = '24px';
      lw = 3;
    }
     
    function Circle(ctx, x, y, r, w) {
      this.ctx = ctx;
      this.init(x, y, r, w);
    } 

    Circle.prototype.init = function(x, y, r, w) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.w = w;
      this.c = color;
    };

    Circle.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.lineWidth = this.w;
      ctx.strokeStyle = this.c;
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.stroke();
      ctx.restore();
    };

    Circle.prototype.render = function() {
      this.draw();
    };

    for (var i = 0; i < 2; i++) {
      var circle = new Circle(ctx, mouseX, mouseY, radius + i * 10, lw);
      circles.push(circle);
    }
    for (var i = 0; i < 2; i++) {
      var circle = new Circle(ctx, mouseX, mouseY, radius * 2 + i * 10, lw);
      circles.push(circle);
    }
    for (var i = 0; i < 1; i++) {
      var circle = new Circle(ctx, mouseX, mouseY, radius * 1.55, lw * 5);
      circles.push(circle);
    }
    for (var i = 0; i < 1; i++) {
      var circle = new Circle(ctx, mouseX, mouseY, radius * 2.65, lw * 10);
      circles.push(circle);
    }

    /********************
      Rect
    ********************/
    
    var rectNum = 6;
    var rects = [];

    function Rect(ctx, x, y, lw, r, flg) {
      this.ctx = ctx;
      this.init(x, y, lw, r, flg);
    }

    Rect.prototype.init = function(x, y, lw, r, flg) {
      this.flg = flg;
      this.flg === true ? this.s = -Math.random(): this.s = Math.random();
      this.flg === true ? this.scale = 1.45 : this.scale = 1.3;
      this.x = x;
      this.y = y;
      this.lw = lw;
      this.c = color;
      this.a = rand(0, 360);
      this.rad = this.a * Math.PI / 180;
      this.r = r;
    };

    Rect.prototype.draw = function(){
      var ctx = this.ctx;
      ctx.save();
      ctx.strokeStyle = this.c;
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
      ctx.lineWidth = this.lw;
      ctx.beginPath();
      ctx.moveTo(this.x + Math.cos(this.rad) * this.r, this.y + Math.sin(this.rad) * this.r);
      ctx.lineTo(this.x + Math.cos(this.rad) * this.r * this.scale, this.y + Math.sin(this.rad) * this.r * this.scale);
      ctx.stroke();
      ctx.restore();
    };
    
    Rect.prototype.upSpeed = function() {
      this.s *= 10;
    };
    
    Rect.prototype.resetSpeed = function() {
      this.flg === true ? this.s = -Math.random(): this.s = Math.random();
    };
     
    Rect.prototype.updateParams = function() {
      this.a -= this.s;
      this.rad = this.a * Math.PI / 180;
    };
     
    Rect.prototype.render = function() {
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < 3; i++) {
      var rect = new Rect(ctx, mouseX, mouseY, lw * 1.5, radius, true);
      rects.push(rect);
    }
    for (var i = 0; i < 6; i++) {
      var rect = new Rect(ctx, mouseX, mouseY, lw * 5, radius * 1.55, false);
      rects.push(rect);
    }
    for (var i = 0; i < 3; i++) {
      var rect = new Rect(ctx, mouseX, mouseY, lw * 1.5, radius * 2, true);
      rects.push(rect);
    }
    for (var i = 0; i < 6; i++) {
      var rect = new Rect(ctx, mouseX, mouseY, lw * 10, radius * 2.5, false);
      rects.push(rect);
    }

    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      drawText();
      drawLine();
      for (var i = 0; i < circles.length; i++) {
        circles[i].render();
      }
      for (var i = 0; i < rects.length; i++) {
        rects[i].render();
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
      mouseX = X / 2;
      mouseY = Y / 2;
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    var clearId;
    window.addEventListener('mousedown', function() {
      clearId = setInterval(function() {
        for (var i = 0; i < rects.length; i++) {
          rects[i].s = rects[i].s * 2;
        }
        text = '#' + rand(0, 100);
      }, 80);
    });

    window.addEventListener('mouseup', function() {
      clearInterval(clearId);
      for (var i = 0; i < rects.length; i++) {
        rects[i].resetSpeed();
      }
    });
    
    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    window.addEventListener('touchstart', function(e) {
      var touch = event.targetTouches[0];
      mouseX = touch.pageX;
      mouseY = touch.pageY;
      clearId = setInterval(function() {
        for (var i = 0; i < rects.length; i++) {
          rects[i].s = rects[i].s * 2;
        }
        text = '#' + rand(0, 100);
      }, 80);
    }, false);

    window.addEventListener('touchend', function(e) {
      clearInterval(clearId);
    });

  }); 
  // Author
  console.log('File Name / section9.js\nCreated Date / May 08, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
