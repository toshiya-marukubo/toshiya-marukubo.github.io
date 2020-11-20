(function() {
  'use strict';
  window.addEventListener('DOMContentLoaded', function() {
    var body = document.getElementsByTagName('body')[0];
    var canvas = document.getElementById('loading_canvas');
    if (!canvas || !canvas.getContext) return false;
    var ctx = canvas.getContext('2d');
    var W = canvas.width = window.innerWidth;
    var H = canvas.height = window.innerHeight;
    var loaded = false;
    var text = 'Loading...';
    var wSplit = W / (text.length + 1);
    var textArr = [];
    var canvas_style_left = 0;
    var cancel_id;
    
    /********************
      StopWatch
    ********************/

    function StopWatch() {
      this.startTime = 0;
      this.running = false;
      this.elapsed = undefined;
    }

    StopWatch.prototype.start = function() {
      this.startTime = +new Date();
      this.elapsedTime = null;
      this.running = true;
    };

    StopWatch.prototype.getElapsedTime = function() {
      if (this.running) {
        return (+new Date()) - this.startTime;
      } else {
        return this.elapsed;
      }
    };

    StopWatch.prototype.isRunning = function() {
      return this.running;
    };

    StopWatch.prototype.stop = function() {
      this.running = false;
    };
    
    StopWatch.prototype.reset = function() {
      this.elapsed = 0;
    };
    

    /********************
      Loading
    ********************/

    function Loading(ctx, t, x, y, i) {
      this.ctx = ctx;
      this.w = new StopWatch();
      this.t = t;
      this.x = x;
      this.ix = this.x;
      this.y = y;
      this.iy = this.y;
      this.i = i;
      this.a = this.i * 30;
      this.rad = this.a * Math.PI / 180;
      this.s = W > 768 ? 150 : 20;
      this.c = 'white';
      this.b = 0;
      this.v = {
        x: 0,
        y: 0
      };
      this.d = 20;
    }

    Loading.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = this.c;
      ctx.font = this.s + 'px "Verdana", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.t, this.x, Math.sin(this.rad) * this.d + this.y);
      ctx.restore();
    };

    Loading.prototype.behavior0 = function() {
      if (!this.w.isRunning()) {
        this.w.start();
      }
      if (this.w.getElapsedTime() > 1600) {
        this.w.stop();
        this.w.reset();
        this.b = 1;
      }
      this.v.y += (H / 2 - this.y) * 0.3;
      this.v.y *= 0.8;
      this.y += this.v.y;
    };

    Loading.prototype.behavior1 = function() {
      if (!this.w.isRunning()) {
        this.w.start();
      }
      if (this.w.getElapsedTime() > 800) {
        this.w.stop();
        this.w.reset();
        this.b = 2;
      }
      this.v.x += (W / 2 - this.x) * 0.3;
      this.v.x *= 0.8;
      this.x += this.v.x;
    }
    
    Loading.prototype.behavior2 = function() {
      if (!this.w.isRunning()) {
        this.w.start();
      }
      if (this.w.getElapsedTime() > 800) {
        this.w.stop();
        this.w.reset();
        this.b = 3;
      }
      this.v.x += (this.ix - this.x) * 0.3;
      this.v.x *= 0.8;
      this.x += this.v.x;
    };

    Loading.prototype.behavior3 = function() {
      this.x += 50;
      if (this.x - this.s / 2 > W) {
        this.x = 0 - this.s;
        if (loaded) {
          this.b = 4;
        } else {
          this.x = this.ix;
          this.y = this.iy;
          this.b = 0;
        } 
      }
    };

    Loading.prototype.behavior4 = function() {
      canvas.style.left = canvas_style_left + 'px';
      canvas_style_left += 50;
      if (canvas_style_left > W) {
        canvas.parentNode.removeChild(canvas);
      }
    };

    Loading.prototype.updateParams = function() {
      this.a += 2;
      this.rad = this.a * Math.PI / 180;
    };

    Loading.prototype.resize = function(wSplit) {
      this.x = wSplit * (this.i + 1);
      this.ix = this.x;
      this.s = W > 768 ? 150 : 20;
    };

    Loading.prototype.render = function() {
      this.draw();
      this.updateParams();
      if (this.b === 0) this.behavior0();
      if (this.b === 1) this.behavior1();
      if (this.b === 2) this.behavior2();
      if (this.b === 3) this.behavior3();
      if (this.b === 4 && this.i === textArr.length - 1) this.behavior4();
    };

    function init() {
      for (var i = 0; i < text.length; i++) {
        (function(i) {
          setTimeout(function() {
            var l = new Loading(ctx, text[i], wSplit * (i + 1), 0, i);
            textArr.push(l);
          }, i * 100);
        })(i);
      }
    }

    init();

    /********************
      Render
    ********************/

    // render
    function render() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < textArr.length; i++) {
        textArr[i].render();
      }
      cancel_id = window.requestAnimationFrame(render);
      if (canvas_style_left > W) {
        window.cancelAnimationFrame(cancel_id);
      }
    }

    render();

    /********************
      Event
    ********************/
    
    window.addEventListener('load', function() {
      loaded = true;
    }, false);

    function onResize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      wSplit = W / (text.length + 1);
      for (var i = 0; i < textArr.length; i++) {
        textArr[i].resize(wSplit);
      }
    }

    window.addEventListener('resize', function() {
      onResize(); 
    }, false);

  }, false);
})();
