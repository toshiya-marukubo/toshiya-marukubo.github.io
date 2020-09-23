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
  let flg = false;
  let y;
  let dy;
  
  // init 
  for (let i = 0; i < 5; i++) {
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
    div.style.height = H + 'px';
    div.style.background = rgbText;
    main.appendChild(div);
    colorLists = document.getElementsByClassName('color');
    for (let i = 0; i < colorLists.length; i++) {
      colorLists[i].addEventListener('click', function() {
        const text = this.textContent;
        copyColor(text);
      }, false);
    }
  }

  function removeDiv() {
    let divs = document.getElementsByTagName('div');
    divs[0].parentNode.removeChild(divs[0]);
    y = document.documentElement.scrollTop || document.body.scrollTop;
    dy = document.body.clientHeight;
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

  // event
  window.addEventListener('scroll', function() {
    y = document.documentElement.scrollTop || document.body.scrollTop;
    dy = document.body.clientHeight;
    if (y > dy - (dy / 3) && flg === false) {
      flg = true;
      makeDiv();
      removeDiv();
    }
    const ratio = (y / H).toFixed(2);
    const num = 1 - (ratio - Math.floor(ratio)); 
    for (let i = 0; i < divs.length; i++) {
      const o = divs[i].offsetTop;
      if (y > o && y < divs[i + 1].offsetTop) {
        divs[i].style.opacity = num;
      }
    }
  }, false);

  window.addEventListener('resize', function() {
    let X = window.innerWidth;
    if (X < 500) {
      return;
    }
    H = window.innerHeight; 
    for (let i = 0; i < divs.length; i++) {
      divs[i].style.height = H + 'px';
    }
  }, false);

})();
