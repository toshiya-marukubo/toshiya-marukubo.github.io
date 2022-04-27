import {Arm} from './arm.js';

export class FKSystem {
  constructor(x, y, v, rand) {
    this.initialize(x, y, v, rand);
  }

  initialize(x, y, v, rand) {
    this.x = x;
    this.y = y;
    this.v = v;
    this.lastArm = null;
    this.phase = 0;
    this.speed = 0.2 * rand + 0.1;
    this.arms = [];
  }

  addArm(length, centerAngle, rotationRange, phaseOffset, scale) {
    const a = new Arm();
    const arm = a.create(length, centerAngle, rotationRange, phaseOffset, scale);
    
    this.arms.push(arm);
    
    if (this.lastArm) {
      arm.parent = this.lastArm;
    }

    this.lastArm = arm;
    this.update();
  }

  update() {
    for (let i = 0; i < this.arms.length; i++) {
      const arm = this.arms[i];

      arm.setPhase(this.phase);

      if (arm.parent) {
        arm.x = arm.parent.getEndX();
        arm.y = arm.parent.getEndY();
      } else {
        arm.x = this.x;
        arm.y = this.y;
      }
    }
    
    this.phase += this.speed;
  }

  updatePosition() {
    this.x += this.v;

    if (this.x > window.innerWidth + 100) {
      this.x = 0 - 100;
    }

    if (this.x < 0 - 100) {
      this.x = window.innerWidth + 100;
    }
  }

  rotateArm(index, angle) {
    this.arms[index].angle = angle;
  }

  render(c, f, t, j) {
    for (let i = 0; i < this.arms.length; i++) {
      this.arms[i].render(c, i, f, t, j);
    } 
  }
}
