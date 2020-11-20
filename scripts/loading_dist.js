/********************
  Common Tool
********************/

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

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
  Canvas
********************/

function Canvas() {
  this.canvas = document.getElementById('loading_canvas');
  if (!this.canvas || !this.canvas.getContext) return false;
  this.ctx = this.canvas.getContext('2d');
  this.W = this.canvas.width = window.innerWidth;
  this.H = this.canvas.height = window.innerHeight;
  this.loaded = false;
  this.animation_cancel_id = null;
  this.canvas_remove_flg = false;
  this.loading_number = 2;
  this.loading_array = [];
  this.glitch = null;
  this.glirch_probability = 0.1;
}

Canvas.prototype.init = function() {
  for (var i = 0; i < this.loading_number; i++) {
    var l = new Loading(this.ctx, 'Loading.', this.W / 2, this.H / 2, i);
    this.loading_array.push(l);
  }
  this.glitch = new Glitch(this.ctx, this.W, this.H, 50, 10);
};

Canvas.prototype.render = function() {
  var that = this;
  this.ctx.clearRect(0, 0, this.W, this.H);
  for (var i = 0; i < this.loading_array.length; i++) {
    this.loading_array[i].render();
  }
  if (Math.random() < this.glirch_probability) this.glitch.render();
  this.animation_cancel_id = requestAnimationFrame(function() {
    that.render();
  });
  if (this.canvas_remove_flg) {
    cancelAnimationFrame(this.animation_cancel_id);
  }
};

Canvas.prototype.load = function() {
  this.loaded = true;
};

Canvas.prototype.resize = function() {
  this.W = this.canvas.width = window.innerWidth;
  this.H = this.canvas.height = window.innerHeight;
  for (var i = 0; i < this.loading_array.length; i++) {
    this.loading_array[i].resize();
  }
};

/********************
  Glitch
********************/

function Glitch(ctx, width, height, splitNumber, swing) {
  this.time;
  this.ctx = ctx;
  this.width = width;
  this.height = height;
  this.splitNum = splitNumber;
  this.swing = swing;
  this.splitH = this.height / this.splitNum;
  this.dataArr = [];
}

Glitch.prototype.getImageData = function() {
  for (var i = 0; i < this.splitNum ; i++) {
    var d = this.ctx.getImageData(0, this.splitH * i, this.width, this.splitH + 1);
    this.dataArr.push(d);
  }
};

Glitch.prototype.addImage = function() {
  for (var i = 0; i < this.splitNum; i++) {
    if (Math.random() < 0.8) {
      this.ctx.putImageData(
        this.dataArr[rand(0, this.splitNum - 1)],
        Math.sin(this.time * 1 + i * 1 * Math.PI / 180) * this.swing * Math.random(),
        this.splitH * i
      );
    } else {
      this.ctx.putImageData(
        this.dataArr[rand(0, this.splitNum - 1)],
        Math.sin(this.time * 1 + i * 1 * Math.PI / 180) * 500 * Math.random(),
        this.splitH * i
      );
    }
  }
};

Glitch.prototype.render = function() {
  this.time = Date.now() / 100;
  this.dataArr = [];
  this.getImageData();
  this.addImage();
};

/********************
  Loading
********************/

function Loading(ctx, t, x, y, i) {
  this.ctx = ctx;
  this.w = new StopWatch();
  this.t = t;
  this.x = x;
  this.y = y;
  this.i = i;
  this.a = this.i * 180;
  this.rad = this.a * Math.PI / 180;
  this.s = canvas.W > 768 ? 50 : 30;
  this.c = this.i === 0 ? 'rgb(255, 2, 79)' : 'rgb(2, 246, 239)';
  this.b = 0;
}

Loading.prototype.draw = function() {
  var ctx = this.ctx;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = this.c;
  ctx.font = this.s + 'px "Verdana", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(this.t, this.x + 10 * Math.random(), this.y + 10 * Math.random());
  ctx.restore();
};

Loading.prototype.behavior0 = function() {
  if (!this.w.isRunning()) {
    this.w.start();
  }
  if (this.w.getElapsedTime() > 1600 && canvas.loaded === true) {
    this.w.stop();
    this.w.reset();
    this.b = 1;
  }
};

Loading.prototype.behavior1 = function() {
  this.t = 'Loaded!';
  canvas.glirch_probability = 0.5;
  if (!this.w.isRunning()) {
    this.w.start();
  }
  if (this.w.getElapsedTime() > 800) {
    this.w.stop();
    this.w.reset();
    this.b = 2;
  }
};

Loading.prototype.behavior2 = function() {
  this.s *= 1.1;
  canvas.glirch_probability = 1;
  if (this.s > canvas.W * 4 && this.i === 1) {
    canvas.canvas.parentNode.removeChild(canvas.canvas);
    canvas.canvas_remove_flg = true;
  }
};

Loading.prototype.updateParams = function() {
  this.a += 1;
  this.rad = this.a * Math.PI / 180;
};

Loading.prototype.resize = function() {
  this.x = canvas.W / 2;
  this.y = canvas.H / 2;
  this.s = canvas.W > 768 ? 50 : 30;
};

Loading.prototype.render = function() {
  this.draw();
  this.updateParams();
  if (this.b === 0) this.behavior0();
  if (this.b === 1) this.behavior1();
  if (this.b === 2) this.behavior2();
};

// global access to canvas
var canvas;

(function() {
  'use strict';
  window.addEventListener('DOMContentLoaded', function() {
    canvas = new Canvas();
    canvas.init();
    canvas.render();
    window.addEventListener('load', function() {
      canvas.load();
    }, false);
    window.addEventListener('resize', function() {
      canvas.resize();
    }, false);
  }, false);
})();
