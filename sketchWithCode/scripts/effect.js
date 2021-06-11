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
      case 'edgeDetect':
        data = this.edgeDetect(ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ);
        return data;
        break;
      case 'emboss':
        data = this.emboss(ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ);
        return data;
        break;
      case 'mosaic':
        data = this.mosaic(ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ);
        return data;
        break;
      case 'outOfFocus':
        data = this.outOfFocus(ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ);
        return data;
        break;
      case 'invert':
        data = this.invert(ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ);
        return data;
        break;
      case 'grayScale':
        data = this.grayScale(ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ);
        return data;
        break;
      case 'blackAndWhite':
        data = this.blackAndWhite(ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ);
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

  static edgeDetect(ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const newImageData = ctx.createImageData(width, height);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let n = 1;
        if (noise) {
          n = simplex.noise3D(x / noiseX, y / noiseY, noiseZ);
        }
        const intensity = Math.floor(numberC * n);
        
        const il = (y * width + x - 1) * 4;
        const rl = imageData.data[il + 0];
        const gl = imageData.data[il + 1];
        const bl = imageData.data[il + 2];

        const i2 = ((y - 1) * width + x) * 4;
        const r2 = imageData.data[i2 + 0];
        const g2 = imageData.data[i2 + 1];
        const b2 = imageData.data[i2 + 2];

        const i3 = (y * width + x) * 4;
        const r = imageData.data[i3 + 0];
        const g = imageData.data[i3 + 1];
        const b = imageData.data[i3 + 2];

        const nr = Math.min((Math.abs(r2 - r) + Math.abs(rl - r)) * intensity, 255);
        const ng = Math.min((Math.abs(g2 - g) + Math.abs(gl - g)) * intensity, 255);
        const nb = Math.min((Math.abs(b2 - b) + Math.abs(bl - b)) * intensity, 255);

        if (imageData.data[i3 + 3] > 0) {
          newImageData.data[i3 + 0] = nr;
          newImageData.data[i3 + 1] = ng;
          newImageData.data[i3 + 2] = nb;
          newImageData.data[i3 + 3] = 0xff;
        }
      }
    }
    
    return newImageData;
  }

  static emboss(ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const newImageData = ctx.createImageData(width, height);
    const bgR = 128, bgG = 128, bgB = 128;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let n = 1;
        if (noise) {
          n = simplex.noise3D(x / noiseX, y / noiseY, noiseZ);
        }
        const power = Math.floor(numberC * n);
        
        const il = (y * width + x - 1) * 4;
        const rl = imageData.data[il + 0];
        const gl = imageData.data[il + 1];
        const bl = imageData.data[il + 2];
        
        const ni = (y * width + x) * 4;
        const r = imageData.data[ni + 0];
        const g = imageData.data[ni + 1];
        const b = imageData.data[ni + 2];
        
        const nr = Math.min(Math.max(bgR + Math.floor((r - rl) * power), 0), 255);
        const ng = Math.min(Math.max(bgG + Math.floor((g - gl) * power), 0), 255);
        const nb = Math.min(Math.max(bgB + Math.floor((b - bl) * power), 0), 255);
        
        if (imageData.data[ni + 3] > 0) {
          newImageData.data[ni + 0] = nr;
          newImageData.data[ni + 1] = ng;
          newImageData.data[ni + 2] = nb;
          newImageData.data[ni + 3] = 0xff;
        }
      }
    }

    return newImageData;
  }

  static mosaic(ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const newImageData = ctx.createImageData(width, height);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let n = 1;
        if (noise) {
          n = simplex.noise3D(x / noiseX, y / noiseY, noiseZ);
        }
        const blockSize = Math.floor(numberC * n);
        const k = (y * width + x) * 4;
        const nx = Math.floor(x / blockSize) * blockSize;
        const ny = Math.floor(y / blockSize) * blockSize;
        const floorIndex = (ny * width + nx) * 4;
        
        if (imageData.data[k + 3] > 0) {
          newImageData.data[k + 0] = imageData.data[floorIndex];
          newImageData.data[k + 1] = imageData.data[floorIndex + 1];
          newImageData.data[k + 2] = imageData.data[floorIndex + 2];
          newImageData.data[k + 3] = imageData.data[floorIndex + 3];
        }
      }
    }  
    
    return newImageData;
  }

  static outOfFocus(ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const newImageData = ctx.createImageData(width, height);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let rTotal = 0, gTotal = 0, bTotal = 0, nColors = 0;
        let n = 1;
        if (noise) {
          n = simplex.noise3D(x / noiseX, y / noiseY, noiseZ);
        }
        const power = Math.floor(numberC / 100 * n);
        
        for (let dy = -power + y; dy <= power + y; dy++) {
          for (let dx = -power + x; dx <= power + x; dx++) {
            if (dx >= 0 && dx < width && dy >= 0 && dy < height) {
              let ni = (dy * width + dx) * 4;
              rTotal += imageData.data[ni + 0];
              gTotal += imageData.data[ni + 1];
              bTotal += imageData.data[ni + 2];
              nColors++;
            }
          }
        }
        
        const ni = (y * width + x) * 4;

        if (imageData.data[ni + 3] > 0) {
          newImageData.data[ni + 0] = rTotal / nColors;
          newImageData.data[ni + 1] = gTotal / nColors;
          newImageData.data[ni + 2] = bTotal / nColors;
          newImageData.data[ni + 3] = 0xff;
        }
      }
    }

    return newImageData;
  }

  static invert(ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const newImageData = ctx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let n = 1;
        if (noise) {
          n = simplex.noise3D(x / noiseX, y / noiseY, noiseZ);
        }
        const val = Math.floor(Math.min(numberC, 255) * n);
        const k = (y * width + x) * 4;

        if (imageData.data[k + 3] > 0) {
          newImageData.data[k + 0] = val - imageData.data[k + 0];
          newImageData.data[k + 1] = val - imageData.data[k + 1];
          newImageData.data[k + 2] = val - imageData.data[k + 2];
          newImageData.data[k + 3] = imageData.data[k + 3];
        }
      }
    }

    return newImageData;
  }

  static grayScale(ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const newImageData = ctx.createImageData(width, height);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const k = (y * width + x) * 4;
        const r = imageData.data[k + 0];
        const g = imageData.data[k + 1];
        const b = imageData.data[k + 2];
        const luminance = (r + g + b) / 3;
        
        if (imageData.data[k + 3] > 0) {
          newImageData.data[k + 0] = luminance;
          newImageData.data[k + 1] = luminance;
          newImageData.data[k + 2] = luminance;
          newImageData.data[k + 3] = imageData.data[k + 3];
        }
      }
    }

    return newImageData;
  }

  static blackAndWhite(ctx, height, width, numberC, numberD, scaleOne, simplex, noise, noiseX, noiseY, noiseZ) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const newImageData = ctx.createImageData(width, height);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const k = (y * width + x) * 4;
        const r = imageData.data[k + 0];
        const g = imageData.data[k + 1];
        const b = imageData.data[k + 2];
        const luminance = (r + g + b) / 3;
        const value = luminance >= 128 ? 255 : 0;
        
        if (imageData.data[k + 3] > 0) {
          newImageData.data[k + 0] = value;
          newImageData.data[k + 1] = value;
          newImageData.data[k + 2] = value;
          newImageData.data[k + 3] = imageData.data[k + 3];
        }
      }
    }

    return newImageData;
  }
}
