export class GetItemsDataFromJSON {
  constructor(path) {
    this.targetElement = document.getElementsByClassName('main-container')[0];
    //this.counterElement = document.getElementById('counter');
    this.count = 0;
    this.index = 0;
    this.flg = false;
    this.number = 18;

    this.initialize(path);
  }

  initialize(path) {
    this.setUpEvent();

    this.getData(path).then((json) => {
      this.data = json;

      this.addItems();
    });
  }

  getData(path) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.addEventListener('load', () => {
        const json = JSON.parse(req.responseText);
        
        resolve(json);
      });
      
      req.open('GET', path, true);
      req.send(null);
    });
  }

  sortNumberToLarge(a, b) {
    return Number(a.number) - Number(b.number);
  }

  sortLovesToSmall(a, b) {
    return Number(b.loves) - Number(a.loves);
  }

  sortViewsToSmall(a, b) {
    return Number(b.views) - Number(a.views);
  }

  sortJson(data, type, dir) {
    return new Promise((resolve, reject) => {
      if (type === 'number' && dir === 'large') {
        this.data.sort(this.sortNumberToLarge);
      }
      if (type === 'loves' && dir === 'small') {
        this.data.sort(this.sortLovesToSmall);
      }
      if (type === 'views' && dir === 'small') {
        this.data.sort(this.sortViewsToSmall);
      }

      resolve();
    });
  }

  createElement(elm, content) {
    const element = document.createElement(elm);

    if (content !== null) element.textContent = content;

    return element;
  }

  addItem(data) {
    return new Promise((resolve, reject) => {
      if (!data) return;

      const obj = {};

      // work
      const work = this.createElement('div', null);
      work.setAttribute('class', 'work');
      work.style.backgroundImage = 'url(' + data.image + ')';
      
      // link
      const a = this.createElement('a', null);
      a.setAttribute('href', data.link);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noreferrer');

      // infomation
      const infos = this.createElement('div', null);
      infos.setAttribute('class', 'infos');

      const ul = this.createElement('ul', null);
      const liL = this.createElement('li', '❤️  ' + data.loves);
      const liV = this.createElement('li', '👀 ' + data.views);
      const p = this.createElement('p', 'Jump to CodePen');
      
      ul.appendChild(liL);
      ul.appendChild(liV);

      infos.appendChild(p);
      infos.appendChild(ul);
      work.appendChild(a);
      a.appendChild(infos);

      this.targetElement.appendChild(work);

      obj.src = data.image;
      obj.work = work;

      resolve(obj);
    });
  }

  loadImage(obj) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.src = obj.src;

      img.addEventListener('load', () => {
        obj.work.classList.add('show');
      });

      resolve(obj);
    });
  }

  deleteItems() {
    return new Promise((resolve, reject) => {
      window.scroll({top: 0});
      this.targetElement.innerHTML = '';
      resolve();
    });
  }

  addItems() {
    if (this.count >= this.number) {
      this.count = 0;
      this.flg = false;

      return;
    }

    this.addItem(this.data[this.index]).then((obj) => {
      this.index++;
      this.count++;

      return this.loadImage(obj);
    }).then((obj) => {
      //this.drawCounter();
      this.addItems();
    });
  }

  drawCounter(e) {
    const len = this.targetElement.children.length;
    const number = Math.ceil(len / this.data.length * 100);

    this.counterElement.textContent = number + ' %';
  }

  onScroll(e) {
    const docHeight = document.body.scrollHeight;
    const docScrollTop = window.pageYOffset;
    const scrollPosition = window.innerHeight + window.pageYOffset;

    if (this.flg) {
      return;
    }

    if (docHeight * 0.8 <= scrollPosition) {
      this.flg = true;
      this.addItems();
    } else {
      return;
    }
  }

  setUpEvent() {
    const that = this;

    window.addEventListener('scroll', this.onScroll.bind(this), false);

    that.buttons = document.getElementsByClassName('sortButton');

    for (let i = 0; i < that.buttons.length; i++) {
      that.buttons[i].addEventListener('click', (e) => {
        e.preventDefault();

        for (let j = 0; j < that.buttons.length; j++) {
          that.buttons[j].firstElementChild.classList.remove('active');
        }

        that.buttons[i].firstElementChild.classList.add('active');

        that.index = 0;
        that.flg = false;

        switch (that.buttons[i].id) {
          case 'reset':
            that.deleteItems().then(function () {

              return that.sortJson(that.data, 'number', 'large');
            }).then(function () {

              return that.addItems();
            });
            break;
          case 'sortLovesToSmallBtn':
            that.deleteItems().then(function () {

              return that.sortJson(that.data, 'loves', 'small');
            }).then(function () {

              return that.addItems();
            });
            break;
          case 'sortViewsToSmallBtn':
            that.deleteItems().then(function () {

              return that.sortJson(that.data, 'views', 'small');
            }).then(function () {

              return that.addItems();
            });
            break;
          default:
            break;
        }
      });
    }
  }
}
