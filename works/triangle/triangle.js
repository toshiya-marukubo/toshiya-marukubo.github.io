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
    var mouseX = X / 2;
    var mouseY = Y / 2;
    var shapes = [];
    var shapeNum = 100;
    var angle = 360 / 3;
    var radian = angle * Math.PI / 180;
    var hsl = rand(0, 360);

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
      Shape
    ********************/
    
    function Shape(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }

    Shape.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.i = i;
      this.r = 15 * i;
      this.a = 1 * i;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.strokeStyle = 'hsl(' + hsl + ', ' + (100 - this.i) + '%, ' + (100 - this.i) + '%';;
      ctx.lineWidth = 0.4;
      ctx.translate(this.x, this.y);
      ctx.rotate(Math.sin(this.rad * 3));
      ctx.translate(-this.x, -this.y);
      ctx.beginPath();
      ctx.moveTo(Math.sin(this.rad) * 100 + Math.sin(radian * 1) * this.r + this.x, Math.cos(this.rad) * 100 + Math.cos(radian * 1) * this.r + this.y);
      ctx.lineTo(Math.sin(this.rad) * 100 + Math.sin(radian * 2) * this.r + this.x, Math.cos(this.rad) * 100 + Math.cos(radian * 2) * this.r + this.y);
      ctx.lineTo(Math.sin(this.rad) * 100 + Math.sin(radian * 3) * this.r + this.x, Math.cos(this.rad) * 100 + Math.cos(radian * 3) * this.r + this.y);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    Shape.prototype.updateParams = function() {
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 2;
    };

    Shape.prototype.render = function(i) {
      this.updateParams();
      this.draw();
    };
    
    for (var i = 0; i < shapeNum; i++) {
      var s = new Shape(ctx, X / 2, Y / 2, i);
      shapes.push(s);
    }

    /********************
      Render
    ********************/
    
    function render() {
      //ctx.clearRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "darken";
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].render(i);
      }
      requestAnimationFrame(render);
    }

    render();

    /********************
      Color
    ********************/
    
    function changeColor() {
      var time = rand(1000, 5000);
      hsl = rand(0, 360);
      setTimeout(changeColor, time);
    }

    changeColor();

    /********************
      Event
    ********************/
    
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].resize();
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });

    canvas.addEventListener('wheel', function(e){
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].r += e.deltaY / 10;
      }
    }, false);

  });
  // Author
  console.log('File Name / eyesight.js\nCreated Date / Jun 18, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
