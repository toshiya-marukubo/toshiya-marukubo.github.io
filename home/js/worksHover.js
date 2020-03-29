(function() {
  'use strict';
  window.addEventListener('load', function() {
    var X = window.innerWidth;
    if(X < 768) {
      return;
    }
    var dispWorks = document.getElementById('dispWorks');
    var body = document.getElementsByTagName('body');
    var loading = document.getElementById('loading');
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
      loading.style.display = 'block';
      this.parentNode.setAttribute('class', 'opened');
      for (var i = 0; i < dispWorksChildren.length; i++) {
        if (dispWorksChildren[i].className !== 'opened') {
          dispWorksChildren[i].style.opacity = '0.3';
        }
      }
      var iframe = document.createElement('iframe');
      iframe.setAttribute('id', 'iframe');
      body[0].appendChild(iframe);
      iframe.src = this.href;
      iframe.addEventListener('load', function() {
        setTimeout(function() {
          loading.style.display = 'none';
        }, 1000);
      });
    }
    function closeIframe() {
      loading.style.display = 'none';
      this.parentNode.removeAttribute('class');
      for (var i = 0; i < dispWorksChildren.length; i++) {
        if (dispWorksChildren[i].className !== 'opened') {
          dispWorksChildren[i].style.opacity = '0.9';
        }
      }
      body[0].removeChild(iframe);
    }
  });
})();
