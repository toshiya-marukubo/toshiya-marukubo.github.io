function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

(function() {
  var ham = document.getElementById('hamburger');
  var body = document.getElementsByTagName('body')[0];
  var hamburgers = [];

  function Hamburger(x, y) {
    this.x = x - 100;
    this.y = y - 100;
    this.removeMe = false;
    this.vx = -Math.random() * 7;
    this.vy = -Math.random() * 10;
    this.style;
    this.elem;
    this.init();
  }

  Hamburger.prototype.init = function() {
    var elem = document.createElement('span');
    elem.textContent = Math.random() < 0.2 ? '🍟' : '🍔';
    elem.setAttribute('class', 'hamburger');
    elem.style.fontSize = rand(5, 10) + 'rem';
    elem.style.top = this.y + 'px';
    elem.style.left = this.x + 'px';
    this.style = elem.style;
    this.elem = elem;
    body.appendChild(elem);
  };

  Hamburger.prototype.updatePosition = function() {
    this.style.left = this.x + 'px';
    this.style.top = this.y + 'px';
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1;
  };

  Hamburger.prototype.ate = function() {
    if (parseInt(this.style.top) > window.innerHeight) {
      this.removeMe = true;
    }
  };

  Hamburger.prototype.render = function() {
    this.updatePosition();
    this.ate();
  };

  ham.addEventListener('click', function(e) {
    e.preventDefault();
    var h = new Hamburger(e.clientX, e.clientY);
    hamburgers.push(h);
  });

  setInterval(function() {
    if (!hamburgers.length) return;
    var newburger = [];
    for (let i = 0; i < hamburgers.length; i++) {
      hamburgers[i].render();
      if (hamburgers[i].removeMe === false) {
        newburger.push(hamburgers[i]);
      } else {
        hamburgers[i].elem.parentNode.removeChild(hamburgers[i].elem);
      }
    }
    hamburgers = newburger;
  }, 18);
})();
