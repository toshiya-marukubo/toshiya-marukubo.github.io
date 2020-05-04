(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Random Number
    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    // var 
    var urlArray = [
      'jewelrySnow',
      'starlight',
      'milkyWay',
      'fireball',
      'grassGrow',
      'mellomelloMellow',
      'rainyDay',
      '65536',
      'fireworks',
      'kiraYaba',
      'snowyLandscape',
      'torch',
      'aquarium',
      'happyValentine',
      'chocolate',
      'fullMoon',
      'neonWave',
      'mamaragan',
      'particleParty',
      'orangeKun',
      'bigBang',
      'sunFlower',
      'stayHome',
      'socialDistance',
      'link',
      'fairy',
      'cell',
      'goToTheMoon',
      'bug',
      'nowLoading',
      'kanji',
      'slime',
      'lightBall',
      'gap',
      'neuron',
      'loop'
    ];
    var pathname = location.pathname;
    var pathArr = pathname.split('/');
    var pageName = pathArr.splice(-2, 1);
    var resultIndex = urlArray.indexOf(pageName[0]);
    var a = document.createElement('a');

    resultIndex === urlArray.length - 1 ? resultIndex = 0 : resultIndex += 1;
    other.textContent = '';
    a.textContent = 'Other';
    a.setAttribute('href', '../' + urlArray[resultIndex] + '/index.html');
    other.appendChild(a);
  });
})();
