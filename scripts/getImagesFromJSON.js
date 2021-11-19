var getImagesFromJSON = {
  getJSON: function (file) {
    var that = this;

    return new Promise(function (resolve, reject) {
      var req = new XMLHttpRequest();
      
      req.addEventListener('load', function() {
        var json = JSON.parse(req.responseText);

        resolve(json);
      }, false);

      req.open('GET', file, true);
      req.send(null);
    });
  },

  loadImages: function (file) {
    var promises = new Array();
    
    for (var i = 0; i < file.length; i++) {
      promises.push(this.loadImage(file[i].image, file.length));
    }

    return Promise.all(promises);
  },

  loadImage: function (src, len) {
    return new Promise(function (resolve, reject) {
      var img = new Image();

      img.src = src;

      img.addEventListener('load', function () {
        resolve();
      });
    });
  },

  loaded: function () {
    return new Promise(function (resolve, reject) {
      resolve();
    });
  },

  start: function () {
    var that = this;

    return new Promise(function (resolve, reject) {
      that.getJSON('codepen.json').then(function (file) {
         
        return that.loadImages(file);
      }).then(function () {
        
        return that.loaded();
      }).then(function () {
        
        resolve();
      });
    });
  }
};
