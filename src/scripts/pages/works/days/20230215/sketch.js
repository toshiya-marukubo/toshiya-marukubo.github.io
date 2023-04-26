import { Stopwatch } from './stopwatch';
import { AnimationTimer } from './animation-timer';
import { Easings } from './easings';
import { Utilities } from './utilities';
import { Points } from './points';
import { Grid } from './grid';
import { Vector } from './vector';

export class Sketch {
  constructor(data) {
    this.vector = new Vector();
    this.setupCanvas();
    this.setupEvents();
    
    this.initialize();
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.canvas.ariaLabel = '';
    this.canvas.role = 'img';
    
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.minHeight = '100vh';
    this.canvas.style.minHeight = 'calc(var(--vh, 1vh) * 100)';
    this.canvas.style.display = 'block';
    this.canvas.style.background = '#FAFAFA';
    this.canvas.style.zIndex = '-1';
    
    document.body.appendChild(this.canvas);
  }

  setupEvents() {
    const d = document;
    
    window.addEventListener('resize', this.onResize.bind(this), false);
  }

  onResize() {
    if (this.preWidth === window.innerWidth) {
      this.height = this.canvas.height = window.innerHeight;
      
      return;
    }
    
    this.initialize();
  }

  initialize() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.setupSizes();
    this.setupShapes();
    
    this.time = new Stopwatch();
    this.time.start();
    
    this.render(0);
  }
  
  setupSizes() {
    this.width = this.preWidth = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  setupShapes() {
    this.shapes = [];
    
    const size = 50;
    const hexSize = size;
    const squareSize = hexSize * (1 / Math.sqrt(2));
    const triangleSize = squareSize * (1 / Math.sqrt(2)) * (2 / Math.sqrt(3));

    this.sizes = {
      hex: hexSize,
      square: squareSize,
      triangle: triangleSize
    };

    const params = Grid.hex(this.vector, 50, (hexSize + triangleSize) * 2);

    for (let i = 0; i < params.length; i++) {
      const s = new Shape(this, params[i]);

      this.shapes.push(s);
    }
  }

  render() {
    //const t = this.time.getElapsedTime();
    this.ctx.save();
    //this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.translate(this.width / 2, this.height / 2);
    
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].draw();
    }
    this.ctx.restore();

    //this.animationId = requestAnimationFrame(this.render.bind(this));
  }
}

class Shape {
  constructor(sketch, params) {
    this.sketch = sketch;
    this.ctx = this.sketch.ctx;

    this.vector = params.v;

    this.initialize();
  }

  initialize() {
    this.hexSize = this.sketch.sizes.hex;
    this.squareSize = this.sketch.sizes.square;
    this.triangleSize = this.sketch.sizes.triangle;
    
    this.hex = Points.polygon(this.sketch.vector, 6, 6);
    this.square = Points.polygon(this.sketch.vector, 4, 4);
    this.triangle = Points.polygon(this.sketch.vector, 3, 3);
    
    this.tx = (this.hexSize * (Math.sqrt(3) / 2) + this.squareSize * (1 / Math.sqrt(2))) * (1 / 2); 
    this.ty = (this.hexSize * (Math.sqrt(3) / 2) + this.squareSize * (1 / Math.sqrt(2))) * (Math.sqrt(3) / 2);
    this.dxy = Math.sqrt(this.tx * this.tx + this.ty * this.ty);
  }

  drawShape(points, size) {
    this.ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      if (i === 0) {
        this.ctx.moveTo(points[i].getX() * size, points[i].getY() * size);
      } else {
        this.ctx.lineTo(points[i].getX() * size, points[i].getY() * size);
      }
    }
    this.ctx.closePath();
    //this.ctx.fill();
    this.ctx.stroke();
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.vector.getX(), this.vector.getY());

    // hex
    this.ctx.save();
    this.ctx.rotate(Math.PI / 2);
    this.drawShape(this.hex, this.hexSize);
    this.ctx.restore();
    
    // square
    this.ctx.save();
    this.ctx.translate(this.tx, this.ty);
    this.ctx.rotate(Math.PI / 12);
    this.drawShape(this.square, this.squareSize);
    this.ctx.restore();
    
    this.ctx.save();
    this.ctx.translate(-this.tx, this.ty);
    this.ctx.rotate(-Math.PI / 12);
    this.drawShape(this.square, this.squareSize);
    this.ctx.restore();
    
    this.ctx.save();
    this.ctx.translate(-this.dxy, 0);
    this.ctx.rotate(Math.PI / 4);
    this.drawShape(this.square, this.squareSize);
    this.ctx.restore();

    // triangle
    this.ctx.save();
    this.ctx.translate(0, this.hexSize + this.triangleSize);
    this.ctx.rotate(Math.PI / 6);
    this.drawShape(this.triangle, this.triangleSize);
    this.ctx.restore();
    
    this.ctx.save();
    this.ctx.translate(-this.dxy, this.dxy * (2 / Math.sqrt(3) * (1 / 2)));
    this.ctx.rotate(-Math.PI / 6);
    this.drawShape(this.triangle, this.triangleSize);
    this.ctx.restore();

    this.ctx.restore();
  }
}
