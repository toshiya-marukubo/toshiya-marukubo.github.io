(() => {
  window.addEventListener('load', () => {
    let target = document.getElementsByClassName('.image');
    target = Array.from(target); 
    
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    }
  
    const observer = new IntersectionObserver(cb, options);

    /*
    target.forEach(box => {
      observer.observe(box);
    });
    */

    for (let i = 0; i < target.length; i++) {
      target[i].observe(target[i]);
    }


    function cb(entries) {
      entries.forEach(entry => {
      if (entry.isIntersecting) {
          console.log('inter');
        }
      });
    }

  });
})();
