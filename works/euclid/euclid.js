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
      Euclid Number
    ********************/

    function euclid(x, y) {
      if (y === 0) return x;
      return euclid(y, x % y); 
    }

    /********************
      Var
    ********************/

    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var shapes = [];

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
    
    function Shape(ctx, x, y, wd) {
      this.ctx = ctx;
      this.init(x, y, wd);
    }
    
    Shape.prototype.init = function(x, y, wd) {
      this.x = x;
      this.y = y;
      this.l = wd;
      this.c = rand(0, 360);
    };

    Shape.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.fillStyle = 'hsl(' + this.c + ', ' + '80%, 60%)';
      ctx.fillRect(this.x, this.y, this.l, this.l);
      ctx.restore();
    };

    Shape.prototype.render = function() {
      this.draw();
    };

    var width = Y;
    var height = 0;
    var x = 0;
    var y = 0;
    var itr = 0;
    while (x < X) {
      itr++;
      if (itr % 2 === 1) {
        var s = new Shape(ctx, x, y, width);
        shapes.push(s);
        x += width;
        width = X - width;
      } else {
        while (x < X) {
          height = width;
          var s = new Shape(ctx, x, y, height);
          shapes.push(s);
          y += width;
          x += height;
          width = X - width;
        }  
      }
    }

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
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  });
  // Author
  console.log('File Name / momVer1.js\nCreated Date / July 09, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
