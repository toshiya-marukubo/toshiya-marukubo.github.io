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
          moreBtn.disabled = false;
          for(var i = 0; i < dispWorksChildren.length; i++) {
            dispWorksChildren[i].style.display = 'inline-block';
          }
          dispWorksChildren[dispNum].firstElementChild.focus();
          moreBtn.textContent = 'Close';
          open = true;
        } else {
          moreBtn.disabled = false;
          for(var i = dispNum; i < dispWorksChildren.length; i++) {
            dispWorksChildren[i].style.display = 'none';
          }
          moreBtn.textContent = 'See More';
          open = false;
        }
      }, 400);
    }, false);
    window.addEventListener('resize', function() {
      dispNum = window.innerWidth < 768 ? dispNum = 3 : dispNum = 9;
    });
  });
})();
