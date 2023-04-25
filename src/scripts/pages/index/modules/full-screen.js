// Reference
// https://coliss.com/articles/build-websites/operation/css/viewport-units-on-mobile.html
// https://zenn.dev/nanaki14/articles/media-query-hover
// Thank you so much.

export class FullScreen {
  constructor() {
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
    this.initialize();
  }
}
