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

    var xSplit = X / 16;
    var ySplit = Y / 16;

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
      Color
    ********************/
    
    // var
    var rowMax = 16;
    var colMax = 16;
    var colors = [];
    
    function Color(ctx, x, y, r, g, b) {
      this.ctx = ctx;
      this.init(x, y, r, g, b);
    }

    Color.prototype.init = function(x, y, r, g, b) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.c = {
        r: r,
        g: g,
        b: b
      }
    };

    Color.prototype.draw = function() {
      ctx = this.ctx;
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = 'rgb(' + this.c.r + ',' + this.c.g + ',' + this.c.b + ')';
      ctx.fillRect(this.x, this.y, xSplit, ySplit);
    };

    Color.prototype.render = function() {
      this.draw();
    };

    for (var i = 0; i < colMax; i++) {
      for (var j = 0; j < rowMax; j++) {
        var color = new Color(ctx, xSplit * i, ySplit * j, rand(0, 255), rand(0, 255), rand(0, 255));
        colors.push(color);
      }
    }

    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < colors.length; i++) {
        colors[i].render();
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
      xSplit = X / 16;
      ySplit = Y / 16;
      colors = [];
      for (var i = 0; i < colMax; i++) {
        for (var j = 0; j < rowMax; j++) {
          var color = new Color(ctx, xSplit * i, ySplit * j, rand(0, 255), rand(0, 255), rand(0, 255));
          colors.push(color);
        }
      }
    }

    window.addEventListener('mousemove', function(){
      colors = [];
      for (var i = 0; i < colMax; i++) {
        for (var j = 0; j < rowMax; j++) {
          var color = new Color(ctx, xSplit * i, ySplit * j, rand(0, 255), rand(0, 255), rand(0, 255));
          colors.push(color);
        }
      }
    }, false);

    window.addEventListener('resize', function() {
      onResize();
    });

  }); 
  // Author
  console.log('File Name / 256.js\nCreated Date / January 21, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
