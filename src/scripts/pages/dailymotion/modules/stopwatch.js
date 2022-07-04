/**
 * Stopwatch class
 */
export class Stopwatch {
  constructor() {
    this.initialize();  
  }
  
  initialize() {
    const time = Date.now();
    
    this.startTime = time;
    this.lastTime = time;  
  }
  
  calculateTime() {
    const time = Date.now();
    
    this.elapsedTime = time - this.startTime;
    this.lastTime = time;
  }
  
  getElapsedTime() {
    return this.elapsedTime;
  }
}
