/*
* File Name / preloadImage.js
* Created Date / Jun 21, 2020
* Auther / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
*/

(function() {
  'use strict';
  
  var imgs = [
    './images/narihirabishi.png',
    './images/anpanman.png',
    './images/irekobishi.png',
    './images/sankuzushi.png',
    './images/gokuzushi.png',
    './images/kikkouhanabishi.png',
    './images/kikkoutsunagi.png',
    './images/komochikikkou.png',
    './images/seigaiha.png',
    './images/amime.png',
    './images/hanasippou.png',
    './images/hoshisippou.png',
    './images/hsnaseigaiha.png',
    './images/kikuseigaiha.png',
    './images/sippoutsunagi.png'
  ];

  for (var i = 0; i < imgs.length; i++) {
    var img = document.createElement('img');
    img.src = imgs[i];
  }

})();
