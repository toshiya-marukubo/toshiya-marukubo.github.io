// References
// Generative Art: A Practical Guide Using Processing / Matt Pearson
// Thank you so much.
export class CellAutomaton {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    
    this.state = this.createMultipleArray(this.height, this.width);
    this.lastState = this.createMultipleArray(this.height, this.width);
    
    this.d = this.ctx.createImageData(this.width, this.height);
    
    this.setupData();
  }

  createMultipleArray(one, two) {
    const arr = [];

    for (let y = 0; y < one; y++) {
      arr[y] = [];
      for (let x = 0; x < two; x++) {
        arr[y][x] = 0;
      }
    }

    return arr;
  }
  
  setupData() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.state[y][x] = Math.floor(Math.random() * 256);
      }
    }
  }
  
  drawData() {
    this.ctx.putImageData(this.d, 0, 0);
  }
  
  updateData() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const i = y * this.width + x;
        
        this.d.data[4 * i + 0] = 0xff;
        this.d.data[4 * i + 1] = 0xff;
        this.d.data[4 * i + 2] = 0xff;
        this.d.data[4 * i + 3] = this.state[y][x];
      }
    }
  }
  
  updateState() {
    const array = this.createMultipleArray(this.height, this.width);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let total = 0;
        let above = y - 1;
        let below = y + 1;
        let left = x - 1;
        let right = x + 1;

        if (above < 0) above = this.height - 1;
        if (below == this.height) below = 0;
        if (left < 0) left = this.width - 1;
        if (right == this.width) right = 0;

        const t = this.state[above][x]; // top
        const r = this.state[y][right]; // right
        const b = this.state[below][x]; // bottom
        const l = this.state[y][left]; // left
        const tl = this.state[above][left]; // top left
        const bl = this.state[below][left]; // bottom left
        const br = this.state[below][right]; // bottom right
        const tr = this.state[above][right]; // top right

        total = t + r + b + l + tl + bl + br + tr;

        let average = Math.floor(total / 8);
        let nextStateNum;

        if (average == 0xff) {
          nextStateNum = 0x00;
        } else if (average == 0x00) {
          nextStateNum = 0xff;
        } else {
          nextStateNum = this.state[y][x] + average;
          if (this.lastState[y][x] > 0x00) {
            nextStateNum =  nextStateNum - this.lastState[y][x];
          }
          if (nextStateNum > 0xff) {
            nextStateNum = 0xff;
          } else if (nextStateNum < 0x00) {
            nextStateNum = 0x00;
          }
        }
        array[y][x] = nextStateNum;
      }
    }
    
    this.lastState = this.state;
    this.state = array;
  }
  
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.updateData();
    this.updateState();
    this.drawData();
  }
}
