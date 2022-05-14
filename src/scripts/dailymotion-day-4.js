import {Sketch} from './pages/dailymotion/days/4/sketch';

(() => {
  window.addEventListener('load', () => {
    document.body.classList.remove('preload');

    const loading = document.getElementsByClassName('loading')[0];
    loading.classList.add('loaded');
    
    const s = new Sketch();
  });
})();
