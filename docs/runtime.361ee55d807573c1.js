(()=>{"use strict";var e,m={},v={};function a(e){var c=v[e];if(void 0!==c)return c.exports;var r=v[e]={exports:{}};return m[e](r,r.exports,a),r.exports}a.m=m,e=[],a.O=(c,r,f,n)=>{if(!r){var t=1/0;for(d=0;d<e.length;d++){for(var[r,f,n]=e[d],u=!0,b=0;b<r.length;b++)(!1&n||t>=n)&&Object.keys(a.O).every(p=>a.O[p](r[b]))?r.splice(b--,1):(u=!1,n<t&&(t=n));if(u){e.splice(d--,1);var i=f();void 0!==i&&(c=i)}}return c}n=n||0;for(var d=e.length;d>0&&e[d-1][2]>n;d--)e[d]=e[d-1];e[d]=[r,f,n]},a.d=(e,c)=>{for(var r in c)a.o(c,r)&&!a.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:c[r]})},a.f={},a.e=e=>Promise.all(Object.keys(a.f).reduce((c,r)=>(a.f[r](e,c),c),[])),a.u=e=>(8592===e?"common":e)+"."+{74:"2e91dbcbda57483a",639:"395b8dd2adc21b33",1122:"5bb7805b00bd4f61",1192:"c6f6a5629acb0d4d",1331:"8e0f6f23b61ece54",1409:"b153ca79a4a6765a",1732:"09ee3a8e45a79df3",2043:"3949716105d648cf",2105:"61235773ac2fc659",2151:"33cf8581f92129c0",2472:"1d1a4791f6f7ac16",2582:"a3303c04a653c709",2652:"836978cf467e3609",2752:"41b9640ab0ae9393",2811:"49785e0bf6b2f112",2947:"595b17684fe82f16",3259:"8dd35105645af07f",3280:"947b1af520c939fe",3530:"d3351e06cac80d9a",3722:"3a24b125ae853247",3794:"e00acfd6b61c4367",3844:"03fdf188aa27c5da",3904:"bb63eea16411fe3c",4055:"5ef608ca062ac0d1",4201:"1a611fe2ccd0e352",5186:"6f936de1c20994b4",5212:"3132458b3252c03e",5289:"b187ec222e309ea8",5373:"1c83fa4daf5778c4",5631:"8161404119f21f5a",5832:"cfc5fd7a9e6822ad",5938:"01aeb235e86d5549",5952:"4162de3bd81dc5aa",6022:"4c36d91062818f5f",6324:"080360f9cfd8dbcd",6426:"804308a4f3be7c8b",6760:"373730b679fce0cb",6824:"8dafbfe7f8f17852",6942:"0091a093530accaa",7203:"34c46eb278a85dd4",7294:"2cdefaf32a4170b9",7471:"d239884c3d01ec48",7493:"7505c510edc947cc",7853:"14afd66292aa08be",8336:"d869e5786646a5b0",8493:"fa8f3bff8eb05d07",8549:"857ef7492de66409",8592:"6eb311959c4befe8",8628:"11edccaa2134452f",8761:"5a9ad5a8b9802f8d",9502:"b637cf7c193c4ba2",9552:"c9a7be0fee93b5d0"}[e]+".js",a.miniCssF=e=>{},a.o=(e,c)=>Object.prototype.hasOwnProperty.call(e,c),(()=>{var e={},c="goalpost-primeng:";a.l=(r,f,n,d)=>{if(e[r])e[r].push(f);else{var t,u;if(void 0!==n)for(var b=document.getElementsByTagName("script"),i=0;i<b.length;i++){var o=b[i];if(o.getAttribute("src")==r||o.getAttribute("data-webpack")==c+n){t=o;break}}t||(u=!0,(t=document.createElement("script")).type="module",t.charset="utf-8",t.timeout=120,a.nc&&t.setAttribute("nonce",a.nc),t.setAttribute("data-webpack",c+n),t.src=a.tu(r)),e[r]=[f];var l=(g,p)=>{t.onerror=t.onload=null,clearTimeout(s);var _=e[r];if(delete e[r],t.parentNode&&t.parentNode.removeChild(t),_&&_.forEach(h=>h(p)),g)return g(p)},s=setTimeout(l.bind(null,void 0,{type:"timeout",target:t}),12e4);t.onerror=l.bind(null,t.onerror),t.onload=l.bind(null,t.onload),u&&document.head.appendChild(t)}}})(),a.r=e=>{typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;a.tt=()=>(void 0===e&&(e={createScriptURL:c=>c},typeof trustedTypes<"u"&&trustedTypes.createPolicy&&(e=trustedTypes.createPolicy("angular#bundler",e))),e)})(),a.tu=e=>a.tt().createScriptURL(e),a.p="",(()=>{var e={3666:0};a.f.j=(f,n)=>{var d=a.o(e,f)?e[f]:void 0;if(0!==d)if(d)n.push(d[2]);else if(3666!=f){var t=new Promise((o,l)=>d=e[f]=[o,l]);n.push(d[2]=t);var u=a.p+a.u(f),b=new Error;a.l(u,o=>{if(a.o(e,f)&&(0!==(d=e[f])&&(e[f]=void 0),d)){var l=o&&("load"===o.type?"missing":o.type),s=o&&o.target&&o.target.src;b.message="Loading chunk "+f+" failed.\n("+l+": "+s+")",b.name="ChunkLoadError",b.type=l,b.request=s,d[1](b)}},"chunk-"+f,f)}else e[f]=0},a.O.j=f=>0===e[f];var c=(f,n)=>{var b,i,[d,t,u]=n,o=0;if(d.some(s=>0!==e[s])){for(b in t)a.o(t,b)&&(a.m[b]=t[b]);if(u)var l=u(a)}for(f&&f(n);o<d.length;o++)a.o(e,i=d[o])&&e[i]&&e[i][0](),e[i]=0;return a.O(l)},r=self.webpackChunkgoalpost_primeng=self.webpackChunkgoalpost_primeng||[];r.forEach(c.bind(null,0)),r.push=c.bind(null,r.push.bind(r))})()})();