function GetJSON() {
  this.file = 'codepen.json';
  this.targetElement = document.getElementById('trashes');
  this.counterElement = document.getElementById('counter');
  this.count = 0;
  this.now = 0;
  this.index = 0;
  this.data = null;
  this.flg = false;
  this.number = 24;

  this.initialize();
}

GetJSON.prototype.initialize = function () {
  var that = this;
  
  this.setUpEvent();

  this.getJson(that.file).then(function (json) {
    that.data = json;

    return that.addItems();
  });
};

GetJSON.prototype.getJson = function (file) {
  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest();
    
    req.addEventListener('load', function () {
      var json = JSON.parse(req.responseText);
      
      resolve(json);
    }, false);
    
    req.open('GET', file, true);
    req.send(null);
  });
};

GetJSON.prototype.sortLovesToSmall = function (a, b) {
  return Number(b.loves) - Number(a.loves);
};

GetJSON.prototype.sortViewsToSmall = function (a, b) {
  return Number(b.views) - Number(a.views);
};

GetJSON.prototype.sortJson = function (data, type, dir) {
  var that = this;

  return new Promise(function (resolve, reject) {
    if (type === 'loves' && dir === 'small') {
      that.data.sort(that.sortLovesToSmall);
    }
    if (type === 'views' && dir === 'small') {
      that.data.sort(that.sortViewsToSmall);
    }
    resolve();
  });
};

GetJSON.prototype.createElement = function (elem, content) {
  var element = document.createElement(elem);
  
  if (content !== null) element.textContent = content;
  
  return element;
};

GetJSON.prototype.addItem = function (json, index) {
  var that = this;

  return new Promise(function (resolve, reject) {
    var obj = {};
    var data = json[index];

    // div
    var div = that.createElement('div', null);
    div.setAttribute('class', 'trash');

    // link
    var a = that.createElement('a', null);
    a.setAttribute('href', data.link);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noreferrer');

    // image
    var image = that.createElement('img', null);
    image.setAttribute('src', data.image);
    image.setAttribute('alt', 'My works image from CodePen');
    
    // loves and views
    var ul = that.createElement('ul', null);
    var liH = that.createElement('li', '❤️' + data.loves);
    var liV = that.createElement('li', '👀 ' + data.views);
   
    // go to codepen
    var p = that.createElement('p', 'Go to CodePen.');
    
    ul.appendChild(liH);
    ul.appendChild(liV);

    a.appendChild(image);
    
    div.appendChild(a);
    div.appendChild(p);
    div.appendChild(ul);

    that.targetElement.appendChild(div);
    
    obj.image = data.image;
    obj.element = div;
     
    resolve(obj);
  });
};

GetJSON.prototype.loadImage = function (obj) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    
    img.src = obj.image;
    img.addEventListener('load', function () {
      resolve(obj.element);
    }, false);
  });
};

GetJSON.prototype.displayImage = function (elm) {
  elm.classList.add('show');
};

GetJSON.prototype.deleteItems = function () {
  var that = this;
  var trashes = document.getElementsByClassName('trash');
  
  return new Promise(function (resolve, reject) {
    that.targetElement.textContent = null;
    resolve();
  });
};

GetJSON.prototype.delay = function (time, elm) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(elm);
    }, time);
  });
};

GetJSON.prototype.addItems = function () {
  var that = this;
  
  if (this.count >= this.number) {
    this.count = 0;
    this.flg = false;
    
    return;
  }
  
  this.addItem(this.data, this.index).then(function (obj) {
    that.index++;
    that.count++;
    console.log(that.index, that.count);
    
    return that.loadImage(obj);
  }).then(function (elm) {
    return that.delay(40, elm);
  }).then(function (elm) {
    that.drawCounter(); 
    
    return that.displayImage(elm);
  }).then(function () {
    that.addItems();
  });
};

GetJSON.prototype.drawCounter = function (e) {
  var len = document.getElementsByClassName('trash').length;
  var number = Math.ceil(len / this.data.length * 100);
  
  this.counterElement.textContent = number + ' %';
};

GetJSON.prototype.onScroll = function (e) {
  var docHeight = document.body.scrollHeight;
  var docScrollTop = window.pageYOffset;
  var scrollPosition = window.innerHeight + window.pageYOffset;
  
  if (this.flg) return;

  if (docHeight * 0.9 <= scrollPosition) {
    this.addItems();
    this.flg = true;
  } else {
    return;
  }
};

GetJSON.prototype.setUpEvent = function () {
  var that = this;
  
  window.addEventListener('scroll', this.onScroll.bind(this), false);

  var ol = document.getElementsByTagName('ol')[0];
  this.olLi = ol.children;

  for (var i = 0; i < this.olLi.length; i++) {
    var that = this;
    
    this.olLi[i].addEventListener('click', function(e) {
      e.preventDefault();
       
      for (var j = 0; j < that.olLi.length; j++) {
        that.olLi[j].classList.remove('active');
      }

      this.classList.add('active');
      
      that.index = 0;
      
      switch (this.id) {
        case 'reset':
          that.deleteItems().then(function () {
            that.initialize();
          });
          break;
        case 'sortLovesToSmallBtn':
          that.deleteItems().then(function () {
            
            return that.sortJson(that.data, 'loves', 'small');
          }).then(function () {
            
            return that.addItems();
          });
          break;
        case 'sortViewsToSmallBtn':
          that.deleteItems().then(function () {
            
            return that.sortJson(that.data, 'views', 'small');
          }).then(function () {
            
            return that.addItems();
          });
          break;
        default:
          break;
      }
    });
  }
};

(function () {
  window.addEventListener('DOMContentLoaded', function () {
    console.clear();

    shuffleInit({
      class_name: 'shuffleText', // input your favorite class name.
      onload: true, // shuffle when loaded.
      delay: true, // displayed in order.
      number_of_iterations: 100,
      iteration_speed: 5,
      displayed_speed: 80,
    });

    var loading = document.getElementsByClassName('loading')[0];
    loading.classList.add('loaded');
    
    new GetJSON();
  });
})();
