/*
* File Name / pixcelDataMap.js (prototype version)
* Created Date / Nov 13, 2020
* Aurhor / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
*/

function PixcelDataMap(ctx, x, y) {
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.d = this.ctx.createImageData(this.x, this.y);
  this.h = [];
}

PixcelDataMap.prototype.updateImageData = function() {
  for (var y = 0; y < this.y; y++) {
    for (var x = 0; x < this.x; x++) {
      var i = y * this.x + x;
      this.d.data[4 * i + 0] = this.h[i];
      this.d.data[4 * i + 1] = this.h[i];
      this.d.data[4 * i + 2] = this.h[i];
      this.d.data[4 * i + 3] = this.h[i];
    }
  }
};

PixcelDataMap.prototype.getHeightMap = function(time) {
  for (var y = 0; y < this.y; y++) {
    for (var x = 0; x < this.x; x++) {
      var i = y * this.x + x;
      var cx = x - this.x / 2;
      var cy = y - this.y / 2;
      var d = Math.sqrt(cx * cx + cy * cy);
      var s = (3 * Math.PI) / (this.y / 2) * time / 5000;
      var r = Math.pow(Math.sin(d * s), 3);
      var n = (r + 1) / 2;
      this.h[i] = Math.floor(n * 255);
    }
  }
};

PixcelDataMap.prototype.drawImageData = function() {
  this.ctx.putImageData(this.d, 0, 0);
};

PixcelDataMap.prototype.render = function() {
  this.drawImageData();
  this.getHeightMap(Date.now()); 
  this.updateImageData(); 
};
