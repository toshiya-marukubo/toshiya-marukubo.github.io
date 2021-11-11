function FKSystem(x, y, v, rand) {
  this.initialize(x, y, v, rand);
}

FKSystem.prototype.initialize = function (x, y, v, rand) {
  this.x = x;
  this.y = y;
  this.v = v;
  this.lastArm = null;
  this.phase = 0;
  this.speed = 0.2 * rand + 0.1;
  this.arms = [];
};

FKSystem.prototype.addArm = function (length, centerAngle, rotationRange, phaseOffset, scale) {
  var a = new Arm();
  var arm = a.create(length, centerAngle, rotationRange, phaseOffset, scale);
  
  this.arms.push(arm);
  
  if (this.lastArm) {
    arm.parent = this.lastArm;
  }

  this.lastArm = arm;
  this.update();
};

FKSystem.prototype.update = function () {
  for (var i = 0; i < this.arms.length; i++) {
    var arm = this.arms[i];

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
};

FKSystem.prototype.updatePosition = function () {
  this.x += this.v;

  if (this.x > window.innerWidth + 100) {
    this.x = 0 - 100;
  }

  if (this.x < 0 - 100) {
    this.x = window.innerWidth + 100;
  }
};

FKSystem.prototype.rotateArm = function (index, angle) {
  this.arms[index].angle = angle;
};

FKSystem.prototype.render = function (c, f, t) {
  for (var i = 0; i < this.arms.length; i++) {
    this.arms[i].render(c, i, f, t);
  } 
};
