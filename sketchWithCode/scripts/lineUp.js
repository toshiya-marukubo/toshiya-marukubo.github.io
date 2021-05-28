/**
 * LineUp
 * @class LineUp
 */
class LineUp {
  /**
   * choise arrangement
   * @param {String} type - arrangement
   * @param {Object} main - main program
   * @param {Number} scale - shape size
   * @return {Array} arr - array included shapes
   */
  static arrangement(type, main, scale) {
    let arr;
    switch (type) {
      case 'lattice':
        arr = this.lattice(main, scale);
        
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
    }
  }

  /**
   * line up lattice
   * @param {Object} main - main program
   * @param {Number} scale - shape size
   * @return {Array} arr - array included shapes
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
   * line up random
   * @param {Object} main - main program
   * @param {Number} scale - shape size
   * @return {Array} arr - array included shapes
   */
  static random(main, scale) {
    const arr = new Array();
    const num = main.dat.params.lineUp.numberE;
    
    for (let i = 0; i < num; i++) {
      const s = new Shape(main, main.width * Math.random(), main.height * Math.random());
      arr.push(s);
    }
    return arr;
  }

  /**
   * line up notOverlap
   * @param {Object} main - main program
   * @param {Number} scale - shape size
   * @return {Array} arr - array included shapes
   */
  static notOverlap(main, scale) {
    const arr = new Array();
    // from dat parameters
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
}
