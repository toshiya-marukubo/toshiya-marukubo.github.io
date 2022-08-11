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
    this.preWidth = window.innerWidth;
    
    const vh = window.innerHeight * 0.01;
    
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // if on pc
    this.hasHover = window.matchMedia('(hover: hover)').matches;
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