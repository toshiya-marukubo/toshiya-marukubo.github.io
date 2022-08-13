import SimplexNoise from 'simplex-noise';

export class Sketch {
  constructor() {
    this.setupCanvas();
    this.setupEvents();
    this.initialize();
  }
  
  setupCanvas() {
    document.body.appendChild(document.createElement('canvas'));

    this.canvas = document.getElementsByTagName('canvas')[0];
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.minHeight = '100vh';
    this.canvas.style.minHeight = 'calc(var(--vh, 1vh) * 100)';
    this.canvas.style.background = '#FFF';
    this.canvas.style.zIndex = '-1';
    
    this.ctx = this.canvas.getContext('2d');
  }
  
  setupEvents() {
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('scroll', this.render.bind(this));
  }
  
  onResize() {
    if (this.preWidth === window.innerWidth) {

      return;
    }

    this.preWidth = window.innerWidth;
    
    this.initialize();
  }
  
  initialize() {
    if (this.id) {
      cancelAnimationFrame(this.id);
    }
    
    this.simplex = new SimplexNoise();

    this.rand = Math.random() * 0.01;
    this.width = this.canvas.width = this.preWidth = Math.floor(window.innerWidth);
    this.height = this.canvas.height = Math.floor(window.innerHeight);
    
    this.d = this.ctx.createImageData(this.width, this.height);

    this.render(0);
  }

  updateImageData(t) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const noise = this.simplex.noise3D(x * this.rand, y * this.rand, t * 0.001);
        const i = y * this.width + x;
        const c = x / this.width * 384;

        this.d.data[4 * i + 0] = c;
        this.d.data[4 * i + 1] = c;
        this.d.data[4 * i + 2] = c;
        this.d.data[4 * i + 3] = (255 + (Math.random() * 128)) * noise;
      }
    }
  }
  
  render(t) {
    this.updateImageData(window.pageYOffset);
    this.ctx.putImageData(this.d, 0, 0);
  }
}
