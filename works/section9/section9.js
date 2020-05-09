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
    var color = 'rgb(71, 255, 255)';
     
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
    var textSize = '56px';
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
    
    var linesNum = 5;
    var lines = [];

    function Line(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Line.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.c = color;
      this.l = rand(10, 50);
      this.lw = 1;
      this.v = {
        x: rand(-5, 5) * Math.random(),
        y: rand(-5, 5) * Math.random()
      };
    };

    Line.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.lineWidth = this.lw;
      ctx.strokeStyle = this.c;
      ctx.beginPath();
      ctx.moveTo(0, this.y);
      ctx.lineTo(X, this.y);
      ctx.stroke();
      ctx.lineWidth = this.lw;
      ctx.beginPath();
      ctx.moveTo(this.x, 0);
      ctx.lineTo(this.x, Y);
      ctx.stroke();
      ctx.restore();
    };

    Line.prototype.updatePosition = function() {
      this.x += this.v.x;
      this.y += this.v.y;
    }; 

    Line.prototype.wrapPosition = function() {
      if (this.x < 0) this.x = X;
      if (this.x > X) this.x = 0;
      if (this.y < 0) this.y = Y;
      if (this.y > Y) this.y = 0;
    };

    Line.prototype.updateParams = function() {
      this.l -= 0.1;
      if (this.l < 0) {
        this.v.x = rand(-5, 5) * Math.random();
        this.v.y = rand(-5, 5) * Math.random();
        this.l = rand(10, 50);
      }
    };

    Line.prototype.render = function() {
      this.updatePosition();
      this.wrapPosition();
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < linesNum; i++) {
      var line = new Line(ctx, rand(0, X), rand(0, Y));
      lines.push(line);
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
    
    if (X < 768) {
      radius = 50;
      textSize = '32px';
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

    Circle.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 2;
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

    Rect.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 2;
    };
    
    Rect.prototype.upSpeed = function() {
      this.flg === true ? this.s = -30: this.s = 30;
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
    for (var i = 0; i < 9; i++) {
      var rect = new Rect(ctx, mouseX, mouseY, lw * 10, radius * 2.5, false);
      rects.push(rect);
    }

    /********************
      Message
    ********************/
    var textWidth = X / 8 + 1;
    function inputMessage() {
      var text = '';
      for (var i = 0; i < textWidth; i++) {
        text += String.fromCharCode(20000 + Math.random() * 33);
      }
      ctx.save();
      ctx.fillStyle = color;
      ctx.font = '16px "impact"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 0, Y / 2);
      ctx.restore();
    }

    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      drawText();
      inputMessage();
      for (var i = 0; i < lines.length; i++) {
        lines[i].render();
      }
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
      textWidth = X / 8 + 1;
      for (var i = 0; i < circles.length; i++) {
        circles[i].resize();
      }
      for (var i = 0; i < rects.length; i++) {
        rects[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    var clearId;
    window.addEventListener('mousedown', function() {
      clearId = setInterval(function() {
        for (var i = 0; i < rects.length; i++) {
          rects[i].upSpeed();
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
          rects[i].upSpeed();
        }
        text = '#' + rand(0, 100);
      }, 80);
    }, false);

    window.addEventListener('touchend', function(e) {
      clearInterval(clearId);
      for (var i = 0; i < rects.length; i++) {
        rects[i].resetSpeed();
      }
    });

  }); 
  // Author
  console.log('File Name / section9.js\nCreated Date / May 08, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
