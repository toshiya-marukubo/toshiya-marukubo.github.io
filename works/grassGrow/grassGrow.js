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
    var waterNum = 200;
    var waters = [];
    var GRAVITY = 0.1;
    
    // gras
    var grassNum = 100;
    var grasses = [];
    var growSpeed = -0.1;

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
      Grass
    ********************/
    
    function Grass(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Grass.prototype.init = function(x, y) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.m = {
        x: rand(5, 15),
        y: rand(-0, -50)
      };
      this.h = rand(10, 30);
    };

    Grass.prototype.draw = function() {
      ctx = this.ctx;
      ctx.beginPath();
      ctx.fillStyle = '#42A977';
      ctx.moveTo(this.x, Y);
      ctx.lineTo(this.x + this.m.x, this.y - this.m.y);
      ctx.lineTo(this.x + this.m.x + this.m.x, Y);
      ctx.fill();
      ctx.closePath();
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
      var grass = new Grass(ctx, rand(0, X), Y);
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
      this.v = {
        x: rand(-1, 1),
        y: rand(-1, 1)
      };
      /*
      this.color = {
        r: rand(255, 255),
        g: rand(215, 215),
        b: rand(0, 0),
        a: 1
      };
      */
      this.radius = Math.random() * 0.1;
    };

    Water.prototype.draw = function() {
      ctx = this.ctx;
      ctx.beginPath();
      ctx.fillStyle = '#43789B';
      ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    };

    Water.prototype.updateParams = function() {
      this.radius += 0.05;
    };

    Water.prototype.updatePosition = function() {
      this.v.y += GRAVITY;
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Water.prototype.wrapPosition = function() {
      if (this.y > Y) {
        this.init(mouseX, mouseY);
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

    // render
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < grasses.length; i++) {
        grasses[i].render();
      }
      for (var i = 0; i < waters.length; i++) {
        waters[i].render(i);
      }
      requestAnimationFrame(render);
    }

    // resize
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      for (var i = 0; i < grasses.length; i++) {
        grasses[i].resize();
      }
    }

    /********************
      Event
    ********************/

    window.addEventListener('mousemove', function(e) {
      if (mouseX === null) {
        render();
      }
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, false);
    
    window.addEventListener('resize', function () {
      onResize();
    });

  });
  // Author
  console.log('File Name / grassGrow.js\nCreated Date / 2020.01.15\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
