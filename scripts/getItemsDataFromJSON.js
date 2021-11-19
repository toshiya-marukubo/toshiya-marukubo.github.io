function getItemsDataFromJSON(file) {
  this.file = file;
  this.targetElement = document.getElementById('trashes');
  this.counterElement = document.getElementById('counter');
  this.count = 0;
  this.now = 0;
  this.index = 0;
  this.data = null;
  this.flg = false;
  this.number = 18;

  this.initialize();
}

getItemsDataFromJSON.prototype.initialize = function () {
  var that = this;
  
  this.setUpEvent();

  this.getJson(that.file).then(function (json) {
    that.data = json;

    that.addItems();
  });
};

getItemsDataFromJSON.prototype.getJson = function (file) {

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

getItemsDataFromJSON.prototype.sortNumberToLarge = function (a, b) {
  return Number(a.number) - Number(b.number);
};

getItemsDataFromJSON.prototype.sortLovesToSmall = function (a, b) {
  return Number(b.loves) - Number(a.loves);
};

getItemsDataFromJSON.prototype.sortViewsToSmall = function (a, b) {
  return Number(b.views) - Number(a.views);
};

getItemsDataFromJSON.prototype.sortJson = function (data, type, dir) {
  var that = this;

  return new Promise(function (resolve, reject) {
    if (type === 'number' && dir === 'large') {
      that.data.sort(that.sortNumberToLarge);
    }
    if (type === 'loves' && dir === 'small') {
      that.data.sort(that.sortLovesToSmall);
    }
    if (type === 'views' && dir === 'small') {
      that.data.sort(that.sortViewsToSmall);
    }
    resolve();
  });
};

getItemsDataFromJSON.prototype.createElement = function (elem, content) {
  var element = document.createElement(elem);
  
  if (content !== null) element.textContent = content;
  
  return element;
};

getItemsDataFromJSON.prototype.addItem = function (data) {
  var that = this;

  return new Promise(function (resolve, reject) {
    var obj = {};

    // div
    var div = that.createElement('div', null);
    div.setAttribute('class', 'trash');

    // link
    var a = that.createElement('a', null);
    a.setAttribute('href', data.link);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noreferrer');

    // image container
    var container = that.createElement('div', null);

    // image
    var img = that.createElement('img', null);
    img.setAttribute('src', data.image);
    img.setAttribute('alt', 'My works img from CodePen');
    img.setAttribute('width', '223.73');
    img.setAttribute('height', '125.84');
    
    // loves and views
    var ul = that.createElement('ul', null);
    var liH = that.createElement('li', '❤️  ' + data.loves);
    var liV = that.createElement('li', '👀 ' + data.views);
   
    // go to codepen
    var p = that.createElement('p', 'Go to CodePen.');
    
    ul.appendChild(liH);
    ul.appendChild(liV);

    a.appendChild(img);

    container.appendChild(a);
    container.appendChild(p);

    div.appendChild(container);
    div.appendChild(ul);

    that.targetElement.appendChild(div);
    
    obj.src = data.image;
    obj.div = div;
    obj.imgTag = img;

    resolve(obj);
  });
};

getItemsDataFromJSON.prototype.loadImage = function (obj) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    
    img.src = obj.src;
    
    img.addEventListener('load', function () {
      obj.imgTag.classList.add('showImage');
    });

    resolve(obj);
  });
};

getItemsDataFromJSON.prototype.displayImage = function (obj) {
  return new Promise(function (resolve, reject) {
    obj.div.classList.add('show');
    resolve(obj);
  });
}

getItemsDataFromJSON.prototype.deleteItems = function () {
  var that = this;

  return new Promise(function (resolve, reject) {
    that.targetElement.textContent = null;
    resolve();
  });
};

getItemsDataFromJSON.prototype.delay = function (time, elm) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(elm);
    }, time);
  });
};

getItemsDataFromJSON.prototype.addItems = function () {
  var that = this;

  if (that.count >= that.number) {
    that.count = 0;
    that.flg = false;
    
    return;
  }
  
  that.addItem(that.data[that.index]).then(function (obj) {
    that.index++;
    that.count++;
    
    return that.loadImage(obj);
  }).then(function (obj) {
    return that.delay(40, obj);
  }).then(function (obj) {
    that.drawCounter(); 
    return that.displayImage(obj);
  }).then(function () {
    that.addItems();
  });
};

getItemsDataFromJSON.prototype.drawCounter = function (e) {
  var len = document.getElementsByClassName('trash').length;
  var number = Math.ceil(len / this.data.length * 100);
  
  this.counterElement.textContent = number + ' %';
};

getItemsDataFromJSON.prototype.onScroll = function (e) {
  var docHeight = document.body.scrollHeight;
  var docScrollTop = window.pageYOffset;
  var scrollPosition = window.innerHeight + window.pageYOffset;
  
  if (this.flg) return;

  if (docHeight * 0.8 <= scrollPosition) {
    this.addItems();
    this.flg = true;
  } else {
    return;
  }
};

getItemsDataFromJSON.prototype.setUpEvent = function () {
  var that = this;
  
  window.addEventListener('scroll', this.onScroll.bind(this), false);

  this.buttons = document.getElementsByClassName('sortButton');

  for (var i = 0; i < this.buttons.length; i++) {
    var that = this;
    
    this.buttons[i].addEventListener('click', function(e) {
      e.preventDefault();
      
      if (this.flg) return;
       
      for (var j = 0; j < that.buttons.length; j++) {
        that.buttons[j].classList.remove('active');
      }

      this.classList.add('active');
      
      that.index = 0;
      
      switch (this.id) {
        case 'reset':
          that.deleteItems().then(function () {
            
            return that.sortJson(that.data, 'number', 'large');
          }).then(function () {
            
            return that.addItems();
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
    }, false);
  }
};
