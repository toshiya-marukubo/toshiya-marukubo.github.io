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
      Pug
    ********************/
    
    var pugNum = 500;
    var pugs = [];

    function Pug(ctx, x, y, h) {
      this.ctx = ctx;
      this.init(x, y, h);
    }

    Pug.prototype.init = function(x, y, h) {
      this.x = x;
      this.y = y;
      this.h = h;
      this.h === true ? this.r = 1 : this.r = 1;
      this.l = rand(5, 10);
      this.a = rand(0, 360);
      this.rad = this.a * Math.PI / 180;
      this.c = {
        r: rand(0, 255),
        g: rand(0, 100),
        b: rand(0, 255)
      };
      this.v = {
        x: rand(-5, 5) * Math.random() + 1,
        y: rand(-5, 5) * Math.random() + 1,
        z: Math.random() * 3
      };
    };


    Pug.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    Pug.prototype.updatePosition = function() {
      this.x += Math.cos(this.rad) * 3 + this.v.x;
      this.y += Math.sin(this.rad) * 3 + this.v.y;
    };
    
    Pug.prototype.wrapPosition = function() {
      if (this.x < 0 - 200) this.x = X;
      if (this.x > X + 200) this.x = 0;
      if (this.y < 0 - 200) this.y = Y;
      if (this.y > Y + 200) this.y = 0;
    };

    Pug.prototype.closestPug = function(i) {
      var j = i;
      var dist = Number.MAX_VALUE;
      var closestI = 0;
      for (var i = 0; i < pugs.length; i++) {
        if (j !== i && pugs[i].h === true) {
          var x = Math.abs(this.x - pugs[i].x);
          var y = Math.abs(this.y - pugs[i].y);
          var d = x * x + y * y;
          var newDist = Math.floor(Math.sqrt(d));
          if (newDist < dist) {
            dist = newDist;
            closestI = i;
          }
        }
      }
      var nx = pugs[closestI].x;
      var ny = pugs[closestI].y;
      var x = this.x - nx;
      var y = this.y - ny;
      var d = x * x + y * y;
      var newD = Math.sqrt(d);
      this.v.x = x / newD * this.v.z;
      this.v.y = y / newD * this.v.z;
      this.x += Math.cos(this.rad);
      this.y += Math.sin(this.rad);
      this.x -= this.v.x;
      this.y -= this.v.y;
    };

    Pug.prototype.updateParams = function() {
      this.a -= 1;
      this.rad = this.a * Math.PI / 180;
      this.l -= 0.1;
      if (this.l < 0) {
        this.v.x = rand(-5, 5) + 1;
        this.v.y = rand(-5, 5) + 1;
        this.l = rand(5, 10); 
      }
    };

    Pug.prototype.render = function(i) {
      if (this.h === true) this.updatePosition();
      if (this.h !== true) this.closestPug(i);
      this.updateParams();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < pugNum; i++) {
      var pug = new Pug(ctx, X / 2, Y / 2, i === 0 ? true : false);
      pugs.push(pug);
    }

    /********************
      Render
    ********************/
    
    function render(){
      //ctx.clearRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "darken";
      ctx.globalAlpha = 0.03;
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;     
      for (var i = 0; i < pugs.length; i++) {
        pugs[i].render(i);
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

    window.addEventListener('resize', function() {
      onResize();
    });
    
    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    var clearId;
    window.addEventListener('mousedown', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      clearId = setInterval(function() {
        var num = rand(1, 10);
        for (var i = 0; i < num; i++) {
          var pug = new Pug(ctx, mouseX, mouseY, Math.random() < 0.01 ? true : false);
          pugs.push(pug);
        }
      }, 80);
    });

    window.addEventListener('mouseup', function() {
      clearInterval(clearId);
    });

    window.addEventListener('touchstart', function(e) {
      var touch = event.targetTouches[0];
      mouseX = touch.pageX;
      mouseY = touch.pageY;
      clearId = setInterval(function() {
        var num = rand(1, 10);
        for (var i = 0; i < num; i++) {
          var pug = new Pug(ctx, mouseX, mouseY, Math.random() < 0.01 ? true : false);
          pugs.push(pug);
        }
      }, 80);
    }, false);

    window.addEventListener('touchend', function(e) {
      clearInterval(clearId);
    });

  }); 
  // Author
  console.log('File Name / flock.js\nCreated Date / May 11, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
