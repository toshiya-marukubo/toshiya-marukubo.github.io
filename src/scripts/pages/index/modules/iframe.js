export class Iframe {
  constructor() {
    this.isDisplayingIframe = false;
    this.lastFocus = document.getElementsByTagName('h1')[0].firstElementChild;
    
    this.iframe = document.getElementsByClassName('iframe')[0];
    this.iframeElm = document.getElementsByTagName('iframe')[0];
    this.frame = document.getElementsByClassName('frame')[0];
    this.title = document.getElementsByClassName('iframe-title')[0];
    this.iframeLists = document.getElementsByClassName('iframe-lists')[0];
    this.git = document.getElementsByClassName('iframe-git')[0];
    this.closeButton = document.getElementsByClassName('iframe-closeButton')[0];
    
    this.setupEvents(); 
  }

  initialize() {
    this.isDisplayingIframe = false;
    
    this.iframe.classList.remove('iframe-show');
    this.frame.classList.remove('iframe-show');
    this.title.classList.remove('iframe-show');
    this.iframeLists.classList.remove('iframe-show');
  }

  addIframe(e, data) {
    e.stopPropagation();

    this.isDisplayingIframe = true;
    this.iframeElm.contentWindow.location.replace(data.href);

    this.iframe.classList.add('iframe-show');
    this.frame.classList.add('iframe-show');
    this.title.classList.add('iframe-show');
    this.iframeLists.classList.add('iframe-show');
    
    this.git.setAttribute('href', data.git);

    this.title.firstElementChild.textContent = '#' + data.day;
    this.title.lastElementChild.textContent = data.category;
  }

  removeIframe(e) {
    e.preventDefault();
    
    this.isDisplayingIframe = false;
    
    this.iframe.classList.remove('iframe-show');
    this.iframe.classList.add('iframe-hide');
    
    this.frame.classList.remove('iframe-show');
    this.frame.classList.add('iframe-hide');
    
    this.title.classList.remove('iframe-show');
    this.title.classList.add('iframe-hide');
    
    this.iframeLists.classList.remove('iframe-show');
    this.iframeLists.classList.add('iframe-hide');
  }

  setupEvents() {
    this.closeButton.addEventListener('click', this.removeIframe.bind(this), false);
    
    this.iframe.addEventListener('animationend', (e) => {
      e.stopPropagation();

      if (e.animationName === 'iframe-show-animation') {
        setTimeout(() => {
          this.title.focus();
        }, 800);
      }
      
      if (e.animationName === 'iframe-hide-animation') {
        setTimeout(() => {
          this.lastFocus.focus();
        }, 800);

        this.iframe.classList.remove('iframe-hide');
        this.iframeElm.contentWindow.location.replace('./works/days/empty.html');
      }
    });

    this.frame.addEventListener('animationend', (e) => {
      e.stopPropagation();
      
      if (e.animationName === 'iframe-hide-animation') {
        this.frame.classList.remove('iframe-hide');
      }
    });
    
    this.title.addEventListener('animationend', (e) => {
      e.stopPropagation();
      
      if (e.animationName === 'iframe-hide-animation') {
        this.title.classList.remove('iframe-hide');
      }
    });
    
    this.iframeLists.addEventListener('animationend', (e) => {
      e.stopPropagation();
      
      if (e.animationName === 'iframe-hide-animation') {
        this.iframeLists.classList.remove('iframe-hide');
      }
    });
    
    this.iframeElm.addEventListener('load', () => {
      const back = this.iframeElm.contentWindow.document.getElementsByClassName('back')[0];
      
      if (back) {
        back.style.display = 'none';
      } 
    });
  }

  isDisplaying() {
    return this.isDisplayingIframe;
  }
}
