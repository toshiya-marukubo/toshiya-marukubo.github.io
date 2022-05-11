(()=>{"use strict";function t(t,e){for(var n=0;n<e.length;n++){var s=e[n];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}var e=function(){function e(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),this.targetElements=document.getElementsByClassName("call"),this.iframe=document.getElementsByTagName("iframe")[0],this.closeButton=document.getElementsByClassName("closeButton")[0],this.preFocus=null,this.initialize()}var n,s,i;return n=e,(s=[{key:"initialize",value:function(){this.setupEvents()}},{key:"setupEvents",value:function(){for(var t=this,e=function(e){var n=t.targetElements[e];n.addEventListener("click",t.add,!1),n.addEventListener("click",(function(e){e.preventDefault(),t.preFocus=n}),!1)},n=0;n<this.targetElements.length;n++)e(n);this.closeButton.addEventListener("click",this.remove.bind(this),!1)}},{key:"add",value:function(t){t.preventDefault();var e=this.getAttribute("href"),n=document.getElementsByTagName("iframe")[0],s=document.getElementsByClassName("closeButton")[0];n.setAttribute("src",e),n.classList.add("show"),s.classList.add("show"),s.firstChild.focus()}},{key:"remove",value:function(t){t.preventDefault(),this.iframe.setAttribute("src",""),this.iframe.classList.remove("show"),this.closeButton.classList.remove("show"),this.preFocus.focus()}}])&&t(n.prototype,s),i&&t(n,i),Object.defineProperty(n,"prototype",{writable:!1}),e}();const n=.5*(Math.sqrt(3)-1),s=(3-Math.sqrt(3))/6,i=1/6,a=(Math.sqrt(5)-1)/4,o=(5-Math.sqrt(5))/20,r=new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]),l=new Float32Array([0,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,1,0,1,1,1,0,1,-1,1,0,-1,1,1,0,-1,-1,-1,0,1,1,-1,0,1,-1,-1,0,-1,1,-1,0,-1,-1,1,1,0,1,1,1,0,-1,1,-1,0,1,1,-1,0,-1,-1,1,0,1,-1,1,0,-1,-1,-1,0,1,-1,-1,0,-1,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,0]);const c=class{constructor(t=Math.random){const e="function"==typeof t?t:function(t){let e=0,n=0,s=0,i=1;const a=function(){let t=4022871197;return function(e){e=e.toString();for(let n=0;n<e.length;n++){t+=e.charCodeAt(n);let s=.02519603282416938*t;t=s>>>0,s-=t,s*=t,t=s>>>0,s-=t,t+=4294967296*s}return 2.3283064365386963e-10*(t>>>0)}}();e=a(" "),n=a(" "),s=a(" "),e-=a(t),e<0&&(e+=1);n-=a(t),n<0&&(n+=1);s-=a(t),s<0&&(s+=1);return function(){const t=2091639*e+2.3283064365386963e-10*i;return e=n,n=s,s=t-(i=0|t)}}(t);this.p=function(t){const e=new Uint8Array(256);for(let t=0;t<256;t++)e[t]=t;for(let n=0;n<255;n++){const s=n+~~(t()*(256-n)),i=e[n];e[n]=e[s],e[s]=i}return e}(e),this.perm=new Uint8Array(512),this.permMod12=new Uint8Array(512);for(let t=0;t<512;t++)this.perm[t]=this.p[255&t],this.permMod12[t]=this.perm[t]%12}noise2D(t,e){const i=this.permMod12,a=this.perm;let o=0,l=0,c=0;const h=(t+e)*n,u=Math.floor(t+h),f=Math.floor(e+h),d=(u+f)*s,m=t-(u-d),v=e-(f-d);let p,y;m>v?(p=1,y=0):(p=0,y=1);const w=m-p+s,g=v-y+s,E=m-1+2*s,M=v-1+2*s,b=255&u,k=255&f;let B=.5-m*m-v*v;if(B>=0){const t=3*i[b+a[k]];B*=B,o=B*B*(r[t]*m+r[t+1]*v)}let C=.5-w*w-g*g;if(C>=0){const t=3*i[b+p+a[k+y]];C*=C,l=C*C*(r[t]*w+r[t+1]*g)}let D=.5-E*E-M*M;if(D>=0){const t=3*i[b+1+a[k+1]];D*=D,c=D*D*(r[t]*E+r[t+1]*M)}return 70*(o+l+c)}noise3D(t,e,n){const s=this.permMod12,a=this.perm;let o,l,c,h;const u=.3333333333333333*(t+e+n),f=Math.floor(t+u),d=Math.floor(e+u),m=Math.floor(n+u),v=(f+d+m)*i,p=t-(f-v),y=e-(d-v),w=n-(m-v);let g,E,M,b,k,B;p>=y?y>=w?(g=1,E=0,M=0,b=1,k=1,B=0):p>=w?(g=1,E=0,M=0,b=1,k=0,B=1):(g=0,E=0,M=1,b=1,k=0,B=1):y<w?(g=0,E=0,M=1,b=0,k=1,B=1):p<w?(g=0,E=1,M=0,b=0,k=1,B=1):(g=0,E=1,M=0,b=1,k=1,B=0);const C=p-g+i,D=y-E+i,A=w-M+i,L=p-b+2*i,z=y-k+2*i,F=w-B+2*i,x=p-1+.5,N=y-1+.5,I=w-1+.5,T=255&f,j=255&d,q=255&m;let O=.6-p*p-y*y-w*w;if(O<0)o=0;else{const t=3*s[T+a[j+a[q]]];O*=O,o=O*O*(r[t]*p+r[t+1]*y+r[t+2]*w)}let P=.6-C*C-D*D-A*A;if(P<0)l=0;else{const t=3*s[T+g+a[j+E+a[q+M]]];P*=P,l=P*P*(r[t]*C+r[t+1]*D+r[t+2]*A)}let U=.6-L*L-z*z-F*F;if(U<0)c=0;else{const t=3*s[T+b+a[j+k+a[q+B]]];U*=U,c=U*U*(r[t]*L+r[t+1]*z+r[t+2]*F)}let R=.6-x*x-N*N-I*I;if(R<0)h=0;else{const t=3*s[T+1+a[j+1+a[q+1]]];R*=R,h=R*R*(r[t]*x+r[t+1]*N+r[t+2]*I)}return 32*(o+l+c+h)}noise4D(t,e,n,s){const i=this.perm;let r,c,h,u,f;const d=(t+e+n+s)*a,m=Math.floor(t+d),v=Math.floor(e+d),p=Math.floor(n+d),y=Math.floor(s+d),w=(m+v+p+y)*o,g=t-(m-w),E=e-(v-w),M=n-(p-w),b=s-(y-w);let k=0,B=0,C=0,D=0;g>E?k++:B++,g>M?k++:C++,g>b?k++:D++,E>M?B++:C++,E>b?B++:D++,M>b?C++:D++;const A=k>=3?1:0,L=B>=3?1:0,z=C>=3?1:0,F=D>=3?1:0,x=k>=2?1:0,N=B>=2?1:0,I=C>=2?1:0,T=D>=2?1:0,j=k>=1?1:0,q=B>=1?1:0,O=C>=1?1:0,P=D>=1?1:0,U=g-A+o,R=E-L+o,H=M-z+o,S=b-F+o,W=g-x+2*o,G=E-N+2*o,J=M-I+2*o,K=b-T+2*o,Q=g-j+3*o,V=E-q+3*o,X=M-O+3*o,Y=b-P+3*o,Z=g-1+4*o,$=E-1+4*o,_=M-1+4*o,tt=b-1+4*o,et=255&m,nt=255&v,st=255&p,it=255&y;let at=.6-g*g-E*E-M*M-b*b;if(at<0)r=0;else{const t=i[et+i[nt+i[st+i[it]]]]%32*4;at*=at,r=at*at*(l[t]*g+l[t+1]*E+l[t+2]*M+l[t+3]*b)}let ot=.6-U*U-R*R-H*H-S*S;if(ot<0)c=0;else{const t=i[et+A+i[nt+L+i[st+z+i[it+F]]]]%32*4;ot*=ot,c=ot*ot*(l[t]*U+l[t+1]*R+l[t+2]*H+l[t+3]*S)}let rt=.6-W*W-G*G-J*J-K*K;if(rt<0)h=0;else{const t=i[et+x+i[nt+N+i[st+I+i[it+T]]]]%32*4;rt*=rt,h=rt*rt*(l[t]*W+l[t+1]*G+l[t+2]*J+l[t+3]*K)}let lt=.6-Q*Q-V*V-X*X-Y*Y;if(lt<0)u=0;else{const t=i[et+j+i[nt+q+i[st+O+i[it+P]]]]%32*4;lt*=lt,u=lt*lt*(l[t]*Q+l[t+1]*V+l[t+2]*X+l[t+3]*Y)}let ct=.6-Z*Z-$*$-_*_-tt*tt;if(ct<0)f=0;else{const t=i[et+1+i[nt+1+i[st+1+i[it+1]]]]%32*4;ct*=ct,f=ct*ct*(l[t]*Z+l[t+1]*$+l[t+2]*_+l[t+3]*tt)}return 27*(r+c+h+u+f)}};function h(t,e){for(var n=0;n<e.length;n++){var s=e[n];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}var u=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.setupCanvas(),this.setupEvents(),this.initialize()}var e,n,s;return e=t,(n=[{key:"setupCanvas",value:function(){document.body.appendChild(document.createElement("canvas")),this.canvas=document.getElementsByTagName("canvas")[0],this.canvas.style.position="fixed",this.canvas.style.top="0",this.canvas.style.left="0",this.canvas.style.width="100%",this.canvas.style.height="100%",this.canvas.style.background="#FFF",this.canvas.style.zIndex="-1",this.ctx=this.canvas.getContext("2d")}},{key:"setupEvents",value:function(){window.addEventListener("resize",this.onResize.bind(this))}},{key:"onResize",value:function(){this.initialize()}},{key:"initialize",value:function(){this.id&&cancelAnimationFrame(this.id),this.simplex=new c,this.width=this.canvas.width=Math.floor(window.innerWidth),this.height=this.canvas.height=Math.floor(window.innerHeight),this.d=this.ctx.createImageData(this.width,this.height),this.render(0)}},{key:"updateImageData",value:function(t){for(var e=.01*Math.random(),n=0;n<this.height;n++)for(var s=0;s<this.width;s++){var i=this.simplex.noise3D(s*e,n*e,.001*t),a=n*this.width+s,o=s/this.width*384;this.d.data[4*a+0]=o,this.d.data[4*a+1]=o,this.d.data[4*a+2]=o,this.d.data[4*a+3]=(255+128*Math.random())*i}}},{key:"render",value:function(t){this.updateImageData(t),this.ctx.putImageData(this.d,0,0)}}])&&h(e.prototype,n),s&&h(e,s),Object.defineProperty(e,"prototype",{writable:!1}),t}();window.addEventListener("load",(function(){document.getElementsByClassName("loading")[0].classList.add("loaded"),new e,new u}))})();