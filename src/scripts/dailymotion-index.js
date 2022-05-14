// styles
import '../styles/dailymotion.styl';

// scripts
import { DisplayIframe } from './pages/dailymotion/modules/display-iframe';
import { Sketch } from './pages/dailymotion/index/sketch';

(() => {
  window.addEventListener('load', () => {
    document.body.classList.remove('preload');

    const loading = document.getElementsByClassName('loading')[0];
    loading.classList.add('loaded');
    
    const a = new DisplayIframe();
    const s = new Sketch();
  });
})();
