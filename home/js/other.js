(function() {
  'use strict';
  window.addEventListener('load', function() {
    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    var other = document.getElementById('other');
    var urlArray = [
      'jewelrySnow',
      'starlight',
      'milkyway',
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
      'lightBall'
    ];
    var a = document.createElement('a');
    other.textContent = '';
    a.textContent = 'Other';
    a.setAttribute('href', '../' + urlArray[rand(0, urlArray.length - 1)] + '/index.html');
    other.appendChild(a);
  });
})();
