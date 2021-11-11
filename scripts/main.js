/**
 * Sketch class
 */
function Sketch() {
  this.setupCanvas();
  this.setupEvents();
  
  this.initialize();
}

Sketch.prototype.setupCanvas = function () {
  document
    .getElementsByTagName("body")[0]
    .appendChild(document.createElement("canvas"));
  
  this.canvas = document.getElementsByTagName('canvas')[0];
  this.canvas.style.position = 'absolute';
  this.canvas.style.top = '0';
  this.canvas.style.left = '0';
  this.canvas.style.zIndex = '-1';
  this.canvas.style.display = 'block';
  this.canvas.style.width = '100%';
  this.canvas.style.height = '50%';
  this.canvas.style.background = '#262830';
};

Sketch.prototype.setupEvents = function () {
  window.addEventListener('resize', this.onResize.bind(this), false);
};

Sketch.prototype.onResize = function () {
  this.initialize();
};

Sketch.prototype.initialize = function () {
  if (this.animationId) {
    cancelAnimationFrame(this.animationId);
  }
  
  this.ctx = this.canvas.getContext('2d');
  this.width = this.canvas.width = Math.ceil(window.innerWidth);
  this.height = this.canvas.height = Math.ceil(window.innerHeight / 2);
  
  this.setupRunners();
  
  this.draw(0);
};

Sketch.prototype.setupRunners = function () {
  this.runners = new Array();
  this.numberOfRunners = this.width > 768 ? 80 : 50;
  this.tall = 50;

  for (var i = 0; i < this.numberOfRunners; i++) {
    var x = this.width * Math.random();
    var y = this.height * Math.random() * Math.random();
    var s = y / this.height;
    var v = 10;
    var rand = Math.max(Math.random(), 0.3);

    if (Math.random() < 0.5) {
      v *= -1;
    }

    var right = new FKSystem(x, y, v * s, rand * s);
    var left  = new FKSystem(x, y, v * s, rand * s);

    left.phase = Math.PI;

    if (v < 0) {
      right.addArm(this.tall * s, Math.PI / 2, Math.PI / 4, 0, s);
      right.addArm(this.tall * s, -0.87, 0.87, -1.5, s);

      left.addArm(this.tall * s, Math.PI / 2, Math.PI / 4, 0, s);
      left.addArm(this.tall * s, -0.87, 0.87, -1.5, s);
    } else {
      right.addArm(this.tall * s, Math.PI / 2, Math.PI / 4, 0, s);
      right.addArm(this.tall * s, 0.87, 0.87, -1.5, s);

      left.addArm(this.tall * s, Math.PI / 2, Math.PI / 4, 0, s);
      left.addArm(this.tall * s, 0.87, 0.87, -1.5, s);
    }

    this.runners.push([right, left]);
  }
};

Sketch.prototype.draw = function (frame) {
  this.ctx.clearRect(0, 0, this.width, this.height);
  
  for (var j = 0; j < this.runners.length; j++) {
    for (var i = 0; i < this.runners[j].length; i++) {
      this.runners[j][i].render(this.ctx, frame * 0.001, this.tall);
      this.runners[j][i].update();
      this.runners[j][i].updatePosition();
    }
  }
  
  this.animationId = requestAnimationFrame(this.draw.bind(this));
};

(function() {
  window.addEventListener('DOMContentLoaded', function() {
    console.clear();
    console.log('Hi there!');

    new Sketch();
 
    happyMealInit({
      button_id: 'hamburger', // Your favorite id name (same name).
      min_size: 30, // min happy meal size.
      max_size: 100, // max happy meal size.
      direction_x: -1, // x direction 1 = to right : -1 = to left.
      direction_y: -1, // y direction 1 = to down : -1 = to up.
      mult_x: 10, // multiply to direction_x.
      mult_y: 5, // multiply to direction_y.
      gravity: 0.1, // gravity.
      gravity_random: true // make gravity random number.
    });

    shuffleInit({
      class_name: 'shuffleText', // input your favorite class name.
      onload: true, // shuffle when loaded.
      delay: true, // displayed in order.
      number_of_iterations: 100,
      iteration_speed: 5,
      displayed_speed: 80,
    });
    
    var loading = document.getElementsByClassName('loading')[0];
    
    loading.classList.add('loaded');
    //loading.setAttribute('class', 'loading loaded');
  });
})();
