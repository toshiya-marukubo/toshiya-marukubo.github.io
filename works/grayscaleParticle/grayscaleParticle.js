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

    var offscreenCanvas = document.createElement('canvas');
    var offscreenCtx = offscreenCanvas.getContext('2d');
    var ctx = canvas.getContext('2d');
    var X = canvas.width = offscreenCanvas.width = window.innerWidth;
    var Y = canvas.height = offscreenCanvas.height = window.innerHeight;
    var mouseX = X / 2;
    var mouseY = Y / 2;
    var particles = [];
    var step = 16;
    var radius = 8;
    var flg = true;
    var curIndex = 0;

    /********************
      offscreenCanvas
    ********************/
    
    var images = [];
    var files = [
      'image.jpg'
    ];
    
    for (var i = 0; i < files.length; i++) {
      var img = new Image();
      img.src = files[i];
      img.crossOrigin = "anonymous";
      images.push(img);
    }

    /********************
      Particle
    ********************/
    
    function Particle(ctx, x, y, r, cr, cg, cb, ca) {
      this.ctx = ctx;
      this.init(x, y, r, cr, cg, cb, ca);
    }

    Particle.prototype.init = function(x, y, r, cr, cg, cb, ca) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.c = { // grayscale.
        r: (cr + cg + cb) / 3,
        g: (cr + cg + cb) / 3, 
        b: (cr + cg + cb) / 3, 
        a: ca
      };
      this.w = 1 - ((this.c.r + this.c.g + this.c.b) / 765);
    };

    Particle.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ', ' + this.c.a + ')';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r < 0 ? this.r * this.w * -1 : this.r * this.w, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    Particle.prototype.render = function() {
      this.draw();
    };

    /********************
      Init
    ********************/

    function loadImage() {
      var load = 0;
      for (var i = 0; i < images.length; i++) {
        images[i].addEventListener('load', function() {
          load++;
          if (load === images.length) {
            init();
          }
        });
      }
    }

    function init() {
      offscreenCtx.drawImage(images[curIndex], (X - images[curIndex].width) / 2, (Y - images[curIndex].height) / 2);
      var data = offscreenCtx.getImageData(0, 0, X, Y).data;
      for (var i = 0; i < Y + step; i += step) {
        for (var j = 0; j < X + step; j += step) {
          var oI = (j + i * X) * 4 + 3; // fantastic! I can not think of it.
          if (data[oI] > 0) {
            var p =  new Particle(ctx, j, i, radius, data[oI - 3], data[oI -2], data[oI - 1], data[oI]);
            particles.push(p);
          }
        }
      }
      render();
    };

    loadImage();

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
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < particles.length; i++) {
        particles[i].render();
      }
      if (flg === true) ctx.drawImage(images[curIndex], (X - images[curIndex].width) / 2, (Y - images[curIndex].height) / 2);
      requestAnimationFrame(render);
    }

    /********************
      Event
    ********************/
    
    function onResize() {
      X = canvas.width = offscreenCanvas.width = window.innerWidth;
      Y = canvas.height = offscreenCanvas.height = window.innerHeight;
      particles = [];
      offscreenCtx.drawImage(images[curIndex], (X - images[curIndex].width) / 2, (Y - images[curIndex].height) / 2);
      var data = offscreenCtx.getImageData(0, 0, X, Y).data;
      for (var i = 0; i < Y + step; i += step) {
        for (var j = 0; j < X + step; j += step) {
          var oI = (j + i * X) * 4 + 3; // fantastic! I can not think of it.
          if (data[oI] > 0) {
            var p =  new Particle(ctx, j, i, radius, data[oI - 3], data[oI -2], data[oI - 1], data[oI]);
            particles.push(p);
          }
        }
      }

    }

    window.addEventListener('resize', function(){
      onResize();
    });

    canvas.addEventListener('wheel', function(e) {
      flg = false;
      var y = e.deltaY;
      for (var i = 0; i < particles.length; i++) {
        particles[i].r += y / 100;
      }
    }, false);

    canvas.addEventListener('click', function(e) {
      flg = true;
    }, false);

    var touchStartY;
    var touchMoveY;
    var touchEndY;

    canvas.addEventListener('touchstart', function(e) {
      flg = false;
      var touch = e.targetTouches[0];
      touchStartY = touch.pageY;
    }, false);

    canvas.addEventListener('touchmove', function(e) {
      var touch = e.targetTouches[0];
      touchMoveY = touch.pageY;
      touchEndY = touchStartY - touchMoveY;
      for (var i = 0; i < particles.length; i++) {
        particles[i].r += touchEndY / 1000;
      }
    }, false);

    canvas.addEventListener('touchend', function(e) {
      touchStartY = null;
      touchMoveY = null;
      touchEndY = null;
    }, false);

  });
  // Author
  console.log('File Name / grayscaleParticle.js\nCreated Date / Jun 19, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
