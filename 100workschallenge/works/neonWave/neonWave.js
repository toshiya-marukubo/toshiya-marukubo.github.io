(function () {
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

    //controller
    var range = document.getElementsByTagName('input');
    var increaseNum = document.getElementById('increaseNum');
    var lineWidthNum = document.getElementById('lineWidthNum');
    var degreeNum = document.getElementById('degreeNum');
    var rangeMaxNum = document.getElementById('rangeMaxNum');
    var waveWidth = document.getElementById('waveWidth');
    var shakeSpeedNum = document.getElementById('shakeSpeedNum');
    var afterImageNum = document.getElementById('afterImageNum');
    var alphaNum = afterImageNum.value;

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
      Wave
    ********************/
    
    // var
    var waveNum = increaseNum.value;
    var waves = [];

    function Wave(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Wave.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.lineWidth = Number(lineWidthNum.value);
      this.degree = rand(0, X);
      this.degreeNum = Number(degreeNum.value);
      this.range = rand(0, 100);
      this.waveWidth = Number(waveWidth.value);
      this.c = {
        r: rand(0, 255),
        g: rand(0, 255),
        b: rand(0, 255)
      };
      this.shakeNum = Number(shakeSpeedNum.value);
      this.shakeSpeed = Number(this.shakeNum);
      this.flapPoint = this.range;
    };
    
    Wave.prototype.updateParams = function() {
      this.degree += this.degreeNum;
      if (this.range > this.flapPoint) {
        this.shakeSpeed = - this.shakeNum;
      } else if (this.range < - this.flapPoint) {
        this.shakeSpeed = this.shakeNum;
      }
      this.range += this.shakeSpeed;
    };

    Wave.prototype.changeParams = function() {
      if (waveNum != increaseNum.value) {
        waveNum = increaseNum.value;
        waves = [];
        for (var i = 0; i < waveNum; i++) {
          var wave = new Wave(ctx, X, Y / 2);
          waves.push(wave);
        }
      }
      this.lineWidth = lineWidthNum.value;
      this.degreeNum = Number(degreeNum.value);
      this.range = rand(0, rangeMaxNum.value);
      this.flapPoint = this.range;
      this.waveWidth = waveWidth.value;
      this.shakeNum = Number(shakeSpeedNum.value);
      alphaNum = afterImageNum.value;
    };
    
    Wave.prototype.draw = function() {
      ctx = this.ctx;
      ctx.save();
      ctx.lineWidth = this.lineWidth;
      ctx.strokeStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      ctx.beginPath();
      for (var i = 0; i < X; i++) {
        var s = Math.sin((this.degree + i) * this.waveWidth * Math.PI / 180) * this.range;
        ctx.lineTo(i, s + this.y);
      }
      ctx.stroke();
      ctx.restore();
    };

    Wave.prototype.resize = function() {
      this.y = Y / 2;
    };

    Wave.prototype.render = function() {
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < waveNum; i++) {
      var wave = new Wave(ctx, X, Y / 2);
      waves.push(wave);
    }
    
    /********************
      Render
    ********************/
    
    function render(){
      //ctx.clearRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "darken";
      ctx.globalAlpha = alphaNum;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      for (var i = 0; i < waves.length; i++) {
        waves[i].render();
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
      for (var i = 0; i < waves.length; i++) {
        waves[i].resize();
      }
    }

    for (var i = 0; i < range.length; i++) {
      range[i].addEventListener('change', function() {
        for (var i = 0; i < waves.length; i++) {
          waves[i].changeParams();
        }
      });
    };

    window.addEventListener('resize', function() {
      onResize();
    });

    /********************
      Menu
    ********************/

    var openController = document.getElementById('openController');
    var closeController = document.getElementById('closeController');
    var controller = document.getElementById('controller');

    openController.addEventListener('click', function(e) {
      e.preventDefault();
      controller.style.display = 'block';
    }, false);

    closeController.addEventListener('click', function(e) {
      e.preventDefault();
      controller.style.display = 'none';
    }, false);
  
  });
  // Author
  console.log('File Name / sineWave.js\nCreated Date / February 13, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
