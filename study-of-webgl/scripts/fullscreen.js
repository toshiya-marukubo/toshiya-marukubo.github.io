// https://coliss.com/articles/build-websites/operation/css/viewport-units-on-mobile.html
class FullScreen {
  constructor() {
    this.preHeight = this.height = window.innerHeight;
    this.setupEvents();
    this.initialize();
  }

  initialize() {
    this.vh = this.height * 0.01;
    document.documentElement.style.setProperty('--vh', `${this.vh}px`);
  }

  setupEvents() {
    window.addEventListener('load', this.onResize.bind(this), false);
  }

  onResize() {
    if (this.preHeight === window.innerHeight) {
      return;
    }

    this.initialize();
  }
}
