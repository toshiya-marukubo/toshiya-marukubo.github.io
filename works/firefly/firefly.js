(function () {
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
    
    var rad = Math.PI / 180;


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
      Spade
    ********************/
    
    // var
    var spadeNum = 1;
    var spades = [];

    function Spade(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Spade.prototype.init = function(x, y, r) {
      this.ctx = ctx;
      this.r = r;
      this.x1 = x;
      this.y1 = y + this.r / 1.5
      this.a = 90;
      this.num = 22.5;
      this.x2 = this.x1 + this.r * Math.cos(this.a * rad);
      this.y2 = this.y1 + this.r * Math.sin(this.a * rad);
      this.cx1 = this.x1 + this.r * Math.cos((this.a + this.num) * rad);
      this.cy1 = this.y1 + this.r * Math.sin((this.a + this.num) * rad);
      this.cx2 = this.x1 + this.r * Math.cos((this.a - this.num) * rad);
      this.cy2 = this.y1 + this.r * Math.sin((this.a - this.num) * rad);
      this.chord = 2 * this.r * Math.sin(this.num * rad / 2);
    };
    
    Spade.prototype.draw = function() {
      ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = '#4d004d';
      ctx.beginPath();
      ctx.moveTo(this.x2, this.y2);
      ctx.arc(this.cx1, this.cy1, this.chord, (270 + this.a) * rad, (270 + this.a + 225) * rad);
      ctx.lineTo(this.x1, this.y1);
      ctx.moveTo(this.x2, this.y2);
      ctx.arc(this.cx2, this.cy2, this.chord, (90 + this.a) * rad, (90 + this.a + 135) * rad, true);
      ctx.lineTo(this.x1, this.y1);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      var triRad = Math.PI / 3 * 2;
      for (var i = 0; i < 3; i++) {
        var xc = Math.sin(i * triRad);
        var yc = Math.cos(i * triRad);
        ctx.lineTo(xc * -50 + this.x1, yc * -50 + this.y1 + 150);
      }
      ctx.fill();
      ctx.restore();
    };

    Spade.prototype.resize = function() {
      this.init(X / 2, Y / 2 - 150, 100);
    };

    Spade.prototype.render = function() {
      this.draw();
    };

    for (var i = 0; i < spadeNum; i++) {
      var spade = new Spade(ctx, X / 2, Y / 2 - 150, 100);
      spades.push(spade);
    }
   
    /********************
      Firefly
    ********************/
    
    var fireflyNum = 36;
    var fireflies = [];

    function Firefly(ctx, x, y, r, a) {
      this.ctx = ctx;
      this.init(x, y, r, a);
    }

    Firefly.prototype.init = function(x, y, r, a) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.r = r;
      this.a = a;
      this.l = rand(10, 30);
      this.v = {
        x: Math.cos(this.a * Math.PI / 180) * Math.random() * 2,
        y: Math.sin(this.a * Math.PI / 180) * Math.random() * 2
      };
    };

    Firefly.prototype.draw = function() {
      ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    };

    Firefly.prototype.updateParams = function() {
      this.r += 0.05;
      this.l -= 0.1;
      /*
      if (this.l < 0) {
        onFire(ctx, this.x, this.y);
        this.init(X / 2, Y / 2, rand(1, 10), this.a);
      }
      */
    };

    window.addEventListener('click', onFire, false);

    Firefly.prototype.updatePosition = function() {
      this.x += this.v.x;
      this.y -= this.v.y;
    };

    Firefly.prototype.gradient = function() {
      var col = '208, 255, 86';
      var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, "rgba(" + col + ", " + (1 * 0.5) + ")");
      g.addColorStop(0.8, "rgba(" + col + ", " + (1) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (1 * 0.7) + ")");
      return g;
    };

    Firefly.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 2;
    };

    Firefly.prototype.render = function() {
      this.updatePosition();
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < fireflyNum; i++) {
      var firefly = new Firefly(ctx, X / 2, Y / 2, rand(1, 10), i * 10);
      fireflies.push(firefly);
    }
    
    /********************
      Fire
    ********************/
    
    var fireNum = 1000;
    var fires = [];

    function Fire(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Fire.prototype.init = function(x, y, r) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.r = r;
      this.l = 10;
      this.v = {
        x: rand(-2, 2),
        y: rand(-3, 3)
      };
      this.color = {
        r: rand(102, 255),
        g: rand(0, 128),
        b: rand(0, 0),
        a: 0.5
      };
    };

    Fire.prototype.draw = function() {
      ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    };

    Fire.prototype.updateParams = function(i) {
      this.l -= 0.1;
      if (this.l < 0) {
        fires.splice(i, 1);
      }
    };

    Fire.prototype.deleteFire = function() {
      
    };

    Fire.prototype.updatePosition = function() {
      this.x += this.v.x;
      this.y -= this.v.y;
    };

    Fire.prototype.gradient = function() {
      var col = this.color.r + "," + this.color.g + "," + this.color.b;
      var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, "rgba(" + col + ", " + (this.color.a * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (this.color.a * 0.3) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (this.color.a * 0) + ")");
      return g;
    };

    Fire.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 2;
    };

    Fire.prototype.render = function(i) {
      this.updatePosition();
      this.updateParams(i);
      this.draw();
    };

    function onFire() {
      for (var i = 0; i < fireflies.length; i++) {
        for (var j = 0; j < 2; j++) {
          var fire = new Fire(ctx, fireflies[i].x, fireflies[i].y, rand(50, 100));
          fires.push(fire);
        }
        fireflies[i].init(X / 2, Y / 2, rand(1, 10), fireflies[i].a);
      }
    }

    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < spades.length; i++) {
        spades[i].render();
      }
      for (var i = 0; i < fireflies.length; i++) {
        fireflies[i].render();
      }
      for (var i = 0; i < fires.length; i++) {
        fires[i].render(i);
      }
      requestAnimationFrame(render);
    }

    render();

    /********************
      Event
    ********************/
    
    // resize
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      for (var i = 0; i < spades.length; i++) {
        spades[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  });
  // Author
  console.log('File Name / firefly.js\nCreated Date / January 31, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
