(function() {
  'use strict';
  window.addEventListener('load', function() {
    var X = window.innerWidth;
    var dispWorks = document.getElementById('dispWorks');
    var body = document.getElementsByTagName('body');
    var dispWorksChildren = dispWorks.children;

    if(X < 768) {
      return;
    }

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
      var iframe = document.createElement('iframe');
      iframe.setAttribute('id', 'iframe');
      body[0].appendChild(iframe);
      var url = this.href;
      iframe.src = url;
    }

    function closeIframe() {
      body[0].removeChild(iframe);
    }
  });
})();
