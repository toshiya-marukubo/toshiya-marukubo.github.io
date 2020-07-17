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
    var flg = false;
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
      this.r = Y / 4;
      this.lw = 4;
      this.a = 0;
      this.rad = this.a * Math.PI / 180; 
      this.v = {
        x: 0,
        y: 0
      };
      this.c = {
        r: rand(254, 254),
        g: rand(194, 194),
        b: rand(0, 0),
        a: 1
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
      ctx.lineWidth = this.lw;
      if (flg === true) {
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.cos(this.rad));
        ctx.scale(Math.cos(this.rad), Math.sin(this.rad));
        ctx.translate(-this.x, -this.y);
      }
      ctx.strokeStyle = 'rgb(' + this.c.r + ',' + this.c.g + ', ' + this.c.b + ')';
      for (var i = 0; i < 36; i++) {
        ctx.translate(this.x, this.y);
        ctx.rotate(10 * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
        ctx.beginPath();
        ctx.ellipse(this.x + this.r / 1.9, this.y + this.r / 1.9, this.r / 30, this.r / 5, -45 * Math.PI / 180, 0, Math.PI * 2, false);
        ctx.stroke();
      }
      ctx.restore();
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineWidth = this.lw;
      if (flg === true) {
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.cos(this.rad));
        ctx.scale(Math.cos(this.rad), Math.sin(this.rad));
        ctx.translate(-this.x, -this.y);
      }
      ctx.strokeStyle = 'rgb(' + this.c.r + ',' + this.c.g + ', ' + this.c.b + ')';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + this.r);
      ctx.lineTo(this.x, Y);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(this.x - this.r / 2, Y - this.r / 2, this.r / 6, this.r / 2, -45 * Math.PI / 180, 0, Math.PI * 2, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(this.x + this.r / 2, Y - this.r / 2, this.r / 6, this.r / 2, 45 * Math.PI / 180, 0, Math.PI * 2, false);
      ctx.stroke();
      ctx.restore();
    };

    Flower.prototype.changeColor = function() {
      this.c.r = rand(0, 255);
      this.c.g = rand(0, 255);
      this.c.b = rand(0, 255);
    };

    Flower.prototype.updateParams = function() {
      this.a += 1;
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
      var time = rand(1000, 3000);
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

    //changeColor();

    /********************
      Render
    ********************/
    var wholeAngle = 0;
    function render() {
      ctx.clearRect(0, 0, X, Y);
      ctx.translate(X / 2, Y);
      ctx.rotate(Math.cos(wholeAngle) * Math.PI / 180);
      ctx.translate(-X / 2, -Y);
      for (var i = 0; i < flowers.length; i++) {
        flowers[i].render();
      }
      requestAnimationFrame(render);
      wholeAngle += 0.05;
    }

    render();

    /********************
      Event
    ********************/
    
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      wholeAngle = 0;
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
      for (var i = 0; i < flowers.length; i++) {
        flowers[i].changeColor();
      }
    });

    canvas.addEventListener('touchmove', function(e) {
      var touch = event.targetTouches[0];
      mouseX = touch.pageX;
      mouseY = touch.pageY;
      for (var i = 0; i < flowers.length; i++) {
        flowers[i].changeColor();
      }
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
