(function () {
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
    var mouseX = null;
    var mouseY = null;

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
      Orange
    ********************/
    
    // var
    var oranges = [];
    var orangeSize = Y / 1.5;
    
    if (X < 768) {
      orangeSize = Y / 2;
    }

    function Orange(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Orange.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.r = orangeSize;
      this.s = this.r / 7;
      this.c = {
        o: 'rgb(236, 142, 4)',
        s: 'rgb(38, 112, 48)',
        e: 'rgb(87, 60, 27)',
        c: 'rgb(240, 177, 0)'
      };
      this.v = {
        x: 0,
        y: rand(5, 10)
      };
      this.a = 20;
      this.es = rand(1, 4);
      this.ms = rand(1, 3);
    };
    
    Orange.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      // circle
      ctx.beginPath();
      ctx.fillStyle = this.c.o;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.a * Math.PI / 180);
      ctx.translate(-this.x, -this.y);
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      // star
      ctx.beginPath();
      ctx.fillStyle = this.c.s;
      var digree = Math.PI / 5 * 4;
      for (var i = 0; i < 5; i++) {
        var x = Math.sin(i * digree);
        var y = Math.cos(i * digree);
        ctx.lineTo(x * this.s * 1.2 + this.x, y * this.s * 1.2 + this.y - this.r * 0.8);
      }
      ctx.closePath();
      ctx.fill();
      // eyes
      ctx.save();
      this.drawEyesPt1();
      ctx.restore();
      // mouth
      ctx.save();
      this.drawMouthPt1();
      ctx.restore();
      // cheek
      ctx.beginPath();
      ctx.fillStyle = this.c.c;
      ctx.arc(this.x - this.s - this.s - this.s - this.s, this.y + this.s, this.s * 1, 0, Math.PI * 2, false);
      ctx.arc(this.x + this.s + this.s + this.s + this.s, this.y + this.s, this.s * 1, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    // eyes
    Orange.prototype.drawEyesPt1 = function() {
      ctx.beginPath();
      ctx.fillStyle = this.c.e;
      ctx.arc(this.x - this.s - this.s, this.y - this.s, this.s / 2, 0, Math.PI * 2, false);
      ctx.arc(this.x + this.s + this.s, this.y - this.s, this.s / 2, 0, Math.PI * 2, false);
      ctx.fill();
    };

    // mouth
    Orange.prototype.drawMouthPt1 = function() {
      ctx.beginPath();
      ctx.strokeStyle = this.c.e;
      ctx.lineWidth = this.s / 2;
      ctx.lineCap = 'round';
      ctx.moveTo(this.x - this.s - this.s, this.y + this.s + this.s + this.s);
      ctx.quadraticCurveTo(this.x, this.y + this.s + this.s + this.s + this.s, this.x + this.s + this.s, this.y + this.s + this.s + this.s);
      ctx.stroke();
    };

    Orange.prototype.render = function(i) {
      this.draw();
    };

    for (var i = 0; i < 1; i++) {
      var orange = new Orange(ctx, X / 2, Y / 2);
      oranges.push(orange);
    }
   
    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < oranges.length; i++) {
        oranges[i].render(i);
      }
      requestAnimationFrame(render);
    }

    render();

    /********************
      Event
    ********************/
    
    // resize
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      oranges = [];
      if (X < 768) {
        orangeSize = Y / 2;
      } else {
        orangeSize = Y / 1.5;
      }
      for (var i = 0; i < 1; i++) {
        var orange = new Orange(ctx, X / 2, Y / 2);
        oranges.push(orange);
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

  });
})();
