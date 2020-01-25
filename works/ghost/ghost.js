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
    var mouseX = 0;
    var mouseY = 0;
    var repFlg = true;
    var countNumber = 5;

    var count = document.getElementById('count');
    
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
      Ghost
    ********************/
    
    // var
    var ghostNum = 25;
    var ghosts = [];
    var circleSplit = 12;
     
    function Ghost(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Ghost.prototype.init = function(x, y) {
      this.radian = 30;
      this.x = x;
      this.y = y;
      this.r = rand(50, 150);
      this.rad = this.radian * Math.PI / 180;
      this.points = [];
      this.setPoints();
    };

    Ghost.prototype.setPoints = function() {
      for (var i = 0; i < circleSplit; i++) {
        var pointX = Math.cos(this.rad) * this.r;
        var pointY = Math.sin(this.rad) * this.r;
        var point = [pointX, pointY];
        this.points.push(point);
        this.rad = (this.radian += 30) * Math.PI / 180;
      }
    };

    Ghost.prototype.draw = function() {
      ctx = this.ctx;
      ctx.strokeStyle = 'rgb(0, 128, 255)';
      ctx.beginPath();
      var xav1 = (this.points[0][0] + this.points[circleSplit - 1][0]) / 2 + this.x;
      var yav1 = (this.points[0][1] + this.points[circleSplit - 1][1]) / 2 + this.y;
      ctx.moveTo(xav1, yav1);
      for (var i = 1; i < this.points.length - 1; i++) {
        var xav2 = (this.points[i][0] + this.points[i + 1][0]) / 2;
        var yav2 = (this.points[i][1] + this.points[i + 1][1]) / 2;
        ctx.quadraticCurveTo(this.points[i][0] + this.x, this.points[i][1] + this.y, xav2 + this.x, yav2 + this.y);
      }
      ctx.quadraticCurveTo(this.points[circleSplit - 1][0] + this.x, this.points[circleSplit - 1][1] + this.y, xav1, yav1);
      ctx.closePath();
      ctx.stroke();
    };

    Ghost.prototype.transform = function() {
      for (var i = 0; i < this.points.length; i++) {
          this.points[i][0] += rand(-5, 5);
          this.points[i][1] += rand(-5, 5);
      }
    };

    Ghost.prototype.replace = function() {
      this.x = rand(0, X);
      this.y = rand(0, Y);
    };

    Ghost.prototype.undo = function() {
      this.x = X / 2;
      this.y = Y / 2;
    };

    Ghost.prototype.render = function() {
      this.transform();
      this.draw();
    };

    for (var i = 0; i < ghostNum; i++) {
      var ghost = new Ghost(ctx, X / 2, Y / 2);
      ghosts.push(ghost);
    }

    /********************
      Render
    ********************/
    
    function render(){
      //ctx.clearRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "darken";
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, X, Y);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      for (var i = 0; i < ghosts.length; i++) {
        ghosts[i].render(i);
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
      for (var i = 0; i < ghosts.length; i++) {
        ghosts[i].undo();
      }
    }

    window.addEventListener('mousemove', function() {
      if (repFlg === true) {
        for (var i = 0; i < ghosts.length; i++) {
          ghosts[i].replace();
        }
        repFlg = false;
      } else {
        for (var i = 0; i < ghosts.length; i++) {
          ghosts[i].undo();
        }
        repFlg = true;
      }
    });

    window.addEventListener('resize', function() {
      onResize();
    });

  }); 
  // Author
  console.log('File Name / ghost.js\nCreated Date / January 25, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
