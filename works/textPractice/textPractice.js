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
    var main = document.getElementById('main');
    var bgColor = document.getElementById('bgColor');
    var textColor = document.getElementById('textColor');
    var changeText = document.getElementById('changeText');
    var text = 'Toshiya Marukubo ';
    var fontType = 'sans-serif';
    var fontSize = '16px';
    var fontColor = 'rgb(0, 0, 0)';
    var textArea;
    var flg = false;
   
    for (var i = 0; i < 10; i++) {
      var str = String.fromCharCode(rand(0, 100000000));
      console.log(str);
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
    
    function drawText(mouseX, mouseY) {
      ctx.save();
      ctx.fillStyle = fontColor;
      ctx.font = fontSize + ' ' + fontType;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, mouseX, mouseY);
      ctx.restore();
    };

    function drawTextOnCircle(string, startAngle, endAngle, radius) {
      var radius = radius;
      var angleDec = (startAngle - endAngle) / (string.length);
      var angle = parseFloat(startAngle);
      var character;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.strokeStyle = 'rgb(50, 50, 50)';
      ctx.font = fontSize + ' ' + 'px sans-selif';
      for (var i = 0; i < string.length; i++) {
        character = string.charAt(i);
        ctx.save();
        ctx.beginPath();
        ctx.translate(mouseX + Math.cos(angle) * radius, mouseY - Math.sin(angle) * radius);
        ctx.rotate(Math.PI / 2 - angle);
        ctx.fillText(character, 0, 0);
        ctx.strokeText(character, 0, 0);
        angle -= angleDec;
        ctx.restore();
      }
      ctx.restore();
    }

    /********************
      Render
    ********************/
   
    var start = Math.PI * 2;
    var end = 0;
    var radius = 100;
    function render() {
      if (flg === false) {
        ctx.clearRect(0, 0, X, Y);
      }
      //drawText(X / 2, mouseY);
      drawTextOnCircle(text, start, end, radius);
      start -= 0.02;
      end -= 0.02;
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
    
    window.addEventListener('click', function(){
      if (!document.getElementsByTagName('textarea').length) {
        text = '';
        textArea = document.createElement('textarea');
        textArea.setAttribute('placeholder', 'Please input text and push enter key.');
        main.appendChild(textArea).focus();
        document.getElementsByTagName('textarea')[0].style.fontSize = fontSize;
      }
    }, false);
   
    window.addEventListener('keyup', function(e){
      var textArea = document.getElementsByTagName('textarea')[0];
      if (e.keyCode === 13) {
        text = textArea.value.slice(0, -1);
        document.getElementById('main').removeChild(textArea);
      }
    });

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      fontSize = mouseX / 8 + 16 + 'px';
      radius = mouseX / 5 + 100;
      if (document.getElementsByTagName('textarea').length) {
        document.getElementsByTagName('textarea')[0].style.fontSize = fontSize;
      }
    });

  });
  // Author
  console.log('File Name / simulationVer1.js\nCreated Date / April 22, 2020\nAuthor / Toshiya Marukubo\nTwitter / https://twitter.com/toshiyamarukubo');
})();
