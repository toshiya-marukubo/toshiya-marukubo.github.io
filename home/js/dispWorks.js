(function() {
  'use strict';
  window.addEventListener('load', function() {
    var X = window.innerWidth;
    var dispNum = window.innerWidth < 768 ? dispNum = 3 : dispNum = 9;
    var dispWorks = document.getElementById('dispWorks');
    var moreBtn = document.getElementById('moreBtn');
    var dispWorksChildren = dispWorks.children;
    var open = false;
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
          for(var i = 0; i < dispWorksChildren.length; i++) {
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
    window.addEventListener('resize', function() {
      dispNum = window.innerWidth < 768 ? dispNum = 3 : dispNum = 9;
    });
  });
})();
