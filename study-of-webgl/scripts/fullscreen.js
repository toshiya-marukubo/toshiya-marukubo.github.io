// Reference
// https://coliss.com/articles/build-websites/operation/css/viewport-units-on-mobile.html
// Thank you so much.
alert(window.innerWidth);

class FullScreen {
  constructor() {
    alert(window.innerWidth);
    this.preWidth = window.innerWidth;
    this.setupEvents();
    this.initialize();
  }

  initialize() {
    this.vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${this.vh}px`);
  }

  setupEvents() {
    window.addEventListener('resize', this.onResize.bind(this), false);
  }

  onResize() {
    const w = window.innerWidth;

    if (this.preWidth === w) {
      return;
    }

    this.preWidth = w;

    this.initialize();
  }
}
