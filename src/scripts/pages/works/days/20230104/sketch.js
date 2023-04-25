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

    this.canvas.ariaLabel = 'The three circles red, blue and green are transforming.';
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
    
    this.size = Math.min(this.width / 4, this.height / 4);

    this.shapes = [];
    for (var i = 0; i < 360; i++) {
      const tmp = {};

      tmp.r = i / 360 * Math.PI * 2;
      tmp.x = Math.cos(tmp.r) * this.size;
      tmp.y = Math.sin(tmp.r) * this.size;
      tmp.a = Math.atan2(tmp.y, tmp.x);
      
      this.shapes.push(tmp);
    }

    this.render();
  }

  render(t) {
    t *= 0.0025;

    this.ctx.save(); 
    this.ctx.clearRect(0, 0, this.width, this.height);
    //this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    //this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.rotate(t);
    this.ctx.globalCompositeOperation = 'lighter';
    
    for (let k = 0; k < 3; k++) {
      if (k === 0) this.ctx.fillStyle = '#FF0000';
      if (k === 1) this.ctx.fillStyle = '#00FF00';
      if (k === 2) this.ctx.fillStyle = '#0000FF';

      for (let i = 0; i < this.shapes.length; i++) {
        this.ctx.save();
        
        const q = Math.sin(Math.cos(this.shapes[i].a * (Math.sin(t * 0.1) * 6)) - t - k * 0.04);
        const x = this.shapes[i].x * q;
        const y = this.shapes[i].y * q;

        this.ctx.translate(this.shapes[i].x, this.shapes[i].y);
        this.ctx.rotate(Math.sin(t * 0.5) * q);
        this.ctx.translate(-this.shapes[i].x, -this.shapes[i].y);

        if (i === 0) {
          this.ctx.beginPath();
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }

        if (i === this.shapes.length - 1) {
          this.ctx.closePath();
          this.ctx.fill();
        }

        this.ctx.restore();
      }
      
    }

    this.ctx.restore();
    this.animationId = requestAnimationFrame(this.render.bind(this));
  }
}
