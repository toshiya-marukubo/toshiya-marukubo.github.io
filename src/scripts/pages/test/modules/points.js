export class Points {
  static polygon(vector, number, poly) {
    const tmp = [];

    for (let j = 0; j < poly; j++) {
      for (let i = 0; i < number / poly; i++) {
        const x = Math.cos(j / poly * Math.PI * 2);
        const y = Math.sin(j / poly * Math.PI * 2);

        let nx, ny;

        if (j === poly - 1) {
          nx = Math.cos(0);
          ny = Math.sin(0);
        } else {
          nx = Math.cos((j + 1) / poly * Math.PI * 2);
          ny = Math.sin((j + 1) / poly * Math.PI * 2);
        }

        const sx = x + (nx - x) * (i / (number / poly));
        const sy = y + (ny - y) * (i / (number / poly));

        const v = vector.create(sx, sy);

        tmp.push(v);
      } 
    }

    return tmp;
  }
  
  static lemniscate(vector, number) {
    const tmp = [];
  
    for (let i = 0; i < number; i++) {
      const radian = i / number * Math.PI * 2;
      const r = Math.sqrt(2 * Math.cos(2 * radian));
      const x = Math.cos(radian) * r;
      const y = Math.sin(radian) * r;

      const v = vector.create(x, y);

      tmp.push(v);
    }

    return tmp;
  }
  
  static heart(vector, number) {
    const tmp = [];
    
    for (let i = number; i > 0; i--) {
      const radian = i / number * Math.PI * 2;
      const x = (
        16 * Math.sin(radian) *
        Math.sin(radian) *
        Math.sin(radian)) * 0.06;
      const y = (
        13 * Math.cos(radian) -
        5 * Math.cos(2 * radian) -
        2 * Math.cos(3 * radian) -
        Math.cos(4 * radian)) * 0.06;
      
      const v = vector.create(x, y);
      
      tmp.push(v);
    }
    
    return tmp;
  }
  
  static astroid(vector, number) {
    const tmp = [];
    
    for (let i = 0; i < number; i++) {
      const radian = i / number * Math.PI * 2;
      const x = Math.pow(Math.cos(radian), 3);
      const y = Math.pow(Math.sin(radian), 3);
      
      const v = vector.create(x, y);
      
      tmp.push(v);
    }
    
    return tmp;
  }
  
  static rose(vector, numberA, numberB, numberC) {
    const tmp = [];
    const radian = Math.PI * 2 * numberC / numberA;
    
    for (let i = 0; i < numberA; i++) {
      const r = Math.cos(numberB * radian * i / numberC);
      const x = Math.cos(radian * i) * r;
      const y = Math.sin(radian * i) * r;
      
      const v = vector.create(x, y);
      
      tmp.push(v);
    }
    
    return tmp;
  }
  
  static lissajous(vector, numberA, numberB, numberC) {
    const tmp = [];
    
    for (let i = 0; i < numberA; i++) {
      const radian = i / numberA * Math.PI * 2;
      const x = Math.cos(radian * numberB);
      const y = Math.sin(radian * numberC + numberA);
      
      const v = vector.create(x, y);
      
      tmp.push(v);
    }
    
    return tmp;    
  }
  
  static star(vector, number) {
    const tmp = [];

    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < number / 5; i++) {
        const x = Math.cos(j / 5 * Math.PI * 4);
        const y = Math.sin(j / 5 * Math.PI * 4);

        let nx, ny;

        if (j === 5 - 1) {
          nx = Math.cos(0);
          ny = Math.sin(0);
        } else {
          nx = Math.cos((j + 1) / 5 * Math.PI * 4);
          ny = Math.sin((j + 1) / 5 * Math.PI * 4);
        }

        const sx = x + (nx - x) * (i / (number / 5));
        const sy = y + (ny - y) * (i / (number / 5));

        const v = vector.create(sx, sy);

        tmp.push(v);
      } 
    }

    return tmp;
  }
}
