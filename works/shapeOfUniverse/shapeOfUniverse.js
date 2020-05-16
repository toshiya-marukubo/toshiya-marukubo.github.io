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
    var range = document.getElementById('range');
    var shapeNum = range.value;
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = X / 2;
    var mouseY = Y / 2;
    var rotateSpeed = 0.5;
    var rMax = Y;
    var increaseR = 2;
    var text = 'STAR';
    var selectShapeNum = rand(1, 6);

    if (X < 768) {
      rMax = Y / 2;
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
      Particle
    ********************/
    
    var shapes = [];

    function Shape(ctx, x, y, i, n, p) {
      this.ctx = ctx;
      this.init(x, y, i, n, p);
    }
    Shape.prototype.init = function(x, y, i, n, p) {
      this.x = x;
      this.y = y;
      this.r = i;
      this.n = n;
      this.p = 5;
      this.flg = true;
      this.a = rand(0, 360);
      this.rad = this.a * Math.PI / 180;
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(0, 255)
      };
    };
    Shape.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.lineWidth = 0.2;
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.beginPath();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rad);
      ctx.translate(-this.x, -this.y);
      switch (this.n) {
        case 1:
          this.rect();
          break;
        case 2:
          this.star();
          break;
        case 3:
          this.triangle();
          break;
        case 4:
          this.line();
          break;
        case 5:
          this.circle();
          break;
        case 6:
          this.whirlpool();
          break;
      }
      ctx.restore();
    };
    Shape.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 2;
    };
    Shape.prototype.rect = function() {
      text = 'SQUARE';
      ctx.rect(this.x - this.r / 2, this.y - this.r / 2, this.r, this.r);
      ctx.stroke();
    };
    Shape.prototype.star = function() {
      text = 'STAR';
      var angle = Math.PI / 5 * 4;
      for (var i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos(i * angle) * this.r + this.x, Math.sin(i * angle) * this.r + this.y);
      }
      ctx.closePath();
      ctx.stroke();
    };
    Shape.prototype.triangle = function() {
      text = 'TRIANGLE';
      var angle = Math.PI / 3 * 4;
      for (var i = 0; i < 3; i++) {
        ctx.lineTo(Math.cos(i * angle) * this.r + this.x, Math.sin(i * angle) * this.r + this.y);
      }
      ctx.closePath();
      ctx.stroke();
    };
    Shape.prototype.line = function() {
      text = 'LINE';
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(Math.cos(this.rad) * this.r + this.x, Math.sin(this.rad) * this.r + this.y);
      ctx.closePath();
      ctx.stroke();
    };
    Shape.prototype.circle = function() {
      text = 'CIRCLE';
      ctx.lineWidth = 0.4;
      ctx.arc(this.x, this.y, this.r < 0 ? this.r * -1 : this.r, 0, Math.PI * 2, false);
      //ctx.arc(Math.cos(this.rad) * this.r + this.x, Math.sin(this.rad) * this.r + this.y, this.r < 0 ? this.r * -1 : this.r, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.stroke();
    };
    Shape.prototype.whirlpool = function() {
      text = 'WHIRLPOOL';
      ctx.arc(Math.cos(this.rad) * this.r + this.x, Math.sin(this.rad) * this.r + this.y, this.r < 0 ? this.r * -1 : this.r, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.stroke();
    };
    Shape.prototype.updateParams = function(i) {
      if (this.r > rMax) this.flg = false;
      if (this.r < 0) this.flg = true;
      if (this.flg === false) this.r -= increaseR;
      if (this.flg === true) this.r += increaseR;
      this.a += rotateSpeed;
      this.rad = this.a * Math.PI / 180;
    }
    Shape.prototype.render = function(i) {
      this.updateParams(i);
      this.draw();
    };

    for (var i = 0; i < shapeNum; i++) {
      var shape = new Shape(ctx, mouseX, mouseY, i * 20, selectShapeNum);
      shapes.push(shape);
    }

    /********************
      Render
    ********************/
    
    function render(){
      //ctx.clearRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "darken";
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].render();
      }
      drawText();
      requestAnimationFrame(render);
    }

    render();

    /********************
      drawText
    ********************/
    
    function drawText() {
      ctx.save();
      ctx.fillStyle = 'rgb(' + shapes[0].c.r + ', '  + shapes[0].c.g + ', ' + shapes[0].c.b  + ')';
      ctx.font = '16px "inpact"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text + ' - Click to change.', X / 2, Y - Y / 8);
      ctx.restore();
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
          b: b,
        };
      }
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
    window.addEventListener('resize', function() {
      onResize();
    });
    canvas.addEventListener('click', function(e) {
      increaseR = 2;
      rotateSpeed = 0.5;
      shapes = [];
      var selectShapeNum = rand(1, 6);
      for (var i = 0; i < shapeNum; i++) {
        var shape = new Shape(ctx, X / 2, Y / 2, i * 20, selectShapeNum);
        shapes.push(shape);
      }
    }, false);
    canvas.addEventListener('wheel', function(e){
      rotateSpeed += e.deltaY / 100;
      increaseR += e.deltaX / 500;
    }, false);

    var touchStartY;
    var touchMoveY;
    var touchEndY;
    var touchStartX;
    var touchMoveX;
    var touchEndX;
    canvas.addEventListener('touchstart', function(e) {
      var touch = e.targetTouches[0];
      touchStartY = touch.pageY;
      touchStartX = touch.pageX;
    }, false);
    canvas.addEventListener('touchmove', function(e) {
      var touch = e.targetTouches[0];
      touchMoveY = touch.pageY;
      touchMoveX = touch.pageX;
    }, false);
    canvas.addEventListener('touchend', function(e) {
      touchEndY = touchStartY - touchMoveY;
      touchEndX = touchStartX - touchMoveX;
      if (touchEndY > 50) {
        rotateSpeed += 1;
      }
      if (touchEndY < -50) {
        rotateSpeed -= 1;
      }
      if (touchEndX > 50) {
        increaseR += 1;
      }
    }, false);

    range.addEventListener('change', function() {
      shapeNum = this.value;
      shapes = [];
      var n = rand(1, 4);
      for (var i = 0; i < shapeNum; i++) {
        var shape = new Shape(ctx, X / 2, Y / 2, i * 20, n);
        shapes.push(shape);
      }
    }, false);
  });
       
  // Author
  console.log('File Name / shapeOfUniverse.js\nCreated Date / May 13, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
