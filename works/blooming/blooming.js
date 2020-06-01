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

    // canvas 
    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = X / 2;
    var mouseY = Y / 2;
    var blooms = [];
    var bloomNum = 100;
    var jointNum = 8 + 2;
    var minRadius = 100;
    var maxRadius = 130;
    var flg = false;

    if (X < 768) {
      minRadius = 70;
      maxRadius = 100;
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
      Bloom
    ********************/
    
    function Bloom(ctx, x, y, i) {
      this.ctx = ctx;
      this.init(x, y, i);
    }

    Bloom.prototype.init = function(x, y, i) {
      this.x = x;
      this.y = y;
      this.i = i;
      this.r = rand(2, 12);
      this.a = 0;
      this.rad = this.a * Math.PI / 180;
      this.radius = rand(minRadius, maxRadius);
      this.joints = this.getJoints();
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(0, 255)
      };
    };

    Bloom.prototype.getJoints = function() {
      var joints = [];
      for (var i = 1; i < jointNum; i++) {
        var a = rand(0, 360);
        var rad = a * Math.PI / 180;
        joints.push(rad);
      }
      return joints;
    };

    Bloom.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.strokeStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.globalCompositeOperation = 'lighter';
      var preX = this.x;
      var preY = this.y;
      for (var i = 1; i < jointNum; i++) {
        var x = Math.cos(this.joints[i] * i) * this.radius / i + preX;
        var y = Math.sin(this.joints[i] * i) * this.radius / i + preY;
        ctx.beginPath();
        ctx.arc(x, y, this.r, 0, Math.PI * 2, false);
        ctx.fill();
        if (flg === true && i !== 1) {
          ctx.beginPath();
          ctx.moveTo(preX, preY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        preX = x;
        preY = y;
      }
      ctx.restore();
    };

    Bloom.prototype.updateParams = function() {
      for (var i = 1; i < this.joints.length; i++) {
        if (i % 2 === 0) {
          this.joints[i] += 0.005;
        } else {
          this.joints[i] -= 0.005;
        }
      }
    };

    Bloom.prototype.render = function(i) {
      this.updateParams();
      this.draw();
    };
    
    for (var i = 0; i < bloomNum; i++) {
      var bloom = new Bloom(ctx, X / 2, Y / 2, i);
      blooms.push(bloom);
    }

    /********************
      Render
    ********************/
   
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < blooms.length; i++) {
        blooms[i].render(i);
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
      if (X < 768) {
        minRadius = 70;
        maxRadius = 100;
      } else {
        minRadius = 100;
        maxRadius = 130;
      }
      blooms = [];
      for (var i = 0; i < bloomNum; i++) {
        var bloom = new Bloom(ctx, X / 2, Y / 2, i);
        blooms.push(bloom);
      }
    }

    window.addEventListener('resize', function(){
      onResize();
    });
    canvas.addEventListener('click', function(e){
      if (flg === false) {
        flg = true;
      } else {
        flg = false;
      }
    }, false); 
    
    canvas.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    canvas.addEventListener('wheel', function(e) {
      var scrollY = e.deltaY;
      if (scrollY < 0) {
        blooms.pop();
      }
      if (scrollY > 0) {
        var bloom = new Bloom(ctx, X / 2, Y / 2, i);
        blooms.push(bloom);
      }
    });

    var touchStartY;
    var touchMoveY;
    var touchEndY;
    canvas.addEventListener('touchstart', function(e) {
      var touch = e.targetTouches[0];
      touchStartY = touch.pageY;
    }, false);
    canvas.addEventListener('touchmove', function(e) {
      var touch = e.targetTouches[0];
      touchMoveY = touch.pageY;
    }, false);
    canvas.addEventListener('touchend', function(e) {
      touchEndY = touchStartY - touchMoveY;
      if (touchEndY < 0) {
        for (var i = 0; i < Math.abs(touchEndY / 10); i++) {
          var bloom = new Bloom(ctx, X / 2, Y / 2, i);
          blooms.push(bloom);
        }
      }
      if (touchEndY > 0) {
        for (var i = 0; i < Math.abs(touchEndY / 10); i++) {
          blooms.pop();
        }
      }
    }, false);

  });
  // Author
  console.log('File Name / blooming.js\nCreated Date / May 26, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
