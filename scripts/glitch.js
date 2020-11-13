/*
* File Name / glitch.js (prototype version)
* Created Date / Nov 13, 2020
* Aurhor / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
*/

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function Glitch(ctx, width, height, splitNumber) {
  this.time;
  this.ctx = ctx;
  this.width = width;
  this.height = height;
  this.splitNum = splitNumber;
  this.splitH = this.height / this.splitNum;
  this.dataArr = [];
}

Glitch.prototype.getImageData = function() {
  for (var i = 0; i < this.splitNum ; i++) {
    var d = this.ctx.getImageData(0, this.splitH * i, this.width, this.splitH + 1);
    this.dataArr.push(d);
  }
};

Glitch.prototype.addImage = function() {
  for (var i = 0; i < this.splitNum; i++) {
    this.ctx.putImageData(
      this.dataArr[rand(0, this.splitNum - 1)],
      Math.sin(this.time * 1 + i * 1 * Math.PI / 180) * Math.random() * this.width,
      this.splitH * i
    );
  }
};

Glitch.prototype.render = function() {
  this.time = Date.now() / 1000;
  this.dataArr = [];
  this.getImageData();
  this.addImage();
};
