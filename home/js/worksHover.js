(function() {
  'use strict';
  window.addEventListener('load', function() {
    var worksList = document.getElementById('worksList');
    var dispWorks = document.getElementById('dispWorks');
    var worksLists = worksList.children;

    for (var i = 0; i < worksLists.length; i++) {
      worksLists[i].addEventListener('mouseenter', openIframe, false);
    }
    for (var i = 0; i < worksLists.length; i++) {
      worksLists[i].addEventListener('mouseleave', closeIframe, false);
    }
    function openIframe() {
      var url = this.firstElementChild.href;
      dispWorks.src = url;
      dispWorks.style.display = 'block';
    }
    function closeIframe() {
      dispWorks.style.display = 'none';
    }
  });
})();
