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
    var text = 'TikTok ';
    var textNum = text.length;
    var xSplit = Math.floor(X / textNum);
    var texts = [];
    var fontSize = 256;
    var lineWidth = 20;
    var radius = X / 5;
    var motionNum = 0;

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
    
    function Text(ctx, t, x, y, i) {
      this.ctx = ctx;
      this.init(t, x, y, i);
    }

    Text.prototype.init = function(t, x, y, i) {
      this.t = t;
      this.x = x;
      this.y = y;
      this.sX = 0;
      this.sY = 0;
      this.v = {
        x: 0,
        y: 0
      };
      this.a = 0;
      this.rad = this.a * Math.PI / 180;
    };

    Text.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = fontSize + 'px Impact';
      // fill stroke
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(254, 44, 85)';
      ctx.fillText(this.t, this.x + this.sX, this.y + this.sY);
      ctx.fillStyle = 'rgb(7, 239, 232)';
      ctx.fillText(this.t, this.x, this.y);
      ctx.restore();
    };

    Text.prototype.render = function() {
      this.draw();
    };
    
    for (var i = 0; i < textNum; i++) {
      var t = new Text(ctx, text[i], xSplit * (i + 1), Y / 2, i);
      texts.push(t);
    }

    /********************
      Render
    ********************/
   
    function render() {
      ctx.clearRect(0, 0, X, Y);
      /*
      ctx.globalCompositeOperation = "darken";
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      */
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

  });
  // Author
  console.log('File Name / textMotionSim.js\nCreated Date / May 24, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
