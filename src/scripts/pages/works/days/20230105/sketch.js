/**
 * class Sketch
 */
export class Sketch {
  constructor() {
    this.setupCanvas();
    this.setupEvents();
    this.initialize();
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.canvas.ariaLabel = 'The circles lined up on golden ratio are scaling and rotating.';
    this.canvas.role = 'img';

    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.minHeight = '100vh';
    this.canvas.style.minHeight = 'calc(var(--vh, 1vh) * 100)';
    this.canvas.style.display = 'block';
    this.canvas.style.background = '#000000';
    this.canvas.style.zIndex = '-1'; 
    
    document.body.appendChild(this.canvas);
  }

  setupEvents() {
    window.addEventListener('resize', this.onResize.bind(this), false);
  }
  
  onResize() {
    if (this.preWidth === window.innerWidth) {
      this.height = this.canvas.height = window.innerHeight;
      this.halfHeight = this.height / 2;

      return;
    }

    this.initialize();
  }

  initialize() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.width = this.preWidth = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;

    const colors = ['rgb(220, 14, 123)', 'rgb(244, 233, 91)', 'rgb(0, 176, 177)'];
    const num = Math.floor(Math.max(this.width, this.height));
    
    let size = num / 5;
    let radius = num;
    this.shapes = [];
    for (var i = 0; i < num; i++) {
      const tmp = {};

      tmp.r = 137.5 * Math.PI / 180 * i;
      tmp.x = Math.cos(tmp.r) * radius;
      tmp.y = Math.sin(tmp.r) * radius;
      tmp.s = size;
      tmp.d = Math.sqrt(tmp.x * tmp.x + tmp.y * tmp.y);
      tmp.a = Math.atan2(tmp.y, tmp.x);
      tmp.c = colors[this.getRandomNumber(0, colors.length - 1)];
      
      this.shapes.push(tmp);

      size *= 0.974;
      radius *= 0.974;
    }

    this.render();
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  render(t) {
    t *= 0.001;

    this.ctx.save(); 
    this.ctx.clearRect(0, 0, this.width, this.height);
    //this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    //this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.rotate(t * 0.2);
    this.ctx.globalCompositeOperation = 'xor';
    
    for (let i = 0; i < this.shapes.length; i++) {
      const q = Math.sin(Math.sin(this.shapes[i].a * 2) + this.shapes[i].d * 0.001 - t) + 1;
      this.ctx.globalAlpha = Math.min(1, q);
      this.ctx.fillStyle = this.shapes[i].c;
      
      this.ctx.beginPath();
      this.ctx.arc(this.shapes[i].x, this.shapes[i].y, this.shapes[i].s * q, 0, Math.PI * 2, false);
      this.ctx.fill();
    }

    this.ctx.restore();
    this.animationId = requestAnimationFrame(this.render.bind(this));
  }
}
