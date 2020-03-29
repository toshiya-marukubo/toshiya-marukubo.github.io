(function() {
  'use strict';
  window.addEventListener('load', function() {
    var X = window.innerWidth;
    if(X < 768) {
      return;
    }
    var dispWorks = document.getElementById('dispWorks');
    var body = document.getElementsByTagName('body');
    var dispWorksChildren = dispWorks.children;

    for (var i = 0; i < dispWorksChildren.length; i++) {
      dispWorksChildren[i].firstElementChild.addEventListener('mouseenter', openIframe, false);
    }
    for (var i = 0; i < dispWorksChildren.length; i++) {
      dispWorksChildren[i].firstElementChild.addEventListener('mouseleave', closeIframe, false);
    }
    /*
    for (var i = 0; i < dispWorksChildren.length; i++) {
      dispWorksChildren[i].firstElementChild.addEventListener('focus', openIframe, false);
    }
    for (var i = 0; i < dispWorksChildren.length; i++) {
      dispWorksChildren[i].firstElementChild.addEventListener('blur', closeIframe, false);
    }
    */
    function openIframe() {
      this.parentNode.setAttribute('class', 'opend');
      for (var i = 0; i < dispWorksChildren.length; i++) {
        if (dispWorksChildren[i].className !== 'opend') {
          dispWorksChildren[i].style.opacity = '0.1';
        }
      }
      var iframe = document.createElement('iframe');
      iframe.setAttribute('id', 'iframe');
      body[0].appendChild(iframe);
      iframe.src = this.href;
    }
    function closeIframe() {
      this.parentNode.removeAttribute('class');
      for (var i = 0; i < dispWorksChildren.length; i++) {
        if (dispWorksChildren[i].className !== 'opend') {
          dispWorksChildren[i].style.opacity = '0.8';
        }
      }
      body[0].removeChild(iframe);
    }
  });
})();
