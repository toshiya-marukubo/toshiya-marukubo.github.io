!function(){"use strict";function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var t=function(){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),this.targetElement=document.getElementsByClassName("main-container")[0],this.count=0,this.index=0,this.flg=!1,this.number=18,this.initialize(e)}var n,r,a;return n=t,(r=[{key:"initialize",value:function(e){var t=this;this.setUpEvent(),this.getData(e).then((function(e){t.data=e,t.addItems()}))}},{key:"getData",value:function(e){return new Promise((function(t,n){var r=new XMLHttpRequest;r.addEventListener("load",(function(){var e=JSON.parse(r.responseText);t(e)})),r.open("GET",e,!0),r.send(null)}))}},{key:"sortNumberToLarge",value:function(e,t){return Number(e.number)-Number(t.number)}},{key:"sortLovesToSmall",value:function(e,t){return Number(t.loves)-Number(e.loves)}},{key:"sortViewsToSmall",value:function(e,t){return Number(t.views)-Number(e.views)}},{key:"sortJson",value:function(e,t,n){var r=this;return new Promise((function(e,a){"number"===t&&"large"===n&&r.data.sort(r.sortNumberToLarge),"loves"===t&&"small"===n&&r.data.sort(r.sortLovesToSmall),"views"===t&&"small"===n&&r.data.sort(r.sortViewsToSmall),e()}))}},{key:"createElement",value:function(e,t){var n=document.createElement(e);return null!==t&&(n.textContent=t),n}},{key:"addItem",value:function(e){var t=this;return new Promise((function(n,r){if(e){var a={},s=t.createElement("div",null);s.setAttribute("class","work"),s.style.backgroundImage="url("+e.image+")";var i=t.createElement("a",null);i.setAttribute("href",e.link),i.setAttribute("target","_blank"),i.setAttribute("rel","noreferrer");var o=t.createElement("div",null);o.setAttribute("class","infos");var l=t.createElement("ul",null),u=t.createElement("li","❤️  "+e.loves),d=t.createElement("li","👀 "+e.views),c=t.createElement("p","Jump to CodePen");l.appendChild(u),l.appendChild(d),o.appendChild(c),o.appendChild(l),s.appendChild(i),i.appendChild(o),t.targetElement.appendChild(s),a.src=e.image,a.work=s,n(a)}}))}},{key:"loadImage",value:function(e){return new Promise((function(t,n){var r=new Image;r.src=e.src,r.addEventListener("load",(function(){e.work.classList.add("show")})),t(e)}))}},{key:"deleteItems",value:function(){var e=this;return new Promise((function(t,n){window.scroll({top:0}),e.targetElement.innerHTML="",t()}))}},{key:"addItems",value:function(){var e=this;if(this.count>=this.number)return this.count=0,void(this.flg=!1);this.addItem(this.data[this.index]).then((function(t){return e.index++,e.count++,e.loadImage(t)})).then((function(t){e.addItems()}))}},{key:"drawCounter",value:function(e){var t=this.targetElement.children.length,n=Math.ceil(t/this.data.length*100);this.counterElement.textContent=n+" %"}},{key:"onScroll",value:function(e){var t=document.body.scrollHeight,n=(window.pageYOffset,window.innerHeight+window.pageYOffset);this.flg||.8*t<=n&&(this.flg=!0,this.addItems())}},{key:"setUpEvent",value:function(){var e=this;window.addEventListener("scroll",this.onScroll.bind(this),!1),e.buttons=document.getElementsByClassName("sortButton");for(var t=function(t){e.buttons[t].addEventListener("click",(function(n){n.preventDefault();for(var r=0;r<e.buttons.length;r++)e.buttons[r].firstElementChild.classList.remove("active");switch(e.buttons[t].firstElementChild.classList.add("active"),e.index=0,e.flg=!1,e.buttons[t].id){case"reset":e.deleteItems().then((function(){return e.sortJson(e.data,"number","large")})).then((function(){return e.addItems()}));break;case"sortLovesToSmallBtn":e.deleteItems().then((function(){return e.sortJson(e.data,"loves","small")})).then((function(){return e.addItems()}));break;case"sortViewsToSmallBtn":e.deleteItems().then((function(){return e.sortJson(e.data,"views","small")})).then((function(){return e.addItems()}))}}))},n=0;n<e.buttons.length;n++)t(n)}}])&&e(n.prototype,r),a&&e(n,a),Object.defineProperty(n,"prototype",{writable:!1}),t}();window.addEventListener("DOMContentLoaded",(function(){document.getElementsByClassName("loading")[0].classList.add("loaded"),new t("./dist/assets/json/codepen.json")}))}();