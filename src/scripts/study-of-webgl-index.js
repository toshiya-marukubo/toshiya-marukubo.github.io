// styles
import '../styles/study-of-webgl-index.styl';

// scripts
import {FullScreen} from './pages/utilities/fullscreen';
import {GetItemsDataFromJSON} from './pages/study-of-webgl/index/get-items-data-from-json';
import {Sketch} from './pages/study-of-webgl/index/sketch';

(() => {
  window.addEventListener('DOMContentLoaded', () => {
    const loading = document.getElementsByClassName('loading')[0];
    loading.classList.add('loaded');
    
    const F = new FullScreen(false);
    const S = new Sketch();
    const G = new GetItemsDataFromJSON('../dist/assets/json/study-of-webgl-images.json');
  });
})();
