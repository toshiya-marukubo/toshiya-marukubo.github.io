/*
* File Name / movePage.js
* Created Date / Jun 15, 2020
* Auther / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
*/

(function() {
  'use strict';
  window.addEventListener('DOMContentLoaded', function() {
    
    var body = document.getElementsByTagName('body')[0];
    var works = [
      'chikurin',
      'kozakura',
      'matsubamaru',
      'kamezoukomon',
      'mimasutsunagi',
      'mimasumon',
      'poop',
      'komochikobenkeigoushi',
      'kobenkeigoushi',
      'benkeigoushi2',
      'benkeigoushi',
      'okinagoushi',
      'misokoshigoushi',
      'yosujigoushi',
      'misujigoushi',
      'futasujigoushi',
      'shoujigoushi',
      'komochigoushi',
      'kogoushi',
      'gobangoushi',
      'mijingoushi',
      'kuruwatsunagi',
      'kuginukitsunagi',
      'sorobanjima',
      'ishidatami2',
      'amejima',
      'yamajimon',
      'tatewaku',
      'yorokejima',
      'ryoukomochijima',
      'komochijima',
      'ryoutakijima',
      'katatakijima',
      'yatarajima2',
      'yatarajima',
      'boujima',
      'katsuojima',
      'mijinsuji',
      'mansuji',
      'sensuji',
      'misujidate',
      'kindooshi',
      'ararekomon',
      'kuzureasanoha',
      'asanoha',
      'kanoko',
      'uroko',
      'takedabishi',
      'ishidatami',
      'narihirabishi',
      'anpanman',
      'irekobishi',
      'sankuzushi',
      'gokuzushi',
      'kikkouhanabishi',
      'komochikikkou',
      'kikkoutsunagi',
      'amime',
      'hanasippou',
      'sippoutsunagi',
      'hoshisippou',
      'hanaseigaiha',
      'kikuseigaiha',
      'seigaiha'
    ];

    function getUrl() {
      var pathname = location.pathname;
      var pathArr = pathname.split('/');
      var pageName = pathArr.splice(-2, 1);
      var worksIndex = works.indexOf(pageName[0]);
      worksIndex === works.length - 1 ? worksIndex = 0 : worksIndex += 1;
      return '../' + works[worksIndex] + '/index.html';
    }

    function fadeOut(url) {
      body.setAttribute('class', 'fadeOut');
      setTimeout(function() {
      //body.style.display = 'none';
        location.href = url;
      }, 300);
    }

    canvas.addEventListener('click', function(e) {
      fadeOut(getUrl());
    }, false);

    /*
    var touchStartY;
    var touchMoveY;
    var touchEndY;

    canvas.addEventListener('touchstart', function(e) {
      var touch = e.targetTouches[0];
      touchStartY = touch.pageY;
    }, false);

    canvas.addEventListener('touchmove', function(e) {
      var touch = e.targetTouches[0];
      touchMoveY = touch.pageY;
      touchEndY = touchStartY - touchMoveY;
      if (touchEndY > 50) {
        fadeOut(getUrl());
      }
    }, false);

    canvas.addEventListener('touchend', function(e) {
      touchStartY = null;
      touchMoveY = null;
      touchEndY = null;
    }, false);
    */

  });
})();
