export class Mouse {
  constructor(sketch, THREE) {
    this.THREE = THREE
    this.sketch = sketch;
    this.initialize();
  }
  
  initialize() {
    this.delta = 0;
    this.beta  = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.speed = 0;
    
    this.mouse = new this.THREE.Vector3(0, 0, 1);
    this.setupEvents();
  }
  
  setupEvents() {
    window.addEventListener('scroll', this.onScroll.bind(this), false);
    window.addEventListener('wheel', this.onWheel.bind(this), false);
    window.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    window.addEventListener('touchstart', this.onTouchStart.bind(this), false);
    window.addEventListener('touchmove', this.onTouchMove.bind(this), false);
    window.addEventListener('touchend', this.onTouchEnd.bind(this), false);
  }

  onScroll(e) {
    const docScrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = docScrollTop / docHeight;

    this.delta = scrollPercent;
  }

  onWheel(e) {
    this.beta += e.deltaY * 0.01;
  }
  
  onMouseDown() {
    this.mouse.z = -1;
  }
  
  onMouseUp() {
    this.mouse.z = 1;
  }

  onMouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    
    this.speed =
        Math.sqrt((e.pageX - this.lastX) **2 +
                  (e.pageY - this.lastY) **2) * 0.1;
    this.lastX = e.pageX;
    this.lastY = e.pageY;
  }
  
  onTouchStart(e) {
    const touch = e.targetTouches[0];

    if (e.touches.length === 2) {
      this.mouse.z = -1;
    }
  }
  
  onTouchEnd(e) {
    const touch = e.targetTouches[0];

    if (e.touches.length === 2) {
      this.mouse.z = 1;
    }
  }
  
  onTouchMove(e) {
    const touch = e.targetTouches[0];

    this.mouse.x = (touch.pageX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(touch.pageY / window.innerHeight) * 2 + 1;
    
    this.speed =
      Math.sqrt((touch.pageX - this.lastX) **2 +
                (touch.pageY - this.lastY) **2) * 0.1;
    this.lastX = touch.pageX;
    this.lastY = touch.pageY;
  }
}
