import * as dat from 'dat.gui';
import { Ease } from '../../modules/ease';
import { Vector } from '../../modules/vector';
import { Points } from '../../modules/points';
import { Grid } from '../../modules/grid';
import { Utilities } from '../../modules/utilities';
import { Stopwatch } from '../../modules/stopwatch';
//import SimplexNoise from 'simplex-noise';

/**
 * class Sketch
 */
export class Sketch {
  constructor() {
    this.setupGUI();
    this.setupCanvas();
    this.setupEvents();
    this.initialize();
  }

  setupGUI() {
    this.gui = new dat.GUI();

    this.gui.params = {
      timescale: 0.001,
      ease: 'easeInOutCirc',
      shapesNumber: 1,
      gridScale: 200,
      start: () => this.start(),
      stop: () => this.stop()
    };

    this.gui.ctrls = {
      timescale: this.gui.add(this.gui.params, 'timescale', 0.001, 0.01, 0.001)
                   .onChange(() => this.initialize()),
      ease: this.gui.add(this.gui.params, 'ease', Ease.returnEaseType())
              .onChange(() => this.initialize()),
      shapesNumber: this.gui.add(this.gui.params, 'shapesNumber', 1, 20, 1)
                      .onChange(() => this.initialize()),
      gridScale: this.gui.add(this.gui.params, 'gridScale', 1, 1000, 1)
                   .onChange(() => this.initialize()),
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
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.canvas.style.background = '#FFF';
    this.canvas.style.zIndex = '-1'; 
  }

  setupEvents() {
    window.addEventListener('resize', this.onResize.bind(this), false);
  }
  
  onResize() {
    if (this.preWidth === window.innerWidth && window.innerWidth < 480) {
      return;
    }

    this.initialize();
  }

  initialize() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.vector = new Vector();
    this.time = new Stopwatch();
    this.timescale = this.gui.params.timescale;
    this.ease = Ease.returnEaseFunc(this.gui.params.ease);
    
    this.setupSizes();
    this.setupShapes();

    this.draw();
  }

  setupSizes() {
    this.width = this.preWidth = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.scale = this.gui.params.gridScale;

    // choise shape size
    //this.size = Math.floor(this.scale * Math.sqrt(2) / 2);
    this.size = Math.floor(this.scale / 2); // square
    //this.size = Math.floor(Math.sqrt(3) * this.scale / 2 / 2); // hex
    //this.size = Math.floor(this.scale * 0.4 * 2 * Math.PI / this.gui.params.number / 2); // circle
  }

  setupShapes() {
    const params = Grid.square(this.vector, this.gui.params.shapesNumber, this.scale);
    
    this.maxDist = Grid.maxDist(params);
    this.points = {
      a: Points.polygon(this.vector, 360, 36),
      b: Points.polygon(this.vector, 360, 4)
    };
    this.shapesNum = params.length;

    this.shapes = [];
    if (this.gui.params.shapesNumber === 1) {
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

  getTime() {
    this.time.calculateTime();

    return this.time.getElapsedTime() * this.timescale;
  }

  draw() {
    const t = this.getTime();
    
    this.ctx.save(); 
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.translate(this.width / 2, this.height / 2);

    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].render(t);
    }

    this.ctx.restore();
    this.animationId = requestAnimationFrame(this.draw.bind(this));
  }
}

class Shape {
  constructor(sketch, params) {
    this.time = new Stopwatch();
    this.timeNum = 4;
    this.timescale = sketch.timescale;
    
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
    this.time.calculateTime();
    const t = this.time.getElapsedTime();
    //const scaledTime = t * this.timescale - this.index / this.shapesNum / Math.PI * 2;
    const scaledTime = t * this.timescale - i - this.dist / this.maxDist / Math.PI * 2;
    //const scaledTime = t * this.timescale;

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

      case 1:
        et = this.sketch.ease(t % 1);
        
        for (let i = 0; i < pointsA.length; i++) {
          const x = Utilities.map(et, 0, 1, pointsB[i].getX(), pointsA[i].getX());
          const y = Utilities.map(et, 0, 1, pointsB[i].getY(), pointsA[i].getY());

          const v = this.sketch.vector.create(x, y);

          tmp.push(v);
        }

        break;

      case 2:
        et = this.sketch.ease(t % 1);
        
        for (let i = 0; i < pointsA.length; i++) {
          const x = Utilities.map(et, 0, 1, pointsA[i].getX(), pointsB[i].getX());
          const y = Utilities.map(et, 0, 1, pointsA[i].getY(), pointsB[i].getY());

          const v = this.sketch.vector.create(x, y);

          tmp.push(v);
        }

        break;

      case 3:
        et = this.sketch.ease(t % 1);
        
        for (let i = 0; i < pointsA.length; i++) {
          const x = Utilities.map(et, 0, 1, pointsB[i].getX(), pointsA[i].getX());
          const y = Utilities.map(et, 0, 1, pointsB[i].getY(), pointsA[i].getY());

          const v = this.sketch.vector.create(x, y);

          tmp.push(v);
        }

        break;

      default:

        break;
    }

    return tmp;
  }

  render() {
    this.ctx.save();
    this.ctx.translate(this.vector.getX(), this.vector.getY());
    this.ctx.lineWidth = 1;
    
    for (let i = 0; i < 10; i++) {
      const t = this.getTime(i / 10);
      const intT = Math.floor(t % this.timeNum);
      const newPoints = this.getNewPoints(intT, t, this.points.a, this.points.b);

      let et, scale = 1, rotate = 0;
      switch (intT) {
        case 0:
          et = this.sketch.ease(t % 1);
          scale = Utilities.map(et, 0, 1, 1, 1.1);

          break;

        case 1:
          et = this.sketch.ease(t % 1);
          rotate = Utilities.map(et, 0, 1, 0, Math.PI / 4);
          scale = Utilities.map(et, 0, 1, 1.1, 1);

          break;

        case 2:
          et = this.sketch.ease(t % 1);
          rotate = Math.PI / 4;
          scale = 1;

          break;

        case 3:
          et = this.sketch.ease(t % 1);
          rotate = Utilities.map(et, 0, 1, Math.PI / 4, Math.PI / 2);
          scale = 1;

          break;

        default:
          break;
      }

      this.ctx.save();
      this.ctx.scale(scale, scale);
      this.ctx.rotate(rotate);
      this.drawShape(newPoints, this.size * i / 10, 1);
      this.ctx.restore();
    }

    this.ctx.restore();
  }
}
