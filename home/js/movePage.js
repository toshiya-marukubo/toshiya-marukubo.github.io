(function() {
  'use strict';
  window.addEventListener('load', function() {
    var req = new XMLHttpRequest();
    var dispWorks = document.getElementById('dispWorks');
    var dispWorksChildren = dispWorks.children;
    var openHref = null;
    for (var i = 0; i < dispWorksChildren.length; i++) {
      dispWorksChildren[i].firstElementChild.addEventListener('mouseenter', function() {
        openHref = this.href;
        req.open('GET', openHref);
        req.responseType = 'document';
        req.send(null);
      }, false);
    }
    for (var i = 0; i < dispWorksChildren.length; i++) {
      dispWorksChildren[i].firstElementChild.addEventListener('mouseleave', function() {
        openHref = null;
      }, false);
    }
    req.addEventListener('load', function() {
      document.getElementsByTagName('html')[0].innerHTML = req.response;
    }, false);
  });
})();
