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

    this.canvas.ariaLabel = 'The rectangles are moving fast.';
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
    
    this.size = this.width / 50;

    this.render();
  }

  render(t) {
    t *= 0.0005;

    this.ctx.save(); 
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.globalCompositeOperation = 'lighter';
    
    for (let k = 0; k < 3; k++) {
      if (k === 0) this.ctx.fillStyle = '#FF0000';
      if (k === 1) this.ctx.fillStyle = '#00FF00';
      if (k === 2) this.ctx.fillStyle = '#0000FF';
      
      for (let i = 0; i < this.height; i += this.size) {
        for (let j = 0; j < this.width / 2; j += this.size) {
          const index = i * this.width + j;
          
          this.ctx.globalAlpha = Math.tan(index - t);
          
          this.ctx.fillRect(
            Math.tan(i * j - Math.sin(index + k * 0.001) + t) * j + this.width / 2 - this.size / 2,
            Math.tan(i * j + Math.cos(index + k * 0.001) - t) * j + this.height / 2 - this.size / 2,
            Math.tan(index + i / j + t + k / 100) / 2 * this.size / 2,
            Math.tan(index * index - t) * this.size / 2
          );
        }
      }
    }

    this.ctx.restore();
    this.animationId = requestAnimationFrame(this.render.bind(this));
  }
}
