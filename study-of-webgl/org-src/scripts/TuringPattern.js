class TuringPattern {
  constructor(ctx, w, h, n, sp) {
    this.ctx = ctx;
    this.w = w;
    this.h = h;
    this.itr = sp;
    this.Du = 2e-5;
    this.Dv = 1e-5;
    this.dx = 0.01;
    this.dt = 1;
    this.setup();
    this.getPattern(n);
    this.addNoise();
  }
  
  createMultipleArray(one, two, num) {
    let array = [];

    for (let y = 0; y < one; y++) {
      array[y] = [];

      for (let x = 0; x < two; x++) {
        array[y][x] = num;
      }
    }

    return array;
  }
  
  getPattern(n) {
    switch (n) {
      case 'Amorphous':
        this.f = 0.04;
        this.k = 0.06;

        break;
      case 'Stripe':
        this.f = 0.022;
        this.k = 0.051;

        break;
      case 'Spot':
        this.f = 0.035;
        this.k = 0.065;

        break;
      case 'Bubble':
        this.f = 0.012;
        this.k = 0.05;

        break;
      case 'Wave':
        this.f = 0.025;
        this.k = 0.05;

        break;
    }
  }
  
  setup() {
    this.u = this.createMultipleArray(this.h, this.w, 1);
    this.v = this.createMultipleArray(this.h, this.w, 0);
    
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (y === this.h / 2 && x === this.w / 2) {
          this.u[y][x] = 0.25;
          this.v[y][x] = 1;
        }
      }
    }
    
    this.laplacian_u = this.createMultipleArray(this.h, this.w, 0);
    this.laplacian_v = this.createMultipleArray(this.h, this.w, 0);
    
    this.d = this.ctx.createImageData(this.w, this.h);
  }
  
  addNoise() {
    for (var y = 0; y < this.h; y++) {
      for (var x = 0; x < this.w; x++) {
        this.u[y][x] += Math.random() * 0.1;
        this.v[y][x] += Math.random() * 0.1;
      }
    }
  }
  
  updateData() {
    let newArrayU = this.createMultipleArray(this.h, this.w, 0);
    let newArrayV = this.createMultipleArray(this.h, this.w, 0);
    
    /**
     * I couldn't think of this code.
     * Referenced / https://memorandums.hatenablog.com/entry/2020/03/10/230100
     * Thank you so much.
     */
    for (let y = 1; y < this.h - 1; y++) {
      for (let x = 1; x < this.w - 1; x++) {
        this.laplacian_u[y][x] =
          (this.u[y + 1][x] +
           this.u[y - 1][x] +
           this.u[y][x + 1] +
           this.u[y][x - 1] - 4 *
           this.u[y][x]) /
          (this.dx * this.dx);
        this.laplacian_v[y][x] =
          (this.v[y + 1][x] +
           this.v[y - 1][x] +
           this.v[y][x + 1] +
           this.v[y][x - 1] - 4 *
           this.v[y][x]) /
          (this.dx * this.dx);
      }
    }
    
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        newArrayU[y][x] =
          this.u[y][x] +
          this.dt *
          this.Du *
          this.laplacian_u[y][x] -
          this.u[y][x] *
          this.v[y][x] *
          this.v[y][x] +
          this.f *
          (1.0 - this.u[y][x]);
        newArrayV[y][x] =
          this.v[y][x] +
          this.dt *
          this.Dv *
          this.laplacian_v[y][x] +
          this.u[y][x] *
          this.v[y][x] *
          this.v[y][x] -
          (this.f + this.k) *
          this.v[y][x];
      }
    }

    this.u = newArrayU;
    this.v = newArrayV;
  }
  
  updateImageData() {
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const i = (y * this.w + x) * 4;
        
        this.d.data[i + 0] = 0x00;
        this.d.data[i + 1] = 0x00;
        this.d.data[i + 2] = 0x00;
        this.d.data[i + 3] = Math.floor((this.u[y][x] / 1) * 0xff);
      }
    }
  }
  
  drawImageData() {
    this.ctx.putImageData(this.d, 0, 0);
  }
  
  changeParams(sp) {
    this.itr = sp;
  }
  
  render() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.drawImageData();
    
    for (let i = 0; i < this.itr; i++) {
      this.updateData();
    }
    
    this.updateImageData();
  }
}
