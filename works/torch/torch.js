(function () {
  'use strict';
  window.addEventListener('load', function() {
    var canvas = document.getElementById('canvas');
    var backCanvas = document.getElementById('backCanvas');


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
    var mouseY = Y / 2 + 100;

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
      fire
    ********************/

    var fireNum = 30;
    var fires = [];

    function Fire(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Fire.prototype.init = function(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.v = {
        x: rand(-0.2, 0.2),
        y: rand(1, 2)
      };
      this.color = {
        r: rand(102, 255),
        g: rand(0, 128),
        b: rand(0, 0),
        a: 1
      };
      this.l = rand(0, 5);
    };

    Fire.prototype.draw = function() {
      ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    };

    Fire.prototype.updateParams = function() {
      this.l -= 0.1;
    };

    Fire.prototype.updatePosition = function() {
      this.x += this.v.x;
      this.y -= this.v.y;
      if (this.l < 0) {
        this.init(mouseX, mouseY, rand(10, 40));
      }
    };

    Fire.prototype.gradient = function() {
      var col = this.color.r + "," + this.color.g + "," + this.color.b;
      var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, "rgba(" + col + ", " + (this.color.a * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (this.color.a * 0.3) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (this.color.a * 0) + ")");
      return g;
    };

    Fire.prototype.resize = function() {
      this.x = mouseX;
      this.y = mouseY;
    };

    Fire.prototype.render = function() {
      this.updatePosition();
      this.updateParams();
      this.draw();
    };

    for (var i = 0; i < fireNum; i++) {
      var fire = new Fire(ctx, mouseX, mouseY, rand(10, 20));
      fires.push(fire);
    }

    /********************
      Clip
    ********************/
    
    var clipSize = 150;
    var clipY = 100;
    
    if (X < 768) {
      clipSize = 100;
      clipY = 50;
    }
     
    function clip() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(mouseX, mouseY - clipY, clipSize, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.clip();
      drawText();
      ctx.restore();
    }

    /********************
      Text
    ********************/
    
    var fontSize = '64px Arial';
    
    if (X < 768) {
      fontSize = '32px Arial';
    }

    function drawText() {
      ctx.save();
      ctx.fillStyle = 'rgb(26, 23, 25)';
      ctx.fillRect(0, 0, X, Y)
      ctx.fillStyle = 'rgb(76, 84, 89)';
      ctx.font = fontSize;
      ctx.textBaseline = 'middle';
      var textWidth = ctx.measureText("You're not alone.").width;
      ctx.fillText("You're not alone.", (X - textWidth) / 2, Y / 2);
      ctx.restore();
    }

    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      clip();
      for (var i = 0; i < fires.length; i++) {
        fires[i].render();
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
      if (X < 768) {
        clipSize = 100;
        clipY = 50;
      }
      if (X < 768) {
        fontSize = '32px Arial';
      }
      clip();
      for (var i = 0; i < fires.length; i++) {
        fires[i].resize();
      }
    }
    
    window.addEventListener('resize', function(){
      onResize();  
    }, false);
    
    window.addEventListener('mousemove', function(e){
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, false);
    
    window.addEventListener('touchmove', function(e) {
      if (e.targetTouches.length === 1) {
        var touch = event.targetTouches[0];
        mouseX = touch.pageX;
        mouseY = touch.pageY;
      }
    }, false);

  });
  // Author
  console.log('File Name / torch.js\nCreated Date / January 30, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
