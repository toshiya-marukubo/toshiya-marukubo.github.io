// styles
import '../styles/works.styl';

// scripts
import {GetItemsDataFromJSON} from './pages/works/get-items-data-from-json';

(() => {
  window.addEventListener('DOMContentLoaded', () => {
    const loading = document.getElementsByClassName('loading')[0];
    loading.classList.add('loaded');

    const getJSON = new GetItemsDataFromJSON('./dist/assets/json/codepen.json');
  });
})();
