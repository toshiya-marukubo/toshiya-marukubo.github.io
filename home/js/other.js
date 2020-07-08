(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Random Number
    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    // var 
    var urlArray = [
      'confetti',
      'circuit',
      'noisy',
      'aurora',
      'string',
      'cyberRainbow',
      'jump',
      'increase',
      'interstellar',
      'tapioca',
      'airfield',
      'toSix',
      'gon',
      'distance',
      'fun',
      'greeting',
      'countup',
      'jellyfish',
      'fighting',
      'playBallPool',
      'perfectNavigation',
      'range',
      'checkBox',
      'grayscaleParticle',
      'eyesight',
      'particleOnText',
      'falling',
      'particleOnPicture',
      'nostalgiaOrFear',
      'noise',
      'circle',
      'petal',
      'ultima',
      'angle',
      'turnsole',
      'farewell',
      'fake3dTriangle',
      'square',
      'wrinkle',
      'flare',
      'crazyRect',
      'illumina',
      'blooming',
      'textMotionSim',
      'tree',
      'flowers',
      'shapeOfUniverse',
      'fog',
      'poppingBall',
      'flock',
      'section9',
      'loop',
      'neuron',
      'gap',
      'lightBall',
      'slime',
      'nowLoading',
      'kanji',
      'bug',
      'goToTheMoon',
      'cell',
      'fairy',
      'link',
      'socialDistance',
      'stayHome',
      'sunFlower',
      'bigBang',
      'orangeKun',
      'particleParty',
      'mamaragan',
      'neonWave',
      'fullMoon',
      'chocolate',
      'happyValentine',
      'aquarium',
      'torch',
      'snowyLandscape',
      'kiraYaba',
      'fireworks',
      '65536',
      'rainyDay',
      'mellomelloMellow',
      'grassGrow',
      'fireball',
      'milkyWay',
      'starlight',
      'jewelrySnow',
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
