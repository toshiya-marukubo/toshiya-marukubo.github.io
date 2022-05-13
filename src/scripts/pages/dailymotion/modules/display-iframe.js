export class DisplayIframe {
  constructor() {
    this.targetElements = document.getElementsByClassName('call');
    this.iframe = document.getElementsByTagName('iframe')[0];
    this.closeButton = document.getElementsByClassName('closeButton')[0];
    this.preFocus = null;
    
    this.initialize();
  }

  initialize() {
    this.setupEvents();
  }

  setupEvents() {
    for (let i = 0; i < this.targetElements.length; i++) {
      const target = this.targetElements[i];
      
      target.addEventListener('click', this.add, false);

      target.addEventListener('click', (e) => {
        e.preventDefault();
        
        this.preFocus = target;
      }, false);
    }

    this.closeButton.addEventListener('click', this.remove.bind(this), false);
  }

  add(e) {
    e.preventDefault();

    const path = this.getAttribute('href');
    const iframe = document.getElementsByTagName('iframe')[0];
    const closeButton = document.getElementsByClassName('closeButton')[0];

    iframe.contentWindow.location.replace(path);
    iframe.classList.add('show');
    closeButton.classList.add('show');
    //closeButton.firstChild.focus();
  }

  remove(e) {
    e.preventDefault();

    this.iframe.contentWindow.location.replace('');
    this.iframe.classList.remove('show');
    this.closeButton.classList.remove('show');
    //this.preFocus.focus();
  }
}
