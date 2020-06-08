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
    var shapes = [];
    var shapeNum = Y / 2;
    var angle = 45;
    var flg = true;

    if (X < 768) {
      shapeNum = X / 2;
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
      Shape
    ********************/
    
    function Shape(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }

    Shape.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.r = 2 * i / 200;
      this.i = i;
      this.c = {
        r: rand(200, 200),
        g: rand(200, 200),
        b: rand(200, 200)
      };
      this.a = 45;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.quadraticCurveTo(
        Math.cos(this.a * Math.PI / 180 * this.i) * this.i / 2 + X / 2,
        Math.sin(this.a * Math.PI / 180 * this.i) * this.i / 2 + Y / 2,
        Math.cos(angle * Math.PI / 180 * this.i) * this.i + X / 2,
        Math.sin(angle * Math.PI / 180 * this.i) * this.i + Y / 2
      );
      ctx.stroke();
      ctx.restore();
    };
    
    Shape.prototype.updateParams = function() {
      //angle += 0.0000001;
      this.a += 0.001;
      this.rad = this.a * Math.PI / 180;
    };
    
    Shape.prototype.render = function() {
      if (flg === true) this.updateParams();
      this.draw();
    };
    
    for (var i = 0; i < shapeNum; i++) {
      var s = new Shape(ctx, X / 2, Y / 2, i);
      shapes.push(s);
    }

    /********************
      ChangeColor
    ********************/
    
    function changeColor() {
      var time = rand(1000, 5000);
      var r = rand(0, 255);
      var g = rand(0, 255);
      var b = rand(0, 255);
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].c  = {
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
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].render();
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
      X < 768 ? shapeNum = X / 2: shapeNum = Y / 2;
      shapes = [];
      for (var i = 0; i < shapeNum; i++) {
        var s = new Shape(ctx, X / 2, Y / 2, i);
        shapes.push(s);
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });
    
    canvas.addEventListener('click', function(e) {
      flg === true ? flg = false : flg = true;
    }, false);
     
  });
  // Author
  console.log('File Name / petal.js\nCreated Date / Jun 08, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
