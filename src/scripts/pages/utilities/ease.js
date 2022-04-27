/**
 * Return easing function.
 * @class Ease
 */
export class Ease {
  /**
   * if you are going to use dat.GUI. This function is return array.
   * @return {array} functions name in array. 
   */
  static returnEaseType() {
    const arr = [
      'linear',
      
      'easeInSine',
      'easeInCubic',
      'easeInQuint',
      'easeInCirc',
      'easeInElastic',
      'easeInQuad',
      'easeInQuart',
      'easeInExpo',
      'easeInBack',
      'easeInBounce',

      'easeOutSine',
      'easeOutCubic',
      'easeOutQuint',
      'easeOutCirc',
      'easeOutElastic',
      'easeOutQuad',
      'easeOutQuart',
      'easeOutExpo',
      'easeOutBack',
      'easeOutBounce',
      
      'easeInOutSine',
      'easeInOutCubic',
      'easeInOutQuint',
      'easeInOutCirc',
      'easeInOutElastic',
      'easeInOutQuad',
      'easeInOutQuart',
      'easeInOutExpo',
      'easeInOutBack',
      'easeInOutBounce',
    ];
    
    return arr;
  }
  
  /**
   * Return easing function.
   * @param {string} type - function name.
   * @return {function} easing function.
   */
  static returnEaseFunc(type) {
    if (type === 'linear') {
      return this.linear();
    }
    
    if (type === 'easeInSine') {
      return this.easeInSine();
    }
    
    if (type === 'easeInCubic') {
      return this.easeInCubic();
    }
    
    if (type === 'easeInQuint') {
      return this.easeInQuint();
    }
    
    if (type === 'easeInCirc') {
      return this.easeInCirc();
    }
    
    if (type === 'easeInElastic') {
      return this.easeInElastic();
    }
    
    if (type === 'easeInQuad') {
      return this.easeInQuad();
    }
    
    if (type === 'easeInQuart') {
      return this.easeInQuart();
    }
    
    if (type === 'easeInExpo') {
      return this.easeInExpo();
    }
    
    if (type === 'easeInBack') {
      return this.easeInBack();
    }
    
    if (type === 'easeInBounce') {
      return this.easeInBounce();
    }
    
    if (type === 'easeOutSine') {
      return this.easeOutSine();
    }
    
    if (type === 'easeOutCubic') {
      return this.easeOutCubic();
    }
    
    if (type === 'easeOutQuint') {
      return this.easeOutQuint();
    }
    
    if (type === 'easeOutCirc') {
      return this.easeOutCirc();
    }
    
    if (type === 'easeOutElastic') {
      return this.easeOutElastic();
    }
    
    if (type === 'easeOutQuad') {
      return this.easeOutQuad();
    }
    
    if (type === 'easeOutQuart') {
      return this.easeOutQuart();
    }
    
    if (type === 'easeOutExpo') {
      return this.easeOutExpo();
    }
    
    if (type === 'easeOutBack') {
      return this.easeOutBack();
    }
    
    if (type === 'easeOutBounce') {
      return this.easeOutBounce();
    }
    
    if (type === 'easeInOutSine') {
      return this.easeInOutSine();
    }
    
    if (type === 'easeInOutCubic') {
      return this.easeInOutCubic();
    }
    
    if (type === 'easeInOutQuint') {
      return this.easeInOutQuint();
    }
    
    if (type === 'easeInOutCirc') {
      return this.easeInOutCirc();
    }
    
    if (type === 'easeInOutElastic') {
      return this.easeInOutElastic();
    }
    
    if (type === 'easeInOutQuad') {
      return this.easeInOutQuad();
    }
    
    if (type === 'easeInOutQuart') {
      return this.easeInOutQuart();
    }
    
    if (type === 'easeInOutExpo') {
      return this.easeInOutExpo();
    }
    
    if (type === 'easeInOutBack') {
      return this.easeInOutBack();
    }
    
    if (type === 'easeInOutBounce') {
      return this.easeInOutBounce();
    }
  }
  
  static linear() {
    return (x) => {
      return x;
    };
  }
  
  // ease in
  static easeInSine() {
    return (x) => {
      return 1 - Math.cos((x * Math.PI) / 2);
    }
  }
  
  static easeInCubic() {
    return (x) => {
      return x * x * x;
    }
  }
  
  static easeInQuint() {
    return (x) => {
      return x * x * x * x * x;
    }
  }
  
  static easeInCirc() {
    return (x) => {
      return 1 - Math.sqrt(1 - Math.pow(x, 2));
    }
  }
  
  static easeInElastic() {
    return (x) => {
      const c4 = (2 * Math.PI) / 3;

      return x === 0
        ? 0
        : x === 1
        ? 1
        : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
    }
  }
  
  static easeInQuad() {
    return (x) => {
      return x * x;
    }
  }
  
  static easeInQuart() {
    return (x) => {
      return x * x * x * x;
    }
  }
  
  static easeInExpo() {
    return (x) => {
      return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
    }
  }
  
  static easeInBack() {
    return (x) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;

      return c3 * x * x * x - c1 * x * x;
    }
  }
  
  static easeInBounce() {
    const easeOutBounce = this.easeOutBounce();
    
    return (x) => {
      return 1 - easeOutBounce(1 - x);
    }
  }
  
  // ease out
  static easeOutSine() {
    return (x) => {
      return Math.sin((x * Math.PI) / 2);
    }
  }
  
  static easeOutCubic() {
    return (x) => {
      return 1 - Math.pow(1 - x, 3);
    }
  }
  
  static easeOutQuint() {
    return (x) => {
      return 1 - Math.pow(1 - x, 5);
    }
  }
  
  static easeOutCirc() {
    return (x) => {
      return Math.sqrt(1 - Math.pow(x - 1, 2));
    }
  }
  
  static easeOutElastic() {
    return (x) => {
      const c4 = (2 * Math.PI) / 3;

      return x === 0
        ? 0
        : x === 1
        ? 1
        : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    }
  }
  
  static easeOutQuad() {
    return (x) => {
      return 1 - (1 - x) * (1 - x);
    }
  }
  
  static easeOutQuart() {
    return (x) => {
      return 1 - Math.pow(1 - x, 4);
    }
  }
  
  static easeOutExpo() {
    return (x) => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }
  }
  
  static easeOutBack() {
    return (x) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;

      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }
  }
  
  static easeOutBounce() {
    return (x) => {
      const n1 = 7.5625;
      const d1 = 2.75;

      if (x < 1 / d1) {
          return n1 * x * x;
      } else if (x < 2 / d1) {
          return n1 * (x -= 1.5 / d1) * x + 0.75;
      } else if (x < 2.5 / d1) {
          return n1 * (x -= 2.25 / d1) * x + 0.9375;
      } else {
          return n1 * (x -= 2.625 / d1) * x + 0.984375;
      }
    }
  }
  
  // ease in out
  static easeInOutSine() {
    return (x) => {
      return -(Math.cos(Math.PI * x) - 1) / 2;
    }
  }
  
  static easeInOutCubic() {
    return (x) => {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }
  }
  
  static easeInOutQuint() {
    return (x) => {
      return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
    }
  }
  
  static easeInOutCirc() {
    return (x) => {
      return x < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    }
  }
  
  static easeInOutElastic() {
    return (x) => {
      const c5 = (2 * Math.PI) / 4.5;

      return x === 0
        ? 0
        : x === 1
        ? 1
        : x < 0.5
        ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
        : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
    }
  }
  
  static easeInOutQuad() {
    return (x) => {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }
  }
  
  static easeInOutQuart() {
    return (x) => {
      return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    }
  }
  
  static easeInOutExpo() {
    return (x) => {
      return x === 0
        ? 0
        : x === 1
        ? 1
        : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
        : (2 - Math.pow(2, -20 * x + 10)) / 2;
    }
  }
  
  static easeInOutBack() {
    return (x) => {
      const c1 = 1.70158;
      const c2 = c1 * 1.525;

      return x < 0.5
        ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
        : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    }
  }
  
  static easeInOutBounce() {
    const easeOutBounce = this.easeOutBounce();
    
    return (x) => {
      return x < 0.5
        ? (1 - easeOutBounce(1 - 2 * x)) / 2
        : (1 + easeOutBounce(2 * x - 1)) / 2;
    }
  }
}
