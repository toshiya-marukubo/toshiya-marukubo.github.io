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
    var mouseX = null;
    var mouseY = null;
    
    var split = document.getElementById('split');
    var count = document.getElementById('count');
    var countNum = 0;
    var splitNum = 8;

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
      Text
    ********************/
    
    var fontSize = '64px';

    if (X < 768) {
      fontSize = '24px';
    }
     
    function drawtext() {
      ctx.fillStyle = 'white';
      ctx.textBaseline = 'middle';
      ctx.font = fontSize + " 'Impact'";
      ctx.textAlign = 'center';
      ctx.fillText("You eat too much.", X / 2, Y / 2);
    }
    
    /********************
      Chocolate
    ********************/
    
    // var
    var rowMax = splitNum;
    var colMax = splitNum;
    var chocolates = [];
    
    function Chocolate(ctx, x, y, r, g, b) {
      this.ctx = ctx;
      this.init(x, y, r, g, b);
    }

    Chocolate.prototype.init = function(x, y, r, g, b) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.w = xSplit;
      this.h = ySplit;
      this.c = {
        r: 92,
        g: 50,
        b: 33
      }
    };

    Chocolate.prototype.draw = function() {
      ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = 'rgb(' + this.c.r + ',' + this.c.g + ',' + this.c.b + ')';
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      ctx.shadowColor = 'rgb(0, 0, 0)';
      ctx.shadowBlur = 30;
      ctx.fillStyle = 'rgb(110, 60, 45)';
      ctx.fillRect(this.x + this.w * 0.2, this.y + this.h * 0.2, this.w * 0.6, this.h * 0.6);
      ctx.restore();
    };

    Chocolate.prototype.eat = function(x, y, i) {
      if ((this.y < y && this.y + this.h > y) && (this.x < x && this.x + this.w > x)) {
        var j = i - 1;
        chocolates.splice(i, 1);
        countNum++;
        count.textContent = countNum;
      }
    };
    
    Chocolate.prototype.render = function() {
      this.draw();
    };

    for (var i = 0; i < colMax; i++) {
      for (var j = 0; j < rowMax; j++) {
        var chocolate = new Chocolate(ctx, xSplit * i, ySplit * j, rand(0, 255), rand(0, 255), rand(0, 255));
        chocolates.push(chocolate);
      }
    }

    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      drawtext();
      for (var i = 0; i < chocolates.length; i++) {
        chocolates[i].render();
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
      chocolates = [];
      for (var i = 0; i < colMax; i++) {
        for (var j = 0; j < rowMax; j++) {
          var chocolate = new Chocolate(ctx, xSplit * i, ySplit * j, rand(0, 255), rand(0, 255), rand(0, 255));
          chocolates.push(chocolate);
        }
      }
    }

    split.addEventListener('change', function(){
      chocolates = [];
      splitNum = this.value;
      rowMax = this.value;
      colMax = this.value;
      xSplit = X / splitNum;
      ySplit = Y / splitNum;
      for (var i = 0; i < colMax; i++) {
        for (var j = 0; j < rowMax; j++) {
          var chocolate = new Chocolate(ctx, xSplit * i, ySplit * j, rand(0, 255), rand(0, 255), rand(0, 255));
          chocolates.push(chocolate);
        }
      }
    }, false);

    window.addEventListener('resize', function() {
      onResize();
    });

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      for (var i = 0; i < chocolates.length; i++) {
        chocolates[i].eat(mouseX, mouseY, i);
      }
    }, false);

    window.addEventListener('touchmove', function(e) {
      if (e.targetTouches.length === 1) {
        var touch = event.targetTouches[0];
        mouseX = touch.pageX;
        mouseY = touch.pageY;
        for (var i = 0; i < chocolates.length; i++) {
          chocolates[i].eat(mouseX, mouseY, i);
        }
      }
    }, false);

  }); 
  // Author
  console.log('File Name / chocolate.js\nCreated Date / February 6, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
