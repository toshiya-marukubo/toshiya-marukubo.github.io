var getJSON = function (file) {
  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest();

    req.addEventListener('load', function() {
      var json = JSON.parse(req.responseText);

      resolve(json);
    }, false);
    
    req.open('GET', file, true);
    req.send(null);
  });
};

var loadImages = function (file) {
  for (let i = 0; i < 36; i++) {
    var img = document.createElement('img');
    img.src = file[i].image;
  }
};

(function () {
  getJSON('codepen.json').then(function(file) {
    loadImages(file);
  });
})();
