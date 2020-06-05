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
    var flowers = [];
    var flowerNum = 1;
    var flowerSize = Y / 3;
    var flg = true;
    var angle = 137.5;

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
      Flower
    ********************/
    
    function Flower(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Flower.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.r = Y / 2;
      this.lw = 5;
      this.a = 0;
      this.rad = this.a * Math.PI / 180; 
      this.v = {
        x: 0,
        y: 0
      };
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(0, 255)
      };
    };

    Flower.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(' + this.c.r + ',' + this.c.g + ', ' + this.c.b + ')';
      ctx.strokeStyle = 'rgb(' + this.c.r + ',' + this.c.g + ', ' + this.c.b + ')';
      if (flg === true) {
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.cos(this.rad));
        ctx.scale(Math.cos(this.rad), Math.sin(this.rad));
        ctx.translate(-this.x, -this.y);
      }
      for (var i = 0; i < this.r; i++) {
        ctx.beginPath();
        ctx.arc(Math.cos(angle * Math.PI / 180 * i) * i / 2 + this.x, Math.sin(angle * Math.PI / 180 * i) * i / 2 + this.y, 2 * i / 100, 0, Math.PI * 2, false);
        ctx.fill();
      }
      ctx.restore();
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineWidth = Math.sin(this.rad) * this.lw;
      if (flg === true) {
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.sin(this.rad));
        ctx.scale(Math.cos(this.rad), Math.sin(this.rad));
        ctx.translate(-this.x, -this.y);
      }
      ctx.strokeStyle = 'rgb(' + this.c.r + ',' + this.c.g + ', ' + this.c.b + ')';
      for (var i = 0; i < 36; i++) {
        ctx.translate(this.x, this.y);
        ctx.rotate(10 * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
        ctx.beginPath();
        ctx.ellipse(this.x + this.r / 2, this.y + this.r / 2, this.r / 30, this.r / 6, -45 * Math.PI / 180, 0, Math.PI * 2, false);
        ctx.stroke();
      }
      ctx.restore();
    };

    Flower.prototype.updateParams = function() {
      this.a += 0.5;
      this.rad = this.a * Math.PI / 180;
    };
    
    Flower.prototype.render = function() {
      this.updateParams();
      this.draw();
    };
    
    for (var i = 0; i < flowerNum; i++) {
      var f = new Flower(ctx, X / 2, Y / 2);
      flowers.push(f);
    }

    /********************
      ChangeColor
    ********************/

    function changeColor() {
      var time = rand(1000, 5000);
      var r = rand(0, 255);
      var g = rand(0, 255);
      var b = rand(0, 255);
      for (var i = 0; i < flowers.length; i++) {
        flowers[i].c  = {
          r: r,
          g: g,
          b: b
        };
      }
      setTimeout(changeColor, time);
    }

    changeColor();

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
      for (var i = 0; i < flowers.length; i++) {
        flowers[i].render();
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
      flowerSize = Y / 3;
      flowers = [];
      for (var i = 0; i < flowerNum; i++) {
        var f = new Flower(ctx, X / 2, Y / 2);
        flowers.push(f);
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });
    
    canvas.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    canvas.addEventListener('click', function(e) {
      flg === true ? flg = false : flg = true;
    });

    canvas.addEventListener('wheel', function(e) {
      for (var i = 0; i < flowers.length; i++) {
        flowers[i].a += e.deltaY;
      }
    });

  });
  // Author
  console.log('File Name / turnsole.js\nCreated Date / Jun 05, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
