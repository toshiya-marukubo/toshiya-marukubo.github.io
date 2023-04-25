(()=>{"use strict";function t(i){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(i)}function i(i,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(i,(r=a.key,s=void 0,s=function(i,e){if("object"!==t(i)||null===i)return i;var n=i[Symbol.toPrimitive];if(void 0!==n){var a=n.call(i,e||"default");if("object"!==t(a))return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(i)}(r,"string"),"symbol"===t(s)?s:String(s)),a)}var r,s}var e=function(){function t(){!function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,t),this.setupEvents(),this.initialize()}var e,n,a;return e=t,(n=[{key:"initialize",value:function(){var t=.01*window.innerHeight;document.documentElement.style.setProperty("--vh","".concat(t,"px"))}},{key:"setupEvents",value:function(){window.addEventListener("resize",this.onResize.bind(this),!1)}},{key:"onResize",value:function(){this.initialize()}}])&&i(e.prototype,n),a&&i(e,a),Object.defineProperty(e,"prototype",{writable:!1}),t}();function n(t){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(t)}function a(t,i){for(var e=0;e<i.length;e++){var a=i[e];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,(r=a.key,s=void 0,s=function(t,i){if("object"!==n(t)||null===t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var a=e.call(t,i||"default");if("object"!==n(a))return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===i?String:Number)(t)}(r,"string"),"symbol"===n(s)?s:String(s)),a)}var r,s}var r=function(){function t(i){!function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,t),this.load=document.getElementsByClassName("loading")[0],this.line=document.getElementsByClassName("loading-line")[0],this.counter=document.getElementsByClassName("loading-counter")[0],this.data=i,this.loadedNumber=1,this.percentage=0,this.num=0}var i,e,n;return i=t,(e=[{key:"initialize",value:function(){var t=this;return new Promise((function(i,e){t.delay(1200).then((function(){t.loadImages(i,e)}))}))}},{key:"loadImages",value:function(t,i){for(var e=this,n=0;n<this.data.length;n++){var a=this.data[n].imagePath,r=new Image;r.src=a,r.addEventListener("load",(function(){e.percentage=e.getPercentage(e.loadedNumber++)}))}this.drawPercentage(t,i)}},{key:"getPercentage",value:function(t){return Math.floor(t/this.data.length*100)}},{key:"drawPercentage",value:function(t,i){this.num<this.percentage&&(this.num+=2),this.line.style.width=this.num+"%",this.counter.textContent=this.num,100!==this.num?this.animationID=requestAnimationFrame(this.drawPercentage.bind(this,t,i)):this.cancelDrawLoopCounterNumber(t,i)}},{key:"cancelDrawLoopCounterNumber",value:function(t,i){cancelAnimationFrame(this.animationID),this.addClass(t,i)}},{key:"addClass",value:function(t,i){var e=this;this.delay(400).then((function(){e.load.classList.add("loading-loaded"),e.line.classList.add("loading-loaded"),e.counter.classList.add("loading-loaded"),e.delay(400).then((function(){t(e.data)}))}))}},{key:"delay",value:function(t){return new Promise((function(i,e){setTimeout((function(){i()}),t)}))}}])&&a(i.prototype,e),n&&a(i,n),Object.defineProperty(i,"prototype",{writable:!1}),t}();function s(t){return s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},s(t)}function o(t,i){for(var e=0;e<i.length;e++){var n=i[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,(a=n.key,r=void 0,r=function(t,i){if("object"!==s(t)||null===t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var n=e.call(t,i||"default");if("object"!==s(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===i?String:Number)(t)}(a,"string"),"symbol"===s(r)?r:String(r)),n)}var a,r}var l=function(){function t(){!function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,t),this.setupCanvas(),this.setupEvents(),this.initialize()}var i,e,n;return i=t,(e=[{key:"setupCanvas",value:function(){this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),this.canvas.ariaLabel="The sierpinski triangles are scaling  and rotating.",this.canvas.role="img",this.canvas.style.position="fixed",this.canvas.style.top="0",this.canvas.style.left="0",this.canvas.style.width="100%",this.canvas.style.minHeight="100vh",this.canvas.style.minHeight="calc(var(--vh, 1vh) * 100)",this.canvas.style.display="block",this.canvas.style.background="#000000",this.canvas.style.zIndex="-1",document.body.appendChild(this.canvas)}},{key:"setupEvents",value:function(){window.addEventListener("resize",this.onResize.bind(this),!1)}},{key:"onResize",value:function(){if(this.preWidth===window.innerWidth)return this.height=this.canvas.height=window.innerHeight,void(this.halfHeight=this.height/2);this.initialize()}},{key:"initialize",value:function(){this.animationId&&cancelAnimationFrame(this.animationId),this.width=this.preWidth=this.canvas.width=window.innerWidth,this.height=this.canvas.height=window.innerHeight,this.size=Math.min(.5*this.width,.5*this.height);for(var t=[],i=0;i<3;i++){var e={x:Math.cos(i/3*Math.PI*2)*this.size,y:Math.sin(i/3*Math.PI*2)*this.size};t.push(e)}this.p0=t[0],this.p1=t[1],this.p2=t[2],this.render()}},{key:"drawTriangle",value:function(t,i,e){this.ctx.beginPath(),this.ctx.moveTo(t.x,t.y),this.ctx.lineTo(i.x,i.y),this.ctx.lineTo(e.x,e.y),this.ctx.closePath(),this.ctx.fill()}},{key:"sierpinski",value:function(t,i,e,n,a){var r=Math.cos(a-n/Math.PI*2)*n*.1+.5,s=Math.sin(a-n/Math.PI*2)*n*.1+.5;if(n>0){var o={x:(i.x+t.x)*r,y:(i.y+t.y)*s},l={x:(e.x+i.x)*r,y:(e.y+i.y)*s},h={x:(t.x+e.x)*r,y:(t.y+e.y)*s};this.sierpinski(t,o,h,n-1,a),this.sierpinski(o,i,l,n-1,a),this.sierpinski(h,l,e,n-1,a)}else this.drawTriangle(t,i,e)}},{key:"render",value:function(t){t*=.001,this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 0.1)",this.ctx.fillRect(0,0,this.width,this.height),this.ctx.translate(this.width/2-this.p0.x,this.height/2),this.ctx.globalCompositeOperation="lighter";for(var i=0;i<3;i++){0===i&&(this.ctx.fillStyle="#FF0000"),1===i&&(this.ctx.fillStyle="#00FF00"),2===i&&(this.ctx.fillStyle="#0000FF");for(var e=0;e<6;e++)this.ctx.translate(this.p0.x,this.p0.y),this.ctx.rotate(2*Math.PI/6),this.ctx.translate(-this.p0.x,-this.p0.y),this.sierpinski(this.p0,this.p1,this.p2,4,t-i/3*.1)}this.ctx.restore(),this.animationId=requestAnimationFrame(this.render.bind(this))}}])&&o(i.prototype,e),n&&o(i,n),Object.defineProperty(i,"prototype",{writable:!1}),t}();window.addEventListener("load",(function(){new e,new r([{imagePath:"../../dist/assets/images/dammy.png"}]).initialize().then((function(){new l}))}))})();