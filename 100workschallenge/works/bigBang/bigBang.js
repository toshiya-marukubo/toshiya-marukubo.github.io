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
    // controller 
    var inputs = document.getElementsByTagName('input');
    var shapeMaxSize = document.getElementById('shapeMaxSize');
    var distance = document.getElementById('distance');
    var numberOfShapes = document.getElementById('numberOfShapes');
    var delay = document.getElementById('delay');

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
    
    // var
    var shapeNum = numberOfShapes.value;
    var shapes = [];
    var polygons = [0, 3, 4, 5]; 
    var composite = ['lighter', 'xor'];
    var delayNum = delay.value;
    var shapePushIntId;
    
    function Shape(ctx, x, y, r, a) {
      this.ctx = ctx;
      this.init(x, y, r, a);
    }

    Shape.prototype.init = function(x, y, r, a) {
      this.poly = polygons[rand(0, polygons.length - 1)];
      this.comp = composite[rand(0, composite.length - 1)];
      this.rad = Math.PI / this.poly * 4;
      this.x = x;
      this.y = y;
      this.a = a;
      this.r = r;
      this.v = {
        x: Math.cos(this.a * Math.PI / 180) * distance.value,
        y: Math.sin(this.a * Math.PI / 180) * distance.value
      };
      this.c = rand(0, 255) + ', ' + rand(0, 255) + ', ' + rand(0, 255);
      this.angle = rand(0, 360);
    };

    Shape.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = 'rgb(' + this.c + ')';
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = this.comp;
      if (this.poly == 0) {
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      } else if (this.poly == 4) {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
        ctx.rect(this.x, this.y, this.r, this.r);
      } else {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
        for (var i = 0; i < 5; i++) {
          var xc = Math.sin(i * this.rad);
          var yc = Math.cos(i * this.rad);
          ctx.lineTo(xc * this.r + this.x, yc * this.r + this.y);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    Shape.prototype.changeParams = function() {
      if (shapeNum !== numberOfShapes.value) {
        shapeNum = numberOfShapes.value;
        shapeCreate();
      }
      if (delayNum !== delay.value) {
        delayNum = delay.value;
        shapeCreate();
      }
      this.r = rand(0, shapeMaxSize.value);
      this.v.x = Math.cos(this.a * Math.PI / 180) * distance.value;
      this.v.y = Math.sin(this.a * Math.PI / 180) * distance.value;
    };

    Shape.prototype.updateParams = function() {
      if (this.r < shapeMaxSize.value) {
        this.r += 0.1;
      }
      this.angle += 1;
      this.l -= 1;
      this.a += 1;
      this.v.x = Math.cos(this.a * Math.PI / 180) * distance.value;
      this.v.y = Math.sin(this.a * Math.PI / 180) * distance.value;
    };
    
    Shape.prototype.updatePosition = function() {
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Shape.prototype.render = function() {
      this.updatePosition();
      this.updateParams();
      this.draw();
    };
    
    function shapeCreate() {
      clearInterval(shapePushIntId);
      shapes = [];
      shapePushIntId = setInterval(function() {
        var shape = new Shape(ctx, X / 2, Y / 2, rand(5, shapeMaxSize.value), rand(0, 360));
        shapes.push(shape);
        if (shapes.length > shapeNum - 1) {
          clearInterval(shapePushIntId);
        }
      }, delayNum);
    }

    shapeCreate();
    
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
      shapeCreate();
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    /********************
      Menu
    ********************/

    var openController = document.getElementById('openController');
    var closeController = document.getElementById('closeController');
    var controller = document.getElementById('controller');

    function changeShapes() {
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].changeParams();
      }
    }
    
    openController.addEventListener('click', function(e) {
      e.preventDefault();
      controller.style.display = 'block';
    }, false);

    closeController.addEventListener('click', function(e) {
      e.preventDefault();
      controller.style.display = 'none';
    }, false);

    for(var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('change', changeShapes, false);
    }

  }); 
  // Author
  console.log('File Name / bigBang.js\nCreated Date / March 4, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
