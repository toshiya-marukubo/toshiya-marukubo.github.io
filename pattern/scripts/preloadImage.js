/*
* File Name / preloadImage.js
* Created Date / Jun 21, 2020
* Auther / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
*/

(function() {
  'use strict';
  
  var imgs = [
    './images/poop.png',
    './images/komochikobenkeigoushi.png',
    './images/kobenkeigoushi.png',
    './images/benkeigoushi2.png',
    './images/benkeigoushi.png',
    './images/okinagoushi.png',
    './images/misokoshigoushi.png',
    './images/yosujigoushi.png',
    './images/misujigoushi.png',
    './images/futasujigoushi.png',
    './images/shoujigoushi.png',
    './images/komochigoushi.png',
    './images/kogoushi.png',
    './images/gobangoushi.png',
    './images/mijingoushi.png',
    './images/kuruwatsunagi.png',
    './images/kuginukitsunagi.png',
    './images/sorobanjima.png',
    './images/ishidatami2.png',
    './images/amejima.png',
    './images/yamajimon.png',
    './images/tatewaku.png',
    './images/yorokejima.png',
    './images/ryoukomochijima.png',
    './images/komochijima.png',
    './images/ryoutakijima.png',
    './images/katatakijima.png',
    './images/yatarajima2.png',
    './images/yatarajima.png',
    './images/boujima.png',
    './images/katsuojima.png',
    './images/mijinsuji.png',
    './images/mansuji.png',
    './images/sensuji.png',
    './images/misujidate.png',
    './images/kindooshi.png',
    './images/ararekomon.png',
    './images/kuzureasanoha.png',
    './images/asanoha.png',
    './images/kanoko.png',
    './images/uroko.png',
    './images/takedabishi.png',
    './images/ishidatami.png',
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
