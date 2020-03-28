(function() {
  'use strict';
  window.addEventListener('load', function() {
    var X = window.innerWidth;
    var dispNum = 9;
    if (X < 768) {
      dispNum = 3;
    }
    var dispWorks = document.getElementById('dispWorks');
    var dispWorksChildren = dispWorks.children;
    var open = false;
    var moreBtn = document.getElementById('moreBtn');
    for(var i = dispNum; i < dispWorksChildren.length; i++) {
      dispWorksChildren[i].style.display = 'none';
    }
    moreBtn.addEventListener('click', function() {
      if (open === false) {
        moreBtn.textContent = 'Loading...';
      }
      moreBtn.disabled = true;
      setTimeout(function() {
        if (open === false) {
          for(var i = dispNum; i < dispWorksChildren.length; i++) {
            dispWorksChildren[i].style.display = 'inline-block';
          }
          moreBtn.textContent = 'Close';
          moreBtn.disabled = false;
          open = true;
        } else {
          for(var i = dispNum; i < dispWorksChildren.length; i++) {
            dispWorksChildren[i].style.display = 'none';
          }
          moreBtn.textContent = 'See More';
          moreBtn.disabled = false;
          open = false;
        }
      }, 400);
    }, false);
  });
})();
