export class AnimationTimer {
  constructor(stopwatch, duration, timeWarp) {
    this.duration = duration;
    this.timeWarp = timeWarp;

    this.stopwatch = stopwatch;
  }

  start() {
    this.stopwatch.start();
  }

  stop() {
    this.stopwatch.stop();
  }

  reset() {
    this.stopwatch.reset();
  }

  getElapsedTime(delay) {
    const elapsedTime = this.stopwatch.getElapsedTime(delay);
    const percentComplete = elapsedTime / this.duration;
    
    return elapsedTime * (this.timeWarp(percentComplete) / percentComplete);
  }

  isRunning() {
    return this.stopwatch.running;
  }

  isOver(delay) {
    return this.stopwatch.getElapsedTime(delay) > this.duration;
  }
}

