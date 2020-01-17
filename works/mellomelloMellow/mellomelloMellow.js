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

    // canvas 
    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;

    // heart
    var heartNum = 1;
    var hearts = [];
    var miniHeartNum = 100;
    var miniHearts =[];

    var rad = Math.PI / 180;
    var GRAVITY = 0.01;

    /********************
      Animation
    ********************/

    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (cb) {
        setTimeout(cb, 17);
      };

    /********************
      MiniHeart
    ********************/
    
    function MiniHeart(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    MiniHeart.prototype.init = function (x, y, r) {
      this.ctx = ctx;
      this.r = r;
      this.x1 = x;
      this.y1 = y;
      this.a = rand(0, 360);
      this.num = 22.5;
      this.v = {
        x: rand(-3, 3),
        y: rand(-3, 3)
      };
      this.x2 = this.x1 + this.r * Math.cos(this.a * rad);
      this.y2 = this.y1 + this.r * Math.sin(this.a * rad);
      this.cx1 = this.x1 + this.r * Math.cos((this.a + this.num) * rad);
      this.cy1 = this.y1 + this.r * Math.sin((this.a + this.num) * rad);
      this.cx2 = this.x1 + this.r * Math.cos((this.a - this.num) * rad);
      this.cy2 = this.y1 + this.r * Math.sin((this.a - this.num) * rad);
      this.chord = 2 * this.r * Math.sin(this.num * rad / 2);
    };

    MiniHeart.prototype.draw = function () {
      ctx = this.ctx;
      ctx.restore();
      ctx.fillStyle = '#fb7daf';
      ctx.beginPath();
      ctx.moveTo(this.x2, this.y2);
      ctx.arc(this.cx1, this.cy1, this.chord, (270 + this.a) * rad, (270 + this.a + 225) * rad);
      ctx.lineTo(this.x1, this.y1);
      ctx.moveTo(this.x2, this.y2);
      ctx.arc(this.cx2, this.cy2, this.chord, (90 + this.a) * rad, (90 + this.a + 135) * rad, true);
      ctx.lineTo(this.x1, this.y1);
      ctx.fill();
    };
    
    MiniHeart.prototype.wrapPosition = function() {
      if (this.y1 > Y) {
        this.init(X / 2, Y / 2, rand(5, 30));
      }
    };
    
    MiniHeart.prototype.updatePosition = function() {
      this.v.y += GRAVITY;
      this.x1 += this.v.x;
      this.x2 += this.v.x;
      this.cx1 += this.v.x;
      this.cx2 += this.v.x;
      this.y1 += this.v.y;
      this.y2 += this.v.y;
      this.cy1 += this.v.y;
      this.cy2 += this.v.y;
    };

    MiniHeart.prototype.render = function () {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };

    /********************
      Heart
    ********************/

    function Heart(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Heart.prototype.init = function (x, y, r) {
      this.ctx = ctx;
      this.r = r;
      this.x1 = x;
      this.y1 = y + this.r / 1.5
      this.a = -90;
      this.num = 22.5;
      this.color = {
        r: 251,
        g: 125,
        b: 175,
        a: 1
      };
      this.x2 = this.x1 + this.r * Math.cos(this.a * rad);
      this.y2 = this.y1 + this.r * Math.sin(this.a * rad);
      this.cx1 = this.x1 + this.r * Math.cos((this.a + this.num) * rad);
      this.cy1 = this.y1 + this.r * Math.sin((this.a + this.num) * rad);
      this.cx2 = this.x1 + this.r * Math.cos((this.a - this.num) * rad);
      this.cy2 = this.y1 + this.r * Math.sin((this.a - this.num) * rad);
      this.chord = 2 * this.r * Math.sin(this.num * rad / 2);
    };

    Heart.prototype.draw = function () {
      ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = this.gradient();
      ctx.shadowColor = '#f9005f';
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.moveTo(this.x2, this.y2);
      ctx.arc(this.cx1, this.cy1, this.chord, (270 + this.a) * rad, (270 + this.a + 225) * rad);
      ctx.lineTo(this.x1, this.y1);
      ctx.moveTo(this.x2, this.y2);
      ctx.arc(this.cx2, this.cy2, this.chord, (90 + this.a) * rad, (90 + this.a + 135) * rad, true);
      ctx.lineTo(this.x1, this.y1);
      ctx.fill();
    };

    Heart.prototype.gradient = function () {
      var col = this.color.r + "," + this.color.g + "," + this.color.b;
      var g = this.ctx.createRadialGradient(this.x1, this.y1 - this.r / 1.5, 0, this.x1, this.y1 - this.r / 1.5, this.r);
      g.addColorStop(0, "rgba(" + col + ", " + (this.color.a * 0) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (this.color.a * 0.5) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (this.color.a * 1) + ")");
      return g;
    };

    Heart.prototype.render = function () {
      this.draw();
    };
    
    /********************
      Create
    ********************/
     
    for (var i = 0; i < miniHeartNum; i++) {
      var miniHeart = new MiniHeart(ctx, X / 2, Y / 2, rand(5, 30));
      miniHearts.push(miniHeart);
    }

    for (var i = 0; i < heartNum; i++) {
      var heart = new Heart(ctx, X / 2, Y / 2, 150);
      hearts.push(heart);
    }

    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < miniHearts.length; i++) {
        miniHearts[i].render();
      }
      for (var i = 0; i < hearts.length; i++) {
        hearts[i].render();
      }
      requestAnimationFrame(render);
    }

    render();

    /********************
      Resize
    ********************/
    
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      hearts[0].init(X / 2, Y / 2, 150);
    }

    /********************
      Event
    ********************/

    window.addEventListener('resize', function () {
      onResize();
    });

  });
  // Author
  console.log('File Name / mellomelloMellow.js\nCreated Date / January 15, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
