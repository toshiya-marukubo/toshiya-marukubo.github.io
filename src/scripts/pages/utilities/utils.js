export class Utils {
  static norm(value, min, max) {
    return (value - min) / (max - min);
  }

  static lerp(norm, min, max) {
    return (max - min) * norm + min;
  }

  static map(value, sourceMin, sourceMax, destMin, destMax) {
    return this.lerp(this.norm(value, sourceMin, sourceMax), destMin, destMax);
  }

  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  static distance(x0, y0, x1, y1) {
    const dx = x1 - x0;
    const dy = y1 - y0;

    return Math.sqrt(dx * dx + dy * dy);
  }

  static randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  static randomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  }

  static randomDist(min, max, iterations) {
    let total = 0;

    for (let i = 0; i < iterations; i++) {
      total += this.randomRange(min, max);
    }

    return total / iterations;
  }

  static degreesToRads(degrees) {
    return degrees / 180 * Math.PI;
  }

  static radsToDegrees(radians) {
    return radians * 180 / Math.PI;
  }

  static roundToPlaces(value, places) {
    const mult = Math.pow(10, places);

    return Math.round(value * mult) / mult;
  }

  static roundNearest(value, nearest) {
    return Math.round(value / nearest) * nearest;
  }
}
