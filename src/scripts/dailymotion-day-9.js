import {Sketch} from './pages/dailymotion/days/9/sketch';

(() => {
  window.addEventListener('load', () => {
    const loading = document.getElementsByClassName('loading')[0];
    loading.classList.add('loaded');
    
    const s = new Sketch();
  });
})();