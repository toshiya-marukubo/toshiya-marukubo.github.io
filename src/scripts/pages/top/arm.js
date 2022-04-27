export class Arm {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.scale = 0;
    this.length = 0;
    this.centerAngle = 0;
    this.rotationRange = Math.PI / 4;
    this.parent = null;
    this.phaseOffset = 0;
  }

  create(length, centerAngle, rotationRange, phaseOffset, scale) {
    const obj = new Arm();
    obj.initialize(length, centerAngle, rotationRange, phaseOffset, scale);

    return obj;
  }

  initialize(length, centerAngle, rotationRange, phaseOffset, scale) {
    this.length = length;
    this.centerAngle = centerAngle;
    this.rotationRange = rotationRange;
    this.phaseOffset = phaseOffset;
    this.scale = scale;
  }

  setPhase(phase) {
    this.angle = this.centerAngle + Math.sin(phase + this.phaseOffset) * this.rotationRange;
  }

  getEndX() {
    let angle = this.angle;
    let parent = this.parent;

    while (parent) {
      angle += parent.angle;
      parent = parent.parent;
    }

    return Math.cos(angle) * this.length + this.x;
  }
  
  getEndY() {
    let angle = this.angle;
    let parent = this.parent;

    while (parent) {
      angle += parent.angle;
      parent = parent.parent;
    }
    
    return Math.sin(angle) * this.length + this.y;
  }

  render(c, i, f, t, j) {
    this.scale = Math.abs(this.y / window.innerHeight);
    this.y = Math.sin(this.x * 0.001 + f) * t * this.scale + this.y;

    c.save();
    c.fillStyle = c.strokeStyle = j === 0 ? 'deeppink' : 'black';
    c.lineCap = 'round';
    c.lineWidth = t * this.scale;

    if (this.parent === null && i === 0) {
      // body
      c.beginPath();
      c.moveTo(this.x, this.y);
      c.lineTo(this.x, this.y - this.length);
      c.stroke();
      // head
      c.beginPath();
      c.arc(this.x, this.y - this.length, 100 * this.scale, 0, Math.PI * 2, false);
      c.fill();
      // shadow
      c.save();
      c.globalAlpha = 0.03;
      c.translate(this.x, this.y + this.length * 2);
      c.scale(2, 0.5);
      c.translate(-this.x, -this.y - this.length * 2);
      c.beginPath();
      c.arc(this.x, this.y + this.length * 2, this.length * 3 * this.scale, 0, Math.PI * 2, false);
      //c.ellipse(this.x, this.y + this.length * 2, this.length * 3 * this.scale, this.length / 2 * this.scale, 0, Math.PI * 2, false);
      c.fill();
      c.restore();
    }

    c.beginPath();
    c.moveTo(this.x, this.y);
    c.lineTo(this.getEndX(), this.getEndY());
    c.stroke();
    
    c.restore();
  }
}
