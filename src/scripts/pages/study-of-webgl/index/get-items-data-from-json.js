export class GetItemsDataFromJSON {
  constructor(path) {
    this.targetElement = document.getElementsByClassName('main-container')[0];
    this.count = 0;
    this.index = 0;
    this.flg = false;
    this.number = 6;

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
      work.setAttribute('role', 'img');
      work.setAttribute('aria-label', data.title + ' Image');
      work.style.backgroundImage = 'url(' + data.image + ')';
      
      // link
      const a = this.createElement('a', null);
      a.setAttribute('href', data.link);

      // infomation
      const infos = this.createElement('div', null);
      infos.setAttribute('class', 'infos');

      const h3 = this.createElement('h3', data.title);
      const p = this.createElement('p', "Created " + data.date);
      
      work.appendChild(a);
      a.appendChild(infos);
      infos.appendChild(h3);
      infos.appendChild(p);

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
  }
}
