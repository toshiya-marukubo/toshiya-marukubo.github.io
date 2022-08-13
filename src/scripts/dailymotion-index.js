// styles
import '../styles/dailymotion.styl';

// scripts
import { FullScreen } from './pages/dailymotion/modules/full-screen';
import { DisplayIframe } from './pages/dailymotion/modules/display-iframe';
import { Sketch } from './pages/dailymotion/index/sketch';

(() => {
  window.addEventListener('load', () => {
    const loading = document.getElementsByClassName('loading')[0];
    loading.classList.add('loaded');
    
    const F = new FullScreen(false);
    const a = new DisplayIframe();
    const s = new Sketch();
  });
})();
