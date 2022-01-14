(() => {
  window.addEventListener('load', () => {
    //console.log(visualViewport.height, window.innerHeight);
    let vh = visualViewport.height * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    window.addEventListener('resize', () => {
      let vh = visualViewport.height * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  });
})();
