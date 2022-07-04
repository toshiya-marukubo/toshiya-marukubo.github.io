import { imagePaths } from './image-paths';

export class Load {
  constructor() {
    this.load = document.getElementById('js-load');
    this.counter = document.getElementById('js-counter');
    this.imagePaths = imagePaths;
    this.loadedNumber = 0;
    this.num = 0;
    this.time = Date.now();
    this.initialize();
  }

  initialize() {
    this.loadImages();
  }

  loadImages() {
    for (let i = 0; i < this.imagePaths.length; i++) {
      const path = this.imagePaths[i];
      const image = new Image();
      
      image.src = path;
      image.addEventListener('load', () => {
        this.drawCounterNumber(this.loadedNumber++, this.imagePaths.length);
        
        if (this.loadedNumber === this.imagePaths.length) {
          const elapsedTime = Date.now() - this.time;
          
          if (elapsedTime < 100) {
            this.drawLoopCounterNumber();
          } else {
            this.addClass();
          }
        }
      });
    }
  }

  addClass() {
    this.delay(400)
      .then(() => {
        this.counter.classList.add('images-loaded');

        this.delay(800)
          .then(() => {
            this.counter.classList.add('finished');
            this.counter.innerHTML = 
              '<span>1</span>' +
              '<span>0</span>' +
              '<span>0</span>' +
              '<span id="js-last-span">%</span>';
            
            const lastSpan = document.getElementById('js-last-span');

            lastSpan.addEventListener('animationend', () => {
              this.load.classList.add('loaded');
            });
          });
      });
  }

  drawCounterNumber(loadedNumber, pathLength) {
    const easedNumber = -(Math.cos(Math.PI * (loadedNumber / (pathLength - 1))) - 1) / 2
    
    let num = Math.ceil(easedNumber * 100);
    
    if (num.toString().length === 1) {
      num = '00' + num;
    }
    if (num.toString().length === 2) {
      num = '0' + num;
    }
    
    this.counter.textContent = num + '%';
  }

  drawLoopCounterNumber() {
    this.drawCounterNumber(this.num++, 100);

    if (this.num === 100) {
      this.cancelDrawLoopCounterNumber();

      return;
    }

    this.animationID = requestAnimationFrame(this.drawLoopCounterNumber.bind(this));
  }

  cancelDrawLoopCounterNumber() {
    cancelAnimationFrame(this.animationID);
    
    this.addClass();
  }
  
  delay(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
}
