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
    var countNum = document.getElementById('countNum');
    var num = 0;

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

    function Orange(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Orange.prototype.init = function(x, y, r) {
      this.x = x;
      this.y = y;
      this.x1 = this.x;
      this.y1 = this.y;
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

    Orange.prototype.updateParams = function(i) {
      if (this.y + this.r === Y) {
        if (mouseX !== null) {
          var angle = Math.atan2(this.y1 - mouseY, this.x1 -  mouseX);
          this.x += Math.cos(angle) * 10;
          this.y += Math.sin(angle) * 10;
          this.x1 = this.x;
          this.y1 = this.y;
        }
      }
      if (this.x - this.r > X || this.x + this.r < 0) {
        oranges.splice(i, 1);
        console.log(oranges.length);
      }
    };

    Orange.prototype.updatePosition = function() {
      this.v.y += 0.5;
      this.y += this.v.y;
      if (this.y > Y - this.r) {
        this.v.y *= -0.5;
        this.y = Y - this.r;
      }
    };

    Orange.prototype.resize = function() {
      this.x = rand(0, X);
      this.y = rand(0, Y);
    };

    Orange.prototype.render = function(i) {
      this.updateParams(i);
      this.updatePosition();
      this.draw();
    };

    for (var i = 0; i < 20; i++) {
      var orange = new Orange(ctx, rand(0, X), rand(0, Y / 2), rand(10, 100));
      oranges.push(orange);
      num++;
      countNum.textContent = num;
    }
   
    /********************
      Tree
    ********************/
    
    // var
    var treeNum = 1;
    var trees = [];

    function Tree(ctx, x, y, r) {
      this.ctx = ctx;
      this.init(x, y, r);
    }

    Tree.prototype.init = function(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = rand(50, 100);
      this.c = {
        trunk: 'rgb(167, 129, 91)',
        leaf: 'rgb(62, 142, 76)'
      };
    };
    
    Tree.prototype.draw = function() {
      var ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.c.leaf;
      ctx.moveTo(0, 0);
      ctx.lineTo(0, Y / 2);
      ctx.quadraticCurveTo(X / 2, Y, X, Y / 2);
      ctx.lineTo(X, 0);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.lineWidth = 80;
      ctx.strokeStyle = this.c.trunk;
      ctx.moveTo(this.x, Y);
      ctx.lineTo(this.x, 0);
      ctx.stroke();
      ctx.restore();
    };

    Tree.prototype.resize = function() {
      this.x = X / 2;
      this.y = Y;
    };

    Tree.prototype.render = function() {
      this.draw();
    };

    for (var i = 0; i < treeNum; i++) {
      var tree = new Tree(ctx, X / 2, Y);
      trees.push(tree);
    }
    
    /********************
      Render
    ********************/
    
    function render(){
      ctx.clearRect(0, 0, X, Y);
      for (var i = 0; i < treeNum; i++) {
        trees[i].render();
      }
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
      for (var i = 0; i < trees.length; i++) {
        trees[i].resize();
      }
      for (var i = 0; i < oranges.length; i++) {
        oranges[i].resize();
      }
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    canvas.addEventListener('click', function() {
      for (var i = 0; i < rand(1, 10); i++) {
        var orange = new Orange(ctx, rand(0, X), rand(0, Y / 2), rand(10, 100));
        oranges.push(orange);
        num++;
        countNum.textContent = num;
      }
    });

  });
  // Author
  console.log('File Name / orangeKun.js\nCreated Date / February 29, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
