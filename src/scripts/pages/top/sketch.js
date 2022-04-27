import {FKSystem} from './fk-system.js';

export class Sketch {
  constructor() {
    this.setupCanvas();
    this.setupEvents();
    
    this.initialize();
  }

  setupCanvas() {
    document
      .body
      .appendChild(document.createElement("canvas"))
      .setAttribute('id', 'sketch');
    
    this.canvas = document.getElementById('sketch');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.display = 'block';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '50%';
    this.canvas.style.background = '#262830';
  }

  setupEvents() {
    window.addEventListener('resize', this.onResize.bind(this), false);
  }

  onResize() {
    this.initialize();
  }

  initialize() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width = Math.ceil(window.innerWidth);
    this.height = this.canvas.height = Math.ceil(window.innerHeight / 2);
    
    this.setupRunners();
    
    this.draw(0);
  }

  setupRunners() {
    this.runners = [];
    this.numberOfRunners = this.width > 768 ? 100 : 50;
    this.tall = 50;

    for (let i = 0; i < this.numberOfRunners; i++) {
      const x = this.width * Math.random();
      const y = this.height * Math.random() * Math.random();
      const s = y / this.height;
      const v = 10;
      const rand = Math.max(Math.random(), 0.3);

      if (Math.random() < 0.5) {
        v *= -1;
      }

      const right = new FKSystem(x, y, v * s, rand * s);
      const left  = new FKSystem(x, y, v * s, rand * s);

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
  }

  draw(frame) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    for (let j = 0; j < this.runners.length; j++) {
      for (let i = 0; i < this.runners[j].length; i++) {
        this.runners[j][i].render(this.ctx, frame * 0.001, this.tall, j);
        this.runners[j][i].update();
        this.runners[j][i].updatePosition();
      }
    }

    this.animationId = requestAnimationFrame(this.draw.bind(this));
  }
}
