// scripts
import {FullScreen} from './pages/utilities/fullscreen';
import {popup} from './pages/study-of-webgl/modules/popup';
import {Sketch} from './pages/study-of-webgl/works/migration/sketch';

(() => {
  window.addEventListener('load', () => {
    popup();
    
    const loading = document.getElementsByClassName('loading')[0];
    loading.classList.add('loaded');

    const F = new FullScreen(false);
    const S = new Sketch();
  });
})();
