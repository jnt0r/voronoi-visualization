(()=>{"use strict";const t=function(){function t(t,n){this.x=t,this.y=n}return t.prototype.isEqualTo=function(t){return this.x===t.x&&this.y===t.y},t.prototype.distanceTo=function(t){return Math.sqrt(Math.pow(this.x-t.x,2)+Math.pow(this.y-t.y,2))},t.prototype.angleTo=function(t){var n=this.x-t.x,o=this.y-t.y,i=Math.atan2(o,n);return i<0?i+2*Math.PI:i},t}();var n=function(){function t(t,n){this.from=t,this.to=n}return t.prototype.isEqualTo=function(t){return this.from.isEqualTo(t.from)&&this.to.isEqualTo(t.to)||this.from.isEqualTo(t.to)&&this.to.isEqualTo(t.from)},t}();const o=n,i=function(){function n(t,n,o){this.a=t,this.b=n,this.c=o}return n.prototype.isEqualTo=function(t){return(this.a.isEqualTo(t.a)||this.a.isEqualTo(t.b)||this.a.isEqualTo(t.c))&&(this.b.isEqualTo(t.a)||this.b.isEqualTo(t.b)||this.b.isEqualTo(t.c))&&(this.c.isEqualTo(t.a)||this.c.isEqualTo(t.b)||this.c.isEqualTo(t.c))},n.prototype.isPointInsideCircumcircle=function(t){var n=this.getCircumCenter();return Math.sqrt(Math.pow(Math.abs(t.x-n.x),2)+Math.pow(Math.abs(t.y-n.y),2))<=Math.sqrt(Math.pow(Math.abs(this.a.x-n.x),2)+Math.pow(Math.abs(this.a.y-n.y),2))},n.prototype.getCircumCenter=function(){var n=this.a.x,o=this.b.x,i=this.c.x,e=this.a.y,r=this.b.y,a=this.c.y,s=2*(n*(r-a)+o*(a-e)+i*(e-r)),h=1/s*((Math.pow(n,2)+Math.pow(e,2))*(r-a)+(Math.pow(o,2)+Math.pow(r,2))*(a-e)+(Math.pow(i,2)+Math.pow(a,2))*(e-r)),u=1/s*((Math.pow(n,2)+Math.pow(e,2))*(i-o)+(Math.pow(o,2)+Math.pow(r,2))*(n-i)+(Math.pow(i,2)+Math.pow(a,2))*(o-n));return new t(h,u)},n.prototype.getEdges=function(){var t=[];return t[0]=new o(this.a,this.b),t[1]=new o(this.b,this.c),t[2]=new o(this.c,this.a),t},n.prototype.sharesSamePointWith=function(t){return this.a.isEqualTo(t.a)||this.a.isEqualTo(t.b)||this.a.isEqualTo(t.c)||this.b.isEqualTo(t.a)||this.b.isEqualTo(t.b)||this.b.isEqualTo(t.c)||this.c.isEqualTo(t.a)||this.c.isEqualTo(t.b)||this.c.isEqualTo(t.c)},n}();var e=document.getElementById("canvas"),r=e.getContext("2d");e.style.width="100%",e.style.height="100%",e.width=e.offsetWidth,e.height=e.offsetHeight;for(var a=e.clientWidth,s=e.clientHeight,h=[],u=new Map,l=15;l>0;l--)h.push(new t(Math.floor(Math.random()*a),Math.floor(Math.random()*s)));for(var c=0,f=h;c<f.length;c++)v(f[c],"#000");var p=[],g=new i(new t(0,0),new t(2*a,0),new t(0,2*s));function v(t,n){void 0===n&&(n="#000"),r.beginPath(),r.arc(t.x,t.y,3,0,2*Math.PI,!1),r.fillStyle=n,r.fill(),r.closePath()}function y(n){for(var o=0,e=n;o<e.length;o++){for(var a=e[o],s=[],l=0,c=p;l<c.length;l++)(W=c[l]).isPointInsideCircumcircle(a)&&s.push(W);for(var f=[],y=0,w=s;y<w.length;y++)for(var E=0,M=(W=w[y]).getEdges();E<M.length;E++)T(s,P=M[E],W)&&f.push(P);for(var d=function(t){p.splice(p.findIndex((function(n){return n.isEqualTo(t)})),1)},q=0,x=s;q<x.length;q++)d(W=x[q]);for(var m=0,b=f;m<b.length;m++){var P=b[m];p.push(new i(a,P.from,P.to))}}for(var C=[],S=function(t){if(t.sharesSamePointWith(g))return"continue";var n=t.getCircumCenter();0===C.filter((function(t){return t.isEqualTo(n)})).length&&C.push(n);for(var o=t.getEdges(),i=function(t){var i=t.getEdges();if(o.filter((function(t){return i.find((function(n){return n.isEqualTo(t)}))})).length>0){r.beginPath(),r.moveTo(n.x,n.y);var e=t.getCircumCenter();0===C.filter((function(t){return t.isEqualTo(e)})).length&&C.push(e),r.lineTo(e.x,e.y),r.strokeStyle="#000",r.stroke(),r.closePath(),r.strokeStyle="#000"}},e=0,a=p;e<a.length;e++)i(a[e])},k=0,I=p;k<I.length;k++){var W;S(W=I[k])}var F=[];console.log(C),console.log(h);for(var H=function(t){var n=h.flatMap((function(n){return{point:n,distance:n.distanceTo(t)}})),o=n.sort((function(t,n){return t.distance<=n.distance?-1:1}))[0].distance,i=n.filter((function(t){console.log(t.distance,o);var n=Number(t.distance).toFixed(5)===Number(o).toFixed(5);return console.log(n),n})).map((function(t){return t.point}));F.push({center:t,points:i})},N=0,$=C;N<$.length;N++)H($[N]);console.log(F);for(var B=function(n){var o=F.filter((function(t){return 1===t.points.filter((function(t){return t.isEqualTo(n)})).length})).map((function(t){return t.center})),i=0,e=0;o.forEach((function(t){i+=t.x,e+=t.y})),i/=o.length,e/=o.length;var a=new t(i,e);o=o.map((function(n){return new t(n.x-a.x,n.y-a.y)})).sort((function(n,o){var i=n.angleTo(new t(0,0)),e=o.angleTo(new t(0,0));return i<e||i==e&&n.distanceTo(new t(0,0))<o.distanceTo(new t(0,0))?1:-1})).map((function(n){return new t(n.x+a.x,n.y+a.y)})),r.beginPath(),r.moveTo(o[0].x,o[0].y);for(var s=1;s<o.length;s++)r.lineTo(o[s].x,o[s].y);r.lineTo(o[0].x,o[0].y);var h=void 0,l=function(t){for(var n="",o=0,i=t;o<i.length;o++){var e=i[o];n+=e.x+""+e.y}return n}(o);u.has(l)?h=u.get(l):(h=("#0"+Math.round(16777215*Math.random()).toString(16)).replace(/^#0([0-9a-f]{6})$/i,"#$1"),u.set(l,h)),r.fillStyle=h,r.strokeStyle="#000",r.stroke(),r.fill(),r.closePath()},R=0,j=h;R<j.length;R++)B(j[R]);for(var z=0,A=h;z<A.length;z++)v(a=A[z],"#000")}function T(t,n,o){for(var i=0,e=t;i<e.length;i++){var r=e[i];if(r!==o)for(var a=0,s=r.getEdges();a<s.length;a++)if(s[a].isEqualTo(n))return!1}return!0}p.push(g),y(h),e.onclick=function(n){r.clearRect(0,0,2*a,2*s);var o=new t(n.x,n.y);h.push(o),y([o])}})();