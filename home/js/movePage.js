(function() {
  'use strict';
  window.addEventListener('load', function() {
    var dispWorks = document.getElementById('dispWorks');
    var dispWorksChildren = dispWorks.children;
    var openHref = null;
    for (var i = 0; i < dispWorksChildren.length; i++) {
      dispWorksChildren[i].firstElementChild.addEventListener('mouseenter', function() {
        var req = new XMLHttpRequest();
        openHref = this.href;
        console.log(openHref);
        req.open('GET', openHref);
        req.responseType = 'document';
        req.send(null);
        req.addEventListener('load', function() {
          document.getElementsByTagName('html')[0].innerHTML = req.response;
        }, false);
      }, false);
    }
    for (var i = 0; i < dispWorksChildren.length; i++) {
      dispWorksChildren[i].firstElementChild.addEventListener('mouseleave', function() {
        openHref = null;
      }, false);
    }
  });
})();
