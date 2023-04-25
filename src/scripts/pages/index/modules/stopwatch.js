export class Stopwatch {
  constructor() {
    this.startTime = 0;
    this.running = false;
    this.elapsedTime = null;
  }

  start() {
    this.startTime = Date.now();
    this.elapsedTime = null;
    this.running = true;
  }

  stop() {
    this.elapsedTime = Date.now() - this.startTime;
    this.running = false;
  }

  getElapsedTime(delayTime) {
    const dt = delayTime || 0;

    if (this.running) {
      return Date.now() - dt - this.startTime;
    } else {
      return this.elapsedTime;
    }
  }

  isRunning() {
    return this.running;
  }

  reset() {
    this.elapsedTime = 0;
  }
}
