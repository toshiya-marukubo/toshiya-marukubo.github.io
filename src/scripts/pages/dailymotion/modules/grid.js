export class Grid {
  static maxDist(arr) {
    let tmp = 0;
    
    for (let i = 0; i < arr.length; i++) {
      tmp = Math.max(arr[i].d, tmp);
    }
    
    return tmp;
  }
  
  static square(vector, num, scale) {
    const tmp = [];

    let index = 0;
    for (let x = -num; x <= num; x++) {
      for (let y = -num; y <= num; y++) {
        const params = {};
        const v = vector.create(x, y).multiply(scale);
        
        params.v = v;
        params.d = v.getLength();
        params.i = index++;

        tmp.push(params);
      }
    }
    
    return tmp;
  }
  
  static square2(vector, num, scale) {
    const tmp = [];
    const ajustV =
            vector.create(num, num)
              .multiply(scale / 2)
              .subtract(vector.create(scale / 2, scale / 2));
    
    for (let y = 0; y < num; y++) {
      for (let x = 0; x < num; x++) {
        const params = {};
        const v = vector.create(x, y).multiply(scale).subtract(ajustV);
        const i = y * num + x;

        if (y % 2 === 0) {
          v.setX(v.getX() + scale / 2);
        }

        params.v = v;
        params.d = v.getLength();
        params.i = i;
        params.c = x;
        params.r = y;

        tmp.push(params);
      }
    }

    return tmp;
  }
  
  static hex(vector, num, scale) {
    const vectors = [];

    for (let x = -num; x <= num; x++) {
      for (let y = -num; y <= num; y++) {
        for (let z = -num; z <= num; z++) {
          if (x + y + z === 0) {
            const v = vector.create(x, y);
            
            vectors.push(v);
          }
        } 
      }
    }

    const tmp = [];

    for (let i = 0; i < vectors.length; i++) {
      const params = {};
      const x = Math.sqrt(3) * (vectors[i].getX() + vectors[i].getY() / 2) / 2 * scale;
      const y = 3 / 2 * vectors[i].getY() / 2 * scale;
      const v = vector.create(x, y);

      params.v = v;
      params.d = v.getLength();
      params.i = i;

      tmp.push(params);
    }

    return tmp;
  }
  
  static circle(vector, num, scale) {
    const tmp = [];
  
    for (let k = 1; k <= num; k++) {
      for (let j = 0; j < k * num; j++) {
        const params = {};
        const x = Math.cos(Math.PI * 2 / (num * k) * j);
        const y = Math.sin(Math.PI * 2 / (num * k) * j);
        const v = vector.create(x, y).multiply(k * scale * 0.4);
        
        params.v = v;
        params.d = v.getLength();
        params.i = k * k * num + j;

        tmp.push(params);
      }
    }

    return tmp;
  }
}
