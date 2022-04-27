// styles
import '../styles/index.styl';

// scripts
import {Sketch} from './pages/top/sketch';

(() => {
  window.addEventListener('DOMContentLoaded', () => {
    const s = new Sketch();
    
    const loading = document.getElementsByClassName('loading')[0];
    loading.classList.add('loaded');
  });
})();
