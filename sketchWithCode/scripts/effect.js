/** Class Effect */
class Effect {
  /**
   * choise effect
   * @param {string} type - type
   * @param {object} ctx - canvas context object
   * @param {number} height - window height
   * @param {number} width - window width
   * @param {number} numberC - number C
   * @param {number} numberD - number D
   * @param {object} simplex - simplex noise instance
   * @param {boolean} noise - true or false
   * @param {number} noiseX - pass noise
   * @param {number} noiseY - pass noise
   * @return {array} data - effected image data array
   */
  static choiseEffect(type, ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ) {
    let data;
    switch (type) {
      case 'vertical':
        data = this.vertical(ctx, height, width, numberC, numberD, simplex, noise, noiseX, noiseY, noiseZ);
        return data;
        break;
      case 'horizontal':
        data = this.horizontal(ctx, height, width, numberC, numberD, simplex, noise, noiseX, noiseY, noiseZ);
        return data;
        break;
      case 'sandstorm':
        data = this.sandstorm(ctx, height, width, numberC, numberD, simplex, noise, noiseX, noiseY, noiseZ);
        return data;
        break;
      case 'skew':
        data = this.skew(ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ);
        return data;
        break;
      case 'anaglyph':
        data = this.anaglyph(ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ);
        return data;
        break;
    }
  }
  
  /**
   * common parameters
   * @param {object} ctx - canvas context object
   * @param {number} height - window height
   * @param {number} width - window width
   * @param {number} numberC - number C
   * @param {number} numberD - number D
   * @param {object} simplex - simplex noise instance
   * @param {boolean} noise - true or false
   * @param {number} noiseX - pass noise
   * @param {number} noiseY - pass noise
   * @return {array} data - effected image data array
   */
  static vertical(ctx, height, width, numberC, numberD, simplex, noise, noiseX, noiseY, noiseZ) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const newImageData = ctx.createImageData(width, height);
    const wave = (numberC * Math.PI * 2) / height;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let n = 1;
        if (noise) {
          n = simplex.noise3D(x / noiseX, y / noiseY, noiseZ);
        }
        const offset = Math.floor(Math.sin(x * wave) * numberD * n);
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

  static horizontal(ctx, height, width, numberC, numberD, simplex, noise, noiseX, noiseY, noiseZ) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const newImageData = ctx.createImageData(width, height);
    const wave = (numberC * Math.PI * 2) / width;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let n = 1;
        if (noise) {
          n = simplex.noise3D(x / noiseX, y / noiseY, noiseZ);
        }
        const offset = Math.floor(Math.sin(y * wave) * numberD * n);
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

  static sandstorm(ctx, height, width, numberC, numberD, simplex, noise, noiseX, noiseY, noiseZ) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const newImageData = ctx.createImageData(width, height);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let n = 1;
        if (noise) {
          n = simplex.noise3D(x / noiseX, y / noiseY, noiseZ);
        }
        const k = (y * width + x) * 4;
        if (imageData.data[k + 3] > 0x00) {
          newImageData.data[k + 0] = imageData.data[k + 0];
          newImageData.data[k + 1] = imageData.data[k + 1];
          newImageData.data[k + 2] = imageData.data[k + 2];
          newImageData.data[k + 3] = Math.random() < numberC / 360 ? 255 * n : imageData.data[k + 3];
        }
      }
    }  
  
    return newImageData;
  }

  static skew(ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const newImageData = ctx.createImageData(width, height);
    const angle = numberC;
    const wave = numberD;
    const radian = angle * Math.PI * 2 / 360;
    const diagonal = scaleOne;
    const scale = (Math.PI * 2 * wave) / diagonal;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let n = 1;
        if (noise) {
          n = simplex.noise3D(x / noiseX, y / noiseY, noiseZ);
        }
        const k = (y * width + x) * 4;
        const cy = Math.floor(y - height / 2);
        const cx = Math.floor(x - width / 2);
        const sa = Math.sin(Math.sqrt(cx * cx + cy * cy) * scale) * radian * n;
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
  
  static anaglyph(ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const imageData2 = ctx.createImageData(width, height);
    const newImageData = ctx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let n = 1;
        if (noise) {
          n = simplex.noise3D(x / noiseX, y / noiseY, noiseZ);
        }
        const offset = - Math.floor(numberC * n);
        const k = (y * width + x) * 4;
        const s = (y * width + x + offset) * 4;
        
        if (imageData.data[s + 3] > 0x00) {
          imageData2.data[k + 0] = imageData.data[s + 0];
          imageData2.data[k + 1] = imageData.data[s + 1];
          imageData2.data[k + 2] = imageData.data[s + 2];
          imageData2.data[k + 3] = imageData.data[s + 3];
        }
      }
    }
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let n = 1;
        if (noise) {
          n = simplex.noise3D(x / noiseX, y / noiseY, noiseZ);
        }
        const k = (y * width + x) * 4;
        
        if (imageData.data[k + 3] > 0x00) {
          newImageData.data[k + 0] = 255 * imageData.data[k + 0] / 0xff;
          newImageData.data[k + 1] = 255 * imageData2.data[k + 1] / 0xff;
          newImageData.data[k + 2] = 255 * imageData2.data[k + 2] / 0xff;
          newImageData.data[k + 3] = imageData.data[k + 3];
        }
      }
    }
  
    return newImageData;
  }
}
