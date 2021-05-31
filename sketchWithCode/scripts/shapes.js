/**
 * Get gradient color
 * @param {ctx} ctx - context of canvas
 * @param {string} type - linear or radial
 * @param {string} startcolor - start color
 * @param {string} endcolor - end color
 * @param {number} point - change point
 * @param {number} x - start coordinate x
 * @param {number} y - start coordinate y
 * @param {number} r - radius or length
 * @param {number} x - end coordinate x (for linear)
 * @param {number} y - end coordinate y (for linear)
 */
const getGradientColor = (ctx, type, startColor, endColor, point, x, y, r, ex, ey) => {
  let col, g;
  switch (type) {
    case 'linear':
      g = ctx.createLinearGradient(x - r, y, ex, ey - r);
      g.addColorStop(0, startColor);
      g.addColorStop(point, startColor);
      g.addColorStop(1, endColor);
      return g;
      break;
    case 'radial':
      g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, startColor);
      g.addColorStop(point, startColor);
      g.addColorStop(1, endColor);
      return g;
      break;
    default:
      console.log('mistaken params');
      break;
  } 
};

/** Class shapes */
class Shapes {
  /**
   * Common option
   * @param {object} o - options object
   * @params {number} offsetscaleone - scale
   * @params {number} offsetscaletwo - scale
   */
  static addStyle(o, offsetScaleOne, offsetScaleTwo) {
    let fillColor, strokeColor;
    /** stroke transparent */
    if (o.shapeColor.strokeTransparent === true) {
      strokeColor = 'rgba(0, 0, 0, 0)';
    } else {
      strokeColor = o.shapeColor.stroke;
    }
    /** fill transparent */
    if (o.shapeColor.fillTransparent === true) {
      fillColor = 'rgba(0, 0, 0, 0)';
    } else {
      fillColor = o.shapeColor.fill;
    }
    /** fill gradient */
    if (o.shapeGradient.on) {
      fillColor = getGradientColor(
        o.ctx,
        o.shapeGradient.type,
        o.shapeGradient.startColor,
        o.shapeGradient.endColor,
        o.shapeGradient.point,
        o.common.x,
        o.common.y,
        offsetScaleOne,
        o.common.x + offsetScaleOne,
        o.common.y + offsetScaleOne
      );
    }
    /** line options */
    if (o.line.on === true) {
      o.ctx.lineCap = o.line.cap;
      o.ctx.lineJoin = o.line.join;
      o.ctx.miterLimit = o.line.miterLimit;
    }
    /** shadow options */
    if (o.shadow.on === true) {
      o.ctx.shadowColor = o.shadow.color;
      o.ctx.shadowOffsetX = o.shadow.offsetX;
      o.ctx.shadowOffsetY = o.shadow.offsetY;
      o.ctx.shadowBlur = o.shadow.blur;
    }
    /** compositiong options */
    if (o.composite.on === true) {
      o.ctx.globalAlpha = o.composite.alpha;
      o.ctx.globalCompositeOperation = o.composite.operation;
    }
    
    o.ctx.lineWidth = o.common.lineWidth;
    o.ctx.fillStyle = fillColor;
    o.ctx.strokeStyle = strokeColor;
    o.ctx.rotate(o.common.rotationAngle * Math.PI / 180);
  }
  
  /********************
   * Circle type
     - Circle
     - Ellipse
     - Lemniscate
   ********************/

  /**
   * draw shapes
   * common parameters
   * @param {object} options - options
   * @param {object} multiple - use chosen lineUp
   */

  static circle(options, multiple) {
    const o = options;
    if (multiple) {
      o.common.scaleOne = multiple.scaleOne;
      o.common.rotationAngle = multiple.rotationAngle;
    }
    if (o.common.scaleOne < o.common.lineWidth) o.common.scaleOne = o.common.lineWidth;
    if (o.common.scaleTwo < o.common.lineWidth) o.common.scaleTwo = o.common.lineWidth;
    const offsetScaleOne = o.common.scaleOne / 2 - o.common.lineWidth / 2;
    const offsetScaleTwo = o.common.scaleTwo / 2 - o.common.lineWidth / 2;
    const radian = Math.PI * 2 / o.common.theta;
    
    o.ctx.save();
    this.addStyle(o, offsetScaleOne);
    o.ctx.beginPath();
    o.ctx.arc(o.common.x, o.common.y, offsetScaleOne, 0, Math.PI * 2, false);
    o.ctx.fill();
    o.ctx.stroke();
    o.ctx.restore();
  }

  static ellipse(options, multiple) {
    const o = options;
    if (multiple) {
      o.common.scaleOne = multiple.scaleOne;
      o.common.rotationAngle = multiple.rotationAngle;
    }
    if (o.common.scaleOne < o.common.lineWidth) o.common.scaleOne = o.common.lineWidth;
    if (o.common.scaleTwo < o.common.lineWidth) o.common.scaleTwo = o.common.lineWidth;
    const offsetScaleOne = o.common.scaleOne / 2 - o.common.lineWidth / 2;
    const offsetScaleTwo = o.common.scaleTwo / 2 - o.common.lineWidth / 2;
    const radian = Math.PI * 2 / o.common.theta;
    
    o.ctx.save();
    this.addStyle(o, offsetScaleOne, offsetScaleTwo);
    o.ctx.beginPath();
    o.ctx.ellipse(o.common.x, o.common.y, offsetScaleOne, offsetScaleTwo, 0, Math.PI * 2, false);
    o.ctx.fill();
    o.ctx.stroke();
    o.ctx.restore();
  }

  static lemniscate(options, multiple) {
    const o = options;
    if (multiple) {
      o.common.scaleOne = multiple.scaleOne;
      o.common.rotationAngle = multiple.rotationAngle;
    }
    if (o.common.scaleOne < o.common.lineWidth) o.common.scaleOne = o.common.lineWidth;
    if (o.common.scaleTwo < o.common.lineWidth) o.common.scaleTwo = o.common.lineWidth;
    const offsetScaleOne = o.common.scaleOne / 2 - o.common.lineWidth / 2;
    const offsetScaleTwo = o.common.scaleTwo / 2 - o.common.lineWidth / 2;
    const radian = Math.PI * 2 / o.common.theta;
    
    o.ctx.save();
    this.addStyle(o, offsetScaleOne, offsetScaleTwo);
    for (let i = 0; i < o.common.theta; i++) {
      const r = Math.sqrt(2 * Math.cos(2 * radian * i));
      const nx = Math.cos(radian * i) * r * offsetScaleOne + o.common.x;
      const ny = Math.sin(radian * i) * r * offsetScaleOne + o.common.y;
      
      if (i === 0) {
        o.ctx.beginPath();
        o.ctx.moveTo(nx, ny);
      } else {
        o.ctx.lineTo(nx, ny);
      }
      if (i === o.common.theta - 1) {
        o.ctx.closePath();
        o.ctx.fill();
        o.ctx.stroke();
      }
    }
    o.ctx.restore();
  }

  /********************
   * Text type
     - Text
   ********************/
  
  static text(options, multiple) {
    const o = options;
    if (multiple) {
      o.common.scaleOne = multiple.scaleOne;
      o.common.rotationAngle = multiple.rotationAngle;
    }
    if (o.common.scaleOne < o.common.lineWidth) o.common.scaleOne = o.common.lineWidth;
    if (o.common.scaleTwo < o.common.lineWidth) o.common.scaleTwo = o.common.lineWidth;
    const offsetScaleOne = o.common.scaleOne / 2 - o.common.lineWidth / 2;
    const offsetScaleTwo = o.common.scaleTwo / 2 - o.common.lineWidth / 2;
    const radian = Math.PI * 2 / o.common.theta;
    
    const fontSize = offsetScaleOne;
    
    o.ctx.save();
    this.addStyle(o, offsetScaleOne, offsetScaleTwo);
    this.measureText(o, offsetScaleOne, fontSize);
    o.ctx.fillText(o.text.value, o.common.x, o.common.y);
    o.ctx.strokeText(o.text.value, o.common.x, o.common.y);
    o.ctx.restore();
  }

  /**
   * measure text width
   * @param {Object} o - options
   * @param {Number} offfsetScaleOne - radius
   * @param {Number} fontSize - font size
   */
  static measureText(o, offsetScaleOne, fontSize) {
    o.ctx.font = o.text.weight + ' ' + o.text.variant  + ' '  + o.text.style + ' ' + fontSize + 'px ' + o.text.family;
    o.ctx.textAlign = o.text.textAlign;
    o.ctx.textBaseline = o.text.textBaseline;
    const s = o.ctx.measureText(o.text.value);
    
    if (s.width > offsetScaleOne * 2) {
      fontSize--;
      this.measureText(o, offsetScaleOne, fontSize);
    }
  }
  
  /********************
   * Rectangle type
     - Rectangle
   ********************/

  static rectangle(options, multiple) {
    const o = options;
    if (multiple) {
      o.common.scaleOne = multiple.scaleOne;
      o.common.scaleTwo = multiple.scaleOne;
      o.common.rotationAngle = multiple.rotationAngle;
    }
    if (o.common.scaleOne < o.common.lineWidth) o.common.scaleOne = o.common.lineWidth;
    if (o.common.scaleTwo < o.common.lineWidth) o.common.scaleTwo = o.common.lineWidth;
    const offsetScaleOne = o.common.scaleOne / 2 - o.common.lineWidth / 2;
    const offsetScaleTwo = o.common.scaleTwo / 2 - o.common.lineWidth / 2;
    const radian = Math.PI * 2 / o.common.theta;
    
    o.ctx.save();
    this.addStyle(o, offsetScaleOne, offsetScaleTwo);
    o.ctx.fillRect(
      o.common.x - o.common.scaleOne / 2 + o.common.lineWidth,
      o.common.y - o.common.scaleTwo / 2 + o.common.lineWidth,
      o.common.scaleOne - o.common.lineWidth * 2,
      o.common.scaleTwo - o.common.lineWidth * 2
    );
    o.ctx.strokeRect(
      o.common.x - o.common.scaleOne / 2 + o.common.lineWidth / 2,
      o.common.y - o.common.scaleTwo / 2 + o.common.lineWidth / 2,
      o.common.scaleOne - o.common.lineWidth,
      o.common.scaleTwo - o.common.lineWidth
    );
    o.ctx.restore();
  }
  
  /********************
   * Polygon type
     - Polygon
     - Polygon Star
   ********************/
  
  static polygon(options, multiple) {
    const o = options;
    if (multiple) {
      o.common.scaleOne = multiple.scaleOne;
      o.common.rotationAngle = multiple.rotationAngle;
    }
    if (o.common.scaleOne < o.common.lineWidth) o.common.scaleOne = o.common.lineWidth;
    if (o.common.scaleTwo < o.common.lineWidth) o.common.scaleTwo = o.common.lineWidth;
    const offsetScaleOne = o.common.scaleOne / 2 - o.common.lineWidth / 2;
    const offsetScaleTwo = o.common.scaleTwo / 2 - o.common.lineWidth / 2;
    const radian = Math.PI * 2 / o.common.theta;
    
    o.ctx.save();
    this.addStyle(o, offsetScaleOne, offsetScaleTwo);
    for (let i = 0; i < o.common.theta; i++) {
      const nx = Math.cos(radian * i) * offsetScaleOne + o.common.x;
      const ny = Math.sin(radian * i) * offsetScaleOne + o.common.y;
      
      if (i === 0) {
        o.ctx.beginPath();
        o.ctx.moveTo(nx, ny);
      } else {
        o.ctx.lineTo(nx, ny);
      }
      if (i === o.common.theta - 1) {
        o.ctx.closePath();
        o.ctx.fill();
        o.ctx.stroke();
      }
    }
    o.ctx.restore();
  }
  
  static polygonStar(options, multiple) {
    const o = options;
    if (multiple) {
      o.common.scaleOne = multiple.scaleOne;
      o.common.rotationAngle = multiple.rotationAngle;
    }
    if (o.common.scaleOne < o.common.lineWidth) o.common.scaleOne = o.common.lineWidth;
    if (o.common.scaleTwo < o.common.lineWidth) o.common.scaleTwo = o.common.lineWidth;
    const offsetScaleOne = o.common.scaleOne / 2 - o.common.lineWidth / 2;
    const offsetScaleTwo = o.common.scaleTwo / 2 - o.common.lineWidth / 2;
    const radian = Math.PI / o.common.theta * 4;
    
    o.ctx.save(); 
    this.addStyle(o, offsetScaleOne, offsetScaleTwo);
    for (let i = 0; i < o.common.theta; i++) {
      const nx = Math.cos(radian * i) * offsetScaleOne + o.common.x;
      const ny = Math.sin(radian * i) * offsetScaleOne + o.common.y;
      
      if (i === 0) {
        o.ctx.beginPath();
        o.ctx.moveTo(nx, ny);
      } else {
        o.ctx.lineTo(nx, ny);
      }
      if (i === o.common.theta - 1) {
        o.ctx.closePath();
        o.ctx.fill();
        o.ctx.stroke();
      }
    }
    o.ctx.restore();
  }
  
  /********************
   * Curve type
     - Sin
     - Cos
     - Tan
     - Heart
     - Rose
     - Astroid
     - Lissajous
     - Archimedes
     - FermatSpiral
   ********************/

  static sin(options, multiple) {
    const o = options;
    o.common.theta *= 5;
    if (multiple) {
      o.common.scaleOne = multiple.scaleOne;
      o.common.rotationAngle = multiple.rotationAngle;
    }
    if (o.common.scaleOne < o.common.lineWidth) o.common.scaleOne = o.common.lineWidth;
    if (o.common.scaleTwo < o.common.lineWidth) o.common.scaleTwo = o.common.lineWidth;
    const offsetScaleOne = o.common.scaleOne / 2 - o.common.lineWidth / 2;
    const offsetScaleTwo = o.common.scaleTwo / 2 - o.common.lineWidth / 2;
    const radian = Math.PI * 2 * o.common.numberB / o.common.theta;
     
    o.ctx.save(); 
    this.addStyle(o, offsetScaleOne, offsetScaleTwo);
    for (let i = 0; i < o.common.theta; i++) {
      const nx = o.common.x - o.common.theta / 2 + i;
      const ny = Math.sin(radian * i) * o.common.numberA + o.common.y;
      if (i === 0) {
        o.ctx.beginPath();
        o.ctx.moveTo(nx, ny);
      } else {
        o.ctx.lineTo(nx, ny);
      }
      if (i === o.common.theta - 1) {
        //o.ctx.closePath();
        //o.ctx.fill();
        o.ctx.stroke();
      }
    }
    o.ctx.restore();
  }
  
  static cos(options, multiple) {
    const o = options;
    o.common.theta *= 5;
    if (multiple) {
      o.common.scaleOne = multiple.scaleOne;
      o.common.rotationAngle = multiple.rotationAngle;
    }
    if (o.common.scaleOne < o.common.lineWidth) o.common.scaleOne = o.common.lineWidth;
    if (o.common.scaleTwo < o.common.lineWidth) o.common.scaleTwo = o.common.lineWidth;
    const offsetScaleOne = o.common.scaleOne / 2 - o.common.lineWidth / 2;
    const offsetScaleTwo = o.common.scaleTwo / 2 - o.common.lineWidth / 2;
    const radian = Math.PI * 2 * o.common.numberB / o.common.theta;
     
    o.ctx.save(); 
    this.addStyle(o, offsetScaleOne, offsetScaleTwo);
    for (let i = 0; i < o.common.theta; i++) {
      const nx = o.common.x - o.common.theta / 2 + i;
      const ny = Math.cos(radian * i) * o.common.numberA + o.common.y;
      if (i === 0) {
        o.ctx.beginPath();
        o.ctx.moveTo(nx, ny);
      } else {
        o.ctx.lineTo(nx, ny);
      }
      if (i === o.common.theta - 1) {
        //o.ctx.closePath();
        //o.ctx.fill();
        o.ctx.stroke();
      }
    }
    o.ctx.restore();
  }
  
  static tan(options, multiple) {
    const o = options;
    o.common.theta *= 5;
    if (multiple) {
      o.common.scaleOne = multiple.scaleOne;
      o.common.rotationAngle = multiple.rotationAngle;
    }
    if (o.common.scaleOne < o.common.lineWidth) o.common.scaleOne = o.common.lineWidth;
    if (o.common.scaleTwo < o.common.lineWidth) o.common.scaleTwo = o.common.lineWidth;
    const offsetScaleOne = o.common.scaleOne / 2 - o.common.lineWidth / 2;
    const offsetScaleTwo = o.common.scaleTwo / 2 - o.common.lineWidth / 2;
    const radian = Math.PI * 2 * o.common.numberB / o.common.theta;
     
    o.ctx.save(); 
    this.addStyle(o, offsetScaleOne, offsetScaleTwo);
    for (let i = 0; i < o.common.theta; i++) {
      const nx = o.common.x - o.common.theta / 2 + i;
      const ny = Math.tan(radian * i) * o.common.numberA + o.common.y;
      if (i === 0) {
        o.ctx.beginPath();
        o.ctx.moveTo(nx, ny);
      } else {
        o.ctx.lineTo(nx, ny);
      }
      if (i === o.common.theta - 1) {
        //o.ctx.closePath();
        //o.ctx.fill();
        o.ctx.stroke();
      }
    }
    o.ctx.restore();
  }
  
  static heart(options, multiple) {
    const o = options;
    if (multiple) {
      o.common.scaleOne = multiple.scaleOne;
      o.common.rotationAngle = multiple.rotationAngle;
    }
    if (o.common.scaleOne < o.common.lineWidth) o.common.scaleOne = o.common.lineWidth;
    if (o.common.scaleTwo < o.common.lineWidth) o.common.scaleTwo = o.common.lineWidth;
    const offsetScaleOne = o.common.scaleOne / 2 - o.common.lineWidth / 2;
    const offsetScaleTwo = o.common.scaleTwo / 2 - o.common.lineWidth / 2;
    const radian = Math.PI * 2 / o.common.theta;
    
    o.ctx.save(); 
    this.addStyle(o, offsetScaleOne, offsetScaleTwo);
    for (let i = 0; i < o.common.theta; i++) {
      const nx = (
        16 * Math.sin(radian * i) *
        Math.sin(radian * i) *
        Math.sin(radian * i)) *
        offsetScaleOne * 0.06 +
        o.common.x;
      const ny = (
        13 * Math.cos(radian * i) -
        5 * Math.cos(2 * radian * i) -
        2 * Math.cos(3 * radian * i) -
        Math.cos(4 * radian * i)) *
        offsetScaleOne * 0.06 + 
        o.common.y;
      
      if (i === 0) {
        o.ctx.beginPath();
        o.ctx.moveTo(nx, ny);
      } else {
        o.ctx.lineTo(nx, ny);
      }
      if (i === o.common.theta - 1) {
        o.ctx.closePath();
        o.ctx.fill();
        o.ctx.stroke();
      }
    }
    o.ctx.restore();
  }

  static rose(options, multiple) {
    const o = options;
    if (multiple) {
      o.common.scaleOne = multiple.scaleOne;
      o.common.rotationAngle = multiple.rotationAngle;
    }
    if (o.common.scaleOne < o.common.lineWidth) o.common.scaleOne = o.common.lineWidth;
    if (o.common.scaleTwo < o.common.lineWidth) o.common.scaleTwo = o.common.lineWidth;
    const offsetScaleOne = o.common.scaleOne / 2 - o.common.lineWidth / 2;
    const offsetScaleTwo = o.common.scaleTwo / 2 - o.common.lineWidth / 2;
    const radian = Math.PI * 2 * o.common.numberB / o.common.theta;
    
    o.ctx.save(); 
    this.addStyle(o, offsetScaleOne, offsetScaleTwo);
    for (let i = 0; i < o.common.theta; i++) {
      const r = Math.cos(o.common.numberA * radian * i / o.common.numberB) * offsetScaleOne;
      const nx = Math.cos(radian * i) * r + o.common.x;
      const ny = Math.sin(radian * i) * r + o.common.y;
      
      if (i === 0) {
        o.ctx.beginPath();
        o.ctx.moveTo(nx, ny);
      } else {
        o.ctx.lineTo(nx, ny);
      }
      if (i === o.common.theta - 1) {
        o.ctx.closePath();
        o.ctx.fill();
        o.ctx.stroke();
      }
    }
    o.ctx.restore();
  }
  
  static astroid(options, multiple) {
    const o = options;
    if (multiple) {
      o.common.scaleOne = multiple.scaleOne;
      o.common.rotationAngle = multiple.rotationAngle;
    }
    if (o.common.scaleOne < o.common.lineWidth) o.common.scaleOne = o.common.lineWidth;
    if (o.common.scaleTwo < o.common.lineWidth) o.common.scaleTwo = o.common.lineWidth;
    const offsetScaleOne = o.common.scaleOne / 2 - o.common.lineWidth / 2;
    const offsetScaleTwo = o.common.scaleTwo / 2 - o.common.lineWidth / 2;
    const radian = Math.PI * 2 / o.common.theta;
    
    o.ctx.save();
    this.addStyle(o, offsetScaleOne, offsetScaleTwo);
    for (let i = 0; i < o.common.theta; i++) {
      const nx = Math.pow(Math.cos(radian * i), 3) * offsetScaleOne + o.common.x;
      const ny = Math.pow(Math.sin(radian * i), 3) * offsetScaleOne + o.common.y;
      
      if (i === 0) {
        o.ctx.beginPath();
        o.ctx.moveTo(nx, ny);
      } else {
        o.ctx.lineTo(nx, ny);
      }
      if (i === o.common.theta - 1) {
        o.ctx.closePath();
        o.ctx.fill();
        o.ctx.stroke();
      }
    }
    o.ctx.restore();
  }
  
  static lissajous(options, multiple) {
    const o = options;
    if (multiple) {
      o.common.scaleOne = multiple.scaleOne;
      o.common.rotationAngle = multiple.rotationAngle;
    }
    if (o.common.scaleOne < o.common.lineWidth) o.common.scaleOne = o.common.lineWidth;
    if (o.common.scaleTwo < o.common.lineWidth) o.common.scaleTwo = o.common.lineWidth;
    const offsetScaleOne = o.common.scaleOne / 2 - o.common.lineWidth / 2;
    const offsetScaleTwo = o.common.scaleTwo / 2 - o.common.lineWidth / 2;
    const radian = Math.PI * 2 / o.common.theta;
    
    o.ctx.save(); 
    this.addStyle(o, offsetScaleOne, offsetScaleTwo);
    for (let i = 0; i < o.common.theta; i++) {
      const nx = Math.cos(o.common.numberA * radian * i) * offsetScaleOne + o.common.x;
      const ny = Math.sin(o.common.numberB * radian * i + o.common.theta) * offsetScaleOne + o.common.y;
      
      if (i === 0) {
        o.ctx.beginPath();
        o.ctx.moveTo(nx, ny);
      } else {
        o.ctx.lineTo(nx, ny);
      }
      if (i === o.common.theta - 1) {
        o.ctx.closePath();
        o.ctx.fill();
        o.ctx.stroke();
      }
    }
    o.ctx.restore();
  }
  
  static archimedesSpiral(options, multiple) {
    const o = options;
    if (multiple) {
      o.common.scaleOne = multiple.scaleOne;
      o.common.rotationAngle = multiple.rotationAngle;
    }
    if (o.common.scaleOne < o.common.lineWidth) o.common.scaleOne = o.common.lineWidth;
    if (o.common.scaleTwo < o.common.lineWidth) o.common.scaleTwo = o.common.lineWidth;
    const offsetScaleOne = o.common.scaleOne / 2 - o.common.lineWidth / 2;
    const offsetScaleTwo = o.common.scaleTwo / 2 - o.common.lineWidth / 2;
    const radian = Math.PI * 2 / o.common.theta;
    
    o.ctx.save();
    this.addStyle(o, offsetScaleOne, offsetScaleTwo);
    for (let i = 0; i < o.common.theta; i++) {
      const r = (radian * i) * offsetScaleOne * 0.16;
      const nx = Math.cos(radian * i * o.common.numberA) * r + o.common.x;
      const ny = Math.sin(radian * i * o.common.numberA) * r + o.common.y;
      
      if (i === 0) {
        o.ctx.beginPath();
        o.ctx.moveTo(nx, ny);
      } else {
        o.ctx.lineTo(nx, ny);
      }
      if (i === o.common.theta - 1) {
        //o.ctx.closePath();
        //o.ctx.fill();
        o.ctx.stroke();
      }
    }
    o.ctx.restore();
  }
  
  static fermatSpiral(options, multiple) {
    const o = options;
    if (multiple) {
      o.common.scaleOne = multiple.scaleOne;
      o.common.rotationAngle = multiple.rotationAngle;
    }
    if (o.common.scaleOne < o.common.lineWidth) o.common.scaleOne = o.common.lineWidth;
    if (o.common.scaleTwo < o.common.lineWidth) o.common.scaleTwo = o.common.lineWidth;
    const offsetScaleOne = o.common.scaleOne / 2 - o.common.lineWidth / 2;
    const offsetScaleTwo = o.common.scaleTwo / 2 - o.common.lineWidth / 2;
    const radian = Math.PI * 2 / o.common.theta;
    
    o.ctx.save();
    this.addStyle(o, offsetScaleOne, offsetScaleTwo);
    for (let i = 0; i < o.common.theta; i++) {
      const r = Math.sqrt((radian * i)) * offsetScaleOne * 0.4;
      const nx = Math.cos(radian * i * o.common.numberA) * r + o.common.x;
      const ny = Math.sin(radian * i * o.common.numberA) * r + o.common.y;
      
      if (i === 0) {
        o.ctx.beginPath();
        o.ctx.moveTo(nx, ny);
      } else {
        o.ctx.lineTo(nx, ny);
      }
      if (i === o.common.theta - 1) {
        //o.ctx.closePath();
        //o.ctx.fill();
        o.ctx.stroke();
      }
    }
    o.ctx.restore();
  }
  
  static spirograf(options, multiple) {
    const o = options;
    if (multiple) {
      o.common.scaleOne = multiple.scaleOne;
      o.common.rotationAngle = multiple.rotationAngle;
    }
    if (o.common.scaleOne < o.common.lineWidth) o.common.scaleOne = o.common.lineWidth;
    if (o.common.scaleTwo < o.common.lineWidth) o.common.scaleTwo = o.common.lineWidth;
    const offsetScaleOne = o.common.scaleOne / 2 - o.common.lineWidth / 2;
    const offsetScaleTwo = o.common.scaleTwo / 2 - o.common.lineWidth / 2;
    const radian = Math.PI * 2 / o.common.theta;
    const k = o.common.numberA / 360;
    const l = o.common.numberB * 10 / 360;
    const T = (1 - k) / k;
    
    o.ctx.save();
    this.addStyle(o, offsetScaleOne, offsetScaleTwo); 
    for (let i = 0; i < o.common.theta; i++) {
      const nx = (Math.cos(i * radian) * (1 - k) + Math.cos(T * (i * radian)) * k * l) * offsetScaleOne;
      const ny = (Math.sin(i * radian) * (1 - k) - Math.sin(T * (i * radian)) * k * l) * offsetScaleOne;
      
      if (i === 0) {
        o.ctx.beginPath();
        o.ctx.moveTo(nx, ny);
      } else {
        o.ctx.lineTo(nx, ny);
      }
      if (i === o.common.theta - 1) {
        o.ctx.closePath();
        o.ctx.fill();
        o.ctx.stroke();
      }
    }
    o.ctx.restore();
  }
}
