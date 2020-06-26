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
    var mouseX = X / 2;
    var mouseY = Y / 2;
    var max;
    var shapes = [];
    var splitNum = 36;
    var split;
    Y > X ? split = Y / splitNum : split = X / splitNum; 
    Y > X ? max = Y : max = X;

    var hsl = rand(0, 360);
    function changeColor() {
      var time = rand(1000, 5000);
      hsl = rand(0, 360);
      setTimeout(changeColor, time);
    }

    changeColor();


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
      this.par = 100;
      this.x = x;
      this.y = y;
      this.v = {
        x: rand(-1, 1) * Math.random(),
        y: 1
      };
      this.a = 180;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'xor';
      ctx.fillStyle = 'hsl(' + hsl + ', ' + this.par + '%, ' + this.par + '%';
      ctx.beginPath();
      ctx.translate(this.x + split / 2, this.y + split / 2);
      ctx.rotate(this.par * Math.PI / 180 * 10);
      ctx.translate(-this.x - split / 2, -this.y - split / 2);
      ctx.rect(this.x, this.y, split, split);
      ctx.fill();
      ctx.restore();
    };

    Shape.prototype.dist = function() {
      var x = mouseX - this.x - split / 2;
      var y = mouseY - this.y - split / 2;
      var d = x * x + y * y;
      var dist = Math.sqrt(d);
      this.par = 100 - (dist / max * 100);
    };

    Shape.prototype.updateParams = function() {
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
    };

    Shape.prototype.render = function() {
      this.updateParams();
      this.draw();
      this.dist();
    };

    for (var i = 0; i < splitNum; i++) {
      for (var j = 0; j < splitNum; j++) {
        var s = new Shape(ctx, split * i, split * j, i);
        shapes.push(s);
      }
    }

    /********************
      Render
    ********************/
    
    function render(){
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
      Y > X ? split = Y / splitNum : split = X / splitNum; 
      Y > X ? max = Y : max = X;
      shapes = [];
      for (var i = 0; i < splitNum; i++) {
        for (var j = 0; j < splitNum; j++) {
          var s = new Shape(ctx, split * i, split * j, i);
          shapes.push(s);
        }
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    canvas.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, false);

    canvas.addEventListener('touchmove', function(e) {
      var touch = e.targetTouches[0];
      mouseY = touch.pageY;
      mouseX = touch.pageX;
    }, false);

  }); 
  // Author
  console.log('File Name / distance.js\nCreated Date / Jun 27, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
