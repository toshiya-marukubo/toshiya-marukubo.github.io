/**
 * main program, shape
 */
class MainProgram {
  /**
   * constructor
   */
  constructor() {
    // set up canvas
    document
      .getElementById("container")
      .appendChild(document.createElement("canvas"));
    this.canvas = document.getElementsByTagName("canvas")[0];
    this.canvas.style.position = 'fixed';
    this.canvas.style.display = 'block';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '-1';
    this.ctx = this.canvas.getContext("2d");
    // instance
    this.Shapes = Shapes; // from other file
    this.dat = new Dat(this); // pass main program
    this.simplex = new SimplexNoise(); 
    // shape
    this.shapesArray = null;
    // parameters
    this.animationId = null;
    this.width = null;
    this.height = null;
    this.diagonal = null;
    this.position = null;
  }

  /**
   * initialize main program
   */
  initialize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.diagonal = Math.sqrt(this.width * this.width + this.height * this.height);
    this.shapesArray = this.lineUp();
  }

  /**
   * shapes line up
   */
  lineUp() {
    const pos = new Array();
    const scale = this.dat.params.common.scaleOne;
    
    if (this.dat.params.lineUp === false) {
      const s = new Shape(this, this.width / 2, this.height / 2);
      pos.push(s);
      return pos;
    } else {
      const yNum = Math.floor(this.height / scale) + 1;
      const xNum = Math.floor(this.width / scale) + 1;
      for (let y = 0; y <= yNum; y++) {
        for (let x = 0; x <= xNum; x++) {
          const s = new Shape(this, x * scale, y * scale);
          pos.push(s);
        }
      }
      return pos;
    }
  }
  
  /**
   * download image data
   */
  downloadImage() {
    const jsImageFrame = document.getElementById('jsImageFrame');
    const donwloadButton = document.getElementById('donwloadButton');
    const displayed = document.getElementsByClassName('displayed');
     
    if (displayed.length) {
      for (let i = 0; i < displayed.length; i++) {
        Utils.deleteDomElement(displayed[i]);
      }
      jsImageFrame.classList.toggle('jsSlideIn');
      return;
    }
    
    const imageLink = document.createElement('a'); 
    const a = document.createElement('a');
    const img = document.createElement('img');
     
    jsImageFrame.classList.toggle('jsSlideIn');
    imageLink.href = this.canvas.toDataURL();
    img.setAttribute('src', imageLink.href);
    a.href = '#';
    a.setAttribute('class', 'displayed');
    a.appendChild(img);
    jsImageFrame.appendChild(a);
    
    displayed[0].addEventListener('click', (e) => {
      e.preventDefault()
      imageLink.download = Date.now() + '.png';
      imageLink.click();
      Utils.deleteDomElement(a);
      jsImageFrame.classList.toggle('jsSlideIn');
    }, false);
  }

  /**
   * remove image
   */
  removeImage() {
    const jsImageFrame = document.getElementById('jsImageFrame');
    const displayed = document.getElementsByClassName('displayed');
     
    if (displayed.length) {
      for (let i = 0; i < displayed.length; i++) {
        Utils.deleteDomElement(displayed[i]);
      }
      jsImageFrame.classList.toggle('jsSlideIn');
    }
  }

  /**
   * add html
   */
  addHtml(str) {
    const jsCodeOne = document.getElementById('jsCodeOne');
    
    jsCodeOne.innerHTML = str;
  }

  /**
   * get code
   */
  getCode(type) {
    const main = document.getElementById('main');
    const options = this.dat.getOptions(this.dat.params.common.type);

    main.classList.toggle('jsShowMain');
    this.addHtml(Utils.getHtml(type, options));
  }

  /**
   * copy code
   */
  copyCode(code) {
    const body = document.getElementsByTagName('body')[0];
    const inputText = document.createElement('input');
    
    inputText.setAttribute('type', 'code');
    body.appendChild(inputText);
    inputText.setAttribute('value', code);
    inputText.select();
    document.execCommand('copy');
    inputText.parentNode.removeChild(inputText);
  }

  /**
   * get background color
   */
  getBackgroundColor(params) {
    let color;
    if (this.dat.params.backgroundColor.on) {
      color = this.dat.params.backgroundColor.color;
    } else {
      color = 'rgba(0, 0, 0, 0)';
    }
    if (params.on) {
      const r = Math.max(this.width / 2, this.height / 2);
      color = 
        getGradientColor(
          this.ctx,
          params.type,
          params.startColor,
          params.endColor,
          params.point,
          this.width / 2,
          this.height / 2,
          r,
          this.width / 2 + r,
          this.height / 2 + r
        );
    }
    
    return color;
  }
  
  /**
   * rendering
   */
  rendering() {
    // draw background color
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.getBackgroundColor(this.dat.params.backgroundGradient);
    this.ctx.save();
    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.rotate(this.dat.params.backgroundGradient.rotationAngle * Math.PI / 180);
    this.ctx.translate(-this.width / 2, -this.height / 2);
    this.ctx.fillRect(
      0 - (this.diagonal - this.width) / 2,
      0 - (this.diagonal - this.height) / 2,
      this.diagonal * 2,
      this.diagonal * 2
    );
    this.ctx.restore();

    // draw shape
    for (let i = 0; i < this.shapesArray.length; i++) {
      this.ctx.save();
      this.ctx.translate(this.shapesArray[i].x, this.shapesArray[i].y);
      this.shapesArray[i].render();
      this.ctx.restore();
    }

    // add effect
    if (this.dat.params.effect.on) {
      const data = Effect.choiseEffect(
        this.dat.params.effect.type,
        this.ctx,
        this.height,
        this.width,
        this.dat.params.effect.numberC,
        this.dat.params.effect.numberD,
        this.dat.params.common.scaleOne,
        this.simplex
      );
      this.ctx.putImageData(data, 0, 0);
    }
    //this.animationId = requestAnimationFrame(() => this.rendering());
  }

  /**
   * Resize
   */
  resize() {
    //cancelAnimationFrame(this.animationId);
    this.initialize();
    this.rendering();
  }
}

class Shape {
  constructor(mainProgram, x, y) {
    this.mainProgram = mainProgram;
    this.ctx = this.mainProgram.ctx;
    this.x = x;
    this.y = y;
    this.Shapes = null;
    this.dat = null;
    this.init();
  }

  init() {
    this.Shapes = this.mainProgram.Shapes;
    this.dat = this.mainProgram.dat;
  }
  
  /**
   * choise shape
   * @param {String} type - params.common.type
   */
  choiseShape(type) {
    const options = this.dat.getOptions(type);
    switch (type) {
      case 'circle':
        this.Shapes.circle(options);
        break;
      case 'ellipse':
        this.Shapes.ellipse(options);
        break;
      case 'text':
        this.Shapes.text(options);
        break;
      case 'lemniscate':
        this.Shapes.lemniscate(options);
        break;
      case 'rectangle':
        this.Shapes.rectangle(options);
        break;
      case 'astroid':
        this.Shapes.astroid(options);
        break;
      case 'polygon':
        this.Shapes.polygon(options);
        break;
      case 'polygonStar':
        this.Shapes.polygonStar(options);
        break;
      case 'sin':
        this.Shapes.sin(options);
        break;
      case 'cos':
        this.Shapes.cos(options);
        break;
      case 'tan':
        this.Shapes.tan(options);
        break;
      case 'heart':
        this.Shapes.heart(options);
        break;
      case 'rose':
        this.Shapes.rose(options);
        break;
      case 'lissajous':
        this.Shapes.lissajous(options);
        break;
      case 'archimedesSpiral':
        this.Shapes.archimedesSpiral(options);
        break;
      case 'fermatSpiral':
        this.Shapes.fermatSpiral(options);
        break;
    }
  }

  render() {
    this.choiseShape(this.dat.params.common.type);
  }
}

/**
 * loading animation
 */
const loadingAnimation = () => {
  const container = document.getElementById('container');
  const jsLoadingFrame = document.getElementById('jsLoadingFrame');
  const jsTexts = document.getElementsByClassName('jsTexts');
  const children = jsTexts[0].children;
  
  setTimeout(() => {
    for (let i = 0; i < children.length; i++) {
      if (i > 7) {
        children[i].classList.add('jsDed');
      }
      setTimeout(() => {
        if (i === 8) children[i].textContent = 'E';
        if (i === 9) children[i].textContent = 'D';
        if (i === 10) children[i].textContent = ' ';
      }, 800);
    }
    for (let i = 0; i < children.length; i++) {
      const closeButton = document.getElementsByClassName('close-button')[0];
      children[i].addEventListener('animationend', () => {
        if (i === 10) {
          container.classList.add('jsShowContainer');
          closeButton.classList.add('showDat');
        }
        jsLoadingFrame.classList.add('jsLoaded');
      });
    }
  }, 4800);
};

/**
 * run this program
 */
(() => {
  window.addEventListener('load', () => {
    console.clear();
    // loading animation
    loadingAnimation();
    
    // start main program
    const jsClose = document.getElementById('jsClose');
    const jsCodeOne = document.getElementById('jsCodeOne');
    const jsAgainButton = document.getElementById('jsAgainButton');
    const mainProgram = new MainProgram();
    
    mainProgram.initialize();
    mainProgram.rendering();

    window.addEventListener('resize', () => {
      mainProgram.resize();
    });

    jsClose.addEventListener('click', (e) => {
      e.preventDefault()
      const main = document.getElementById('main');
      
      main.classList.toggle('jsShowMain');
    }, false);
    
    jsCodeOne.addEventListener('click', (e) => {
      const code = jsCodeOne.textContent;
      const code2 = code.replace(/\s/g, ''); 
      mainProgram.copyCode(code2);
    }, false);

    jsAgainButton.addEventListener('click', (e) => {
      e.preventDefault()
      mainProgram.removeImage();
    }, false);
  });
})();
