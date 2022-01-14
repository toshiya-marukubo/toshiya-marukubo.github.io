/*
(() => {
  window.addEventListener('load', () => {
    let vh = visualViewport.height * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    window.addEventListener('resize', () => {
      let vh = visualViewport.height * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  });
})();
*/
(() => {
  window.addEventListener('load', () => {
    document.getElementsByClassName('header-container')[0].style.height = window.innerHeight + 'px';

    window.addEventListener('resize', () => {
      document.getElementsByClassName('header-container')[0].style.height = window.innerHeight + 'px';
    });
  });
})();
