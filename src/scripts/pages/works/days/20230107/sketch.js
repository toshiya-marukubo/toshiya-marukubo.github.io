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

    this.canvas.ariaLabel = 'The sierpinski triangles are scaling  and rotating.';
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

    this.size = Math.min(this.width * 0.5, this.height * 0.5);

    const points = [];
    for (let i = 0; i < 3; i++) {
      const x = Math.cos(i / 3 * Math.PI * 2) * this.size;
      const y = Math.sin(i / 3 * Math.PI * 2) * this.size;
      let obj = {
        x: x,
        y: y
      };
      points.push(obj);
    }

    this.p0 = points[0];
    this.p1 = points[1];
    this.p2 = points[2];

    this.render();
  }

  drawTriangle(p0, p1, p2) {
    this.ctx.beginPath();
    this.ctx.moveTo(p0.x, p0.y);
    this.ctx.lineTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.closePath();
    //this.ctx.stroke();
    this.ctx.fill();
  }

  sierpinski(p0, p1, p2, limit, t) {
    const tx = Math.cos(t - limit / Math.PI * 2) * limit * 0.1 + 0.5;
    const ty = Math.sin(t - limit / Math.PI * 2) * limit * 0.1 + 0.5;

    if (limit > 0) {
      const pa = {
        x: (p1.x + p0.x) * tx,
        y: (p1.y + p0.y) * ty
      };
      const pb = {
        x: (p2.x + p1.x) * tx,
        y: (p2.y + p1.y) * ty
      };
      const pc = {
        x: (p0.x + p2.x) * tx,
        y: (p0.y + p2.y) * ty
      };

      this.sierpinski(p0, pa, pc, limit - 1, t);
      this.sierpinski(pa, p1, pb, limit - 1, t);
      this.sierpinski(pc, pb, p2, limit - 1, t);
    } else {
      this.drawTriangle(p0, p1, p2);
    }
  }

  render(t) {
    t *= 0.001;

    this.ctx.save(); 
    //this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.translate(this.width / 2 - this.p0.x, this.height / 2);
    this.ctx.globalCompositeOperation = 'lighter';
    
    for (let j = 0; j <  3; j++) {
      if (j === 0) this.ctx.fillStyle = '#FF0000';
      if (j === 1) this.ctx.fillStyle = '#00FF00';
      if (j === 2) this.ctx.fillStyle = '#0000FF';

      for (let i = 0; i < 6; i++) {
        //const nt = this.ease((t - j / 3 * 0.1 - this.shapes[i].d / this.width / 1 / Math.PI * 2) % 1);
        this.ctx.translate(this.p0.x, this.p0.y);
        this.ctx.rotate(Math.PI * 2 / 6);
        this.ctx.translate(-this.p0.x, -this.p0.y);
        this.sierpinski(this.p0, this.p1, this.p2, 4, t - j / 3 * 0.1);
      }
    }
    
    this.ctx.restore();
    this.animationId = requestAnimationFrame(this.render.bind(this));
  }
}
