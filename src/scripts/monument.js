// scripts
import {confirmation} from './pages/study-of-webgl/modules/confirmation.js';
import {FullScreen} from './pages/utilities/fullscreen';
import {popup} from './pages/study-of-webgl/modules/popup';
import {Sketch} from './pages/study-of-webgl/works/monument/sketch';

(() => {
  window.addEventListener('load', () => {
    confirmation('If you are not good at light stimulation please push cancel button.');
    
    popup();
    
    const loading = document.getElementsByClassName('loading')[0];
    loading.classList.add('loaded');

    const F = new FullScreen(false);
    const S = new Sketch();
  });
})();
