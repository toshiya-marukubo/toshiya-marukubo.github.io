/**
* File Name / happyMeal.js
*/

/*MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMNMMMNMMMNMMMNMMMNMMMNMMMNMMMNMMMNMMMNMMMNMMMNMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN
MMNMMNMMNMMNMNMMNMMNMNMMNMMNMNMMNMMNMNMMNMMNMNMMMM
MMMNMMMNMMMMMMNMMMNMMMMNMMMMMMNMMMNMMMMNMMMMMMNMMM
MNMMNMMMNMNMNMMNMMMNMMNMMNMNMMMNMMMNMMNMMNMNMMMNMN
MMNMMNMMMNMMMNMMNMMHMNMMMMNMNMHMMNMMNMMMNMMMNMMMNM
MMMMMMNMMMMNMMMM#!.(, TNMMN#!.., TMMMNMMMMNMMNMMMM
MNMNMMMNMMNMMMN@ .MMNc ?MMF .MMMc ?MMMNMMNMMNMNMMN
MMNMNMMMNMMMNM# `dMMMN.`d# `dMMNN.`4MNMMNMMMMMMNMM
MMMMMNMMMNMMMN\ .MMMMM]  '`.MMNMM] .MMMMMNMNMNMMMM
MNMMNMMNMMNMM#  (MMNMMN`  `(MMMMMN  JMNMMMNMMMNMNM
MMNMMMNMMMMMN% `dMMMNMM.  `MMNMMNM  .MMNMMMMNMMMMN
MMMNMMMNMNMMM`` NMMNMMN{   NMMNMMM;  MMMNMNMMNMMMM
MNMMNMMMNMMM# `.MMNMMMM] `.MMMMNMM] `JMMMNMMMMNMNM
MMNMMNMMMMNMF `.MMMMNMM]  ,MMNMMNM]` -MMMMMNMMMNMM
MMMMMMNMMNMMF` ,MNMMMMN]` ,MMNMMMMF  ,MNMMNMNMMMMN
MNMNMMMNMMMM] `,MMNMNMMMMMMMMMNMMMF `,#XMNMMMNMMNM
MMNMNMMMNMNMMMNMMNMMMNMMMMMNMMMNMMMMMMMMMMMMMMNMMM
MMMMMNMMMNMMMMMNMMMNMMMMNMMMNMMNMNMMNMMNMNMNMMMNMM
MNMMNMMNMMMNNMMMNMMMNMMNMMNMMNMMMMNMMNMMNMMMNMMMNM
MMNMMMNMMMNMMNMMMNMMMNMMMNMMMMNMMNMMMMNMMMNMMNMMMN
MMMNMMMNMMMMMMNMMMNMMMNMMMNMMNMMNMMNMMMNMMMNMMNMMM
MNMMNMMMNMNMMNMMNMMNMMMNMMMNMMMMMMNMMNMMNMMMNMMNMM
MMNMMNMMMNMMNMMNMMNMNMMMNMMMNMNMMNMMMMNMMNMMMMMMNM
MMMMMMNMMMMNMMMMMNMMMNMMNMNMMMMNMMMNMMMMMMNMNMNM*/

/**
* get random number.
* @param {number} min - min number.
* @param {number} max - max number.
*/

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
* create happy meal.
* @param {object} body - body element.
* @param {string} menu - text.
* @param {number} font_size - font size.
* @param {number} x - coordinate x.
* @param {number} y - coordinate y.
* @param {number} direction_x - direction x.
* @param {number} direction_y - direction y.
* @param {number} mult_x - mult x.
* @param {number} mult_y - mult y.
* @param {number} gravity - gravity.
*/

function HappyMeal(body, menu, font_size, x, y, direction_x, direction_y, mult_x, mult_y, gravity, gravity_random) {
  this.body = body;
  this.menu = menu;
  this.fs = font_size;
  this.x = x - font_size / 2;
  this.y = y - font_size / 2;
  this.vx = direction_x * Math.random() * mult_x;
  this.vy = direction_y * Math.random() * mult_y;
  this.gravity = gravity_random === true ? Math.random() : gravity;
  this.removeMe = false;
  this.style = null;
  this.elem = null;
  this.animationId = null;
  
  this.init();
}

HappyMeal.prototype.init = function() {
  var elem = document.createElement('span');

  elem.textContent = this.menu;
  elem.style.fontSize = this.fs + 'px';
  elem.style.position = 'fixed';
  elem.style.userSelect = 'none';
  elem.style.zIndex = '9999';
  elem.style.top = Math.floor(this.y) + 'px';
  elem.style.left = Math.floor(this.x) + 'px';
  
  this.style = elem.style;
  this.elem = elem;
  this.body.appendChild(elem);
};

HappyMeal.prototype.updatePosition = function() {
  this.style.left = Math.floor(this.x) + 'px';
  this.style.top = Math.floor(this.y) + 'px';
  this.x += this.vx;
  this.y += this.vy;
  this.vy += this.gravity;
};

HappyMeal.prototype.ate = function() {
  if (parseInt(this.style.top) > window.innerHeight) {
    this.removeMe = true;
  }
};

HappyMeal.prototype.render = function() {
  this.updatePosition();
  this.ate();
  
  if (this.removeMe) {
    this.elem.parentNode.removeChild(this.elem);
    cancelAnimationFrame(this.animationId);
    return;
  }

  this.animationId = requestAnimationFrame(this.render.bind(this));
};

/**
* initialize.
* @param {obj} option - option object.
*/
function happyMealInit(option) {
  var min_size = option.min_size;
  var max_size = option.max_size;
  var button_id = option.button_id;
  var direction_x = option.direction_x;
  var direction_y = option.direction_y;
  var mult_x = option.mult_x;
  var mult_y = option.mult_y;
  var gravity = option.gravity;
  var gravity_random = option.gravity_random;
  
  var button = document.getElementById(button_id);
  var body = document.getElementsByTagName('body')[0];
  var menu = ['🍔', '🍟', '🥤'];
  
  button.addEventListener('click', function(e) {
    e.preventDefault();
    var h = new HappyMeal(
      body,
      menu[rand(0, menu.length - 1)],
      rand(min_size, max_size),
      e.clientX || button.getBoundingClientRect().left,
      e.clientY || button.getBoundingClientRect().top,
      direction_x,
      direction_y,
      mult_x,
      mult_y,
      gravity,
      gravity_random
    );
    h.render();
  }, false);
};
