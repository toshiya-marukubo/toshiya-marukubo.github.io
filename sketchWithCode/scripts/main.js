/** Class main program, Class shape */
class MainProgram {
  /**
   * constructor
   */
  constructor() {
    /** set up canvas */
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
    
    /** create instance */
    this.Shapes = Shapes; // from other file
    this.dat = new Dat(this); // pass main program
    this.simplex = new SimplexNoise(); // use at effect 
    
    /** shape array */
    this.shapesArray = null;
    
    /** parameters */
    this.animationId = null;
    this.width = null;
    this.height = null;
    this.diagonal = null;
    this.override = false;
    
    /** image */
    this.image = null;
  }

  /**
   * initialize main program
   */
  initialize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.diagonal = Math.sqrt(this.width * this.width + this.height * this.height);
  }

  /**
   * line up shapes
   * @param {string} type - line up type
   * @return {array} pos - array included shape
   */
  lineUp(type) {
    let pos = new Array();
    const scale = this.dat.params.common.scaleOne;
    
    /** put shape to center */
    if (this.dat.params.lineUp.on === false) {
      const arr = new Array();
      const s = new Shape(this, this.width / 2, this.height / 2);
      
      arr.push(s);
      pos = arr;
      
      return pos;
    }

    /** from LineUp class */
    pos = LineUp.arrangement(type, this, scale);

    return pos;
  }

  /**
   * download image data
   */
  downloadImage() {
    const jsImageFrame = document.getElementById('jsImageFrame');
    const donwloadButton = document.getElementById('donwloadButton');
    const displayed = document.getElementsByClassName('displayed');
    const fileName = Date.now();
     
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
    a.setAttribute('download', fileName + '.png');
    a.appendChild(img);
    jsImageFrame.appendChild(a);
    
    displayed[0].addEventListener('click', (e) => {
      e.preventDefault();
      imageLink.download = fileName + '.png';
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
   * @param {string}
   */
  addHtml(str) {
    const jsCodeOne = document.getElementById('jsCodeOne');
    
    jsCodeOne.innerHTML = str;
  }

  /**
   * get code (using datInstance file)
   * @param {string} 
   */
  getCode(type) {
    const main = document.getElementById('main');
    const options = this.dat.getOptions(type);

    main.classList.toggle('jsShowMain');
    this.addHtml(Utils.getHtml(type, options));
  }

  /**
   * copy code
   * @param {string}
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
   * load file
   * @param {object} e - event object
   */
  loadFile(e) {
    if (e.target.files.length === 0) return;
    const files = e.target.files;
    const reader = new FileReader();

    reader.readAsDataURL(files[0]);
    reader.addEventListener('load', () => {
      this.loadImage(reader.result);
    }, false);
  }

  loadImage(result) {
    this.image = new Image();
    this.image.src = result;
    this.image.addEventListener('load', () => {
      this.initialize();
      this.rendering();
    }, false);
  }

  /**
   * get background color
   * @param {object} params - background gradient parameters from dat instance
   * @return {string ot object} color - return color string or gradient object 
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
    this.shapesArray = this.lineUp(this.dat.params.lineUp.type);
    this.ctx.save();
    
    /** draw background color */
    this.canvas.style.background = this.dat.params.backgroundColor.color;
    
    if (!this.override) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      /* 
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
      */
    }
    
    /** rotation */
    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.rotate(this.dat.params.frame.angle * Math.PI / 180);
    this.ctx.scale(this.dat.params.frame.scaleX, this.dat.params.frame.scaleY);
    this.ctx.translate(-this.width / 2, -this.height / 2);
    
    /** draw shape */
    for (let i = 0; i < this.shapesArray.length; i++) {
      this.ctx.save();
      this.ctx.translate(this.shapesArray[i].x, this.shapesArray[i].y);
      this.shapesArray[i].render();
      this.ctx.restore();
    }

    /** add effect */
    if (this.dat.params.effect.on) {
      const data = Effect.choiseEffect(
        this.dat.params.effect.type,
        this.ctx,
        this.height,
        this.width,
        this.dat.params.effect.numberC,
        this.dat.params.effect.numberD,
        this.dat.params.common.scaleOne,
        this.simplex,
        this.dat.params.effect.noise,
        this.dat.params.effect.x,
        this.dat.params.effect.y,
        this.dat.params.effect.z
      );
      this.ctx.putImageData(data, 0, 0);
    }
    this.ctx.restore();
  }

  /**
   * Resize
   */
  resize() {
    this.initialize();
    this.rendering();
  }
}

/** Class shape */
class Shape {
  constructor(mainProgram, x, y, multiple) {
    this.mainProgram = mainProgram;
    this.ctx = this.mainProgram.ctx;
    this.x = x;
    this.y = y;
    this.multiple = multiple;
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
   * @param {string} type - params.common.type
   * @param {object} multiple - if chosen line up
   */
  choiseShape(type, multiple) {
    const options = this.dat.getOptions(type);

    switch (type) {
      case 'circle':
        this.Shapes.circle(options, multiple);
        break;
      case 'ellipse':
        this.Shapes.ellipse(options, multiple);
        break;
      case 'text':
        this.Shapes.text(options, multiple);
        break;
      case 'lemniscate':
        this.Shapes.lemniscate(options, multiple);
        break;
      case 'rectangle':
        this.Shapes.rectangle(options, multiple);
        break;
      case 'astroid':
        this.Shapes.astroid(options, multiple);
        break;
      case 'polygon':
        this.Shapes.polygon(options, multiple);
        break;
      case 'polygonStar':
        this.Shapes.polygonStar(options, multiple);
        break;
      case 'box':
        this.Shapes.box(options, multiple);
        break;
      case 'sin':
        this.Shapes.sin(options, multiple);
        break;
      case 'cos':
        this.Shapes.cos(options, multiple);
        break;
      case 'tan':
        this.Shapes.tan(options, multiple);
        break;
      case 'heart':
        this.Shapes.heart(options, multiple);
        break;
      case 'rose':
        this.Shapes.rose(options, multiple);
        break;
      case 'lissajous':
        this.Shapes.lissajous(options, multiple);
        break;
      case 'archimedesSpiral':
        this.Shapes.archimedesSpiral(options, multiple);
        break;
      case 'fermatSpiral':
        this.Shapes.fermatSpiral(options, multiple);
        break;
      case 'spirograf':
        this.Shapes.spirograf(options, multiple);
        break;
      case 'image':
        this.Shapes.image(options, multiple, this.mainProgram.image);
        break;
    }
  }

  render() {
    this.choiseShape(this.dat.params.common.type, this.multiple);
  }
}

/**
 * loading animation
 */
const loadingAnimation = () => {
  //document.getElementsByTagName('body')[0].setAttribute('style', '');
  const container = document.getElementById('container');
  const jsLoadingFrame = document.getElementById('jsLoadingFrame');
  const jsTexts = document.getElementsByClassName('jsTexts');
  
  Utils.delay(1600)
    .then(() => {
      container.classList.add('jsShowContainer');
      jsLoadingFrame.classList.add('jsLoaded');
    });
};

/**
 * run this program
 */
(() => {
  window.addEventListener('DOMContentLoaded', () => {
    console.clear();
    console.log(':)');
    /** loading animation */
    loadingAnimation();
    
    /** start main program */
    const jsClose = document.getElementById('jsClose');
    const jsCodeOne = document.getElementById('jsCodeOne');
    const jsAgainButton = document.getElementById('jsAgainButton');
    const inputImageButton = document.getElementById('inputImage');
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

    inputImageButton.addEventListener('change', (e) => {
      mainProgram.loadFile(e);
    }, false);
  });
})();
