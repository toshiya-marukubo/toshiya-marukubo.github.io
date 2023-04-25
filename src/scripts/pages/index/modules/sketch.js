import { Stopwatch } from './stopwatch';
import { AnimationTimer } from './animation-timer';
import { Easings } from './easings';
import { Utilities } from './utilities';
import { Vector } from './vector';
import { Iframe } from './iframe';
import { Loading } from './loading';

export class Sketch {
  constructor(data) {
    this.data = data;
    this.vector = new Vector();
    this.iframe = new Iframe();

    this.getElements();
    this.setupCanvas();
    this.setupEvents();
    this.initialize();
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.canvas.ariaLabel = 'This is images gallery.';
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
    //this.canvas.style.filter = 'grayscale(100%)';
    this.canvas.style.cursor = 'zoom-in';
    
    document.body.appendChild(this.canvas);

    // picture
    this.canvas2 = document.createElement('canvas');
    this.ctx2 = this.canvas2.getContext('2d');

    this.canvas2.ariaLabel = 'This is images gallery.';
    this.canvas2.role = 'img';
    
    this.canvas2.style.top = '0';
    this.canvas2.style.left = '0';
    this.canvas2.style.width = '100%';
    this.canvas2.style.height = '100%';
    this.canvas2.style.display = 'block';
    this.canvas2.style.background = '#FAFAFA';
    this.canvas2.style.cursor = 'zoom-in';

    this.canvas2.width = 256;
    this.canvas2.height = 64;

    this.pictureElement.appendChild(this.canvas2);

    this.pic = new Image();
    this.pic.src = '../dist/assets/images/pic.png';
    
    this.offCanvas = document.createElement('canvas');
    this.offCtx = this.offCanvas.getContext('2d');

    this.pic.addEventListener('load', () => {
      const width = this.offCanvas.width = 256;
      const height = this.offCanvas.height = 64;

      this.offCtx.drawImage(this.pic, 0, 0, width, height);

      const data = this.offCtx.getImageData(0, 0, width, height);

      this.imageData = data;
      this.newData = this.ctx2.createImageData(width, height);
    });
  }

  drawPic(t) {
    if (!this.imageData) return;

    t *= 0.002;
    this.newData2 = this.ctx2.createImageData(this.imageData.width, this.imageData.height);

    for (let y = 0; y < this.imageData.height; y++) {
      const offset = Math.floor(Math.tan(y * (t % 3.0 * Math.PI / 180) + t) * Math.tan(t) * t % 30 * Math.random());
      for (let x = 0; x < this.imageData.width; x++) {
        const k = (y * this.imageData.width + x) * 4;
        const s = (y * this.imageData.width + x + offset) * 4;

        this.newData2.data[k + 0] = this.imageData.data[s + 0];
        this.newData2.data[k + 1] = this.imageData.data[s + 1];
        this.newData2.data[k + 2] = this.imageData.data[s + 2];
        this.newData2.data[k + 3] = this.imageData.data[s + 3];
      }
    }

    for (let y = 0; y < this.imageData.height; y++) {
      for (let x = 0; x < this.imageData.width; x++) {
        const k = (y * this.imageData.width + x) * 4;
        
        this.newData.data[k + 0] = 255 * this.imageData.data[k + 0] / 0xff;
        this.newData.data[k + 1] = 255 * this.newData2.data[k + 1] / 0xff;
        this.newData.data[k + 2] = 255 * this.newData2.data[k + 2] / 0xff;
        this.newData.data[k + 3] = this.imageData.data[k + 3];
      }
    }

    this.ctx2.putImageData(this.newData, 0, 0);
  }

  getElements() {
    this.resetElement = document.getElementsByClassName('js-reset')[0];
    this.aboutElement = document.getElementsByClassName('js-about')[0]; 
    this.smileElement = document.getElementsByClassName('js-smile')[0];

    this.iframeCloseButton = document.getElementsByClassName('iframe-closeButton')[0];

    this.pictureElement = document.getElementsByClassName('js-picture')[0]; 
  }

  setupEvents() {
    const d = document;
    
    window.addEventListener('resize', this.onResize.bind(this), false);
    
    d.addEventListener('wheel', this.onWheel.bind(this), false);
    d.addEventListener('click', this.onClick.bind(this), false);
    d.addEventListener('touchstart', this.onTouchstart.bind(this), { passive: true });
    d.addEventListener('touchmove', this.onTouchmove.bind(this), false);
    d.addEventListener('touchend', this.onTouchend.bind(this), false);

    const click = new Event('click');
    d.addEventListener('keydown', (e) => {
      if (this.state === 'about') {
        this.terminal.setupFadeOutAnimation();

        this.smileElement.classList.add('smile-displayed');
        this.aboutElement.classList.remove('show');

        Utilities.delay(800).then(() => {
          this.initialize();
        });
      }
      
      if(e.key === 'Escape' && this.iframe.isDisplaying()){
        this.iframeCloseButton.dispatchEvent(click);
        this.onClick();
      }
    }, false);
    
    this.canvas.addEventListener('mousemove', this.onMousemove.bind(this), false);
    this.resetElement.addEventListener('click', this.onClickResetElement.bind(this), false);
    this.aboutElement.addEventListener('click', this.onClickAboutElement.bind(this), false);

    this.iframeCloseButton.addEventListener('click', this.onClickCloseButton.bind(this), false);
    
    this.smileElement.addEventListener('animationend', (e) => {
      if (e.animationName === 'smile-second-animation') {
        this.smileElement.classList.remove('smile-displayed');
      }
    }, false);
  }

  onClickCloseButton() {
    this.isAnimation = true;

    Utilities.delay(1600).then(() => {
      this.isAnimation = false;
    });
  }

  onClickResetElement(e) {
    e.preventDefault();
    e.stopPropagation();

    this.isAnimation = true;

    if (this.state === 'about') {
      this.terminal.setupFadeOutAnimation();

      this.smileElement.classList.add('smile-displayed');
      this.aboutElement.classList.remove('show');

      Utilities.delay(800).then(() => {
        this.initialize();
      });

      return;
    }

    Utilities.delay(2400).then(() => {
      this.isAnimation = false;
    });

    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].changeMotionType('second');
      this.shapes[i].resetTimer();
    }
  }

  onClickAboutElement(e) {
    e.preventDefault();
    e.stopPropagation();
    
    this.isAnimation = true;

    this.aboutElement.classList.add('show');

    let delayNumber = 1200;

    if (this.state === 'about') {
      this.terminal.setupFadeOutAnimation();

      this.smileElement.classList.add('smile-displayed');
      this.aboutElement.classList.remove('show');

      delayNumber = 800;
    }

    Utilities.delay(delayNumber).then(() => {
      if (this.state === 'about') {
        this.initialize();

        return;
      } else {
        this.state = 'about';

        this.terminal.animationTimer.start();
      }
    });
    
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].changeMotionType('fourth');
      this.shapes[i].resetTimer();
    }
  }

  onClick(e) {
    if (this.isRendering) {
      if (this.isAnimation === true) {
        return;
      }

      this.isRendering = false;

      for (let i = 0; i < this.shapes.length; i++) {
        const s = this.shapes[i];

        if (this.isHovered(s, this.vectors.mouse.getX(), this.vectors.mouse.getY())) {
          this.iframe.addIframe(e, s.data);
          
          break;
        }
      }

      cancelAnimationFrame(this.animationId);
    } else {
      if (this.iframe.isDisplaying()) {
        return;
      }
      
      this.isRendering = true;
       
      this.render(0);
    }
  }

  onMousemove(e) {
    this.vectors.mouse.setX(e.clientX / this.width * this.width - this.width / 2);
    this.vectors.mouse.setY(e.clientY / this.height * this.height - this.height / 2);
  }

  onTouchstart(e) {
    const t = e.targetTouches[0];
    
    this.vectors.touch.lastMove.setX(t.pageX);
    this.vectors.touch.lastMove.setY(t.pageY);
  }

  onTouchmove(e) {
    if (!this.isRendering) {
      return;
    }
    
    const t = e.targetTouches[0];
    
    this.vectors.mouse.setX(t.pageX / this.width * this.width - this.width / 2);
    this.vectors.mouse.setY(t.pageY / this.height * this.height - this.height / 2);

    this.vectors.touch.move.setX(t.pageX);
    this.vectors.touch.move.setY(t.pageY);

    const v = this.vectors.touch.move.subtract(this.vectors.touch.lastMove);

    this.vectors.alpha.subtractFrom(v.multiply(0.005));
    
    this.vectors.touch.lastMove.setX(t.pageX);
    this.vectors.touch.lastMove.setY(t.pageY);
  }

  onTouchend(e) {
  }
  
  onResize() {
    if (this.preWidth === window.innerWidth) {
      this.height = this.canvas.height = window.innerHeight;
      
      return;
    }
    
    this.initialize();
  }

  onWheel(e) {
    if (!this.isRendering) {
      return;
    }

    this.vectors.alpha.addTo(this.vector.create(e.deltaX * 0.0005, e.deltaY * 0.0005));

    if (e.deltaY < 0) {
      this.vectors.beta.setY(1);
    } else {
      this.vectors.beta.setY(-1);
    }
  }
  
  initialize() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.aboutElement.classList.remove('show');
    
    this.easeInOutQuint = Easings.returnEaseFunc('easeInOutQuint');

    this.setupSizes();
    this.setupShapes();
    this.iframe.initialize(); 

    this.state = '';
    this.isRendering = true;
    this.isAnimation = true;
    this.preIndex = 0;
    
    this.time = new Stopwatch();
    this.time.start();

    const text = `About Me
    `;

    this.terminal = new Terminal(this.ctx, text, this.width, this.height);
    this.process = new Process(this.ctx, this.radius);
    
    this.vectors = {
      mouse: this.vector.create(0, 0),
      touch: {
        start: this.vector.create(0, 0),
        move: this.vector.create(0, 0),
        lastMove: this.vector.create(0, 0),
      },
      alpha: this.vector.create(0, 0),
      beta: this.vector.create(0, 0),
    };

    this.focus = {
      vector: this.vector.create(0, 0),
      size: this.size
    };

    Utilities.delay(1200).then(() => {
      this.isAnimation = false;
    });

    this.render(0);
  }
  
  setupSizes() {
    this.width = this.preWidth = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  setupShapes() {
    const diagonal = Math.sqrt(this.width * this.width + this.height * this.height);

    this.radius = diagonal / 2;
    this.numberOfShape = 14;
    this.size = this.radius * 2 / (this.numberOfShape / 2);
    this.shapes = [];

    let index = 0;
    for (let y = 0; y < this.numberOfShape; y++) {
      for (let x = 0; x < this.numberOfShape; x++) {
        const randInt = Utilities.randomInt(0, this.data.length - 1);
        const params = {
          x: x,
          y: y,
          i: index++,
          v: this.vector.create(0, 0),
          c: this.ctx,
          s: this.size,
          r: this.radius,
          n: this.numberOfShape,
          d: this.data[randInt],
          a: this.data
        };
        const s = new Shape(params);

        this.shapes.push(s);
      }
    }
  }

  drawFocus(s) {
    const v = s.vector.multiply(this.radius).subtract(this.focus.vector).multiply(0.16);

    this.focus.vector.addTo(v);
    
    this.ctx.save();
    this.ctx.lineWidth = this.size * 0.025;
    this.ctx.strokeRect(this.focus.vector.getX() - this.focus.size / 2, this.focus.vector.getY() - this.focus.size / 2, this.focus.size, this.focus.size);
    this.ctx.restore();
  }
  
  isHovered(shape, x, y) {
    if (
         shape.displayed === true &&
         x > shape.vector.getX() * this.radius - this.size / 2 &&
         x < shape.vector.getX() * this.radius + this.size / 2 &&
         y > shape.vector.getY() * this.radius - this.size / 2 &&
         y < shape.vector.getY() * this.radius + this.size / 2
       ) 
    {
      return true;
    } 
  }

  render(t) {
    if (this.state === 'about') {
      this.terminal.draw();
    } else {
      this.ctx.save();
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.translate(this.width / 2, this.height / 2);

      let hoveredElement;
      for (let i = 0; i < this.shapes.length; i++) {
        const s = this.shapes[i];

        this.shapes[i].draw(this.vectors);
        
        if (this.isHovered(s, this.vectors.mouse.getX(), this.vectors.mouse.getY())) {
          hoveredElement = i;
        }
      }

      if (this.isAnimation === false) {
        this.process.getImageData(this.shapes[hoveredElement || 0], hoveredElement);
        this.process.draw(this.shapes[hoveredElement || 0], this.time.getElapsedTime());
        this.drawFocus(this.shapes[hoveredElement || 0]);
      }

      this.ctx.restore();
    }

    this.drawPic(this.time.getElapsedTime());

    this.animationId = requestAnimationFrame(this.render.bind(this));
  }
}

class Process {
  constructor(ctx, radius) {
    this.ctx = ctx;
    this.scale = 3;
    this.radius = radius;
    this.preIndex = 0;
    this.processTypes = [
      'biribiriHorizontal',
      'biribiriVertical',
      'biyobiyoHorizontal',
      'biyobiyoVertical',
      'noise',
      'mosaic',
      'anaglyph',
    ];

    this.initialize();
  }

  initialize() {
    this.time = new Stopwatch();
    this.time.start();
  }
  
  getImageData(s, i) {
    if (this.offCanvas) {
      this.offCanvas.remove();
    }

    if (i === this.preIndex) {
      return;
    }

    this.offCanvas = document.createElement('canvas');
    this.ctx2 = this.offCanvas.getContext('2d');

    const width = this.offCanvas.width = Math.floor(s.image.width / this.scale);
    const height = this.offCanvas.height = Math.floor(s.image.height / this.scale);

    this.ctx2.drawImage(s.image, 0, 0, width, height);

    const data = this.ctx2.getImageData(0, 0, width, height);

    this.imageData = data;
    this.newData = this.ctx2.createImageData(width, height);

    this.preIndex = i;
    this.processType = this.processTypes[Utilities.randomInt(0, this.processTypes.length - 1)];
  }

  biribiriHorizontal(t) {
    t *= 0.002;

    for (let y = 0; y < this.imageData.height; y++) {
      const g = Math.floor(Math.tan(y * (t % 3.0 * Math.PI / 180) + t) * Math.tan(t) * t % 30 * Math.random());
      
      for (let x = 0; x < this.imageData.width; x++) {
        const i = (y * this.imageData.width + x) * 4;
        const s = (y * this.imageData.width + x + g) * 4;
        
        this.newData.data[i + 0] = this.imageData.data[s + 0];
        this.newData.data[i + 1] = this.imageData.data[s + 1];
        this.newData.data[i + 2] = this.imageData.data[s + 2];
        this.newData.data[i + 3] = 0xff;
      }
    }
    this.ctx2.putImageData(this.newData, 0, 0);
  }

  biribiriVertical(t) {
    t *= 0.002;

    for (let x = 0; x < this.imageData.width; x++) {
      const g = Math.floor(Math.tan(x * (t % 3.0 * Math.PI / 180) + t) * Math.tan(t) * t % 30 * Math.random());
      
      for (let y = 0; y < this.imageData.height; y++) {
        const i = (y * this.imageData.width + x) * 4;
        const s = ((y + g) * this.imageData.width + x) * 4;
        
        this.newData.data[i + 0] = this.imageData.data[s + 0];
        this.newData.data[i + 1] = this.imageData.data[s + 1];
        this.newData.data[i + 2] = this.imageData.data[s + 2];
        this.newData.data[i + 3] = 0xff;
      }
    }
    this.ctx2.putImageData(this.newData, 0, 0);
  }
  
  biyobiyoHorizontal(t) {
    t *= 0.002;

    for (let x = 0; x < this.imageData.width; x++) {
      const g = Math.floor(Math.sin(x * (t % 5.0 * Math.PI / 180) + t) * Math.sin(t) * 50);
      
      for (let y = 0; y < this.imageData.height; y++) {
        const i = (y * this.imageData.width + x) * 4;
        const s = (y * this.imageData.width + x + g) * 4;
        
        this.newData.data[i + 0] = this.imageData.data[s + 0];
        this.newData.data[i + 1] = this.imageData.data[s + 1];
        this.newData.data[i + 2] = this.imageData.data[s + 2];
        this.newData.data[i + 3] = 0xff;
      }
    }
    this.ctx2.putImageData(this.newData, 0, 0);
  }
  
  biyobiyoVertical(t) {
    t *= 0.002;

    for (let y = 0; y < this.imageData.height; y++) {
      const g = Math.floor(Math.sin(y * (t % 5.0 * Math.PI / 180) + t) * Math.sin(t) * 50);
      
      for (let x = 0; x < this.imageData.width; x++) {
        const i = (y * this.imageData.width + x) * 4;
        const s = ((y + g) * this.imageData.width + x) * 4;
        
        this.newData.data[i + 0] = this.imageData.data[s + 0];
        this.newData.data[i + 1] = this.imageData.data[s + 1];
        this.newData.data[i + 2] = this.imageData.data[s + 2];
        this.newData.data[i + 3] = 0xff;
      }
    }
    
    this.ctx2.putImageData(this.newData, 0, 0);
  }
  
  noise(t) {
    for (let x = 0; x < this.imageData.width; x++) {
      for (let y = 0; y < this.imageData.height; y++) {
        //const n = this.simplexNoise.noise3D(x * 0.05, y * 0.05, t);
        const i = (x * this.imageData.height + y) * 4;
        const n = Math.random();
        
        this.newData.data[i + 0] = this.imageData.data[i + 0] * n;
        this.newData.data[i + 1] = this.imageData.data[i + 1] * n;
        this.newData.data[i + 2] = this.imageData.data[i + 2] * n;
        this.newData.data[i + 3] = 0xff;
      }
    }
    this.ctx2.putImageData(this.newData, 0, 0);
  }

  mosaic(t) {
    t *= 0.002;

    for (let x = 0; x < this.imageData.width; x++) {
      const g = Math.floor(Math.tan(x * (t % 3.0 * Math.PI / 180) + t) * Math.tan(t) * t % 30 * Math.random());
      
      for (let y = 0; y < this.imageData.height; y++) {
        const blockSize = Math.floor(Math.sin(y * 0.01 - t) * 10);
        const i = (x * this.imageData.height + y) * 4;
        const nx = Math.floor(x / blockSize) * blockSize + blockSize / 2;
        const ny = Math.floor(y / blockSize) * blockSize + blockSize / 2;
        const floorIndex = (nx * this.imageData.width + ny) * 4;

        this.newData.data[i + 0] = this.imageData.data[floorIndex];
        this.newData.data[i + 1] = this.imageData.data[floorIndex + 1];
        this.newData.data[i + 2] = this.imageData.data[floorIndex + 2];
        this.newData.data[i + 3] = this.imageData.data[floorIndex + 3];
      }
    }
    this.ctx2.putImageData(this.newData, 0, 0);
  }

  anaglyph(t) {
    t *= 0.002;
    this.newData2 = this.ctx2.createImageData(this.imageData.width, this.imageData.height);

    for (let y = 0; y < this.imageData.height; y++) {
      const offset = Math.floor(Math.tan(y * (t % 3.0 * Math.PI / 180) + t) * Math.tan(t) * t % 3 * Math.random());
      for (let x = 0; x < this.imageData.width; x++) {
        const k = (y * this.imageData.width + x) * 4;
        const s = (y * this.imageData.width + x + offset) * 4;

        this.newData2.data[k + 0] = this.imageData.data[s + 0];
        this.newData2.data[k + 1] = this.imageData.data[s + 1];
        this.newData2.data[k + 2] = this.imageData.data[s + 2];
        this.newData2.data[k + 3] = this.imageData.data[s + 3];
      }
    }

    for (let y = 0; y < this.imageData.height; y++) {
      for (let x = 0; x < this.imageData.width; x++) {
        const k = (y * this.imageData.width + x) * 4;
        
        this.newData.data[k + 0] = 255 * this.imageData.data[k + 0] / 0xff;
        this.newData.data[k + 1] = 255 * this.newData2.data[k + 1] / 0xff;
        this.newData.data[k + 2] = 255 * this.newData2.data[k + 2] / 0xff;
        this.newData.data[k + 3] = this.imageData.data[k + 3];
      }
    }
    this.ctx2.putImageData(this.newData, 0, 0);
  }

  selectUpdateParams(processType, t) {
    switch (processType) {
      case 'biribiriHorizontal':
        this.biribiriHorizontal(t);
        
        break;
      case 'biribiriVertical':
        this.biribiriVertical(t);
        
        break;
      case 'biyobiyoHorizontal':
        this.biyobiyoHorizontal(t);
        
        break;
      case 'biyobiyoVertical':
        this.biyobiyoVertical(t);
        
        break;
      case 'noise':
        this.noise(t);
        
        break;
      case 'mosaic':
        this.mosaic(t);
        
        break;
      case 'anaglyph':
        this.anaglyph(t);
        
        break;
      default:

        break;
    }
  }

  draw(s, t) {
    this.selectUpdateParams(this.processType, this.time.getElapsedTime());
    //this.selectUpdateParams('anaglyph', this.time.getElapsedTime());

    const x = Math.floor(s.vector.getX() * this.radius - s.size / 2);
    const y = Math.floor(s.vector.getY() * this.radius - s.size / 2);

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.scale(this.scale, this.scale); 
    this.ctx.translate(-x, -y);
    this.ctx.drawImage(
      this.offCanvas, x, y
    );
    this.ctx.restore();
  }
}

class Shape {
  constructor(params) {
    this.ctx = params.c;
    this.xIndex = params.x;

    this.yIndex = params.y;

    if (this.xIndex % 2 === 0) {
      this.yIndex += 0.5;
    }
    this.index = params.i;
    this.vector = params.v;
    this.scale = params.r;
    this.numberOfShape = params.n;
    this.size = params.s * 0.95;
    this.data = params.d;
    this.datas = params.a;
    
    this.image = new Image();
    this.image.src = this.data.imagePath;
    this.image.width = this.size;
    this.image.height = this.size;

    this.alpha = 1;
    this.beta = 0;
    this.gamma = 1;
    this.delta = 0;

    this.moveType = 'first';
    this.displayed = true;

    this.time = new Stopwatch();
    this.time.start();
    
    this.easeInOutQuint = Easings.returnEaseFunc('easeInOutQuint');
    this.duration = 1000;
    this.animationTimer = new AnimationTimer(new Stopwatch(), this.duration, this.easeInOutQuint);
    this.animationTimer.start();

    this.initialize();
  }

  shuffle() {
    this.resetTimer();

    const randInt = Utilities.randomInt(0, this.datas.length - 1);
    
    this.data = this.datas[randInt];
    this.image = new Image();
    this.image.src = this.data.imagePath;
    this.image.width = this.size;
    this.image.height = this.size;
    
    this.beta = 1;
  }

  changeMotionType(type) {
    this.moveType = type;
  }

  initialize() {
    this.xRadian = Math.PI * 2 / this.numberOfShape * this.xIndex;
    this.yRadian = Math.PI * 2 / this.numberOfShape * this.yIndex;
  }

  updateParamsFirst(data) {
    this.alpha = this.easedDist();
    
    const delay = this.index * 5;
    const elapsedTime = this.animationTimer.getElapsedTime(delay) / this.duration;

    if (this.animationTimer.isOver(delay)) {
      this.animationTimer.stop();
      this.beta = 1;
    } else {
      this.beta = elapsedTime;
    }

    this.vector.setX((Math.acos(Math.cos(this.xRadian - data.alpha.getX())) * this.beta / (Math.PI / 2) - 1));
    this.vector.setY(Math.asin(Math.sin(this.yRadian + data.alpha.getY())) / (Math.PI / 2));
  }

  updateParamsSecond(data) {
    this.alpha = this.easedDist();
    
    const delay = this.vector.subtract(this.vector.create(0, 0)).getLength() * 100;
    const elapsedTime = this.animationTimer.getElapsedTime(Math.min(delay, 1)) / this.duration;

    if (this.animationTimer.isOver(delay)) {
      this.animationTimer.stop();
      this.gamma = 0;
      this.shuffle();
      this.moveType = 'third';
    } else {
      this.gamma = 1 - elapsedTime;
    }

    this.vector.setX((Math.acos(Math.cos(this.xRadian - data.alpha.getX())) * this.beta / (Math.PI / 2) - 1));
    this.vector.setY(Math.asin(Math.sin(this.yRadian + data.alpha.getY())) / (Math.PI / 2));
  }

  updateParamsThird(data) {
    this.alpha = this.easedDist();
    
    const delay = this.vector.subtract(this.vector.create(0, 0)).getLength() * 100;
    const elapsedTime = this.animationTimer.getElapsedTime(Math.min(delay, 1)) / this.duration;

    if (this.animationTimer.isOver(delay)) {
      this.animationTimer.stop();
      this.gamma = 1;
      this.beta = 1;
    } else {
      this.gamma = elapsedTime;
    }

    this.vector.setX((Math.acos(Math.cos(this.xRadian - data.alpha.getX())) * this.beta / (Math.PI / 2) - 1));
    this.vector.setY(Math.asin(Math.sin(this.yRadian + data.alpha.getY())) / (Math.PI / 2));
  }
  
  updateParamsFourth(data) {
    this.alpha = this.easedDist();
    
    const delay = 0;
    const elapsedTime = this.animationTimer.getElapsedTime(delay) / this.duration;

    if (this.animationTimer.isOver(delay)) {
      this.animationTimer.stop();
    } else {
      this.beta = 1 - elapsedTime;
    }

    this.vector.setX((Math.acos(Math.cos(this.xRadian - data.alpha.getX())) * this.beta / (Math.PI / 2) - 1));
    this.vector.setY(Math.asin(Math.sin(this.yRadian + data.alpha.getY())) / (Math.PI / 2));
  }

  selectUpdateParams(data, moveType) {
    switch (moveType) {
      case 'first':
        this.updateParamsFirst(data);
        
        break;
      case 'second':
        this.updateParamsSecond(data);

        break;
      case 'third':
        this.updateParamsThird(data);

        break;
      case 'fourth':
        this.updateParamsFourth(data);

        break;
      default:

        break;
    }
  }

  resetTimer() {
    this.animationTimer.reset();
    this.animationTimer.start();
  }

  easedDist() {
    let tmp;
    tmp = this.vector.getLength();
    tmp = this.ease(tmp);
    tmp = 1 - Math.min(tmp, 1);

    return tmp;
  }

  ease(t) {
    return Math.min(t * t * t, 1);
  }

  isDisplayed(data) {
    const x = (Math.asin(Math.sin(this.xRadian - data.alpha.getX())) / (Math.PI / 2));
    const y = (Math.acos(Math.cos(this.yRadian + data.alpha.getY())) / (Math.PI / 2) - 1);

    if (x < 0 || y < 0) {
      return true;
    }
  }

  draw(data, moveType) {
    this.selectUpdateParams(data, this.moveType);

    if (this.isDisplayed(data)) {
      this.displayed = false;
      
      return;
    }

    this.displayed = true;

    this.ctx.save();
    
    this.ctx.translate(Math.floor(this.vector.getX() * this.scale), Math.floor(this.vector.getY() * this.scale));
    this.ctx.scale(this.gamma, this.gamma);
    this.ctx.rotate(Math.PI * 2 * this.beta);
    this.ctx.globalAlpha = this.alpha;
    
    this.ctx.drawImage(
      this.image,
      -this.size / 2,
      -this.size / 2,
      this.size,
      this.size,
    );
    
    this.ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);

    this.ctx.restore();
  }
}

class Terminal {
  constructor(ctx, texts, width, height) {
    this.textsArr = texts.split('\n');
    this.width = width;
    this.height = height;
    
    this.initialize(ctx);
  }

  initialize(ctx, texts) {
    this.ctx = ctx;
    this.col = 0;
    this.row = 0;
    this.maxLength = this.getMaxLength();
    this.size = this.width / this.maxLength / 2;
    this.curHeight = Math.max(this.size * (this.textsArr.length + 1), this.height);
    this.easeInOutQuint = Easings.returnEaseFunc('easeInOutQuint');
    this.duration = 800;
    this.animationTimer = new AnimationTimer(new Stopwatch(), this.duration, this.easeInOutQuint);
    this.stopwatch = new Stopwatch();
    this.stopwatch.start();
    this.fadeOut = false;

    this.ga = 1;
  }

  getMaxLength() {
    let tmp = 0;
    for (let i = 0; i < this.textsArr.length; i++) {
      const num = Math.max(this.textsArr[i].length, tmp);

      tmp = num;
    }

    return tmp;
  }

  draw() {
    if (this.animationTimer.isOver(0)) {
      this.animationTimer.stop();
    }
    
    this.ctx.textBaseline = 'top';
    this.ctx.font = this.size * 0.8 + 'px Montserrat';

    if (this.fadeOut) {
      this.fadeOutAnimation();
    }

    this.ctx.clearRect(0, 0, this.width, this.curHeight);
    
    for (let i = 0; i < this.textsArr.length; i++) {
      let text = this.textsArr[i];

      if (i <= this.row) {
        if (i === this.row) {
          text = text.substring(0, this.col);
        }

        this.ctx.fillText(text, this.size, i * this.size + this.size);
      }
    }

    if (this.row === this.textsArr.length - 1 || this.animationTimer.isRunning() === true) {
      this.ctx.save();
      
      this.ctx.globalAlpha = Math.sin(this.stopwatch.getElapsedTime() * 0.005) * this.ga;
      
      this.ctx.fillRect(
        this.ctx.measureText(this.textsArr[this.row].substring(0, this.col)).width + this.size,
        this.row * this.size + this.size,
        this.size / 4,
        this.size * 0.8
      );

      if (this.animationTimer.isRunning() === false) {

        if (Math.random() < 0.9) {
          this.ctx.restore();
          
          return;
        }

        const newText = this.generateIntroduction();

        this.textsArr.push(newText);
        this.curHeight = Math.max(this.size * (this.textsArr.length + 1), this.height);
      }
      
      this.ctx.restore();
      
      return;
    }

    this.ctx.fillRect(
      this.ctx.measureText(this.textsArr[this.row].substring(0, this.col)).width + this.size,
      this.row * this.size + this.size,
      this.size / 4,
      this.size * 0.8
    );

    if (Math.random() < 0.8) this.col++;

    if (this.col >= this.textsArr[this.row].length) {
      this.row++;
      this.col = 0;

      if (this.row * this.size > this.height - this.size * 2) {
        this.ctx.translate(0, -this.size);
      }
    }
  }

  fadeOutAnimation() {
    const elapsedTime = this.animationTimer.getElapsedTime() / this.duration;

    if (this.animationTimer.isOver(0)) {
      this.animationTimer.stop();
      this.ctx.globalAlpha = 0;
    } else {
      this.ctx.globalAlpha = this.ga = 1 - elapsedTime;
    }
  }

  setupFadeOutAnimation() {
    this.fadeOut = true;
    this.animationTimer.reset();
    this.animationTimer.start();
  }

  generateIntroduction() {
    let tmp = '';
    let randomNumber = Utilities.randomInt(0, this.maxLength * 3);
   
    for (let i = 0; i < randomNumber; i++) {
      let text = String.fromCodePoint(Utilities.randomInt(0, 0xFFFF));
      
      if (i !== 0 && Math.random() < 0.5) {
        text = ' ';
      }

      tmp += text;
    }

    return tmp;
  }
}
