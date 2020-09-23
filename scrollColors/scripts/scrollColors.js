/*
* File Name / scrollColor.js
* Created Date / Sep 23, 2020
* Aurhor / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
*/

(function() {
  'use strict';
  const body = document.getElementsByTagName('body')[0];
  const main = document.getElementsByTagName('main')[0];
  const copy = document.getElementById('copy');
  let colorLists = document.getElementsByClassName('color');
  let divs = document.getElementsByTagName('div');
  let H = window.innerHeight;
  let W = window.innerWidth;
  let flg = false;
  let y;
  let dy;
  
  // init 
  for (let i = 0; i < 1; i++) {
    makeDiv(i);
  }

  // creat div
  function makeDiv(i) {
    const div = document.createElement('div');
    const ul = document.createElement('ul');
    const rgbL = document.createElement('li');
    const codeL = document.createElement('li');
    const r = Math.floor(Math.random() * 255 + 1);
    const g = Math.floor(Math.random() * 255 + 1);
    const b = Math.floor(Math.random() * 255 + 1);
    const codeR = Number(r).toString(16);
    const codeG = Number(g).toString(16);
    const codeB = Number(b).toString(16);
    let rgbText = 'rgb(' + r + ', ' + g + ', ' + b + ')';
    let codeText = '#' + codeR + codeG + codeB;
    if (i === 0) {
      rgbText = 'rgb(255, 255, 255)';
      codeText = '#ffffff';
    }
    rgbL.textContent = rgbText;
    codeL.textContent = codeText;
    rgbL.setAttribute('class', 'color');
    codeL.setAttribute('class', 'color');
    ul.appendChild(rgbL);
    ul.appendChild(codeL);
    div.appendChild(ul);
    div.style.background = rgbText;
    main.appendChild(div);
    colorLists = document.getElementsByClassName('color');
    for (let i = 0; i < colorLists.length; i++) {
      colorLists[i].addEventListener('click', function() {
        const text = this.textContent;
        copyColor(text);
      }, false);
    }
    div.setAttribute('class', 'in');
  }

  function removeDiv() {
    let divs = document.getElementsByTagName('div');
    if (divs.length === 1) return;
    divs[0].parentNode.removeChild(divs[0]);
  }

  // copy
  for (let i = 0; i < colorLists.length; i++) {
    colorLists[i].addEventListener('click', function() {
      const text = this.textContent;
      copyColor(text);
    }, false);
  }

  function copyColor(text) {
    let inputText = document.createElement('input');
    inputText.setAttribute('type', 'text');
    body.appendChild(inputText);
    inputText.setAttribute('value', text);
    inputText.select();
    document.execCommand('copy');
    inputText.parentNode.removeChild(inputText);
  }

  window.addEventListener('resize', function() {
    let afterW = window.innerWidth;
  }, false);

  let startY = 0;
  let timer = null;
  let meter = document.getElementById('meter');

  window.addEventListener('wheel', function(e) {
    startY += e.deltaY / 1000;
    if (startY < 0) startY = 0;
    let ratio = startY / 1 * 100;
    meter.style.height = ratio.toFixed(2) + '%';
    divs[0].style.opacity = 1 - startY;
    if (startY > 1) {
      clearTimeout(timer);
      timer = setTimeout(function() {
        meter.style.height = 0 + '%';
        makeDiv();
        removeDiv();
        startY = 0;
      }, 80);
    }
  });

  let touchStart;
  let touchMove;
  let touchEnd = 0;

  window.addEventListener('touchstart', function(e) {
    const touch = e.targetTouches[0];
    touchStart = touch.pageY;
  }, false);

  window.addEventListener('touchmove', function(e) {
    const touch = e.targetTouches[0];
    touchMove = touch.pageY;
    touchEnd += (touchStart - touchMove) / 5000;
    if (touchEnd < 0) touchEnd = 0;
    console.log(touchEnd);
    let ratio = touchEnd / 1 * 100;
    meter.style.height = ratio.toFixed(2) + '%';
    divs[0].style.opacity = 1 - touchEnd;
    if (touchEnd > 1) {
      clearTimeout(timer);
      timer = setTimeout(function(){
        meter.style.height = 0 + '%';
        makeDiv();
        removeDiv();
        touchEnd = 0;
      }, 80);
    }
  }, false);

})();
