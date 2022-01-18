class ObserveWorks {
  constructor(className) {
    this.target = document.getElementsByClassName(className);
    this.targetArr = Array.from(this.target);
    this.options = {
      root: null,
      rootMargin: '0px',
      threshhold: 0.5
    };
    
    this.initialize();
  }

  initialize() {
    this.observer = new IntersectionObserver(this.addClass, this.options);

    for (let i = 0; i < this.targetArr.length; i++) {
      this.observer.observe(this.targetArr[i]);
    }
  }

  addClass(targets) {
    for (let i = 0; i < targets.length; i++) {
      if (targets[i].isIntersecting) {
        targets[i].target.classList.add('show');
      }
    }
  }
}
