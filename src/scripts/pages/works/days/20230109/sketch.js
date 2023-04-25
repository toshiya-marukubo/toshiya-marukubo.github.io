import * as dat from 'dat.gui';
import { Easings } from '../../../index/modules/easings';
import { Vector } from '../../../index/modules/vector';
import { Points } from '../../../index/modules/points';
import { Grid } from '../../../index/modules/grid';
import { Utilities } from '../../../index/modules/utilities';
import { Stopwatch } from '../../../index/modules/stopwatch';
//import SimplexNoise from 'simplex-noise';

/**
 * class Sketch
 */
export class Sketch {
  constructor() {
    this.vector = new Vector();

    this.setupGUI();
    this.setupCanvas();
    this.setupEvents();
    this.initialize();
  }

  setupGUI() {
    this.gui = new dat.GUI();

    this.gui.params = {
      timeScale: 0.0008,
      ease: 'easeInSine',
      numberOfShapes: 4,
      scale: Math.min(window.innerWidth / 10, window.innerHeight / 10),
      start: () => this.start(),
      stop: () => this.stop()
    };

    this.gui.ctrls = {
      timeScale: this.gui.add(this.gui.params, 'timeScale', 0.0001, 0.01, 0.0001).onChange(() => this.initialize()),
      ease: this.gui.add(this.gui.params, 'ease', Easings.returnEaseType()).onChange(() => this.initialize()),
      numberOfShapes: this.gui.add(this.gui.params, 'numberOfShapes', 1, 20, 1).onChange(() => this.initialize()),
      scale: this.gui.add(this.gui.params, 'scale', 1, 1000, 1).onChange(() => this.initialize()),
      start: this.gui.add(this.gui.params, 'start'),
      stop: this.gui.add(this.gui.params, 'stop')
    };

    this.gui.hide();
  }
  
  start() {
    this.initialize();
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.canvas.ariaLabel = 'The squares are rotating and scaling.';
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

    this.time = new Stopwatch();
    this.time.start();

    this.timeScale = this.gui.params.timeScale;
    this.ease = Easings.returnEaseFunc(this.gui.params.ease);
    
    this.setupSizes();
    this.setupShapes();

    this.render();
  }

  setupSizes() {
    this.width = this.preWidth = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.scale = this.gui.params.scale;

    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;

    this.gui.params.scale = Math.min(window.innerWidth / 10, window.innerHeight / 10);

    // choise shape size
    this.size = Math.floor(this.scale * Math.sqrt(2) / 2);
    this.size2 = Math.floor(this.scale / 2);
    //this.size = Math.floor(Math.sqrt(3) * this.scale / 2 / 2);
    //this.size = Math.floor(this.scale * 0.4 * 2 * Math.PI / this.gui.params.number / 2);
  }

  setupShapes() {
    const params = Grid.square(this.vector, this.gui.params.numberOfShapes, this.scale);
    
    this.maxDist = Grid.maxDist(params);
    this.shapesNum = params.length;
    this.points = {
      a: Points.polygon(this.vector, 36, 4),
    };

    this.shapes = [];
    
    if (this.gui.params.numberOfShapes === 1) {
      const tmp = {
        v: this.vector.create(0, 0),
        d: Number.MIN_VALUE,
        i: 0
      };

      const s = new Shape(this, tmp);
      
      this.shapes.push(s);

      return;
    }

    for (let i = 0; i < params.length; i++) {
      const s = new Shape(this, params[i]);
      
      this.shapes.push(s);
    }
  }

  render() {
    const t = this.time.getElapsedTime() * this.timeScale;
    
    this.ctx.save(); 
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.translate(this.width / 2, this.height / 2);

    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].draw(t);
    }

    this.ctx.restore();
    this.animationId = requestAnimationFrame(this.render.bind(this));
  }
}

class Shape {
  constructor(sketch, params) {
    this.time = new Stopwatch();
    this.time.start();
    this.timeNum = 4;
    this.timeScale = sketch.timeScale;
    
    this.sketch = sketch;
    this.ctx = sketch.ctx;
    this.points = sketch.points;
    this.maxDist = sketch.maxDist;
    this.shapesNum = sketch.shapesNum;
    this.size = sketch.size;
    
    this.vector = params.v;
    this.dist = params.d;
    this.index = params.i;
  }

  getTime(i) {
    const t = this.time.getElapsedTime();
    //const scaledTime = t * this.timeScale - this.index / this.shapesNum / Math.PI * 2;
    const scaledTime = t * this.timeScale - this.dist / this.maxDist / Math.PI * 2;
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

  drawPoints(points, size, pointSize) {
    for (let i = 0; i < points.length; i++) {
      const nx = points[i].getX() * size;
      const ny = points[i].getY() * size;

      this.ctx.beginPath();
      this.ctx.arc(nx, ny, pointSize, 0, Math.PI * 2, false);
      this.ctx.fill();
      //this.ctx.stroke();
    }
  }

  drawTrailLine(t, points, size) {
    const index = Math.floor(Utilities.map(t, 0, 1, 0, points.length - 1));
    const endex = Math.ceil(Utilities.map(t, 0, 1, index + 1, points.length - 1));

    this.ctx.beginPath();
    this.ctx.moveTo(points[index].getX() * size, points[index].getY() * size);
    for (let i = index; i < endex; i++) {
      const p = points[i];

      this.ctx.lineTo(p.getX() * size, p.getY() * size);
    }
    this.ctx.stroke();
  }

  getNewPoints(intT, t, pointsA, pointsB) {
    let tmp = [];

    let et;
    switch (intT) {
      case 0:
        et = this.sketch.ease(t % 1);
        
        for (let i = 0; i < pointsA.length; i++) {
          const x = Utilities.map(et, 0, 1, pointsA[i].getX(), pointsB[i].getX());
          const y = Utilities.map(et, 0, 1, pointsA[i].getY(), pointsB[i].getY());

          const v = this.sketch.vector.create(x, y);

          tmp.push(v);
        }

        break;

      default:
        break;
    }

    return tmp;
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.vector.getX(), this.vector.getY());
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = 1;
    
    const t = this.getTime(this.index);
    const intT = Math.floor(t % this.timeNum);

    let et, size, rotate;
    switch (intT) {
      case 0:
        et = this.sketch.ease(t % 1);
        size = Utilities.map(et, 0, 1, this.sketch.size2, this.sketch.size);
        rotate = Utilities.map(et, 0, 1, 0, Math.PI / 4);

        break;
      
      case 1:
        et = this.sketch.ease(t % 1);
        size = Utilities.map(et, 0, 1, this.sketch.size, this.sketch.size);
        rotate = Utilities.map(et, 0, 1, Math.PI / 4, Math.PI / 4);

        break;
      
      case 2:
        et = this.sketch.ease(t % 1);
        size = Utilities.map(et, 0, 1, this.sketch.size, this.sketch.size2);
        rotate = Utilities.map(et, 0, 1, Math.PI / 4, Math.PI / 4 * 2);
        
        break;

      case 3:
        et = this.sketch.ease(t % 1);
        size = Utilities.map(et, 0, 1, this.sketch.size2, this.sketch.size2);
        rotate = Utilities.map(et, 0, 1, Math.PI / 4 * 2, Math.PI / 4 * 2);
        
        break;
        
      default:
        break;
    }

    this.ctx.rotate(rotate);
    this.drawShape(this.points.a, size);

    this.ctx.restore();
  }
}
