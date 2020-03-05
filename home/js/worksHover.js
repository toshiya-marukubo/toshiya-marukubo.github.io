(function() {
  'use strict';
  window.addEventListener('load', function() {
    var X = window.innerWidth;
    var worksList = document.getElementById('worksList');
    var dispWorks = document.getElementById('dispWorks');
    var worksLists = worksList.children;

    if(X < 768) {
      return;
    }

    for (var i = 0; i < worksLists.length; i++) {
      worksLists[i].firstElementChild.addEventListener('mouseenter', openIframe, false);
    }
    for (var i = 0; i < worksLists.length; i++) {
      worksLists[i].firstElementChild.addEventListener('mouseleave', closeIframe, false);
    }
    for (var i = 0; i < worksLists.length; i++) {
      worksLists[i].firstElementChild.addEventListener('focus', openIframe, false);
    }
    for (var i = 0; i < worksLists.length; i++) {
      worksLists[i].firstElementChild.addEventListener('blur', closeIframe, false);
    }
    function openIframe() {
      var url = this.href;
      dispWorks.src = url;
      dispWorks.style.display = 'block';
    }
    function closeIframe() {
      dispWorks.style.display = 'none';
    }
  });
})();
