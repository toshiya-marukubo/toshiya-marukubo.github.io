
/********************

  I wanted to make a tree, but I was lacking in ability.
  I referenced this book. I have almost understood... maybe...
  
  "Supercharged JavaScript Graphics / Raffaele Cecco" Thanks for genius.

********************/

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
      Tree
    ********************/
    
    var treeNum = 10;
    var trees = [];

    if (X < 768) {
      treeNum = 5;
    }

    function Tree(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }
    Tree.prototype.init = function(x, y) {
      this.x = x;
      this.y = y;
      this.l = rand(Y / 10, Y / 8);
      this.a = -Math.PI / 2;
      this.d = 12;
      this.lw = 14;
      this.c = {
        r: rand(255, 255),
        g: rand(255, 255),
        b: rand(255, 255)
      };
    };
    Tree.prototype.draw = function(x, y, l, a, d, lw) {
      var ctx = this.ctx;
      var endX = x || this.x;
      var endY = y || this.y;
      var newLength = l || this.l;
      var newAngle = a || this.a;
      var newDepth = d || this.d;
      var newBranchWidth = lw || this.lw;
      var maxBranch = 3;
      var maxAngle = 2 * Math.PI / 8;
      var subBranches;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      endX = Math.cos(newAngle) * this.l + endX;
      endY = Math.sin(newAngle) * this.l + endY;
      ctx.lineCap = 'round';
      ctx.lineWidth = newBranchWidth;
      ctx.lineTo(endX, endY);

      if (this.d <= 2) {
        ctx.strokeStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      } else {
        ctx.strokeStyle = 'rgb(' + this.c.r + ', ' + this.c.g + ', ' + this.c.b + ')';
      }
      ctx.stroke();

      newDepth = newDepth - 1;
      if (!newDepth) {
        return;
      }

      subBranches = (Math.random() * maxBranch - 1) + 1;
      newBranchWidth *= 0.7;
      
      for (var i = 0; i < subBranches; i++) {
        newAngle = newAngle + Math.random() * maxAngle - maxAngle * 0.5;
        newLength = newLength * (0.7 + Math.random() * 0.3);
        this.draw(endX, endY, newLength, newAngle, newDepth, newBranchWidth);
      }

      ctx.restore();
    }
    Tree.prototype.resize = function() {
      this.x = rand(0 - 50, X + 50);
      this.y = Y;
    };
    Tree.prototype.render = function() {
      this.draw();
    };

    for (var i = 0; i < treeNum; i++) {
      var tree = new Tree(ctx, rand(-50, X + 50), Y);
      trees.push(tree);
    }

    for (var i = 0; i < trees.length; i++) {
      trees[i].render();
    }

    /********************
      Render
    ********************/
    
    function render() {
      ctx.clearRect(0, 0, X, Y);
      trees = [];
      for (var i = 0; i < treeNum; i++) {
        var tree = new Tree(ctx, rand(-50, X + 50), Y);
        trees.push(tree);
      }
      for (var i = 0; i < trees.length; i++) {
        trees[i].render();
      }
      var time = rand(1000, 3000); 
      setTimeout(render, time);
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
        trees[i].render();
      }
    }
    
    window.addEventListener('resize', function() {
      onResize();
    });

  });
  // Author
  console.log('File Name / tree.js\nCreated Date / May 20, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
