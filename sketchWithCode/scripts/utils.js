/** Class utility static function */
class Utils {
  /**
   * get random number
   * @param {number} min - min number
   * @param {number} max - max number
   * @return {number} random number
   */
  static getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  /**
   * Get rgb color if not params return random
   * @param {number} r - red
   * @param {number} g - green
   * @param {number} b - blue
   */
  static getRGBColor(r, g, b) {
    const rr = r || this.getRandomNumber(0, 255);
    const rg = g || this.getRandomNumber(0, 255);
    const rb = b || this.getRandomNumber(0, 255);
    return 'rgb(' + rr + ', ' + rg + ', ' + rb + ')';
  }
  
  /**
   * delay
   * @params {number} time - delay time
   * @return {object} promise - promise
   */
  static delay(time) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res();
      }, time);
    });
  }
  
  /**
   * get html from options object
   * @param {string} type - from dat gui
   * @param {object} options - selected option
   * @return {string} html - return html element
   */
  static getHtml(type, options) {
    let html = 
      'Shapes.' + type + '({<br>' + 
      '&nbsp;&nbsp;ctx: ctx' + ',<br>' +
      '&nbsp;&nbsp;common: {' + '<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;x: ' + options.common.x + ',<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;y: ' + options.common.y + ',<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;scaleOne: ' + options.common.scaleOne + ',<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;scaleTwo: ' + options.common.scaleTwo + ',<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;theta: ' + options.common.theta + ',<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;numberA: ' + options.common.numberA + ',<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;numberB: ' + options.common.numberB + ',<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;rotationAngle: ' + options.common.rotationAngle + ',<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;lineWidth: ' + options.common.lineWidth + '<br>' +
      '&nbsp;&nbsp;},' + '<br>' +
      '&nbsp;&nbsp;text: {' + '<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;on: ' + options.text.on + ',<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;value: "' + options.text.value + '",<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;family: "' + options.text.family + '",<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;textAlign: "' + options.text.textAlign + '",<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;textBaseline: "' + options.text.textBaseline + '",<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;style: "' + options.text.style + '",<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;variant: "' + options.text.variant + '",<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;weight: "' + options.text.weight + '"<br>' +
      '&nbsp;&nbsp;},' + '<br>' +
      '&nbsp;&nbsp;line: {' + '<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;on: ' + options.line.on + ',<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;cap: "' + options.line.cap + '",<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;join: "' + options.line.join + '",<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;miterLimit: ' + options.line.miterLimit + '<br>' +
      '&nbsp;&nbsp;},' + '<br>' +
      '&nbsp;&nbsp;shadow: {' + '<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;on: ' + options.shadow.on + ',<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;color: "' + options.shadow.color + '",<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;offsetX: ' + options.shadow.offsetX + ',<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;offsetY: ' + options.shadow.offsetY + ',<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;blur: ' + options.shadow.blur + '<br>' +
      '&nbsp;&nbsp;},' + '<br>' +
      '&nbsp;&nbsp;composite: {' + '<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;on: ' + options.composite.on + ',<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;alpha: ' + options.composite.alpha + ',<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;operation: "' + options.composite.operation + '"<br>' +
      '&nbsp;&nbsp;},' + '<br>' +
      '&nbsp;&nbsp;shapeColor: {' + '<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;fillTransparent: ' + options.shapeColor.fillTransparent + ',<br>' + 
      '&nbsp;&nbsp;&nbsp;&nbsp;fill: "' + options.shapeColor.fill + '",<br>' + 
      '&nbsp;&nbsp;&nbsp;&nbsp;strokeTransparent: ' + options.shapeColor.strokeTransparent + ',<br>' + 
      '&nbsp;&nbsp;&nbsp;&nbsp;stroke: "' + options.shapeColor.stroke + '"<br>' +
      '&nbsp;&nbsp;},' + '<br>' +
      '&nbsp;&nbsp;shapeGradient: {' + '<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;on: ' + options.shapeGradient.on + ',<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;type: "' + options.shapeGradient.type + '",<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;startColor: "' + options.shapeGradient.startColor + '",<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;endColor: "' + options.shapeGradient.endColor + '",<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;point: ' + options.shapeGradient.point + '<br>' +
      '&nbsp;&nbsp;}' + '<br>' +
      '});';

    return html;
  }

  /**
   * getShapesType
   * @return {array} arr - return shape type array
   */
  static getShapesTypeArray() {
    let arr = new Array();
    arr = [
      'circle',
      'ellipse',
      'lemniscate',
      'text',
      'rectangle',
      'polygon',
      'polygonStar',
      'box',
      'sin',
      'cos',
      'tan',
      'heart',
      'rose',
      'astroid',
      'lissajous',
      'archimedesSpiral',
      'fermatSpiral',
      'spirograf',
      'image'
    ];

    return arr;
  }

  /**
   * get global composite operation array
   * @return {array} arr - return global composite operation array
   */
  static getGlobalCompositeOperationArray() {
    let arr = new Array();
    
    arr = [
      'copy',
      'destination-atop',
      'destination-in',
      'destination-out',
      'destination-over',
      'lighter',
      'source-atop',
      'source-in',
      'source-out',
      'source-over',
      'xor'
    ];

    return arr;
  }

  /**
   * get effect array
   * @return {array} arr - return effect array
   */
  static getEffectArray() {
     let arr = new Array();
     arr = [
       'vertical',
       'horizontal',
       'sandstorm',
       'skew',
       'anaglyph',
       'edgeDetect',
       'emboss',
       'mosaic',
       'outOfFocus',
       'invert',
       'grayScale',
       'blackAndWhite'
     ];

     return arr;
   }

  /**
   * get line up array
   * @return {array} arr - return line up array
   */
  static getLineUpArray() {
    let arr = new Array();
    arr = [
      'lattice',
      'gap',
      'pack',
      'random',
      'notOverlap',
      'fractalOne',
      'fractalTwo',
      'sierpinski',
      'circular',
      'circleOnCircle',
      'fibonacci'
    ];

    return arr;
  }

  /**
   * delete own dom element
   */
  static deleteDomElement(element) {
     element.parentNode.removeChild(element);
  }
}
