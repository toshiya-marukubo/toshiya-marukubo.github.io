(function () {
  'use strict';
  window.addEventListener('load', function () {
    var canvas = document.getElementById('canvas');
    var canvasBack = document.getElementById('canvasBack');

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
    var ctxBack = canvasBack.getContext('2d');
    var X = canvas.width = canvasBack.width = window.innerWidth;
    var Y = canvas.height = canvasBack.height = window.innerHeight;
    var mouseX = X / 2;
    var mouseY = Y / 2;
    var petals = [];
    var petalNum = 100;

    if (X < 768) {
      petalNum = 70;
    }

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
      Petal
    ********************/
    
    function Petal(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Petal.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.r = rand(5, 20);
      this.c = {
        r: rand(200, 255),
        g: rand(150, 180),
        b: rand(200, 230),
        a: 1
      };
      this.v = {
        x: Math.random(),
        y: rand(1, 2)
      };
      this.angle = rand(0, 360);
      this.radian = this.angle * Math.PI / 180;
      this.rs = Math.random();
    };

    Petal.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.strokeStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.translate(this.x, this.y);
      ctx.rotate(this.radian);
      ctx.scale(Math.cos(this.radian), Math.sin(this.radian));
      ctx.translate(-this.x, -this.y);
      ctx.beginPath();
      ctx.moveTo(this.x - this.r / 3, this.y - this.r);
      ctx.quadraticCurveTo(this.x - this.r, this.y, this.x, this.y + this.r);
      ctx.lineTo(this.x, this.y - this.r / 1.5);
      ctx.lineTo(this.x - this.r / 3, this.y - this.r);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(this.x + this.r / 3, this.y - this.r);
      ctx.quadraticCurveTo(this.x + this.r, this.y, this.x, this.y + this.r);
      ctx.lineTo(this.x, this.y - this.r / 1.5);
      ctx.lineTo(this.x + this.r / 3, this.y - this.r);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    Petal.prototype.updateParams = function(i) {
      i % 2 === 0 ? this.angle += this.rs : this.angle -= this.rs; 
      this.radian = this.angle * Math.PI / 180;
    };

    Petal.prototype.updatePosition = function() {
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Petal.prototype.wrapPosition = function() {
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
    
    Petal.prototype.render = function(i) {
      this.updateParams();
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };
    
    for (var i = 0; i < petalNum; i++) {
      var t = new Petal(ctx, rand(0, X), rand(0, Y));
      petals.push(t);
    }

    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < petals.length; i++) {
        petals[i].render(i);
      }
      requestAnimationFrame(render);
    }

    render();

    /********************
      Event
    ********************/
    
    function onResize() {
      X = canvas.width = canvasBack.width = window.innerWidth;
      Y = canvas.height = canvasBack.height = window.innerHeight;
    }

    window.addEventListener('resize', function(){
      onResize();
    });

    canvas.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

  });
  // Author
  console.log('File Name / .js\nCreated Date / Jun 10, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
