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
    var curIndex = 0;
    var flg = false;

    /********************
      offscreenCanvas
    ********************/
    
    var images = [];
    var files = [
      'image1.jpg',
      'image2.jpg',
      'image3.jpg'
    ];
     
    for (var i = 0; i < files.length; i++) {
      var img = new Image();
      img.src = files[i];
      images.push(img);
    }

    /*
    function drawText() {
      offscreenCtx.save();
      offscreenCtx.fillStyle = 'red';
      offscreenCtx.font = '100px sans-serif';
      offscreenCtx.textAlign = 'center';
      offscreenCtx.textBaseline = 'middle';
      offscreenCtx.fillText('PARTICLE', X / 2, Y / 2);
      offscreenCtx.restore();
    }

    drawText();
    */

    /********************
      Particle
    ********************/
    
    function Particle(ctx, x, y, r, cr, cg, cb) {
      this.ctx = ctx;
      this.init(x, y, r, cr, cg, cb);
    }

    Particle.prototype.init = function(x, y, r, cr, cg, cb) {
      this.x = x;
      this.y = y;
      this.xi = x;
      this.yi = y;
      this.r = r;
      this.s = 10;
      this.c = {
        r: cr,
        g: cg,
        b: cb,
        a: 1
      };
      this.v = {
        x: rand(-10, 10),
        y: rand(1, 5)
      };
      this.a = rand(0, 360);
      this.rad = this.a * Math.PI / 180;
    };

    Particle.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.sin(this.rad) < 0 ? -Math.sin(this.rad) * this.r : Math.sin(this.rad) * this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    Particle.prototype.updatePosition = function() {
      this.v.y *= 1.05;
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Particle.prototype.initPosition = function() {
      this.x = this.xi;
      this.y = this.yi;
    };

    Particle.prototype.returnPosition = function() {
      var x = this.x - this.xi;
      var y = this.y - this.yi;
      var d = x * x + y * y;
      var dist = Math.sqrt(d);
      if (dist < 1) {
        return;
      }
      this.v.x = x / dist * this.s;
      this.v.y = y / dist * this.s;
      this.x -= this.v.x;
      this.y -= this.v.y;
    };

    Particle.prototype.updateParams = function() {
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
    };

    Particle.prototype.render = function() {
      if (flg === true) this.updatePosition();
      //this.updateParams();
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
          if (load === images.length - 1) {
            init();
          }
        });
      }
    }

    function init() {
      offscreenCtx.drawImage(images[curIndex], (X - images[curIndex].width) / 2, (Y - images[curIndex].height) / 2);
      var data = offscreenCtx.getImageData(0, 0, X, Y).data;
      var step = 36;
      for (var i = 0; i < Y; i += step) {
        for (var j = 0; j < X; j += step) {
          var oI = (j + i * X) * 4 + 3; // fantastic! I can not think of it.
          if (data[oI] > 0) {
            var p =  new Particle(ctx, j + rand(-3, 3), i + rand(-3, 3), 30, data[oI - 3], data[oI -2], data[oI - 1]);
            particles.push(p);
          }
        }
      }
      render();
    };

    loadImage();

    function changeImage() {
      particles = [];
      offscreenCtx.drawImage(images[curIndex], (X - images[curIndex].width) / 2, (Y - images[curIndex].height) / 2);
      var data = offscreenCtx.getImageData(0, 0, X, Y).data;
      var step = 36;
      for (var i = 0; i < Y; i += step) {
        for (var j = 0; j < X; j += step) {
          var oI = (j + i * X) * 4 + 3; // fantastic! I can not think of it.
          if (data[oI] > 0) {
            var p =  new Particle(ctx, j + rand(-3, 3), i + rand(-3, 3), 30, data[oI - 3], data[oI -2], data[oI - 1]);
            particles.push(p);
          }
        }
      }
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
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < particles.length; i++) {
        particles[i].render();
      }
      if (flg === false) ctx.drawImage(images[curIndex], (X - images[curIndex].width) / 2, (Y - images[curIndex].height) / 2);
      requestAnimationFrame(render);
    }

    /********************
      Event
    ********************/
    
    function onResize() {
      X = canvas.width = offscreenCanvas.width = window.innerWidth;
      Y = canvas.height = offscreenCanvas.height = window.innerHeight;
    }

    window.addEventListener('resize', function(){
      onResize();
    });

    canvas.addEventListener('click', function() {
      if (flg === true) {
        flg = false;
        for (var i = 0; i < particles.length; i++) {
          particles[i].initPosition();
        }
        if (curIndex === images.length - 1) {
          curIndex = 0;
        } else {
          curIndex++;
        }
        changeImage();
      } else {
        flg = true;
      }
    }, false);

  });
  // Author
  console.log('File Name / particleOnPicture.js\nCreated Date / Jun 12, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
