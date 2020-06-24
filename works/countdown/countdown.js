(function() {
  'use strict';
  window.addEventListener('load', function() {
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
    
    // var
    var textNum = 3;
    var texts = [];
    var index = 0;
    
    var count = [
      'TEN.',
      'NINE.',
      'EIGHT.',
      'SEVEN.',
      'SIX.',
      'FIVE.',
      'FOUR.',
      'THREE.',
      'TWO.',
      'ONE.',
      'ZERO.'
    ];
     
    function Text(ctx, x, y, i, t) {
      this.ctx = ctx;
      this.init(x, y, i, t);
    }

    Text.prototype.init = function(x, y, i, t) {
      this.x = x;
      this.y = y;
      this.t = t;
      this.c = 'black';
      this.sc = 'white';
      this.a = i * 60;
      this.rad = this.a * Math.PI / 180;
    };

    Text.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(Math.tan(this.rad));
      ctx.scale(Math.cos(this.rad), Math.sin(this.rad));
      ctx.translate(-this.x, -this.y);
      ctx.globalAlpha = Math.sin(this.rad * 2);
      ctx.strokeStyle = this.sc;
      ctx.fillStyle = this.c;
      ctx.lineWidth = Math.tan(this.rad) * 50;
      ctx.font = Math.tan(this.rad) * 300 + 'px "Impact", sans-selif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText(this.t, this.x, this.y);
      ctx.fillText(this.t, this.x, this.y);
      ctx.restore();
    };

    Text.prototype.updateParams = function() {
      this.a += 1;
      this.rad = this.a * Math.PI / 180;
      if (this.a % 180 === 0) {
        index === count.length - 1 ? index = 0 : index++;
        this.t = count[index];
      }
    };

    Text.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y / 2;
    };

    Text.prototype.render = function() {
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < textNum; i++) {
      var t = new Text(ctx, X / 2, Y / 2, i, count[0]);
      texts.push(t);
    }

    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < texts.length; i++) {
        texts[i].render(i);
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
      for (var i = 0; i < texts.length; i++) {
        texts[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  }); 
  // Author
  console.log('File Name / countdown.js\nCreated Date / Jun 24, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
