// Reference
// https://coliss.com/articles/build-websites/operation/css/viewport-units-on-mobile.html
// Thank you so much.
export class FullScreen {
  constructor() {
    this.preWidth = window.innerWidth;
    this.setupEvents();
    this.initialize();
  }

  initialize() {
    const vh = window.innerHeight * 0.01;
    
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  setupEvents() {
    window.addEventListener('resize', this.onResize.bind(this), false);
  }

  onResize() {
    const w = window.innerWidth;

    if (this.preWidth === w ) {
      return;
    }

    this.preWidth = w;

    this.initialize();
  }
}
