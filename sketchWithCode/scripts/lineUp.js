/** Class LineUp */
class LineUp {
  /**
   * choise arrangement
   * @param {string} type - arrangement
   * @param {object} main - main program
   * @param {number} scale - shape size
   * @return {array} arr - array included shapes
   */
  static arrangement(type, main, scale) {
    let arr;

    switch (type) {
      case 'lattice':
        arr = this.lattice(main, scale);
        
        return arr;
        break;
      case 'gap':
        arr = this.gap(main, scale);

        return arr;
        break;
      case 'pack':
        arr = this.pack(main, scale);

        return arr;
        break;
      case 'random':
        arr = this.random(main, scale);
        
        return arr;
        break;
      case 'notOverlap':
        arr = this.notOverlap(main, scale);
        
        return arr;
        break;
      case 'fractalOne':
        arr = this.fractalOne(main, scale);

        return arr;
        break;
      case 'fractalTwo':
        arr = this.fractalTwo(main, scale);

        return arr;
        break;
      case 'sierpinski':
        arr = this.sierpinski(main, scale);

        return arr;
        break;
      case 'circular':
        arr = this.circular(main, scale);

        return arr;
        break;
      case 'fibonacci':
        arr = this.fibonacci(main, scale);

        return arr;
        break;
    }
  }

  /**
   * line up lattice
   * @param {object} main - main program
   * @param {number} scale - shape size
   * @return {array} arr - array included shapes
   */
  static lattice(main, scale) {
    const arr = new Array();
    const yNum = Math.floor(main.height / scale) + 1;
    const xNum = Math.floor(main.width / scale) + 1;

    for (let y = 0; y <= yNum; y++) {
      for (let x = 0; x <= xNum; x++) {
        const s = new Shape(main, x * scale, y * scale);
        arr.push(s);
      }
    }
    
    return arr;
  }

  /**
   * line up gap
   * @param {object} main - main program
   * @param {number} scale - shape size
   * @return {array} arr - array included shapes
   */
  static gap(main, scale) {
    const arr = new Array();
    const yNum = Math.floor(main.height / scale) + 1;
    const xNum = Math.floor(main.width / scale) + 1;
    let s;

    for (let y = 0; y <= yNum; y++) {
      for (let x = 0; x <= xNum; x++) {
        if (y % 2 === 0) {
          s = new Shape(main, x * scale, y * scale);
          arr.push(s);
        } else {
          s = new Shape(main, x * scale + scale / 2, y * scale);
          arr.push(s);
        }
      }
    }
    
    return arr;
  }
  
  /**
   * line up pack
   * @param {object} main - main program
   * @param {number} scale - shape size
   * @return {array} arr - array included shapes
   */
  static pack(main, scale) {
    const arr = new Array();
    const yNum = Math.floor(main.height / scale) + 2;
    const xNum = Math.floor(main.width / scale) + 1;
    const gapX = scale / 2;
    const gapY = Math.cos(30 * Math.PI / 180) * scale;
    let s;

    for (let y = 0; y <= yNum; y++) {
      for (let x = 0; x <= xNum; x++) {
        if (y % 2 === 0) {
          s = new Shape(main, x * scale, y * gapY);
          arr.push(s);
        } else {
          s = new Shape(main, x * scale + gapX, y * gapY);
          arr.push(s);
        }
      }
    }
    
    return arr;
  }

  /**
   * line up random
   * @param {object} main - main program
   * @param {number} scale - shape size
   * @return {array} arr - array included shapes
   */
  static random(main, scale) {
    const arr = new Array();
    const num = main.dat.params.lineUp.numberE;
    
    for (let i = 0; i < num; i++) {
      const multiple = {
        scaleOne: Utils.getRandomNumber(10, scale),
        rotationAngle: Utils.getRandomNumber(0, 360)
      };
      const s = new Shape(main, main.width * Math.random(), main.height * Math.random(), multiple);
      arr.push(s);
    }
    return arr;
  }

  /**
   * line up notOverlap
   * @param {object} main - main program
   * @param {number} scale - shape size
   * @return {array} arr - array included shapes
   */
  static notOverlap(main, scale) {
    const arr = new Array();
    /** from dat parameters */
    const num = main.dat.params.lineUp.numberE;
    let intersection = false;
    
    for (let i = 0; i < num; i++) {
      const newX = Utils.getRandomNumber(0, main.width);
      const newY = Utils.getRandomNumber(0, main.height);
      
      for (let newR = scale; newR >= 10; newR-- ) {
        for (let j = 0; j < arr.length; j++) {
          const dx = newX - arr[j].x;
          const dy = newY - arr[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          intersection = dist < arr[j].multiple.scaleOne / 2 + newR / 2;
          if (intersection) {
            break;
          }
        }
        if (!intersection) {
          const multiple = {
            scaleOne: newR,
            rotationAngle: Utils.getRandomNumber(0, 360)
          };
          const s = new Shape(main, newX, newY, multiple);
          
          arr.push(s);
        }
      }
    }
    
    return arr;
  }

  /**
   * line up fractalOne
   * @param {object} main - main program
   * @param {number} scale - size
   * @return {array} arr - array included shapes
   */
  static fractalOne(main, scale) {
    const arr = new Array();
    const num = main.dat.params.lineUp.numberE;
    const n = Math.min(Math.floor(main.dat.params.lineUp.numberE / 1000), 6);

    this.fract(main, 0, 0, Math.max(main.width, main.height), n, arr);

    return arr;
  }

  static map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

  static fract(main, x, y, scale, n, arr) {
    const multiple = {
      scaleOne: scale / 2,
      rotationAngle: main.dat.params.common.rotationAngle
    };
    const s = new Shape(main, x + scale / 2, y + scale / 2, multiple);
    
    arr.push(s);
    n--;
    if (n >= 0) {
      const ns = scale / 2;
      const p = this.map(n, 0, 3 - 1, 0.5, 0);
      if (Math.random() > p) {
        this.fract(main, x, y, ns, n, arr);
        this.fract(main, x + ns, y, ns, n, arr);
        this.fract(main, x + ns, y + ns, ns, n, arr);
        this.fract(main, x, y + ns, ns, n, arr);
      }
    }
  }

  /**
   * line up fractalTwo
   * @param {object} main - main program
   * @param {number} scale - size
   * @return {array} arr - array included shapes
   */
  static fractalTwo(main, scale) {
    const arr = new Array();
    const num = main.dat.params.lineUp.numberE;
    const n = Math.min(Math.floor(main.dat.params.lineUp.numberE / 1000), 6);

    this.fractTwo(main, 0, 0, Math.max(main.width, main.height), n, arr);

    return arr;
  }

  static fractTwo(main, x, y, scale, n, arr) {
    const multiple = {
      scaleOne: scale,
      rotationAngle: main.dat.params.common.rotationAngle
    };
    
    if (n % 4 !== 0) {
      const s = new Shape(main, x + scale / 2, y + scale / 2, multiple);
      
      arr.push(s);
    }
    
    n--;
    if (n >= 0) {
      const ns = scale / 2;
      const p = this.map(n, 0, 3 - 1, 0.5, 0);
      if (Math.random() > p) {
        this.fractTwo(main, x, y, ns, n, arr);
        this.fractTwo(main, x + ns, y, ns, n, arr);
        this.fractTwo(main, x + ns, y + ns, ns, n, arr);
        this.fractTwo(main, x, y + ns, ns, n, arr);
      }
    }
  }
  
  /**
   * line up sierpinski
   * @param {object} main - main program
   * @param {number} scale - size
   * @return {array} arr - array included shapes
   */
  static sierpinski(main, scale) {
    const arr = new Array();
    const num = main.dat.params.lineUp.numberE;
    const n = Math.min(Math.floor(main.dat.params.lineUp.numberE / 1000), 5);

    this.carpet(main, main.width, main.height, n, 0, 0, arr);

    return arr;
  }

  static carpet(main, width, height, n, x0, y0, arr) {
    const multiple = {
      scaleOne: width / 3,
      scaleTwo: height / 3,
      rotationAngle: main.dat.params.common.rotationAngle
    };

    if (n === 0) return arr;
    n--;
    const tw = width / 3;
    const th = height / 3;
    const s = new Shape(main, tw + x0 + tw / 2, th + y0 + th / 2, multiple);
    arr.push(s);

    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (!(y === 1 && x === 1)) {
          this.carpet(main, tw, th, n, x0 + x * tw, y0 + y * th, arr);
        }
      }
    }
  }
  
  /**
   * line up circular
   * @param {object} main - main program
   * @param {number} scale - size
   * @return {array} arr - array included shapes
   */
  static circular(main, scale) {
    const arr = new Array();
    const num = Math.floor(main.dat.params.lineUp.numberE / 100);
    let s;

    s = new Shape(main, main.width / 2, main.height / 2);
    arr.push(s);
    for (let i = 1; i < num; i++) {
      for (let j = 0; j < i * 6; j++) {
        const nx = Math.cos(Math.PI * 2 / (6 * i) * j) * scale * i + main.width / 2;
        const ny = Math.sin(Math.PI * 2 / (6 * i) * j) * scale * i + main.height / 2;
 
        s = new Shape(main, nx, ny);
        arr.push(s);
      }
    }

    return arr;
  }
  
  /**
   * line up fibonacci
   * @param {object} main - main program
   * @param {number} scale - size
   * @return {array} arr - array included shapes
   */
  static fibonacci(main, scale) {
    const arr = new Array();
    const num = Math.floor(main.dat.params.lineUp.numberE);
    let size = num / 5;
    let r = num;
   
    for (let i = 0; i < num / 3; i++) {
      const multiple = {
        scaleOne: size * 2,
        rotationAngle: main.dat.params.common.rotationAngle
      };
      const rad = 137.5 * Math.PI / 180 * i;
      const nx = Math.cos(rad) * r + main.width / 2;
      const ny = Math.sin(rad) * r + main.height / 2;
      const s = new Shape(main, nx, ny, multiple);
      
      arr.push(s);
      size *= 0.974;
      r *= 0.974;
    }
    
    return arr;
  }
}
