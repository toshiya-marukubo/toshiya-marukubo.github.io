export class Mouse {
  constructor(sketch) {
    this.sketch = sketch;
    
    this.initialize();
  }
  
  initialize() {
    this.x_ = 0;
    this.y_ = 0;
    this.z_ = 0;
    
    this.setupEvents();
  }
  
  setupEvents() {
    this.sketch.canvas.addEventListener('mousemove', this.onMousemove.bind(this), false);
  }
  
  onMousemove(e) {
    this.x_ = (e.clientX / window.innerWidth) * 2 - 1;
    this.y_ = -(e.clientY / window.innerHeight) * 2 + 1;
    this.z_ = 0;
  }

  getX() {
    return this.x_;
  }

  getY() {
    return this.y_;
  }
}
