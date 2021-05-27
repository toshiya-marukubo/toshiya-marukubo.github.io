/**
 * Effect
 */
class Effect {
  /**
   * choise effect
   * @param {String} type - type
   * @param {Object} ctx - canvas context object
   * @param {Number} height - window height
   * @param {Number} width - window width
   * @param {Number} numberC - number c
   * @param {Number} numberD - number d
   * @param {Object} noise - simplex noise instance
   * @return {Array} data - image data array
   */
  static choiseEffect(type, ctx, height, width, numberC, numberD, scaleOne, simplex) {
    let data;
    switch (type) {
      case 'vertical':
        data = this.vertical(ctx, height, width, numberC, numberD);
        return data;
        break;
      case 'horizontal':
        data = this.horizontal(ctx, height, width, numberC, numberD);
        return data;
        break;
      case 'sandstorm':
        data = this.sandstorm(ctx, height, width, numberC, numberD);
        return data;
        break;
      case 'skew':
        data = this.skew(ctx, height, width, numberC, numberD, scaleOne);
        return data;
        break;
      case 'noise':
        data = this.noise(ctx, height, width, numberC, numberD, scaleOne, simplex);
        return data;
        break;
    }
  }
  
  static vertical(ctx, height, width, numberC, numberD) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const newImageData = ctx.createImageData(width, height);
    const wave = (numberC * Math.PI * 2) / height;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const offset = Math.floor(Math.sin(x * wave) * numberD);
        const k = (y * width + x) * 4;
        const s = ((y + offset) * width + x) * 4;
        
        if (imageData.data[s + 3] > 0x00) {
          newImageData.data[k + 0] = imageData.data[s + 0];
          newImageData.data[k + 1] = imageData.data[s + 1];
          newImageData.data[k + 2] = imageData.data[s + 2];
          newImageData.data[k + 3] = imageData.data[s + 3];
        } else {
          newImageData.data[k + 0] = imageData.data[k + 0];
          newImageData.data[k + 1] = imageData.data[k + 1];
          newImageData.data[k + 2] = imageData.data[k + 2];
          newImageData.data[k + 3] = imageData.data[k + 3];
        }
      }
    }
  
    return newImageData;
  }

  static horizontal(ctx, height, width, numberC, numberD) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const newImageData = ctx.createImageData(width, height);
    const wave = (numberC * Math.PI * 2) / width;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const offset = Math.floor(Math.sin(y * wave) * numberD);
        const k = (y * width + x) * 4;
        const s = (y * width + x + offset) * 4;
        
        if (imageData.data[s + 3] > 0x00) {
          newImageData.data[k + 0] = imageData.data[s + 0];
          newImageData.data[k + 1] = imageData.data[s + 1];
          newImageData.data[k + 2] = imageData.data[s + 2];
          newImageData.data[k + 3] = imageData.data[s + 3];
        } else {
          newImageData.data[k + 0] = imageData.data[k + 0];
          newImageData.data[k + 1] = imageData.data[k + 1];
          newImageData.data[k + 2] = imageData.data[k + 2];
          newImageData.data[k + 3] = imageData.data[k + 3];
        }
      }
    }
  
    return newImageData;
  }

  static sandstorm(ctx, height, width, numberC, numberD) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const newImageData = ctx.createImageData(width, height);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const k = (y * width + x) * 4;
        if (imageData.data[k + 3] > 0x00) {
          newImageData.data[k + 0] = imageData.data[k + 0];
          newImageData.data[k + 1] = imageData.data[k + 1];
          newImageData.data[k + 2] = imageData.data[k + 2];
          newImageData.data[k + 3] = Math.random() < numberC / 360 ? Utils.getRandomNumber(0, 255) : imageData.data[k + 3];
        }
      }
    }  
  
    return newImageData;
  }

  static skew(ctx, height, width, numberC, numberD, scaleOne) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const newImageData = ctx.createImageData(width, height);
    const angle = numberC;
    const wave = numberD;
    const radian = angle * Math.PI * 2 / 360;
    const diagonal = scaleOne;
    const scale = (Math.PI * 2 * wave) / diagonal;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const k = (y * width + x) * 4;
        const cy = Math.floor(y - height / 2);
        const cx = Math.floor(x - width / 2);
        const sa = Math.sin(Math.sqrt(cx * cx + cy * cy) * scale) * radian;
        const co = Math.cos(sa);
        const si = Math.sin(sa);
        const ys = Math.floor((cy * co + cx * si) + height / 2);
        const xs = Math.floor((cx * co - cy * si) + width / 2);
        const s = (ys * width + xs) * 4;

        if (imageData.data[s + 3] > 0x00 && xs >= 0 && xs < width && ys >= 0 && ys < height) {
          newImageData.data[k + 0] = imageData.data[s + 0];
          newImageData.data[k + 1] = imageData.data[s + 1];
          newImageData.data[k + 2] = imageData.data[s + 2];
          newImageData.data[k + 3] = imageData.data[s + 3];
        } else {
          newImageData.data[k + 0] = imageData.data[k + 0];
          newImageData.data[k + 1] = imageData.data[k + 1];
          newImageData.data[k + 2] = imageData.data[k + 2];
          newImageData.data[k + 3] = imageData.data[k + 3];
        }
      }
    }
  
    return newImageData;
  }
  
  static noise(ctx, height, width, numberC, numberD, scaleOne, simplex) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const newImageData = ctx.createImageData(width, height);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const k = (y * width + x) * 4;
        if (imageData.data[k + 3] > 0x00) {
          const n = simplex.noise2D(x / numberC, y / numberD);
          newImageData.data[k + 0] = imageData.data[k + 0] * n;
          newImageData.data[k + 1] = imageData.data[k + 1] * n;
          newImageData.data[k + 2] = imageData.data[k + 2] * n;
          newImageData.data[k + 3] = imageData.data[k + 3];
        }
      }
    }  
  
    return newImageData;
  }

}
