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

    var colors = document.getElementById('colors');
    var colorsLists = colors.children;

    // canvas 
    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    
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
      BackStar
    ********************/
    
    // var
    var backStarNum = 100;
    var backStars = [];

    if (X < 768) {
      backStarNum = 50;
    }
     
    function BackStar(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    BackStar.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.r = rand(0, 10);
      this.c = '255, 255, 255';
      this.v = {
        x: -0.05,
        y: 0.05
      };
    };

    BackStar.prototype.updatePosition = function() {
      this.x += this.v.x;
      this.y += this.v.y;
    };
    
    BackStar.prototype.wrapPosition = function() {
      if (this.x - this.r > X) {
        this.x = 0;
      }
      if (this.x + this.r < 0) {
        this.x = X;
      }
      if (this.y - this.r > Y) {
        this.y = 0;
      }
      if (this.y + this.r < 0) {
        this.y = Y;
      }
    };

    BackStar.prototype.draw = function() {
      ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    };

    BackStar.prototype.gradient = function () {
      var col = this.c;
      var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, "rgba(" + col + ", " + (1 * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (1 * 0.2) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (1 * 0) + ")");
      return g;
    };

    BackStar.prototype.resize = function() {
      this.x = rand(0, X);
      this.y = rand(0, Y);
    };

    BackStar.prototype.render = function() {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < backStarNum; i++) {
      var backStar = new BackStar(ctx, rand(0, X), rand(0, Y));
      backStars.push(backStar);
    }

    /********************
      Star
    ********************/
    
    // var
    var starNum = 72;
    var stars = [];
    var starColors = ['234, 97, 133', '73, 188, 189', '242, 143, 1', '157, 120, 180', '18, 176, 221'];
    var polygons = [0, 3, 5]; 
    
    if (X < 768) {
      starNum = 36;
    }

    function Star(ctx, x, y, a) {
      this.ctx = ctx;
      this.init(x, y, a);
    }

    Star.prototype.init = function(x, y, a) {
      this.poly = polygons[rand(0, polygons.length - 1)];
      this.rad = Math.PI / this.poly * 4;
      this.x = x;
      this.y = y;
      this.a = a;
      this.v = {
        x: Math.cos(this.a * Math.PI / 180) * Math.random() * 2,
        y: Math.sin(this.a * Math.PI / 180) * Math.random() * 2
      };
      this.c = starColors[rand(0, starColors.length - 1)];
      this.r = rand(5, 30);
      this.angle = rand(0, 360);
      this.l = rand(10, 30);
    };

    Star.prototype.draw = function() {
      ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = 0.8;
      if (this.poly == 0) {
        ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      } else {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
        for (var i = 0; i < 5; i++) {
          var xc = Math.sin(i * this.rad);
          var yc = Math.cos(i * this.rad);
          ctx.lineTo(xc * this.r + this.x, yc * this.r + this.y);
        }
      }
      ctx.closePath();
      ctx.fillStyle = 'rgb(' + this.c + ')';
      ctx.fill();
      ctx.restore();
    };

    Star.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 2;
    };

    Star.prototype.updateParams = function() {
      this.angle += 1;
      this.r += 0.05;
      this.l -= 0.1;
    };
    
    Star.prototype.wrapPosition = function() {
      if (this.l < 0) {
        this.init(X / 2, Y / 2, this.a);
      }
    };
     
    Star.prototype.updatePosition = function() {
      this.x += this.v.x;
      this.y += this.v.y;
    };
    
    Star.prototype.render = function() {
      this.updatePosition();
      this.updateParams();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < starNum; i++) {
      var star = new Star(ctx, X / 2, Y / 2, i * 10);
      stars.push(star);
    }

    /********************
      centerStar
    ********************/
    
    function centerStar() {
      var rad = Math.PI / 5 * 4;
      var radius = Y * 0.8;
      ctx.save();
      ctx.beginPath();
      ctx.translate(X / 2, Y / 2);
      ctx.rotate(180 * Math.PI / 180);
      ctx.translate(-X / 2, -Y / 2);
      ctx.globalAlpha = 0.8;
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(255, 255, 128)';
      ctx.shadowColor = 'rgb(255, 255, 128)';
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 100;
      for (var i = 0; i < 5; i++) {
        var xc = Math.sin(i * rad);
        var yc = Math.cos(i * rad);
        ctx.lineTo(xc * radius + X / 2, yc * radius + Y / 2);
      }
      ctx.fill();
      ctx.restore();
    }

    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      // backStar
      for (var i = 0; i < backStars.length; i++) {
        backStars[i].render();
      }
      centerStar();
      // stars
      for (var i = 0; i < stars.length; i++) {
        stars[i].render(i);
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
      // backStar
      for (var i = 0; i < backStars.length; i++) {
        backStars[i].resize();
      }
      // stars
      for (var i = 0; i < stars.length; i++) {
        stars[i].resize();
      }
    }

    for (var i = 0; i < colorsLists.length; i++) {
      colorsLists[i].addEventListener('click', changeBackgroudColor, false);
    }

    function changeBackgroudColor() {
      var style = window.getComputedStyle(this);
      var backgroundColor = style.background;
      canvas.style.background = backgroundColor;
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  }); 
  // Author
  console.log('File Name / kiraYaba.js\nCreated Date / January 27, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
