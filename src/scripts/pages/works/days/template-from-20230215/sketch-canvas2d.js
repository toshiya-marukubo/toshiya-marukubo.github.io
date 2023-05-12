import GUI from 'lil-gui';
import { Stopwatch } from '../template-from-20230215/stopwatch';
import { AnimationTimer } from '../template-from-20230215/animation-timer';
import { Easings } from '../template-from-20230215/easings';
import { Utilities } from '../template-from-20230215/utilities';
import { Points } from '../template-from-20230215/points';
import { Grid } from '../template-from-20230215/grid';
import { Vector } from '../template-from-20230215/vector';

export class Sketch {
  constructor(data) {
    this.vector = new Vector();
    this.setupGUI();
    this.setupCanvas();
    this.setupEvents();
    
    this.initialize();
  }

  setupGUI() {
    this.gui = new GUI();
    
    this.obj = {
      ease: 'easeInOutExpo',
      gridScale: 30
    };

    this.gui.add(this.obj, 'ease', Easings.returnEaseType()).onChange(() => {
      this.initialize();
    });

    this.gui.add(this.obj, 'gridScale', 0, 100, 1).onChange(() => {
      this.initialize();
    });
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

    this.ease = Easings.returnEaseFunc(this.obj.ease);
    
    this.render(0);
  }
  
  setupSizes() {
    this.width = this.preWidth = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  setupShapes() {
    this.shapes = [];
    this.gridScale = this.obj.gridScale;
    //this.size = Math.floor(this.gridScale * Math.sqrt(2) / 2);
    this.size = Math.floor(this.gridScale / 2);
    //this.size = Math.floor(Math.sqrt(3) * this.scale / 2 / 2);

    const params = Grid.square(this.vector, 2, this.gridScale);

    this.maxDist = Grid.maxDist(params);

    for (let i = 0; i < params.length; i++) {
      const s = new Shape(this, params[i]);

      this.shapes.push(s);
    }
  }

  render() {
    //const t = this.time.getElapsedTime();
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.translate(this.width / 2, this.height / 2);
    
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].draw();
    }
    
    this.ctx.restore();

    this.animationId = requestAnimationFrame(this.render.bind(this));
  }
}

class Shape {
  constructor(sketch, params) {
    this.sketch = sketch;
    this.ctx = this.sketch.ctx;
    this.maxDist = this.sketch.maxDist;
    this.size = this.sketch.size;

    this.vector = params.v;
    this.dist = params.d;
    this.index = params.i;

    this.initialize();
  }

  initialize() {
    this.time = new Stopwatch();
    this.time.start();
    this.timeScale = 0.001;
    this.timeNum = 2 + 1;
    
    this.circle = Points.polygon(this.sketch.vector, 36, 36);
  }

  getTime(i) {
    const t = this.time.getElapsedTime() / 1000;
    //const scaledTime = t * this.timeScale - i / this.shapesNum / Math.PI * 2;
    const scaledTime = t - this.dist / this.maxDist / Math.PI * 2;
    //const scaledTime = t * this.timeScale;

    return Math.abs(scaledTime);
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

  updateParams() {
    const t = this.getTime();
    const intT = Math.floor(t % this.timeNum);

    let et, scale;
    switch (intT) {
      case 0:
        et = this.sketch.ease(t % 1);
        scale = Utilities.map(et, 0, 1, 0, 1);

        break;
      
      case 1:
        et = this.sketch.ease(t % 1);
        scale = Utilities.map(et, 0, 1, 1, 1);

        break;
      
      case 2:
        et = this.sketch.ease(t % 1);
        scale = Utilities.map(et, 0, 1, 1, 0);

        break;
      
      default:
        break;
    }

    this.ctx.scale(scale, scale);
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.vector.getX(), this.vector.getY());

    this.updateParams();

    this.drawShape(this.circle, this.size);

    this.ctx.restore();
  }
}
