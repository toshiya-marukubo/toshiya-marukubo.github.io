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
    var mouseX = 0;
    var mouseY = 0;
    var flg = false;

    var count = document.getElementById('count');
    
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
      Fairy
    ********************/
    
    // var
    var fairyNum = 10;
    var fairies = [];
    var circleSplit = 6;
     
    function Fairy(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Fairy.prototype.init = function(x, y) {
      this.radian = 0;
      this.x = x;
      this.y = y;
      this.x1 = this.x;
      this.y1 = this.y;
      this.r = rand(1, 5);
      this.l = 10;
      this.ga = rand(0, 1) + 0.1;
      this.rad = this.radian * Math.PI / 180;
      this.points = [];
      this.setPoints();
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(0, 255)
      };
    };

    Fairy.prototype.setPoints = function() {
      for (var i = 0; i < circleSplit; i++) {
        var pointX = Math.cos(this.rad) * this.r + this.x;
        var pointY = Math.sin(this.rad) * this.r + this.y;
        var point = [pointX, pointY];
        this.points.push(point);
        this.rad = (this.radian += 60) * Math.PI / 180;
      }
    };

    Fairy.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.beginPath();
      ctx.globalAlpha = this.ga;
      ctx.globalCompositeOperation = 'lighter';
      ctx.moveTo(this.x, this.y);
      ctx.quadraticCurveTo(this.points[5][0], this.points[5][1], this.points[0][0], this.points[0][1]);
      ctx.quadraticCurveTo(this.points[1][0], this.points[1][1], this.x, this.y);
      ctx.quadraticCurveTo(this.points[2][0], this.points[2][1], this.points[3][0], this.points[3][1]);
      ctx.quadraticCurveTo(this.points[4][0], this.points[4][1], this.x, this.y);
      ctx.closePath();
      ctx.fill();
    };

    Fairy.prototype.transform = function() {
      for (var i = 0; i < this.points.length; i++) {
        this.points[i][0] += rand(-8, 8);
        this.points[i][1] += rand(-8, 8);
      }
    };

    Fairy.prototype.replace = function() {
      this.x = rand(0, X);
      this.y = rand(0, Y);
    };

    Fairy.prototype.remove = function(i) {
      if (flg === true) {
        return;
      }
      this.l -= 0.1;
      if (this.l < 0) {
        if (fairies.length < 10) {
          return;
        }
        fairies.splice(i, 1);
      }
    };

    Fairy.prototype.render = function(i) {
      this.transform();
      this.remove(i);
      this.draw();
    };

    for (var i = 0; i < fairyNum; i++) {
      var fairy = new Fairy(ctx, X / 2, Y / 2);
      fairies.push(fairy);
    }

    /********************
      Render
    ********************/
    
    function render(){
      //ctx.clearRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "darken";
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      for (var i = 0; i < fairies.length; i++) {
        fairies[i].render(i);
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

    window.addEventListener('click', function(e) {
      if (flg !== true) {
        flg = true;
      } else {
        flg = false;
      }
    }, false);

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      var fairy = new Fairy(ctx, mouseX, mouseY);
      fairies.push(fairy);
    });

    window.addEventListener('touchmove', function(e) {
      if (e.targetTouches.length === 1) {
        var touch = event.targetTouches[0];
        mouseX = touch.pageX;
        mouseY = touch.pageY;
        var fairy = new Fairy(ctx, mouseX, mouseY);
        fairies.push(fairy);
      }
    }, false);

    window.addEventListener('resize', function() {
      onResize();
    });

  }); 
  // Author
  console.log('File Name / fairy.js\nCreated Date / April 16, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
