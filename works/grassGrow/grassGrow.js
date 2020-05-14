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
      return Math.random() * (max - min + 1) + min;
    }

    /********************
      Var
    ********************/

    // canvas 
    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;

    // water
    var waterNum = 500;
    var waters = [];
    var GRAVITY = 0.1;
    
    // gras
    var grassNum = 100;
    var grasses = [];
    var growSpeed = -0.1;
    
    // mouse
    var mouseX = null;
    var mouseY = null;

    /********************
      Animation
    ********************/

    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (cb) {
        setTimeout(cb, 17);
      };

    /********************
      Cloud
    ********************/
    
    function drawCloud() {
      var x = mouseX || X / 2;
      var y = mouseY || Y / 2;
      var r = 25;
      ctx.beginPath();
      ctx.fillStyle = 'rgb(242, 242, 242)';
      ctx.arc(x, y - r, r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.arc(x - r * 1.5, y - r, r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.arc(x + r * 1.5, y - r, r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.arc(x - r / 1.5, y - r - r, r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.arc(x + r / 1.5, y - r - r, r, 0, Math.PI * 2, false);
      ctx.fill();
    }
    
    /********************
      Grass
    ********************/
    
    function Grass(ctx, x, y, h) {
      this.ctx = ctx;
      this.init(x, y, h);
    }

    Grass.prototype.init = function(x, y, h) {
      this.x = x;
      this.y = y;
      this.h = h;
      this.m = {
        x: rand(5, 15),
        y: rand(-0, -50)
      };
    };

    Grass.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.fillStyle = 'rgb(66, 169, 119)';
      ctx.moveTo(this.x, Y);
      ctx.lineTo(this.x + this.m.x, this.y - this.m.y);
      ctx.lineTo(this.x + this.m.x + this.m.x, Y);
      ctx.closePath();
      ctx.fill();
    };

    Grass.prototype.grow = function() {
      this.y += growSpeed; 
    };

    Grass.prototype.resize = function() {
      this.x = rand(0, X);
    };

    Grass.prototype.render = function() {
      this.grow();
      this.draw();
    };

    for (var i = 0; i < grassNum; i++) {
      var grass = new Grass(ctx, rand(0, X), Y, rand(10, 30));
      grasses.push(grass);
    }

    /********************
      Water
    ********************/

    function Water(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Water.prototype.init = function(x, y) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.r = 1;
      this.v = {
        x: rand(-6, 6) * Math.random(),
        y: rand(-6, 6) * Math.random()
      };
    };

    Water.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.beginPath();
      ctx.fillStyle = 'rgb(67, 120, 155)';
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
    };

    Water.prototype.updateParams = function() {
      this.r += 0.05;
    };

    Water.prototype.updatePosition = function() {
      this.v.y += GRAVITY;
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Water.prototype.wrapPosition = function() {
      if (this.y > Y) {
        this.r = 1;
        this.v.y = rand(-1, 1);
        this.x = mouseX || X / 2;
        this.y = mouseY || Y / 2;
      }
    };

    Water.prototype.render = function() {
      this.updatePosition();
      this.updateParams();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < waterNum; i++) {
      var water = new Water(ctx, rand(0, X), rand(0, Y));
      waters.push(water);
    }

    /********************
      Render
    ********************/
    
    // render
    function render() {
      ctx.clearRect(0, 0, X, Y);
      drawCloud();
      for (var i = 0; i < grasses.length; i++) {
        grasses[i].render();
      }
      for (var i = 0; i < waters.length; i++) {
        waters[i].render();
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
      for (var i = 0; i < grasses.length; i++) {
        grasses[i].resize();
      }
    }

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, false);

    window.addEventListener('touchmove', function(e) {
      var touch = event.targetTouches[0];
      mouseX = touch.pageX;
      mouseY = touch.pageY;
    }, false);
    
    window.addEventListener('resize', function () {
      onResize();
    });

  }, false);
  // Author
  console.log('File Name / grassGrow.js\nCreated Date / January 15, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
