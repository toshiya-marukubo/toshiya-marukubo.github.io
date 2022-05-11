export class Time {
  constructor(sketch) {
    this.sketch = sketch;
    
    this.initialize();  
  }
  
  initialize() {
    this.setupCanvas();
    
    const time = Date.now();
    
    this.startTime = time;
    this.lastTime = time;  
  }
  
  setupCanvas() {
    document.body.appendChild(document.createElement('canvas'));
  
    this.canvas = document.getElementsByTagName('canvas')[1];
    this.ctx = this.canvas.getContext('2d');
    
    this.ctx.font = '16px sans-serif';
    const metrics = this.ctx.measureText('000 FPS');
    
    this.width = this.canvas.width = metrics.width;
    this.height = this.canvas.height = 32;
    
    this.canvas.style.position = 'fixed';
    this.canvas.style.zIndex = '9999';
    this.canvas.style.background = 'black';
    this.canvas.style.display = 'block';
    this.canvas.style.bottom = '0';
    this.canvas.style.right = '0';
  }
  
  calculateTime() {
    const time = Date.now();
    
    this.elapsedTime = time - this.startTime;
    this.fps = 1000 / (time - this.lastTime);
    this.lastTime = time;
  }
  
  drawFPS() {
    const ctx = this.ctx;
    
    ctx.clearRect(0, 0, this.width, this.height);
    
    ctx.save();
    
    ctx.fillStyle = 'rgb(2, 230, 231)';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.fps.toFixed() + ' FPS', this.width / 2, this.height / 2);
    
    ctx.restore();
  }
  
  getElapsedTime() {
    return this.elapsedTime;
  }
}
