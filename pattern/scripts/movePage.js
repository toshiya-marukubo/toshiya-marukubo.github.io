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
      'seigaiha',
      'kikuseigaiha',
      'hanaseigaiha',
      'hoshisippou',
      'sippoutsunagi',
      'hanasippou',
      'amime',
      'komochikikkou',
      'kikkoutsunagi',
      'kikkouhanabishi'
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
      //body.setAttribute('class', 'fadeOut');
      //setTimeout(function() {
        body.style.display = 'none';
        location.href = url;
      //}, 500);
    }

    canvas.addEventListener('wheel', function(e) {
      var y = e.deltaY;
      if (y > 50) {
        fadeOut(getUrl());
      }
    }, false);

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

  });
})();
