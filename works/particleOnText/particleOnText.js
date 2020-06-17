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

    var ctx = canvas.getContext('2d');
    var offscreenCanvas = document.createElement('canvas');
    var offscreenCtx = offscreenCanvas.getContext('2d');
    var X = canvas.width = offscreenCanvas.width = window.innerWidth;
    var Y = canvas.height = offscreenCanvas.height = window.innerHeight;
    var mouseX = X / 2;
    var mouseY = Y / 2;
    var particles = [];
    var ease = 0.3;
    var friction = 0.8;
    // DOM 
    var inputText = document.getElementById('text');
    var inputRandomFontColor = document.getElementById('randomFontColor');
    var inputFontColor = document.getElementById('fontColor');
    var inputFontSize = document.getElementById('fontSize');
    var inputParticleSize = document.getElementById('particleSize');
    var inputStep = document.getElementById('step');
    var inputFlexibility = document.getElementById('flexibility');
    var inputIncreaseAngle = document.getElementById('increaseAngle');
    var selectComposition = document.getElementById('composition');
    // Value
    var textValue = inputText.value;
    var compositionValue = selectComposition.value;
    var randomFontColorValue = inputRandomFontColor.checked;
    var flexibilityValue = inputFlexibility.checked;
    var fontColorValue = inputFontColor.value;
    var stepValue = Number(inputStep.value);
    var fontSizeValue = inputFontSize.value;
    var particleSizeValue = inputParticleSize.value;
    var increaseAngleValue = Number(inputIncreaseAngle.value);
    

    /********************
      Responsive
    ********************/

    if (X < 768) {
      fontSizeValue = 50;
      stepValue = 2;
      particleSizeValue = 4;
    }
     
    /********************
      offscreenCanvas
    ********************/
    
    function drawText() {
      offscreenCtx.save();
      offscreenCtx.fillStyle = fontColorValue;
      offscreenCtx.font = fontSizeValue + 'px sans-serif';
      offscreenCtx.textAlign = 'center';
      offscreenCtx.textBaseline = 'middle';
      offscreenCtx.fillText(textValue, X / 2, Y / 2);
      offscreenCtx.restore();
    }

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
      this.xi = rand(0, X);
      this.yi = rand(0, Y);
      this.r = r;
      this.s = 10;
      this.c = {
        r: cr,
        g: cg,
        b: cb,
        a: 1
      };
      this.v = {
        x: rand(-5, 5) * Math.random(),
        y: rand(-5, 5) * Math.random()
      };
      this.a = rand(0, 360);
      this.rad = this.a * Math.PI / 180;
    };

    Particle.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = compositionValue;
      ctx.fillStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.beginPath();
      ctx.arc(this.xi, this.yi, Math.sin(this.rad) < 0 ? -Math.sin(this.rad) * this.r : Math.sin(this.rad) * this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    Particle.prototype.updatePosition = function() {
      this.v.x += (this.xi - this.x) * ease;
      this.v.y += (this.yi - this.y) * ease;
      this.v.x *= friction;
      this.v.y *= friction;
      this.xi -= this.v.x;
      this.yi -= this.v.y;
    };

    Particle.prototype.changeColor = function() {
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(0, 255)
      }
    };

    Particle.prototype.updateParams = function() {
      this.a += increaseAngleValue;
      this.rad = this.a * Math.PI / 180;
    };

    Particle.prototype.render = function() {
      if (flexibilityValue) this.updateParams();
      this.updatePosition();
      this.draw();
    };

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
    
    function initText(cb) {
      var data = offscreenCtx.getImageData(0, 0, X, Y).data;
      var p;
      for (var i = 0; i < Y; i += stepValue) {
        for (var j = 0; j < X; j += stepValue) {
          var oI = (j + i * X) * 4 + 3; // fantastic! I can not think of it.
          if (data[oI] > 0) {
            if (randomFontColorValue) {
              p = new Particle(ctx, j, i, particleSizeValue, rand(0, 255), rand(0, 255), rand(0, 255));
            } else {
              p = new Particle(ctx, j, i, particleSizeValue, data[oI - 3], data[oI -2], data[oI - 1]);
            }
            particles.push(p);
          }
        }
      }
      if (cb) {
        cb();
      } else {
        return;
      }
    }

    drawText();
    initText(render);

    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < particles.length; i++) {
        particles[i].render();
      }
      requestAnimationFrame(render);
    }

    /********************
      Event
    ********************/
    
    function onResize() {
      X = canvas.width = offscreenCanvas.width = window.innerWidth;
      Y = canvas.height = offscreenCanvas.height = window.innerHeight;
      particles = [];
      if (X < 768) {
        fontSizeValue = 50;
        stepValue = 2;
        particleSizeValue = 4;
      } else {
        fontSizeValue = 200;
        stepValue = 8;
        particleSizeValue = 20;
      }
      offscreenCtx.clearRect(0, 0, X, Y);
      drawText();
      initText();
    }

    window.addEventListener('resize', function(){
      onResize();
    });

    /********************
      Controller
    ********************/
    
    var openController = document.getElementById('openController');
    var closeController = document.getElementById('closeController');
    var controller = document.getElementById('controller');
    var backgroundColor = document.getElementById('backgroundColor');

    openController.addEventListener('click', function(e) {
      e.preventDefault();
      controller.style.display = 'block';
    }, false);

    closeController.addEventListener('click', function(e) {
      e.preventDefault();
      controller.style.display = 'none';
    }, false);

    backgroundColor.addEventListener('input', function() {
      document.getElementsByTagName('body')[0].style.background = this.value;
    }, false);
    
    inputText.addEventListener('keyup', function() {
      textValue = this.value;
      particles = [];
      offscreenCtx.clearRect(0, 0, X, Y);
      drawText();
      initText();
    }, false);

    inputStep.addEventListener('change', function() {
      stepValue = Number(this.value);
      particles = [];
      offscreenCtx.clearRect(0, 0, X, Y);
      drawText();
      initText();
    }, false);

    inputFontSize.addEventListener('change', function() {
      fontSizeValue = this.value;
      particles = [];
      offscreenCtx.clearRect(0, 0, X, Y);
      drawText();
      initText();
    }, false);

    inputParticleSize.addEventListener('change', function() {
      particleSizeValue = this.value;
      for (var i = 0; i < particles.length; i++) {
        particles[i].r = this.value;
      }
    }, false);

    inputFontColor.addEventListener('input', function() {
      fontColorValue = this.value;
      inputRandomFontColor.checked = false;
      randomFontColorValue = false;
      particles = [];
      offscreenCtx.clearRect(0, 0, X, Y);
      drawText();
      initText();
    }, false);

    inputFlexibility.addEventListener('click', function() {
      flexibilityValue = this.checked;
    }, false);

    inputRandomFontColor.addEventListener('click', function() {
      randomFontColorValue = inputRandomFontColor.checked;
      if (randomFontColorValue) {
        for (var i = 0; i < particles.length; i++) {
          particles[i].changeColor();
        }
      }
    }, false);

    selectComposition.addEventListener('change', function() {
      compositionValue = this.value;
    });
    
    inputIncreaseAngle.addEventListener('change', function() {
      increaseAngleValue = Number(this.value);
    });

  });
  // Author
  console.log('File Name / particleOnPicture.js\nCreated Date / Jun 17, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
