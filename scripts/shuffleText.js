/*
* File Name / shuffleText.js
* Created Date / Nov 15, 2020
* Aurhor / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
*/

function ShuffleText(class_name, onload, delay, itere_number, itere_speed, displayed_speed, i) {
  this.element = class_name;
  this.itere_number = itere_number;
  this.itere_speed = itere_speed;
  this.index = delay === true ? i + 1 : 1;
  this.displayed_speed = displayed_speed;
  this.top = this.element.getBoundingClientRect().top;
  this.texts = this.element.textContent;
  this.start_texts = this.texts;
  this.texts_arr = [];
  this.texts_new_arr = [];
  this.new_text = '';
  this.isRunning = false;
}

ShuffleText.prototype.createNewArr = function() {
  for (var i = 0; i < this.texts.length; i++) {
    this.texts_arr.push(this.texts[i]);
  }
  while(this.texts_arr.length > 0) {
    var num = Math.floor(this.texts_arr.length * Math.random());
    this.texts_new_arr.push(this.texts_arr[num]);
    this.texts_arr.splice(num, 1);
  }
};

ShuffleText.prototype.createNewTexts = function() {
  for (var i = 0; i < this.texts_new_arr.length; i++) {
    this.new_text += this.texts_new_arr[i];
  }
  this.element.textContent = this.new_text;
};

ShuffleText.prototype.reset = function() {
  this.new_text = '';
  this.texts_arr = [];
  this.texts_new_arr = [];
};

ShuffleText.prototype.render = function() {
  this.createNewArr();
  this.createNewTexts();
  this.reset();
};

ShuffleText.prototype.iteration = function(ev) {
  if (this.isRunning !== false) return;
  if (ev === true) this.index = 1;
  this.isRunning = true;
  var that = this;
  for (var i = 0; i < this.itere_number; i++) {
    (function(i) {
      setTimeout(function() {
        that.render();
        if (i === that.itere_number - 1) {
          that.element.textContent = '';
          for (var j = 0; j < that.start_texts.length; j++) {
            (function(j) {
              setTimeout(function() {
                that.element.textContent += that.start_texts[j];
                if (j === that.start_texts.length - 1) {
                  that.isRunning = false;
                }
              }, j * that.displayed_speed);
            })(j);
          }
        }
      }, i * that.index * that.itere_speed);
    })(i);
  }
};

function shuffleInit(class_name, onload, delay, itere_number, itere_speed, displayed_speed) {
  window.addEventListener('load', function() {
    var classArr = [];
    var classes = document.getElementsByClassName(class_name);
    for (var i = 0; i < classes.length; i++) {
      var s = new ShuffleText(classes[i], onload, delay, itere_number, itere_speed, displayed_speed, i);
      classArr.push(s);
    }
    
    if (onload === true) {
      for (var i = 0; i < classArr.length; i++) {
        classArr[i].iteration();
      }
    }

    for (var i = 0; i < classArr.length; i++) {
      (function(i) {
        classArr[i].element.addEventListener('mouseover', function() {
          classArr[i].iteration(true);
        }, false);
      })(i);
    }
  }, false);
}

shuffleInit('shuffleText', true, true, 50, 10, 80); // classname, itere_number, itere_speed, displayed_speed
