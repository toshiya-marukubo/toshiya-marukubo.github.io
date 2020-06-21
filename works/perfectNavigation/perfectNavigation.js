(function () {
  'use strict';
  window.addEventListener('load', function () {

    /********************
      Random Number
    ********************/

    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /********************
      Var
    ********************/
    
    var main = document.getElementById('main');
    var X = window.innerWidth;
    var Y = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    var flg = false;

    /********************
      Animation
    ********************/

    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(cb) {
        setTimeout(cb, 17);
      };

    /********************
      meaningless
    ********************/
    
    var num = 200;
    var mouseDist = 200;
    if (X < 768) {
      num = 100;
      mouseDist = 100;
    }
    var spans;
    var links;
    var textArr = [
      'Home', 
      'About Us',
      'About Me',
      'Contact',
      'Menu',
      'Signup',
      'Signin',
      'Login',
      'Works',
      'Blog',
      'Logout'
    ];

    function createElem() {
      var span = document.createElement('span');
      var a = document.createElement('a');
      var initX = rand(0, X);
      var initY = rand(0, Y);
      span.textContent = textArr[rand(0, textArr.length - 1)];
      span.style.left = initX + 'px';
      span.style.top = initY + 'px';
      span.style.position = 'absolute';
      span.setAttribute('data-initx', initX);
      span.setAttribute('data-inity', initY);
      a.setAttribute('href', '#');
      a.setAttribute('class', 'link');
      a.appendChild(span);
      main.appendChild(a);
    }
    
    function getElem() {
      return new Promise(function(res, rej) {
        for (var i = 0; i < num; i++) {
          createElem();
        }
        spans = document.getElementsByTagName('span');
        links = document.getElementsByClassName('link');
        for (var i = 0; i < links.length; i++) {
          links[i].addEventListener('click', function(e) {
            e.preventDefault();
          }, false);
        }
        res();
      });
    }

    function escapeNav() {
      if (flg !== false) {
        for (var i = 0; i < spans.length; i++) {
          var coordinate = spans[i].getBoundingClientRect();
          var x = mouseX - coordinate.left - coordinate.width / 2;
          var y = mouseY - coordinate.top - coordinate.height / 2;
          var d = x * x + y * y;
          var dist = Math.sqrt(d);
          if (dist < mouseDist) {
            var vx = x / dist * 5;
            var vy = y / dist * 5;
            spans[i].style.left = coordinate.left - vx + 'px';
            spans[i].style.top = coordinate.top - vy + 'px';
          } else {
            var initX = spans[i].dataset.initx;
            var initY = spans[i].dataset.inity;
            var x = initX - coordinate.left;
            var y = initY - coordinate.top;
            var d = x * x + y * y;
            var dist = Math.sqrt(d);
            if (dist > 5) {
              var vx = x / dist * 5;
              var vy = y / dist * 5;
              spans[i].style.left = coordinate.left + vx + 'px';
              spans[i].style.top = coordinate.top + vy + 'px';
            }
          }
        }
      }
    }
    
    function interval() {
      escapeNav();
      requestAnimationFrame(interval);
    }

    getElem()
    .then(interval);

    /********************
      Event
    ********************/
    
    window.addEventListener('click', function(e) {
      flg = true;
    });
     
    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, false);

    window.addEventListener('touchmove', function(e) {
      var touch = e.targetTouches[0];
      mouseX = touch.pageX;
      mouseY = touch.pageY;
    });

  });
  // Author
  console.log('File Name / perfectNavigation.js\nCreated Date / Jun 21, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
