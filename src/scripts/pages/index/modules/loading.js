export class Loading {
  constructor(data) {
    this.load = document.getElementsByClassName('loading')[0];
    this.line = document.getElementsByClassName('loading-line')[0];
    this.counter = document.getElementsByClassName('loading-counter')[0];
    this.data = data;
    this.loadedNumber = 1;
    this.percentage = 0;
    this.num = 0;
  }

  initialize() {
    return new Promise((resolve, reject) => {
      this.delay(1200).then(() => {
        this.loadImages(resolve, reject);
      });
    });
  }

  loadImages(resolve, reject) {
    for (let i = 0; i < this.data.length; i++) {
      const path = this.data[i].imagePath;
      const image = new Image();

      image.src = path;
      
      image.addEventListener('load', () => {
        this.percentage = this.getPercentage(this.loadedNumber++);
      });
    }

    this.drawPercentage(resolve, reject);
  }

  getPercentage(num) {
    return Math.floor(num / this.data.length * 100);
  }

  drawPercentage(resolve, reject) {
    if (this.num < this.percentage) {
      this.num+=2;
    }

    this.line.style.width = this.num + '%';
    this.counter.textContent = this.num;

    if (this.num === 100) {
      this.cancelDrawLoopCounterNumber(resolve, reject);

      return;
    }

    this.animationID = requestAnimationFrame(this.drawPercentage.bind(this, resolve, reject));
  }

  cancelDrawLoopCounterNumber(resolve, reject) {
    cancelAnimationFrame(this.animationID);
    
    this.addClass(resolve, reject);
  }
  
  addClass(resolve, reject) {
    this.delay(400)
      .then(() => {
        this.load.classList.add('loading-loaded');
        this.line.classList.add('loading-loaded');
        this.counter.classList.add('loading-loaded');
        
        this.delay(400).then(() => {
          resolve(this.data);
        });
      });
  }
  
  delay(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
}
