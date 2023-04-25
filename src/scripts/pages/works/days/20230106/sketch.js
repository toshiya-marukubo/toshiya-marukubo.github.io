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

    this.canvas.ariaLabel = 'This is hilbert curve.';
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

    this.shapes = [];
    this.depth = 5;
    this.length = Math.min(this.width / 33, this.height / 33);
    this.angle = 0;
    this.radian = 0;
    this.startX = - this.length * 31 / 2;
    this.startY = - this.length * 31 / 2;

    this.fractal(90, this.depth);

    this.render();
  }

  fractal(angle, depth) {
    if (depth > 0) {
      this.turn(angle);
      this.fractal(-angle, depth - 1);
      this.getCoordinates(length);
      this.turn(-angle);
      this.fractal(angle, depth - 1);
      this.getCoordinates(length);
      this.fractal(angle, depth - 1);
      this.turn(-angle);
      this.getCoordinates(length);
      this.fractal(-angle, depth - 1);
      this.turn(angle);
    }
  }

  turn(num) {
    this.angle += num;
  }

  getCoordinates() {
    const tmp = {};

    tmp.r = this.angle * Math.PI / 180;
    tmp.x = Math.cos(tmp.r) * this.length + this.startX;
    tmp.y = Math.sin(tmp.r) * this.length + this.startY;
    tmp.mx = Math.cos(tmp.r) * (this.length / 2) + this.startX;
    tmp.my = Math.sin(tmp.r) * (this.length / 2) + this.startY;
    tmp.d = Math.sqrt(tmp.x * tmp.x + tmp.y * tmp.y);
    tmp.a = Math.atan2(tmp.ny, tmp.nx);
    tmp.sx = this.startX;
    tmp.sy = this.startY;

    this.shapes.push(tmp);
    
    this.startX = tmp.x;
    this.startY = tmp.y;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  norm(value, min, max) {
    return (value - min) / (max - min);
  }
  
  lerp(norm, min, max) {
    return (max - min) * norm + min;
  }

  map(value, sourceMin, sourceMax, destMin, destMax) {
    return this.lerp(this.norm(value, sourceMin, sourceMax), destMin, destMax);
  }

  ease(x) {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    return x < 0.5
      ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
      : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
  }

  render(t) {
    t *= 0.0005;

    this.ctx.save(); 
    this.ctx.clearRect(0, 0, this.width, this.height);
    //this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    //this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.lineWidth = this.length * 0.5;
    this.ctx.lineCap = 'square';
    this.ctx.globalCompositeOperation = 'lighter';
    
    for (let j = 0; j <  3; j++) {
      if (j === 0) this.ctx.strokeStyle = '#FF0000';
      if (j === 1) this.ctx.strokeStyle = '#00FF00';
      if (j === 2) this.ctx.strokeStyle = '#0000FF';

      for (let i = 0; i < this.shapes.length; i++) {
        const nt = this.ease((t - j / 3 * 0.1 - this.shapes[i].d / this.width / 1 / Math.PI * 2) % 1);

        let rotate;
        if (nt < 0.5) {
          rotate = this.map(nt, 0, 0.5, 0, Math.PI);
        } else {
          rotate = Math.PI;
        }
        
        this.ctx.save();
        this.ctx.translate(this.shapes[i].mx, this.shapes[i].my);
        this.ctx.rotate(rotate);
        this.ctx.translate(-this.shapes[i].mx, -this.shapes[i].my);
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.shapes[i].sx, this.shapes[i].sy);
        this.ctx.lineTo(this.shapes[i].x, this.shapes[i].y);
        this.ctx.stroke();
        this.ctx.restore();
      }
    }
    
    this.ctx.restore();
    this.animationId = requestAnimationFrame(this.render.bind(this));
  }
}
