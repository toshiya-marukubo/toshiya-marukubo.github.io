(()=>{"use strict";function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(e,i){for(var n=0;n<i.length;n++){var a=i[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,(r=a.key,o=void 0,o=function(e,i){if("object"!==t(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,i||"default");if("object"!==t(a))return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===i?String:Number)(e)}(r,"string"),"symbol"===t(o)?o:String(o)),a)}var r,o}var i=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.setupEvents(),this.initialize()}var i,n,a;return i=t,(n=[{key:"initialize",value:function(){var t=.01*window.innerHeight;document.documentElement.style.setProperty("--vh","".concat(t,"px"))}},{key:"setupEvents",value:function(){window.addEventListener("resize",this.onResize.bind(this),!1)}},{key:"onResize",value:function(){this.initialize()}}])&&e(i.prototype,n),a&&e(i,a),Object.defineProperty(i,"prototype",{writable:!1}),t}();function n(t){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(t)}function a(t,e){for(var i=0;i<e.length;i++){var a=e[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,(r=a.key,o=void 0,o=function(t,e){if("object"!==n(t)||null===t)return t;var i=t[Symbol.toPrimitive];if(void 0!==i){var a=i.call(t,e||"default");if("object"!==n(a))return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(r,"string"),"symbol"===n(o)?o:String(o)),a)}var r,o}var r=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.load=document.getElementsByClassName("loading")[0],this.line=document.getElementsByClassName("loading-line")[0],this.counter=document.getElementsByClassName("loading-counter")[0],this.data=e,this.loadedNumber=1,this.percentage=0,this.num=0}var e,i,n;return e=t,(i=[{key:"initialize",value:function(){var t=this;return new Promise((function(e,i){t.delay(1200).then((function(){t.loadImages(e,i)}))}))}},{key:"loadImages",value:function(t,e){for(var i=this,n=0;n<this.data.length;n++){var a=this.data[n].imagePath,r=new Image;r.src=a,r.addEventListener("load",(function(){i.percentage=i.getPercentage(i.loadedNumber++)}))}this.drawPercentage(t,e)}},{key:"getPercentage",value:function(t){return Math.floor(t/this.data.length*100)}},{key:"drawPercentage",value:function(t,e){this.num<this.percentage&&(this.num+=2),this.line.style.width=this.num+"%",this.counter.textContent=this.num,100!==this.num?this.animationID=requestAnimationFrame(this.drawPercentage.bind(this,t,e)):this.cancelDrawLoopCounterNumber(t,e)}},{key:"cancelDrawLoopCounterNumber",value:function(t,e){cancelAnimationFrame(this.animationID),this.addClass(t,e)}},{key:"addClass",value:function(t,e){var i=this;this.delay(400).then((function(){i.load.classList.add("loading-loaded"),i.line.classList.add("loading-loaded"),i.counter.classList.add("loading-loaded"),i.delay(400).then((function(){t(i.data)}))}))}},{key:"delay",value:function(t){return new Promise((function(e,i){setTimeout((function(){e()}),t)}))}}])&&a(e.prototype,i),n&&a(e,n),Object.defineProperty(e,"prototype",{writable:!1}),t}();function o(t){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o(t)}function s(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,(a=n.key,r=void 0,r=function(t,e){if("object"!==o(t)||null===t)return t;var i=t[Symbol.toPrimitive];if(void 0!==i){var n=i.call(t,e||"default");if("object"!==o(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(a,"string"),"symbol"===o(r)?r:String(r)),n)}var a,r}var h=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.setupCanvas(),this.setupEvents(),this.initialize()}var e,i,n;return e=t,(i=[{key:"setupCanvas",value:function(){this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),this.canvas.ariaLabel="The circles lined up on golden ratio are scaling and rotating.",this.canvas.role="img",this.canvas.style.position="fixed",this.canvas.style.top="0",this.canvas.style.left="0",this.canvas.style.width="100%",this.canvas.style.minHeight="100vh",this.canvas.style.minHeight="calc(var(--vh, 1vh) * 100)",this.canvas.style.display="block",this.canvas.style.background="#000000",this.canvas.style.zIndex="-1",document.body.appendChild(this.canvas)}},{key:"setupEvents",value:function(){window.addEventListener("resize",this.onResize.bind(this),!1)}},{key:"onResize",value:function(){if(this.preWidth===window.innerWidth)return this.height=this.canvas.height=window.innerHeight,void(this.halfHeight=this.height/2);this.initialize()}},{key:"initialize",value:function(){this.animationId&&cancelAnimationFrame(this.animationId),this.width=this.preWidth=this.canvas.width=window.innerWidth,this.height=this.canvas.height=window.innerHeight;var t=["rgb(220, 14, 123)","rgb(244, 233, 91)","rgb(0, 176, 177)"],e=Math.floor(Math.max(this.width,this.height)),i=e/5,n=e;this.shapes=[];for(var a=0;a<e;a++){var r={};r.r=137.5*Math.PI/180*a,r.x=Math.cos(r.r)*n,r.y=Math.sin(r.r)*n,r.s=i,r.d=Math.sqrt(r.x*r.x+r.y*r.y),r.a=Math.atan2(r.y,r.x),r.c=t[this.getRandomNumber(0,t.length-1)],this.shapes.push(r),i*=.974,n*=.974}this.render()}},{key:"getRandomNumber",value:function(t,e){return Math.floor(Math.random()*(e-t+1)+t)}},{key:"render",value:function(t){t*=.001,this.ctx.save(),this.ctx.clearRect(0,0,this.width,this.height),this.ctx.translate(this.width/2,this.height/2),this.ctx.rotate(.2*t),this.ctx.globalCompositeOperation="xor";for(var e=0;e<this.shapes.length;e++){var i=Math.sin(Math.sin(2*this.shapes[e].a)+.001*this.shapes[e].d-t)+1;this.ctx.globalAlpha=Math.min(1,i),this.ctx.fillStyle=this.shapes[e].c,this.ctx.beginPath(),this.ctx.arc(this.shapes[e].x,this.shapes[e].y,this.shapes[e].s*i,0,2*Math.PI,!1),this.ctx.fill()}this.ctx.restore(),this.animationId=requestAnimationFrame(this.render.bind(this))}}])&&s(e.prototype,i),n&&s(e,n),Object.defineProperty(e,"prototype",{writable:!1}),t}();window.addEventListener("load",(function(){new i,new r([{imagePath:"../../dist/assets/images/dammy.png"}]).initialize().then((function(){new h}))}))})();