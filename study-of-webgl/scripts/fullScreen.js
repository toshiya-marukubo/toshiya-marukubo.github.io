(() => {
  window.addEventListener('load', () => {
    const headerContainer = document.getElementsByClassName('header-container')[0];
    headerContainer.style.height = window.innerHeight;

    window.addEventListener('resize', () => {
      headerContainer.style.height = window.innerHeight;
    });
  });
})();
