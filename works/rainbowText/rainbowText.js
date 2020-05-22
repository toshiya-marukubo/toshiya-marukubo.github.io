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
    var text = '@toshiya-marukubo ';
    var textNum = text.length;
    var xSplit = X / textNum;
    var texts = [];
    var fontSize = 56;
    var lineWidth = 20;
    var radius = X / 5;
    var motionNum = 0;

    if (X < 768) {
      fontSize = 28;
      lineWidth = 10;
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
    
    function Text(ctx, t, x, y, i) {
      this.ctx = ctx;
      this.init(t, x, y, i);
    }

    Text.prototype.init = function(t, x, y, i) {
      this.t = t;
      this.x = x;
      this.y = y;
      this.xi = this.x;
      this.yi = this.y;
      this.x1 = rand(0, X);
      this.y1 = rand(0, Y);
      this.v = {
        x: 0,
        y: 0
      };
      this.a = i * 20;
      this.rad = this.a * Math.PI / 180;
    };

    Text.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // gradient
      var gradient = ctx.createLinearGradient(0, 0, X, 0);
      gradient.addColorStop(0, "rgba(255, 0, 0, 1)");
      gradient.addColorStop(0.15, "rgba(255, 255, 0, 1)");
      gradient.addColorStop(0.3, "rgba(0, 255, 0, 1)");
      gradient.addColorStop(0.5, "rgba(0, 255, 255, 1)");
      gradient.addColorStop(0.65, "rgba(0, 0, 255, 1)");
      gradient.addColorStop(0.8, "rgba(255, 0, 255, 1)");
      gradient.addColorStop(1, "rgba(255, 0, 0, 1)");
      // settings
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = gradient;
      ctx.fillStyle = 'black';
      ctx.lineWidth = Math.sin(this.rad) * lineWidth + lineWidth + 5;
      ctx.font = fontSize + 'px Impact';
      // motion 4
      if (motionNum === 4) {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rad);
        ctx.translate(-this.x, -this.y);
      }
      // fill stroke
      ctx.strokeText(this.t, this.x, this.y);
      ctx.fillText(this.t, this.x, this.y);
      ctx.restore();
    };

    Text.prototype.updateParams = function() {
      this.a -= 1;
      this.rad = this.a * Math.PI / 180;
    };

    Text.prototype.wrapPosition = function() {
      if (this.x < 0) this.x = X;
      if (this.x > X) this.x = 0;
      if (this.y < 0) this.y = Y;
      if (this.y > Y) this.y = 0;
    };
    
    Text.prototype.initialPosition = function() {
      var x = this.xi - this.x;
      var y = this.yi - this.y;
      var d = x * x + y * y;
      var dist = Math.sqrt(d);
      if (dist < 5) {
        return;
      }
      this.v.x = x / dist * 10;
      this.v.y = y / dist * 10;
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Text.prototype.verticalMotion = function() {
      this.y = Math.tan(this.rad) * 10 + this.y;
    }

    Text.prototype.sideMotion = function() {
      this.x = Math.tan(this.rad) * 10 + this.x;
    }

    Text.prototype.circleMotion = function() {
      this.x = Math.cos(this.rad) * 20 + this.x;
      this.y = Math.sin(this.rad) * 20 + this.y;
    }

    Text.prototype.vibeMotion = function() {
      this.x += rand(-10, 10);
      this.y += rand(-10, 10);
    };

    Text.prototype.fallMotion = function() {
      this.y += 20;
    }

    Text.prototype.render = function() {
      this.updateParams();
      if (motionNum === 0) this.initialPosition();
      if (motionNum === 1) this.verticalMotion();
      if (motionNum === 2) this.sideMotion();
      if (motionNum === 3) this.circleMotion();
      if (motionNum === 5) this.vibeMotion();
      if (motionNum === 6) this.fallMotion();
      this.wrapPosition();
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
      ctx.globalCompositeOperation = "darken";
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
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
      if (X < 768) {
        fontSize = 28;
        lineWidth = 10;
        xSplit = X / textNum;
      } else {
        fontSize = 56;
        lineWidth = 20;
        xSplit = X / textNum;
      }
      texts = [];
      for (var i = 0; i < textNum; i++) {
        var t = new Text(ctx, text[i], xSplit * (i + 1), Y / 2, i);
        texts.push(t);
      }
    });
    
    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    canvas.addEventListener('click', function(e){
      //repRandomNum();
      motionNum++;
      if (motionNum === 7) {
        motionNum = 0;
      }
    }, false);

    canvas.addEventListener('wheel', function(e) {
      for (var i = 0; i < texts.length; i++) {
        texts[i].y -= e.deltaY;
        texts[i].a -= e.deltaX;
      }
    });

    var touchStartY;
    var touchMoveY;
    var touchEndY;
    var touchStartX;
    var touchMoveX;
    var touchEndX;
    canvas.addEventListener('touchstart', function(e) {
      var touch = e.targetTouches[0];
      touchStartY = touch.pageY;
      touchStartX = touch.pageX;
    }, false);
    canvas.addEventListener('touchmove', function(e) {
      var touch = e.targetTouches[0];
      touchMoveY = touch.pageY;
      touchMoveX = touch.pageX;
    }, false);
    canvas.addEventListener('touchend', function(e) {
      touchEndY = touchStartY - touchMoveY;
      touchEndX = touchStartX - touchMoveX;
      for (var i = 0; i < texts.length; i++) {
        texts[i].y -= touchEndY;
      }
      for (var i = 0; i < texts.length; i++) {
        texts[i].y += touchEndY;
      }
      for (var i = 0; i < texts.length; i++) {
        texts[i].a -= touchEndX;
      }
    }, false);

  });
  // Author
  console.log('File Name / rainbowText.js\nCreated Date / May 22, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
