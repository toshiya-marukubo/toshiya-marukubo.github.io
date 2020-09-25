/*
* File Name / scrollColor.js
* Created Date / Sep 23, 2020
* Aurhor / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
* Referenced / about change color https://yanohirota.com/color-converter/
*/

(function() {
  'use strict';
  const body = document.getElementsByTagName('body')[0];
  const main = document.getElementsByTagName('main')[0];
  const copy = document.getElementById('copy');
  let colorLists = document.getElementsByClassName('color');
  let divs = document.getElementsByTagName('div');
  let y;
  let dy;
  
  // init 
  makeDiv('rgb(255, 255, 255)', 'hsl(0, 0%, 100%)', '#ffffff');

  // creat div
  function makeDiv(rgb, hsl, hex) {
    const div = document.createElement('div');
    const ul = document.createElement('ul');
    const aR = document.createElement('a');
    const aHS = document.createElement('a');
    const aH = document.createElement('a');
    const rgbL = document.createElement('li');
    const hslList = document.createElement('li');
    const hexL = document.createElement('li');
    const r = Math.floor(Math.random() * 255 + 1);
    const g = Math.floor(Math.random() * 255 + 1);
    const b = Math.floor(Math.random() * 255 + 1);
    const hexR = Number(r).toString(16);
    const hexG = Number(g).toString(16);
    const hexB = Number(b).toString(16);
    // hsl
    const MAX = Math.max(r, g, b);
    const MIN = Math.min(r, g, b);
    let H;
    if (r === MAX) H = 60 * ((g - b) / (MAX - MIN));
    if (g === MAX) H = 60 * ((b - r) / (MAX - MIN)) + 120;
    if (b === MAX) H = 60 * ((r - g) / (MAX - MIN)) + 240;
    if (r === g === b) H = 0;
    if (H < 0) H += 360;
    let hslH = H.toFixed(0);
    let S = (MAX + MIN) / 2;
    if (S <= 127) S = (MAX - MIN) / (MAX + MIN);
    if (S >= 128) S = (MAX - MIN) / (510 - MAX - MIN);
    let hslS = (S * 100).toFixed(0);
    let L = ((MAX + MIN) / 2) * (100 / 255);
    let hslL = L.toFixed(0); 
    let rgbText = rgb || 'rgb(' + r + ', ' + g + ', ' + b + ')';
    let hslText = hsl || 'hsl(' + hslH + ', ' + hslS + '%, ' + hslL + '%)';
    let hexText = hex || '#' + hexR + hexG + hexB;
    aR.textContent = rgbText;
    aHS.textContent = hslText;
    aH.textContent = hexText;
    aR.setAttribute('href', '#');
    aHS.setAttribute('href', '#');
    aH.setAttribute('href', '#');
    rgbL.setAttribute('class', 'color');
    hslList.setAttribute('class', 'color');
    hexL.setAttribute('class', 'color');
    rgbL.appendChild(aR);
    hslList.appendChild(aHS);
    hexL.appendChild(aH);
    ul.appendChild(rgbL);
    ul.appendChild(hslList);
    ul.appendChild(hexL);
    div.appendChild(ul);
    div.style.background = rgbText;
    main.appendChild(div);
    colorLists = document.getElementsByClassName('color');
    for (let i = 0; i < colorLists.length; i++) {
      colorLists[i].addEventListener('click', function(e) {
        e.preventDefault();
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

  const button = document.getElementById('button');
  const fav = document.getElementById('fav');
  
  button.addEventListener('click', function() {
    const rgb = document.getElementsByClassName('color')[0];
    const hsl = document.getElementsByClassName('color')[1];
    const hex = document.getElementsByClassName('color')[2];
    const li = document.createElement('li');
    const a = document.createElement('a');
    const ol = document.getElementsByTagName('ol')[0];
    const lists = ol.children;
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].style.background == rgb.textContent) {
        return;
      }
    }
    if (lists.length > 9) {
      lists[0].parentNode.removeChild(lists[0]);
    }
    a.setAttribute('href', '#');
    a.textContent = ' ';
    li.appendChild(a);
    li.setAttribute('class', 'appear');
    li.style.background = rgb.textContent;
    fav.appendChild(li);
    li.addEventListener('click', function(e) {
      e.preventDefault();
      makeDiv(rgb.textContent, hsl.textContent, hex.textContent);
      removeDiv();
    }, false);
  }, false);

})();
