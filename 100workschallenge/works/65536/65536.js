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
    
    var split = document.getElementById('split');
    var splitNum = split.value;

    var xSplit = X / splitNum;
    var ySplit = Y / splitNum;

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
    var rowMax = splitNum;
    var colMax = splitNum;
    var colors = [];
    
    function Color(ctx, x, y, r, g, b) {
      this.ctx = ctx;
      this.init(x, y, r, g, b);
    }

    Color.prototype.init = function(x, y, r, g, b) {
      this.x = x;
      this.y = y;
      this.c = {
        r: r,
        g: g,
        b: b
      }
    };

    Color.prototype.draw = function() {
      var ctx = this.ctx;
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
      xSplit = X / splitNum;
      ySplit = Y / splitNum;
      colors = [];
      for (var i = 0; i < colMax; i++) {
        for (var j = 0; j < rowMax; j++) {
          var color = new Color(ctx, xSplit * i, ySplit * j, rand(0, 255), rand(0, 255), rand(0, 255));
          colors.push(color);
        }
      }
    }

    split.addEventListener('change', function(){
      colors = [];
      splitNum = this.value;
      rowMax = this.value;
      colMax = this.value;
      xSplit = X / splitNum;
      ySplit = Y / splitNum;
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
  console.log('File Name / 65536.js\nCreated Date / January 21, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
