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
    var mouseX = null;
    var mouseY = null;
    var minSize = 1;
    var maxSize = 100;

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

    function Orange(ctx, x, y, r, x1, y1) {
      this.ctx = ctx;
      this.init(x, y, r, x1, y1);
    }

    Orange.prototype.init = function(x, y, r, x1, y1) {
      this.x = x;
      this.y = y;
      this.x1 = x1 || x;
      this.y1 = y1 || y;
      this.r = r;
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
      this.a = rand(0, 360);
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
      switch (this.es) {
        case 1:
          this.drawEyesPt1();
          break;
        case 2:
          this.drawEyesPt2();
          break;
        case 3:
          this.drawEyesPt3();
          break;
        case 4:
          this.drawEyesPt4();
          break;
      }
      ctx.restore();
      // mouth
      ctx.save();
      switch (this.ms) {
        case 1:
          this.drawMouthPt1();
          break;
        case 2:
          this.drawMouthPt2();
          break;
        case 3:
          this.drawMouthPt3();
          break;
      }
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
    Orange.prototype.drawEyesPt2 = function() {
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineWidth = this.s / 2;
      ctx.strokeStyle = this.c.e;
      ctx.moveTo(this.x - this.s - this.s - this.s, this.y - this.s);
      ctx.lineTo(this.x - this.s, this.y - this.s);
      ctx.moveTo(this.x + this.s + this.s + this.s, this.y - this.s);
      ctx.lineTo(this.x + this.s, this.y - this.s);
      ctx.stroke();
    };
    Orange.prototype.drawEyesPt3 = function() {
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineWidth = this.s / 2;
      ctx.strokeStyle = this.c.e;
      ctx.moveTo(this.x - this.s - this.s - this.s, this.y - this.s);
      ctx.lineTo(this.x - this.s, this.y - this.s - this.s);
      ctx.moveTo(this.x + this.s + this.s + this.s, this.y - this.s);
      ctx.lineTo(this.x + this.s, this.y - this.s - this.s);
      ctx.stroke();
      ctx.moveTo(this.x - this.s - this.s - this.s, this.y - this.s - this.s);
      ctx.lineTo(this.x - this.s, this.y - this.s - this.s);
      ctx.moveTo(this.x + this.s + this.s + this.s, this.y - this.s - this.s);
      ctx.lineTo(this.x + this.s, this.y - this.s - this.s);
      ctx.stroke();
      ctx.moveTo(this.x - this.s - this.s - this.s, this.y - this.s - this.s - this.s);
      ctx.lineTo(this.x - this.s, this.y - this.s - this.s);
      ctx.moveTo(this.x + this.s + this.s + this.s, this.y - this.s - this.s - this.s);
      ctx.lineTo(this.x + this.s, this.y - this.s - this.s);
      ctx.stroke();
    };
    Orange.prototype.drawEyesPt4 = function() {
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineWidth = this.s / 2;
      ctx.strokeStyle = this.c.e;
      ctx.moveTo(this.x - this.s - this.s - this.s, this.y - this.s);
      ctx.lineTo(this.x - this.s, this.y - this.s - this.s);
      ctx.moveTo(this.x + this.s + this.s + this.s, this.y - this.s);
      ctx.lineTo(this.x + this.s, this.y - this.s - this.s);
      ctx.stroke();
      ctx.moveTo(this.x - this.s - this.s - this.s, this.y - this.s - this.s);
      ctx.lineTo(this.x - this.s, this.y - this.s - this.s + this.s);
      ctx.moveTo(this.x + this.s + this.s + this.s, this.y - this.s - this.s);
      ctx.lineTo(this.x + this.s, this.y - this.s);
      ctx.stroke();
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
    Orange.prototype.drawMouthPt2 = function() {
      ctx.beginPath();
      ctx.strokeStyle = this.c.e;
      ctx.lineWidth = this.s / 2;
      ctx.lineCap = 'round';
      ctx.moveTo(this.x - this.s - this.s, this.y + this.s + this.s + this.s);
      ctx.quadraticCurveTo(this.x, this.y + this.s, this.x + this.s + this.s, this.y + this.s + this.s + this.s);
      ctx.stroke();
    };
    Orange.prototype.drawMouthPt3 = function() {
      ctx.beginPath();
      ctx.strokeStyle = this.c.e;
      ctx.lineWidth = this.s / 2;
      ctx.lineCap = 'round';
      ctx.moveTo(this.x - this.s - this.s, this.y + this.s + this.s + this.s);
      ctx.lineTo(this.x + this.s + this.s, this.y + this.s + this.s + this.s);
      ctx.stroke();
    };   
    
    Orange.prototype.deleteOrange = function(i) {
      if (mouseX > this.x - this.r && mouseX < this.x + this.r && mouseY > this.y - this.r && mouseY < this.y + this.r) {
        oranges.splice(i, 1);
      }
    };

    Orange.prototype.updatePosition = function() {
      if (Math.abs(this.x - this.x1) < 2 && Math.abs(this.y - this.y1) < 2) {
        this.v.x = 0;
        this.v.y = 0;
      } else {
        var x = this.x - this.x1;
        var y = this.y - this.y1;
        var d = x * x + y * y;
        var dist = Math.floor(Math.sqrt(d));
        this.v.x = x / dist * 3;
        this.v.y = y / dist * 3;
        //this.x += Math.sin(this.rad) * 2;
        //this.y += Math.cos(this.rad) * 2;
        this.x -= this.v.x;
        this.y -= this.v.y;
        //this.rad += 0.01;
      }
    };

    function addParticle() {
      var overlap = false;
      var setX = rand(0, X);
      var setY = rand(0, Y);
      var setR = rand(minSize, maxSize);
      for (var i = 0; i < oranges.length; i++) {
        var x = Math.abs(setX - oranges[i].x1);
        var y = Math.abs(setY - oranges[i].y1);
        var d = x * x + y * y;
        var dist = Math.floor(Math.sqrt(d));
        if (dist < setR + oranges[i].r) {
          overlap = true;
          break;
        }
      }
      if (overlap === true) {
        addParticle();
        return;
      }
      var orange = new Orange(ctx, X / 2, Y / 2, setR, setX, setY);
      oranges.push(orange);
    }
    var orange = new Orange(ctx, rand(0, X), rand(0, Y), rand(minSize, maxSize));
    oranges.push(orange);
    
    Orange.prototype.render = function(i) {
      this.updatePosition();
      this.draw();
    };

    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      addParticle();
      for (var i = 0; i < oranges.length; i++) {
        oranges[i].render(i);
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

    window.addEventListener('resize', function() {
      onResize();
    });

    window.addEventListener('click', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      oranges = [];
    }, false);

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      for (var i = 0; i < oranges.length; i++) {
        oranges[i].deleteOrange(i);
      }
    });

  }); 
  // Author
  console.log('File Name / particle.js\nCreated Date / April 28, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
