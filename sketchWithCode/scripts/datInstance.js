/** Class dat Instance */
class Dat {
  /**
   * constructor
   * @param {object} mainProgram - reference main program
   */
  constructor(mainProgram) {
    this.mainProgram = mainProgram;
    this.gui = new dat.GUI();
    // folders
    this.Line = null;
    this.Shadow = null;
    this.Composite = null;
    this.ShapeColor = null;
    this.ShapeGradient = null;
    // parameters object
    this.params = null;
    // controllers object
    this.ctrls = null;
    // initialize
    this.initialize();
  }

  /**
   * make folders
   */
  makeFolder() {
    this.Common = this.gui.addFolder('Common');
    this.Text = this.gui.addFolder('Text');
    this.Line = this.gui.addFolder('Line');
    this.Shadow = this.gui.addFolder('Shadow');
    this.Composite = this.gui.addFolder('Composite');
    this.ShapeColor = this.gui.addFolder('ShapeColor');
    this.ShapeGradient = this.gui.addFolder('ShapeGradient');
    this.BackgroundColor = this.gui.addFolder('BackgroundColor');
    this.BackgroundGradient = this.gui.addFolder('BackgroundGradient');
    this.Effect = this.gui.addFolder('Effect');
    this.LineUp = this.gui.addFolder('LineUp');
  }

  /**
   * set parameters
   * @return {object} params - parameters object
   */
  setPrameter() {
    let params;
    /** initialize value */
    params = {
      common: {
        type: 'circle',
        x: 0,
        y: 0,
        scaleOne: 200,
        scaleTwo: 0,
        theta: 360,
        numberA: 4,
        numberB: 1,
        rotationAngle: 0,
        lineWidth: 1
      },
      text: {
        on: false,
        value: 'Text',
        family: 'sans-serif',
        textAlign: 'center',
        textBaseline: 'middle',
        style: 'normal',
        variant: 'normal',
        weight: 'normal'
      },
      line: {
        on: false,
        cap: '',
        join: '',
        miterLimit: 0
      },
      shadow: {
        on: false,
        color: '#000000',
        offsetX: 0,
        offsetY: 0,
        blur: 0
      },
      composite: {
        on: false,
        alpha: 1,
        operation: ''
      },
      shapeColor: {
        fillTransparent: true,
        fillMultiColorNumber: 1,
        fillOne: '#000000',
        fillTwo: '#000000',
        fillThree: '#000000',
        strokeTransparent: false,
        stroke: '#000000'
      },
      shapeGradient: {
        on: false,
        type: 'radial',
        startColor: '#FFFFFF',
        endColor: '#000000',
        point: 0.0
      },
      backgroundColor: {
        on: true,
        color: '#FFFFFF'
      },
      backgroundGradient: {
        on: false,
        type: 'linear',
        startColor: '#FFFFFF',
        endColor: '#000000',
        point: 0.0,
        rotationAngle: 0
      },
      effect: {
        on: false,
        type: 'vertical',
        numberC: 10,
        numberD: 10,
        noise: false,
        x: 1,
        y: 1,
        z: 1
      },
      lineUp: {
        on: false,
        type: 'lattice',
        numberE: 1000
      },
      loadImage: () => document.getElementById('inputImage').click(),
      reset: () => this.resetParams(),
      getCode: () => this.mainProgram.getCode(this.params.common.type),
      downloadImage: () => this.mainProgram.downloadImage()
      //getRandomShape: () => this.addRandomParams()
    };
    return params;
  }

  /**
   * add random parameters
   * making now
   */
  addRandomParams() {
    const type = Utils.getShapesTypeArray();
    // common
    this.ctrls.common.type.setValue(type[Utils.getRandomNumber(0, type.length - 1)]);
    this.ctrls.common.scaleOne.setValue(Utils.getRandomNumber(100, 300));
    this.ctrls.common.scaleTwo.setValue(Utils.getRandomNumber(100, 300));
    this.ctrls.common.theta.setValue(Utils.getRandomNumber(0, 360));
    this.ctrls.common.numberA.setValue(Utils.getRandomNumber(0, 360));
    this.ctrls.common.numberB.setValue(Utils.getRandomNumber(0, 360));
    this.ctrls.common.rotationAngle.setValue(Utils.getRandomNumber(0, 360));
    this.ctrls.common.lineWidth.setValue(Utils.getRandomNumber(1, 5));
    // line
    this.ctrls.line.on.setValue(Math.random() < 0.5 ? true : false);
    if (this.params.line.on) {
      this.ctrls.line.cap
    }
    this.mainProgram.rendering()
    /*
    this.ctrls.common.x.setValue(0);
    this.ctrls.common.y.setValue(0);
    this.ctrls.common.scaleOne.setValue(200);
    this.ctrls.common.scaleTwo.setValue(0);
    this.ctrls.common.theta.setValue(360);
    this.ctrls.common.numberA.setValue(0);
    this.ctrls.common.numberB.setValue(0);
    this.ctrls.common.rotationAngle.setValue(0);
    this.ctrls.common.lineWidth.setValue(1);
    this.ctrls.text.on.setValue(false);
    this.ctrls.text.value.setValue('Text');
    this.ctrls.text.family.setValue('sans-serif');
    this.ctrls.text.textAlign.setValue('center');
    this.ctrls.text.textBaseline.setValue('middle');
    this.ctrls.text.style.setValue('normal');
    this.ctrls.text.variant.setValue('normal');
    this.ctrls.text.weight.setValue('normal');
    this.ctrls.line.on.setValue(false);
    this.ctrls.line.cap.setValue('');
    this.ctrls.line.join.setValue('');
    this.ctrls.line.miterLimit.setValue(0);
    this.ctrls.shadow.on.setValue(false);
    this.ctrls.shadow.color.setValue('#000000');
    this.ctrls.shadow.offsetX.setValue(0);
    this.ctrls.shadow.offsetY.setValue(0);
    this.ctrls.shadow.blur.setValue(0);
    this.ctrls.composite.on.setValue(false);
    this.ctrls.composite.alpha.setValue(1);
    this.ctrls.composite.operation.setValue('');
    this.ctrls.shapeColor.fillTransparent.setValue(false);
    this.ctrls.shapeColor.fill.setValue('#000000');
    this.ctrls.shapeColor.strokeTransparent.setValue(false);
    this.ctrls.shapeColor.stroke.setValue('#000000');
    this.ctrls.shapeGradient.on.setValue(false);
    this.ctrls.shapeGradient.type.setValue('radial');
    this.ctrls.shapeGradient.startColor.setValue('#000000');
    this.ctrls.shapeGradient.endColor.setValue('#FFFFFF');
    this.ctrls.shapeGradient.point.setValue(0);
    this.ctrls.backgroundColor.on.setValue(true);
    this.ctrls.backgroundColor.color.setValue('#FFFFFF');
    this.ctrls.backgroundGradient.on.setValue(false);
    this.ctrls.backgroundGradient.type.setValue('radial');
    this.ctrls.backgroundGradient.startColor.setValue('#FFFFFF');
    this.ctrls.backgroundGradient.endColor.setValue('#000000');
    this.ctrls.backgroundGradient.point.setValue(0.0);
    this.ctrls.backgroundGradient.rotationAngle.setValue(0);
    this.ctrls.lineUp.setValue(false);
    this.ctrls.effect.on.setValue(false);
    */
    //this.choiseParams(this.params.common.type);
  }

  /**
   * set controller
   * @return {object} ctrls - controller object
   */
  setController() {
    let ctrls;

    ctrls = {
      /** common */
      common: {
        type: this.Common.add(this.params.common, 'type', Utils.getShapesTypeArray())
          .onChange(() => {
            this.choiseParams(this.params.common.type);
            this.mainProgram.rendering();
          }),
        x: this.Common.add(this.params.common, 'x', -window.innerWidth, window.innerWidth, 1)
          .onChange(() => this.mainProgram.rendering()),
        y: this.Common.add(this.params.common, 'y', -window.innerHeight, window.innerHeight, 1)
          .onChange(() => this.mainProgram.rendering()),
        scaleOne: this.Common.add(this.params.common, 'scaleOne', 0, 3000, 1)
          .onChange(() => this.mainProgram.rendering()),
        scaleTwo: this.Common.add(this.params.common, 'scaleTwo', 0, 3000, 1)
          .onChange(() => this.mainProgram.rendering()),
        theta: this.Common.add(this.params.common, 'theta', 0, 360, 1)
          .onChange(() => this.mainProgram.rendering()),
        numberA: this.Common.add(this.params.common, 'numberA', 0, 360, 1)
          .onChange(() => this.mainProgram.rendering()),
        numberB: this.Common.add(this.params.common, 'numberB', 0, 360, 1)
          .onChange(() => this.mainProgram.rendering()),
        rotationAngle: this.Common.add(this.params.common, 'rotationAngle', 0, 360, 1)
          .onChange(() => this.mainProgram.rendering()),
        lineWidth: this.Common.add(this.params.common, 'lineWidth', 0.1, 1000, 0.1)
          .onChange(() => this.mainProgram.rendering())
      },
      /** text */
      text: {
        on: this.Text.add(this.params.text, 'on')
          .onChange(() => {
            this.mainProgram.rendering();
          }),
        value: this.Text.add(this.params.text, 'value')
          .onChange(() => this.mainProgram.rendering()),
        family: this.Text.add(this.params.text, 'family')
          .onChange(() => this.mainProgram.rendering()),
        textAlign: this.Text.add(this.params.text, 'textAlign', ['center', 'start', 'end', 'left', 'right'])
          .onChange(() => this.mainProgram.rendering()),
        textBaseline: this.Text.add(this.params.text, 'textBaseline', ['middle', 'top', 'ideographic', 'hanging', 'alphabetic', 'bottom'])
          .onChange(() => this.mainProgram.rendering()),
        style: this.Text.add(this.params.text, 'style', ['normal', 'italic', 'oblique'])
          .onChange(() => this.mainProgram.rendering()),
        variant: this.Text.add(this.params.text, 'variant', ['normal', 'small-caps'])
          .onChange(() => this.mainProgram.rendering()),
        weight: this.Text.add(this.params.text, 'weight', ['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900'])
          .onChange(() => this.mainProgram.rendering())
      },
      /** line */
      line: {
        on: this.Line.add(this.params.line, 'on')
          .onChange(() => {
            this.mainProgram.rendering();
          }),
        cap: this.Line.add(this.params.line, 'cap', ['butt', 'round', 'square'])
          .onChange(() => this.mainProgram.rendering()),
        join: this.Line.add(this.params.line, 'join', ['bevel', 'round', 'miter'])
          .onChange(() => this.mainProgram.rendering()),
        miterLimit: this.Line.add(this.params.line, 'miterLimit', 0, 100, 1)
          .onChange(() => this.mainProgram.rendering())
      },
      /** shadow */
      shadow: {
        on: this.Shadow.add(this.params.shadow, 'on')
          .onChange(() => {
            this.mainProgram.rendering();
          }),
        color: this.Shadow.addColor(this.params.shadow, 'color')
          .onChange(() => this.mainProgram.rendering()),
        offsetX: this.Shadow.add(this.params.shadow, 'offsetX', -1000, 1000, 1)
          .onChange(() => this.mainProgram.rendering()),
        offsetY: this.Shadow.add(this.params.shadow, 'offsetY', -1000, 1000, 1)
          .onChange(() => this.mainProgram.rendering()),
        blur: this.Shadow.add(this.params.shadow, 'blur', 0, 1000, 1)
          .onChange(() => this.mainProgram.rendering())
      },
      /** composite */
      composite: {
        on: this.Composite.add(this.params.composite, 'on')
          .onChange(() => {
            this.mainProgram.rendering();
          }),
        alpha: this.Composite.add(this.params.composite, 'alpha', 0, 1, 0.1)
          .onChange(() => this.mainProgram.rendering()),
        operation: this.Composite.add(this.params.composite, 'operation', Utils.getGlobalCompositeOperationArray())
          .onChange(() => this.mainProgram.rendering())
      },
      /** shape color */
      shapeColor: {
        fillTransparent: this.ShapeColor.add(this.params.shapeColor, 'fillTransparent')
          .onChange(() => {
            this.mainProgram.rendering();
          }),
        fillMultiColorNumber: this.ShapeColor.add(this.params.shapeColor, 'fillMultiColorNumber', [1, 2, 3])
          .onChange(() => {
            this.mainProgram.rendering();
          }),
        fillOne: this.ShapeColor.addColor(this.params.shapeColor, 'fillOne')
          .onChange(() => this.mainProgram.rendering()),
        fillTwo: this.ShapeColor.addColor(this.params.shapeColor, 'fillTwo')
          .onChange(() => this.mainProgram.rendering()),
        fillThree: this.ShapeColor.addColor(this.params.shapeColor, 'fillThree')
          .onChange(() => this.mainProgram.rendering()),
        strokeTransparent: this.ShapeColor.add(this.params.shapeColor, 'strokeTransparent')
          .onChange(() => {
            this.mainProgram.rendering();
          }),
        stroke: this.ShapeColor.addColor(this.params.shapeColor, 'stroke')
          .onChange(() => this.mainProgram.rendering())
      },
      /** shape color gradient */
      shapeGradient: {
        on: this.ShapeGradient.add(this.params.shapeGradient, 'on')
          .onChange(() => {
            this.mainProgram.rendering();
          }),
        type: this.ShapeGradient.add(this.params.shapeGradient, 'type', ['radial', 'linear'])
          .onChange(() => this.mainProgram.rendering()),
        startColor: this.ShapeGradient.addColor(this.params.shapeGradient, 'startColor')
          .onChange(() => this.mainProgram.rendering()),
        endColor: this.ShapeGradient.addColor(this.params.shapeGradient, 'endColor')
          .onChange(() => this.mainProgram.rendering()),
        point: this.ShapeGradient.add(this.params.shapeGradient, 'point', 0.0, 1.0, 0.1)
          .onChange(() => this.mainProgram.rendering())
      },
      /** background color */
      backgroundColor: {
        on: this.BackgroundColor.add(this.params.backgroundColor, 'on')
          .onChange(() => {
            this.mainProgram.rendering();
          }),
        color: this.BackgroundColor.addColor(this.params.backgroundColor, 'color')
          .onChange(() => this.mainProgram.rendering())
      },
      /** background gradient */
      backgroundGradient: {
        on: this.BackgroundGradient.add(this.params.backgroundGradient, 'on')
          .onChange(() => {
            this.mainProgram.rendering();
          }),
        type: this.BackgroundGradient.add(this.params.backgroundGradient, 'type', ['radial', 'linear'])
          .onChange(() => this.mainProgram.rendering()),
        startColor: this.BackgroundGradient.addColor(this.params.backgroundGradient, 'startColor')
          .onChange(() => this.mainProgram.rendering()),
        endColor: this.BackgroundGradient.addColor(this.params.backgroundGradient, 'endColor')
          .onChange(() => this.mainProgram.rendering()),
        point: this.BackgroundGradient.add(this.params.backgroundGradient, 'point', 0.0, 1.0, 0.1)
          .onChange(() => this.mainProgram.rendering()),
        rotationAngle: this.BackgroundGradient.add(this.params.backgroundGradient, 'rotationAngle', 0, 360, 1)
          .onChange(() => this.mainProgram.rendering())
      },
      /** effect */
      effect: {
        on: this.Effect.add(this.params.effect, 'on')
          .onChange(() => {
            this.mainProgram.rendering();
          }),
        type: this.Effect.add(this.params.effect, 'type', Utils.getEffectArray())
          .onChange(() => this.mainProgram.rendering()),
        numberC: this.Effect.add(this.params.effect, 'numberC', 0, 360, 1)
          .onChange(() => this.mainProgram.rendering()),
        numberD: this.Effect.add(this.params.effect, 'numberD', 0, 360, 1)
          .onChange(() => this.mainProgram.rendering()),
        noise: this.Effect.add(this.params.effect, 'noise')
          .onChange(() => {
            this.mainProgram.rendering();
          }),
        x: this.Effect.add(this.params.effect, 'x', 1, 1000, 1)
          .onChange(() => this.mainProgram.rendering()),
        y: this.Effect.add(this.params.effect, 'y', 1, 1000, 1)
          .onChange(() => this.mainProgram.rendering()),
        z: this.Effect.add(this.params.effect, 'z', 1, 1000, 1)
          .onChange(() => this.mainProgram.rendering())
      },
      /** line up */
      lineUp: {
        on: this.LineUp.add(this.params.lineUp, 'on')
          .onChange(() => {
            this.mainProgram.resize();
          }),
        type: this.LineUp.add(this.params.lineUp, 'type', Utils.getLineUpArray())
          .onChange(() => this.mainProgram.resize()),
        numberE: this.LineUp.add(this.params.lineUp, 'numberE', 1, 10000, 1)
          .onChange(() => this.mainProgram.resize())
      },
      /** etc */
      loadImage: this.gui.add(this.params, 'loadImage'),
      reset: this.gui.add(this.params, 'reset'),
      getCode: this.gui.add(this.params, 'getCode'),
      downloadImage: this.gui.add(this.params, 'downloadImage')
      //getRandomShape: this.gui.add(this.params, 'getRandomShape')
    };

    return ctrls;
  }
  
  /**
   * get options
   * @params {string} type - params.common.type
   * @return {object} options - options object
   */
  getOptions(type) {
    const options = {
      ctx: this.mainProgram.ctx,
      common: {
        x: this.params.common.x,
        y: this.params.common.y,
        scaleOne: this.params.common.scaleOne,
        scaleTwo: this.params.common.scaleTwo,
        theta: this.params.common.theta,
        numberA: this.params.common.numberA,
        numberB: this.params.common.numberB,
        rotationAngle: this.params.common.rotationAngle,
        lineWidth: this.params.common.lineWidth
      },
      text: {
        on: this.params.text.on,
        value: this.params.text.on === true ? this.params.text.value : '',
        family: this.params.text.on === true ? this.params.text.family : '',
        textAlign: this.params.text.on === true ? this.params.text.textAlign : '',
        textBaseline: this.params.text.on === true ? this.params.text.textBaseline : '',
        style: this.params.text.on === true ? this.params.text.style : '',
        variant: this.params.text.on === true ? this.params.text.variant : '',
        weight: this.params.text.on === true ? this.params.text.weight : ''
      },
      line: {
        on: this.params.line.on,
        cap: this.params.line.on === true ? this.params.line.cap : '',
        join: this.params.line.on === true ? this.params.line.join : '',
        miterLimit: this.params.line.on === true ? this.params.line.miterLimit : 0
      },
      shadow: {
        on: this.params.shadow.on,
        color: this.params.shadow.on === true ? this.params.shadow.color : '',
        offsetX: this.params.shadow.on === true ? this.params.shadow.offsetX : 0,
        offsetY: this.params.shadow.on === true ? this.params.shadow.offsetY : 0,
        blur: this.params.shadow.on === true ? this.params.shadow.blur : 0
      },
      composite: {
        on: this.params.composite.on,
        alpha: this.params.composite.on === true ? this.params.composite.alpha : 1,
        operation: this.params.composite.on === true ? this.params.composite.operation : ''
      },
      shapeColor: {
        fillTransparent: this.params.shapeColor.fillTransparent,
        fillMultiColorNumber: this.params.shapeColor.fillMultiColorNumber,
        fill: this.getColorArray(this.params.shapeColor.fillTransparent, this.params.shapeColor.fillMultiColorNumber),
        strokeTransparent: this.params.shapeColor.strokeTransparent,
        stroke: this.params.shapeColor.strokeTransparent === true ? '' : this.params.shapeColor.stroke
      },
      shapeGradient: {
        on: this.params.shapeGradient.on,
        type: this.params.shapeGradient.on === true ? this.params.shapeGradient.type : '',
        startColor: this.params.shapeGradient.on === true ? this.params.shapeGradient.startColor : '',
        endColor: this.params.shapeGradient.on === true ? this.params.shapeGradient.endColor : '',
        point: this.params.shapeGradient.on === true ? this.params.shapeGradient.point : 0
      }
    };

    return options;
  }

  /**
   * get color array
   * @params {boolean} transparent 
   * @params {number} number
   * @return {array} arr - colors
   */
  getColorArray(transparent, num) {
    const arr = new Array();
    
    if (transparent) {

      return '';
    } else {
      if (num == 1) return [this.params.shapeColor.fillOne];
      if (num == 2) return [this.params.shapeColor.fillOne, this.params.shapeColor.fillTwo];
      if (num == 3) return [this.params.shapeColor.fillOne, this.params.shapeColor.fillTwo, this.params.shapeColor.fillThree];
    }
  }

  /**
   * hide parameters
   * @params {array} arr - want to hide index number
   */
  hideParams(arr) {
    /** dat gui added class name */
    const cs = document.getElementsByClassName('c');
    
    /** prepared hidden css class */
    for (let i = 0; i < cs.length; i++) {
      cs[i].classList.remove('hidden');
    }
    for (let i = 0; i < arr.length; i++) {
      cs[arr[i]].classList.add('hidden');
    }
  }

  /**
   * display parameters
   * @params {array} arr - want to display index number
   */
  displayParams(arr) {
    const cs = document.getElementsByClassName('c');
    
    /** prepared hidden css class */
    for (let i = 0; i < arr.length; i++) {
      cs[arr[i]].classList.toggle('hidden');
    }
  }
  
  /**
   * check on or off
   */
  checkOnOrOff() {
    if (this.params.line.on) {
      this.displayParams([19, 20, 21]);
    }
    if (this.params.shadow.on) {
      this.displayParams([23, 24, 25, 26]);
    }
    if (this.params.composite.on) {
      this.displayParams([28, 29]);
    }
    if (!this.params.shapeColor.fillTransparent) {
      this.displayParams([31]);
    }
    if (!this.params.shapeColor.strokeTransparent) {
      this.displayParams([33]);
    }
    if (this.params.shapeGradient.on) {
      this.displayParams([35, 36, 37, 38]);
    }
    if (this.params.backgroundColor.on) {
      this.displayParams([40]);
    }
    if (this.params.backgroundGradient.on) {
      this.displayParams([42, 43, 44, 45, 46]);
    }
    if (this.params.effect.on) {
      //this.ctrls.effect.noise(true);
      this.displayParams([48, 49, 50, 51, 52, 53, 54]);
    }
    if (this.params.lineUp.on) {
      this.displayParams([56, 57]);
    }
  }

  /**
   * choise parameters
   * @param {string} type - pass params.common.type
   */
  choiseParams(type) {
    this.ctrls.text.on.setValue(false);
    
    switch (type) {
      case 'circle':
        this.ctrls.common.scaleTwo.setValue(0);
        this.ctrls.common.theta.setValue(0);
        this.ctrls.common.numberA.setValue(0);
        this.ctrls.common.numberB.setValue(0);
        this.hideParams([4, 5, 6, 7]);
        break;
      case 'ellipse':
        this.ctrls.common.scaleTwo.setValue(100);
        this.ctrls.common.theta.setValue(0);
        this.ctrls.common.numberA.setValue(0);
        this.ctrls.common.numberB.setValue(0);
        this.hideParams([5, 6, 7]);
        break;
      case 'lemniscate':
        this.ctrls.common.scaleTwo.setValue(100);
        this.ctrls.common.theta.setValue(360);
        this.ctrls.common.numberA.setValue(0);
        this.ctrls.common.numberB.setValue(0);
        this.hideParams([4, 6, 7]);
        break;
      case 'text':
        this.ctrls.text.on.setValue(true);
        this.Text.open();
        this.ctrls.common.scaleTwo.setValue(0);
        this.ctrls.common.theta.setValue(0);
        this.ctrls.common.numberA.setValue(0);
        this.ctrls.common.numberB.setValue(0);
        this.hideParams([4, 5, 6, 7]);
        break;
      case 'rectangle':
        this.ctrls.common.scaleTwo.setValue(100);
        this.ctrls.common.theta.setValue(0);
        this.ctrls.common.numberA.setValue(0);
        this.ctrls.common.numberB.setValue(0);
        this.hideParams([5, 6, 7]);
        break;
      case 'polygon':
        this.ctrls.common.scaleTwo.setValue(200);
        this.ctrls.common.theta.setValue(5);
        this.ctrls.common.numberA.setValue(0);
        this.ctrls.common.numberB.setValue(0);
        this.hideParams([4, 6, 7]);
        break;
      case 'polygonStar':
        this.ctrls.common.scaleTwo.setValue(200);
        this.ctrls.common.theta.setValue(5);
        this.ctrls.common.numberA.setValue(0);
        this.ctrls.common.numberB.setValue(0);
        this.hideParams([4, 6, 7]);
        break;
      case 'sin':
        this.ctrls.common.scaleOne.setValue(200);
        this.ctrls.common.scaleTwo.setValue(0);
        this.ctrls.common.theta.setValue(50);
        this.ctrls.common.numberA.setValue(50);
        this.ctrls.common.numberB.setValue(1);
        this.hideParams([4]);
        break;
      case 'cos':
        this.ctrls.common.scaleOne.setValue(200);
        this.ctrls.common.scaleTwo.setValue(0);
        this.ctrls.common.theta.setValue(50);
        this.ctrls.common.numberA.setValue(50);
        this.ctrls.common.numberB.setValue(1);
        this.hideParams([4]);
        break;
      case 'tan':
        this.ctrls.common.scaleOne.setValue(200);
        this.ctrls.common.scaleTwo.setValue(0);
        this.ctrls.common.theta.setValue(50);
        this.ctrls.common.numberA.setValue(50);
        this.ctrls.common.numberB.setValue(1);
        this.hideParams([4]);
        break;
      case 'heart':
        this.ctrls.common.scaleOne.setValue(200);
        this.ctrls.common.scaleTwo.setValue(0);
        this.ctrls.common.theta.setValue(360);
        this.ctrls.common.rotationAngle.setValue(180);
        this.ctrls.common.numberA.setValue(0);
        this.ctrls.common.numberB.setValue(0);
        this.hideParams([4, 6, 7]);
        break;
      case 'rose':
        this.ctrls.common.scaleOne.setValue(200);
        this.ctrls.common.scaleTwo.setValue(0);
        this.ctrls.common.theta.setValue(360);
        this.ctrls.common.numberA.setValue(5);
        this.ctrls.common.numberB.setValue(2);
        this.hideParams([4]);
        break; 
      case 'astroid':
        this.ctrls.common.scaleOne.setValue(200);
        this.ctrls.common.scaleTwo.setValue(0);
        this.ctrls.common.theta.setValue(360);
        this.ctrls.common.numberA.setValue(0);
        this.ctrls.common.numberB.setValue(0);
        this.hideParams([4, 6, 7]);
        break;
      case 'lissajous':
        this.ctrls.common.scaleOne.setValue(200);
        this.ctrls.common.scaleTwo.setValue(0);
        this.ctrls.common.theta.setValue(360);
        this.ctrls.common.numberA.setValue(5);
        this.ctrls.common.numberB.setValue(2);
        this.hideParams([4]);
        break; 
      case 'archimedesSpiral':
        this.ctrls.common.scaleOne.setValue(200);
        this.ctrls.common.scaleTwo.setValue(0);
        this.ctrls.common.theta.setValue(360);
        this.ctrls.common.numberA.setValue(5);
        this.ctrls.common.numberB.setValue(0);
        this.hideParams([4, 7]);
        break; 
      case 'fermatSpiral':
        this.ctrls.common.scaleOne.setValue(200);
        this.ctrls.common.scaleTwo.setValue(0);
        this.ctrls.common.theta.setValue(360);
        this.ctrls.common.numberA.setValue(5);
        this.ctrls.common.numberB.setValue(0);
        this.hideParams([4, 7]);
        break; 
      case 'spirograf':
        this.ctrls.common.scaleOne.setValue(200);
        this.ctrls.common.scaleTwo.setValue(0);
        this.ctrls.common.theta.setValue(360);
        this.ctrls.common.numberA.setValue(36);
        this.ctrls.common.numberB.setValue(36);
        this.hideParams([4]);
        break; 
      case 'image':
        this.ctrls.common.scaleOne.setValue(100);
        this.ctrls.common.scaleTwo.setValue(0);
        this.ctrls.common.numberA.setValue(360);
        this.ctrls.common.numberB.setValue(360);
        this.hideParams([4, 5, 9]);
        break; 
    }
  }
  
  /**
   * reset parameters
   */
  resetParams() {
    /** common */
    this.ctrls.common.x.setValue(0);
    this.ctrls.common.y.setValue(0);
    this.ctrls.common.scaleOne.setValue(200);
    this.ctrls.common.scaleTwo.setValue(0);
    this.ctrls.common.theta.setValue(360);
    this.ctrls.common.numberA.setValue(0);
    this.ctrls.common.numberB.setValue(0);
    this.ctrls.common.rotationAngle.setValue(0);
    this.ctrls.common.lineWidth.setValue(1);
    /** text */
    this.ctrls.text.on.setValue(false);
    this.ctrls.text.value.setValue('Text');
    this.ctrls.text.family.setValue('sans-serif');
    this.ctrls.text.textAlign.setValue('center');
    this.ctrls.text.textBaseline.setValue('middle');
    this.ctrls.text.style.setValue('normal');
    this.ctrls.text.variant.setValue('normal');
    this.ctrls.text.weight.setValue('normal');
    /** line */
    this.ctrls.line.on.setValue(false);
    this.ctrls.line.cap.setValue('');
    this.ctrls.line.join.setValue('');
    this.ctrls.line.miterLimit.setValue(0);
    /** shadow */
    this.ctrls.shadow.on.setValue(false);
    this.ctrls.shadow.color.setValue('#000000');
    this.ctrls.shadow.offsetX.setValue(0);
    this.ctrls.shadow.offsetY.setValue(0);
    this.ctrls.shadow.blur.setValue(0);
    /** composite */
    this.ctrls.composite.on.setValue(false);
    this.ctrls.composite.alpha.setValue(1);
    this.ctrls.composite.operation.setValue('');
    /** shape color */
    this.ctrls.shapeColor.fillTransparent.setValue(true);
    this.ctrls.shapeColor.fill.setValue('#000000');
    this.ctrls.shapeColor.strokeTransparent.setValue(false);
    this.ctrls.shapeColor.stroke.setValue('#000000');
    /** shape gradient */
    this.ctrls.shapeGradient.on.setValue(false);
    this.ctrls.shapeGradient.type.setValue('radial');
    this.ctrls.shapeGradient.startColor.setValue('#000000');
    this.ctrls.shapeGradient.endColor.setValue('#FFFFFF');
    this.ctrls.shapeGradient.point.setValue(0);
    /** background color */
    this.ctrls.backgroundColor.on.setValue(true);
    this.ctrls.backgroundColor.color.setValue('#FFFFFF');
    /** background gradient */
    this.ctrls.backgroundGradient.on.setValue(false);
    this.ctrls.backgroundGradient.type.setValue('radial');
    this.ctrls.backgroundGradient.startColor.setValue('#FFFFFF');
    this.ctrls.backgroundGradient.endColor.setValue('#000000');
    this.ctrls.backgroundGradient.point.setValue(0.0);
    this.ctrls.backgroundGradient.rotationAngle.setValue(0);
    /** etc */
    this.ctrls.lineUp.on.setValue(false);
    this.ctrls.effect.on.setValue(false);
    this.ctrls.effect.noise.setValue(false);
    /** initialize parameters */
    this.choiseParams(this.params.common.type);
  }

  /**
   * initialize
   */
  initialize() {
    this.makeFolder(); 
    this.params = this.setPrameter(); 
    this.ctrls = this.setController();
    /** open only common */
    this.gui.close();
    this.Common.open();
    this.hideParams([4, 5, 6, 7]);
  }
}
