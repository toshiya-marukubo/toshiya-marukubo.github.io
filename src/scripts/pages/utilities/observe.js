/**
 * class Observe
 * @param {string} className - Observe classes.
*/
export class Observe {
  constructor(className) {
    this.target = document.getElementsByClassName(className);
    this.targetArr = Array.from(this.target);
    this.options = {
      root: null,
      rootMargin: '0px',
      threshhold: 0
    };
    
    this.initialize();
  }

  initialize() {
    this.observer = new IntersectionObserver(this.func, this.options);

    for (let i = 0; i < this.targetArr.length; i++) {
      this.observer.observe(this.targetArr[i]);
    }
  }

  func(targets) {
    for (let i = 0; i < targets.length; i++) {
      if (targets[i].isIntersecting) {
        const t = targets[i].target;
      }
    }
  }
}
