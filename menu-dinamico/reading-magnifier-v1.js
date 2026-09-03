(()=>{'use strict';
if(window.__NEXO_READING_MAGNIFIER_V1__)return;window.__NEXO_READING_MAGNIFIER_V1__=true;
const BUILD='Prueba 4';
function markBuild(){const b=document.getElementById('nexoBuildIndicator');if(b){b.textContent=BUILD;return}setTimeout(markBuild,80)}markBuild();
const ua=navigator.userAgent||'';
const mobile=/Android|iPhone|iPad|iPod|Mobile/i.test(ua)||(navigator.maxTouchPoints>0&&Math.min(screen.width||9999,screen.height||9999)<=900);
if(!mobile||!('ontouchstart'in window||navigator.maxTouchPoints>0))return;
const style=document.createElement('style');style.id='nexo-reading-magnifier-style';style.textContent=`
#nexoReadingMagnifier{position:fixed;z-index:2147483646;left:50%;top:50%;width:min(84vw,390px);min-height:68px;box-sizing:border-box;padding:16px 20px;border:2px solid rgba(23,21,17,.2);border-radius:28px;background:rgba(255,255,255,.985);color:#171511;box-shadow:0 18px 55px rgba(0,0,0,.28);font:750 34px/1.3 system-ui,-apple-system,"Segoe UI",sans-serif;text-align:center;overflow-wrap:anywhere;pointer-events:none;opacity:0;visibility:hidden;transform:translate(-50%,-100%) scale(.94);transform-origin:50% 100%;transition:opacity .12s ease,transform .12s ease,visibility 0s linear .12s;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
#nexoReadingMagnifier[data-show="1"]{opacity:1;visibility:visible;transform:translate(-50%,-100%) scale(1);transition:opacity .12s ease,transform .12s ease}
#nexoReadingMagnifier[data-below="1"]{transform:translate(-50%,0) scale(.94);transform-origin:50% 0}
#nexoReadingMagnifier[data-show="1"][data-below="1"]{transform:translate(-50%,0) scale(1)}
#nexoReadingMagnifier:after{content:"";position:absolute;left:50%;bottom:-12px;width:22px;height:22px;background:inherit;border-right:2px solid rgba(23,21,17,.2);border-bottom:2px solid rgba(23,21,17,.2);transform:translateX(-50%) rotate(45deg)}
#nexoReadingMagnifier[data-below="1"]:after{top:-12px;bottom:auto;border:0;border-left:2px solid rgba(23,21,17,.2);border-top:2px solid rgba(23,21,17,.2)}
html.nexoMagnifierActive,html.nexoMagnifierActive body{overscroll-behavior:none}html.nexoMagnifierActive body{-webkit-user-select:none!important;user-select:none!important}
`;
document.head.appendChild(style);
const bubble=document.createElement('div');bubble.id='nexoReadingMagnifier';bubble.setAttribute('aria-hidden','true');document.body.appendChild(bubble);
let timer=null,active=false,startX=0,startY=0,lastX=0,lastY=0,suppressClickUntil=0,pendingTarget=null;
const blocked='input,textarea,select,[contenteditable="true"],.miseCheck,.mopCheck,.icon,.lang,.installBtn,.taxonomyImageClose,.photoAction,.photoBtn';
function eligible(el){if(!el||el.nodeType!==1)return false;if(el.closest(blocked))return false;const t=(el.textContent||'').replace(/\s+/g,' ').trim();return t.length>0}
function clamp(n,min,max){return Math.max(min,Math.min(max,n))}
function caretAt(x,y){try{if(document.caretPositionFromPoint){const p=document.caretPositionFromPoint(x,y);if(p&&p.offsetNode)return{node:p.offsetNode,offset:p.offset}}if(document.caretRangeFromPoint){const r=document.caretRangeFromPoint(x,y);if(r)return{node:r.startContainer,offset:r.startOffset}}}catch(_){}return null}
function excerptFromPoint(x,y){const c=caretAt(x,y);if(c&&c.node&&c.node.nodeType===3){const raw=String(c.node.nodeValue||'');if(raw.trim()){let s=Math.max(0,c.offset-34),e=Math.min(raw.length,c.offset+46);while(s>0&&!/\s/.test(raw[s-1])&&c.offset-s<48)s--;while(e<raw.length&&!/\s/.test(raw[e])&&e-c.offset<60)e++;let out=raw.slice(s,e).replace(/\s+/g,' ').trim();if(out){if(s>0)out='…'+out;if(e<raw.length)out+='…';return out}}}
const el=document.elementFromPoint(x,y);if(!eligible(el))return'';let cur=el;while(cur&&cur!==document.body){const t=(cur.textContent||'').replace(/\s+/g,' ').trim();if(t&&t.length<=180)return t;cur=cur.parentElement}const full=(el.textContent||'').replace(/\s+/g,' ').trim();return full.length>150?full.slice(0,147)+'…':full}
function place(x,y){const half=Math.min(innerWidth*.42,195);const px=clamp(x,half+8,innerWidth-half-8);const above=y>150;bubble.dataset.below=above?'0':'1';bubble.style.left=px+'px';bubble.style.top=(above?Math.max(92,y-28):Math.min(innerHeight-92,y+54))+'px'}
function update(x,y){const text=excerptFromPoint(x,y);if(text)bubble.textContent=text;place(x,y)}
function activate(){timer=null;if(!pendingTarget||!eligible(pendingTarget))return;active=true;document.documentElement.classList.add('nexoMagnifierActive');update(lastX,lastY);if(!bubble.textContent){active=false;document.documentElement.classList.remove('nexoMagnifierActive');return}bubble.dataset.show='1';if(navigator.vibrate)try{navigator.vibrate(18)}catch(_){} }
function clearTimer(){if(timer){clearTimeout(timer);timer=null}}
function close(){clearTimer();if(active){active=false;suppressClickUntil=Date.now()+550;bubble.dataset.show='0';document.documentElement.classList.remove('nexoMagnifierActive');setTimeout(()=>{if(!active)bubble.textContent=''},140)}pendingTarget=null}
document.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;const t=e.touches[0];if(!eligible(e.target))return;close();suppressClickUntil=0;pendingTarget=e.target;startX=lastX=t.clientX;startY=lastY=t.clientY;timer=setTimeout(activate,450)},{passive:true,capture:true});
document.addEventListener('touchmove',e=>{if(e.touches.length!==1){close();return}const t=e.touches[0];lastX=t.clientX;lastY=t.clientY;if(!active){if(Math.hypot(lastX-startX,lastY-startY)>12){clearTimer();pendingTarget=null}return}e.preventDefault();update(lastX,lastY)},{passive:false,capture:true});
document.addEventListener('touchend',()=>close(),{passive:true,capture:true});
document.addEventListener('touchcancel',()=>close(),{passive:true,capture:true});
document.addEventListener('contextmenu',e=>{if(active||timer){e.preventDefault();e.stopPropagation()}},{capture:true});
document.addEventListener('click',e=>{if(Date.now()<suppressClickUntil){e.preventDefault();e.stopImmediatePropagation()}},{capture:true});
})();