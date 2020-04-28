(function () {
  'use strict';
  window.addEventListener('load', function () {
    var canvas = document.getElementById('canvas');

    if (!canvas || !canvas.getContext) {
      return false;
    }

    /********************
      Random Number
    ********************/

    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /********************
      Var
    ********************/

    // canvas 
    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = X / 2;
    var mouseY = Y / 2;
    var text = 'Please wait a moment. ';
    var textNum = text.length;
    var texts = [];
    var startAngle = Math.PI * 2;
    var endAngle = 0;
    var angleSplit = (startAngle - endAngle) / text.length;
    var radius = X / 10;
    var flg = false;
    
    if (X < 768) {
      radius = X / 3;
    } 
    /********************
      Animation
    ********************/

    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(cb) {
        setTimeout(cb, 17);
      };

    /********************
      Text
    ********************/

    function drawText() {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgb(30, 30, 30)';
      ctx.font = '12px "sans-selif"';
      ctx.fillText('Now Loading.', X / 2, Y / 2);
      ctx.restore();
    }

    /********************
      Text
    ********************/
    
    function drawTextOnCircle(ctx, text, angleSplit, radius, index, x, y) {
      this.ctx = ctx;
      this.init(text, angleSplit, radius, index, x, y);
    }

    drawTextOnCircle.prototype.init = function(text, angleSplit, radius, index, x, y) {
      this.text = text;
      this.radius = radius;
      this.index = index;
      this.x = x;
      this.y = y;
      this.x1 = X / textNum * (index + 1);
      this.y1 = Y / 2;
      this.x2 = this.x;
      this.y2 = this.y;
      this.angle = angleSplit;
      this.v = {
        x: 0,
        y: 0
      };
      this.rad = rand(0, 360) * Math.PI / 180;
    };

    drawTextOnCircle.prototype.draw = function(){
      var ctx = this.ctx;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgb(30, 30, 30)';
      ctx.font = '16px "sans-selif"';
      ctx.translate(this.x + Math.cos(this.angle) * this.radius, this.y - Math.sin(this.angle) * this.radius);
      if (flg === false) ctx.rotate(Math.PI / 2 - this.angle);
      ctx.fillText(this.text, 0, 0);
      ctx.restore();
    };

    drawTextOnCircle.prototype.updateParams = function() {
      this.angle -= 0.02;
      this.rad -= 0.02;
    };

    drawTextOnCircle.prototype.updatePosition = function() {
      var x = this.x - this.x1;
      var y = this.y - this.y1;
      var d = x * x + y * y;
      if (Math.abs(x) < 5 && Math.abs(y) < 5) {
        this.v.x = 0;
        this.v.y = 0;
      } else {
        var newDist = Math.sqrt(d);
        this.v.x = x / newDist * 5;
        this.v.y = y / newDist * 5;
        this.x = Math.sin(this.rad) * 1 + this.x;
        this.y = Math.cos(this.rad) * 1 + this.y;
        this.x -= this.v.x;
        this.y -= this.v.y;
      }
    };

    var returnFlg = false;

    drawTextOnCircle.prototype.returnPosition = function() {
      var x = this.x - this.x2;
      var y = this.y - this.y2;
      var d = x * x + y * y;
      if (Math.abs(x) <= 2 && Math.abs(y) <= 2) {
        this.v.x = 0;
        this.v.y = 0;
      } else {
        var newDist = Math.sqrt(d);
        this.v.x = x / newDist * 5;
        this.v.y = y / newDist * 5;
        this.x = Math.sin(this.rad) * 1 + this.x;
        this.y = Math.cos(this.rad) * 1 + this.y;
        this.x -= this.v.x;
        this.y -= this.v.y;
      }
    };

    drawTextOnCircle.prototype.render = function() {
      this.draw();
      this.updateParams();
      if (flg === true) {
        this.updatePosition();
      }
      if (returnFlg === true) {
        this.returnPosition();
      }
    };

    for (var i = 0; i < text.length; i++) {
      var t = new drawTextOnCircle(ctx, text[i], -angleSplit * i, radius, i, mouseX, mouseY);
      texts.push(t);
    }

    /********************
      Render
    ********************/
   
    function render() {
      ctx.clearRect(0, 0, X, Y);
      drawText();
      for (var i = 0; i < texts.length; i++) {
        texts[i].render();
      }
      requestAnimationFrame(render);
    }

    render();

    /********************
      Event
    ********************/
    
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', function(){
      onResize();
    });
    
    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    window.addEventListener('click', function() {
      if (flg === true) {
        flg = false;
        returnFlg = true;
      } else {
        flg = true;
        returnFlg = false;
      }
    }, false);

  });
  // Author
  console.log('File Name / loadingText.js\nCreated Date / April 25, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
