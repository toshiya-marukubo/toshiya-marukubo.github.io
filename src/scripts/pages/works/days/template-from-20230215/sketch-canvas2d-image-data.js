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
    this.image = this.ctx.createImageData(this.width, this.height);
  }

  render() {
    const t = this.time.getElapsedTime() / 1000 * 5;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const i = (y * this.width + x) * 4;
        
        this.image.data[i + 0] = 0x00;
        this.image.data[i + 1] = 0x00;
        this.image.data[i + 2] = 0x00;
        this.image.data[i + 3] = (x & y) & (x ^ y) % Math.floor(t % 100) ? 0xff : 0x00;
      }
    }
    
    this.ctx.putImageData(this.image, 0, 0);
    
    this.animationId = requestAnimationFrame(this.render.bind(this));
  }
}
