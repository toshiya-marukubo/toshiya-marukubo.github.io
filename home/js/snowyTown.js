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
    
    // buildings
    var buildings = []; 
    var buildingsBack = [];
    var builNum = 18;
    var builBackNum = 18;

    // snow
    var snowNum = 50;
    var snows = [];
    
    // speed
    var builSpeed = 0.1;
    var builBackSpeed = 0.01;
    var snowSpeed = -0.01;
    var vehicleSpeed = 1;
    
    // etc 
    var selectedVehicle = 'car';
    var gameStart = false;
    
    // get DOM
    var car = document.getElementById('car');
    var bicycle = document.getElementById('bicycle');
    var snowplow = document.getElementById('snowplow');
    
    // game
    var first = document.getElementById('first');
    var second = document.getElementById('second');
    var third = document.getElementById('third');
    var forth = document.getElementById('forth');

    // game second
    var vehicles = document.getElementById('vehicles');
    var carBtn = document.getElementById('carBtn');
    var bicyBtn = document.getElementById('bicyBtn');
    var snowplowBtn = document.getElementById('snowplowBtn');
    
    // game third
    var go = document.getElementById('go');
    var back = document.getElementById('back');
    var speed = document.getElementById('speed');
    var mater = document.getElementById('mater');
    var resetBtns = document.getElementsByClassName('reset');    
    
    /*
    var mountainLeft = {
      x: 0,
      y: rand(Y / 2, Y) 
    };
    var mountainRight = {
      x: X,
      y: rand(Y / 2, Y)
    };
    var mountainTop = {
      x: X / 2,
      y: Y / 2
    };
    */

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
      Building
    ********************/
    
    function Building(ctx, x, y, bW, bH, winSize, r, g, b, winCol, backSpeed) {
      this.ctx = ctx;
      this.init(x, y, bW, bH, winSize, r, g, b, winCol, backSpeed);
    }
    
    Building.prototype.init = function(x, y, bW, bH, winSize, r, g, b, winCol, backSpeed) {
      this.ctx = ctx;
      this.x = x || 0;
      this.y = y || 0;
      this.bW = bW || 0;
      this.bH = bH || 0;
      this.winSize = winSize || 0;
      this.winOffset = winSize;
      this.color = {
        r: r,
        g: g,
        b: b
      };
      this.winCol = winCol;
      this.backSpeed = backSpeed;
    };

    Building.prototype.draw = function() {
      ctx = this.ctx;
      ctx.beginPath();
      if (this.backSpeed) {
        this.x += builBackSpeed;
      }
      ctx.fillStyle = 'rgb(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ')';
      ctx.fillRect(this.x, Y - this.bH, this.bW, this.bH);
      ctx.fillStyle = '#ffffff';
      if (this.winCol) {
        ctx.fillStyle = this.winCol;
      }
      var winCountX = this.bW / this.winSize - 1;
      var winCountY = this.bH / this.winSize - 2;
      for (var i = 1; i < winCountX; i++) {
        if (i % 2 !== 0) {
          for (var j = 1; j < winCountY; j++) {
            if (j % 2 !== 0) {
              ctx.fillRect(this.x + i * this.winSize, Y - this.bH + j * this.winSize, this.winSize, this.winSize);
            } 
          }
        } 
      }
      ctx.closePath();
    };

    Building.prototype.updatePosition = function() {
      this.x -= builSpeed;
    };

    Building.prototype.wrapPosition = function() {
      if (this.x < 0 - this.bW) {
        this.x = X;
      }
      if (this.x > X) {
        this.x = 0 - this.bW;
      }
    };

    Building.prototype.render = function() {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };
    
    Building.prototype.resize = function() {
      this.x = rand(-50, X);
    };
    
    for (var i = 0; i < builNum; i++) {
      var buil = new Building(ctx, rand(-50, X), 0, rand(50, 100), rand(Y * 0.1, Y * 0.2), rand(5, 15), rand(77, 77), rand(77, 77), rand(77, 77));
      var builBack = new Building(ctx, rand(-100, X), 0, rand(100, 150), rand(Y * 0.2, Y * 0.4), rand(5, 10), rand(38, 38), rand(38, 38), rand(38, 38), '#cccccc', true);
      buildings.push(buil);
      buildingsBack.push(builBack);
    }

    /********************
      moveCar
    ********************/
    
    function goCar(e) {
      e.preventDefault();
      if (!gameStart) {
        return;
      }
      var vehicle = document.getElementById(selectedVehicle).firstElementChild;
      var curVehicle = vehicle.getBoundingClientRect();
      vehicleSpeed += 0.1;
      speed.textContent = vehicleSpeed.toFixed(0).replace('-', '');
      builSpeed += 0.01;
      builBackSpeed += 0.001;
      snowSpeed -= 0.01;
      //mountainTop.x -= 0.01;
      if(builSpeed > 0) {
        vehicle.style.left = curVehicle.left + 1 + 'px';
        if (curVehicle.left > X - curVehicle.width) {
          finishGame();
          return;
        }
        if (curVehicle.left > X) {
          vehicle.style.left = '-' + curVehicle.width + 'px';
        }
      }
    }
    
    function backCar(e) {
      e.preventDefault();
      if (!gameStart) {
        return;
      }
      var vehicle = document.getElementById(selectedVehicle).firstElementChild;
      var curVehicle = vehicle.getBoundingClientRect();
      vehicleSpeed -= 0.1;
      speed.textContent = vehicleSpeed.toFixed(0).replace('-', '');
      builSpeed -= 0.01;
      builBackSpeed -= 0.001;
      snowSpeed += 0.01;
      //mountainTop.x += 0.01;
      if (builSpeed < 0) {
        vehicle.style.left = curVehicle.left - 1 + 'px';
        if (curVehicle.left + curVehicle.width < 0) {
          vehicle.style.left = X + 'px';
        }
      }
    }
    
    /********************
      Snow
    ********************/
    
    function Particle(ctx, x, y) {
      this.ctx = ctx;
      this.init(x, y);
    }

    Particle.prototype.init = function(x, y) {
      this.ctx = ctx;
      this.x = x - 0.1 || 0;
      this.y = y || 0;
      this.v = {
        x: snowSpeed,
        y: Math.random() * 1
      };
      this.color = {
        r: rand(200, 250),
        g: rand(200, 250),
        b: rand(200, 250),
        a: 1
      };
      this.radius = Math.random() * 30;
    };

    Particle.prototype.draw = function() {
      ctx = this.ctx;
      ctx.beginPath();
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    };

    Particle.prototype.updatePosition = function() {
      this.x += this.v.x + snowSpeed;
      this.y += this.v.y;
    };

    Particle.prototype.wrapPosition = function() {
      if (this.x < 0) this.x = X;
      if (this.x > X) this.x = 0;
      if (this.y < 0) this.y = Y;
      if (this.y > Y) this.y = 0;
    };

    Particle.prototype.gradient = function() {
      var col = this.color.r + "," + this.color.g + "," + this.color.b;
      var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      g.addColorStop(0, "rgba(" + col + ", " + (this.color.a * 1) + ")");
      g.addColorStop(0.5, "rgba(" + col + ", " + (this.color.a * 0.2) + ")");
      g.addColorStop(1, "rgba(" + col + ", " + (this.color.a * 0) + ")");
      return g;
    };

    Particle.prototype.resize = function() {
      this.x = rand(0, X);
    };

    Particle.prototype.render = function() {
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    };

    for (var i = 0; i < snowNum; i++) {
      var positionX = Math.random() * X;
      var positionY = Math.random() * Y;
      var particle = new Particle(ctx, positionX, positionY);
      snows.push(particle);
    }

    /********************
      Game
    ********************/

    start.addEventListener('click', function(e) {
      e.preventDefault();
      first.style.visibility = 'hidden';
      second.style.visibility = 'visible';
      carBtn.firstElementChild.focus();
    }, false);

    carBtn.addEventListener('click', function(e) {
      e.preventDefault();
      selectedVehicle = 'car';
      car.style.display = 'block';
      bicycle.style.display = 'none';
      snowplow.style.display = 'none';
      thirdDisp();
    }, false);

    bicyBtn.addEventListener('click', function(e) {
      e.preventDefault();
      selectedVehicle = 'bicycle';
      car.style.display = 'none';
      bicycle.style.display = 'block';
      snowplow.style.display = 'none';
      thirdDisp();
    }, false);

    snowplowBtn.addEventListener('click', function(e) {
      e.preventDefault();
      selectedVehicle = 'snowplow';
      car.style.display = 'none';
      bicycle.style.display = 'none';
      snowplow.style.display = 'block';
      thirdDisp();
    }, false);

    function thirdDisp() {
      second.style.visibility = 'hidden';
      third.style.visibility = 'visible';
      gameStart = true;
      go.firstElementChild.focus();
    }

    function finishGame() {
      third.style.visibility = 'hidden';
      forth.style.visibility = 'visible';
      gameStart = false;
    }

    function reset(e) {
      e.preventDefault();
      var vehicle = document.getElementById(selectedVehicle).firstElementChild;
      vehicle.style.left = '1.6' + 'rem';
      builSpeed = 0.1;
      builBackSpeed = 0.01;
      snowSpeed = -0.01;
      selectedVehicle = 'car';
      vehicleSpeed = 1;
      speed.textContent = 1;
      gameStart = false;
      forth.style.visibility = 'hidden';
      third.style.visibility = 'hidden';
      first.style.visibility = 'visible';
      start.firstElementChild.focus();
    }
    
    /********************
      Muuntain
    ********************/
    
    /*
    function mountain() {
      ctx.beginPath();
      ctx.fillStyle = "#000";
      ctx.moveTo(mountainLeft.x - 0.01, mountainLeft.y);
      ctx.lineTo(mountainLeft.x - 0.01, Y);
      ctx.lineTo(mountainRight.x, Y);
      ctx.lineTo(mountainRight.x, mountainRight.y);
      ctx.quadraticCurveTo(mountainTop.x, mountainTop.y, mountainLeft.x, mountainLeft.y);
      ctx.fill();
    }
    */

    // render
    function render() {
      ctx.clearRect(0, 0, X, Y);
      //mountain();
      for (var i = 0; i < buildingsBack.length; i++) {
        buildingsBack[i].render();
      }
      for (var i = 0; i < buildings.length; i++) {
        buildings[i].render();
      }
      for (var i = 0; i < snows.length; i++) {
        snows[i].render();
      }
      requestAnimationFrame(render);
    }
    
    render();

    // resize
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
      for (var i = 0; i < buildings.length; i++) {
        buildings[i].resize();
      }
      for (var i = 0; i < buildingsBack.length; i++) {
        buildingsBack[i].resize();
      }
      for (var i = 0; i < snows.length; i++) {
        snows[i].resize();
      }
    }

    /********************
      Event
    ********************/
    
    window.addEventListener('keydown', function(e) {
      if (e.keyCode === 39) {
        goCar(e);
      }
      if (e.keyCode === 37) {
        backCar(e);
      }
      return;
    });

    go.addEventListener('mouseover', function(e) {
      goCar(e);
    });

    go.addEventListener('click', function(e) {
      goCar(e);
    }, false);
    
    back.addEventListener('mouseover', function(e) {
      backCar(e);
    });
    
    back.addEventListener('click', function(e) {
      backCar(e);
    }, false);
     
    for (var i = 0; i < resetBtns.length; i++) {
      resetBtns[i].addEventListener('click', function(e) {
        reset(e);
      }, false);
    }
    
    window.addEventListener('resize', function() {
      onResize();
    });
  
  });
  // Author
  console.log('File Name / snowyTown.js\nCreated Date / 2019.12.10\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
