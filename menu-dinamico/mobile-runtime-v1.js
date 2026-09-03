(()=>{'use strict';
if(window.__NEXO_MOBILE_RUNTIME_V1__)return;window.__NEXO_MOBILE_RUNTIME_V1__=true;
const MOBILE=window.matchMedia('(max-width:720px)');
const PWA='https://dtokurisu-png.github.io/nexo-inventory-smart/menu-dinamico/pwa.html';
let moving=false;
function ensureResponsive(){
  if(!MOBILE.matches)return;
  let l=document.getElementById('nexo-responsive-core-v2');
  if(!l){l=document.createElement('link');l.id='nexo-responsive-core-v2';l.rel='stylesheet';l.href='./responsive-core-v2.css?v=20260903-1';document.head.appendChild(l);return}
  if(l!==document.head.lastElementChild&&!moving){moving=true;document.head.appendChild(l);queueMicrotask(()=>moving=false)}
}
function standalone(){return window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}
function addInstall(){
  if(!MOBILE.matches||standalone())return;
  const bar=document.querySelector('.topbar');if(!bar||document.getElementById('nexoInstallApp'))return;
  const b=document.createElement('button');b.id='nexoInstallApp';b.className='lang';b.type='button';b.textContent=document.documentElement.lang==='en'?'Install':'Instalar';b.style.cssText='white-space:nowrap;min-width:auto;padding:0 10px;font-size:15px';
  const legend=document.getElementById('legendBtn');bar.insertBefore(b,legend||null);
  b.addEventListener('click',()=>{
    try{
      const u=new URL(window.top.location.href);
      if(u.origin===location.origin&&u.pathname.endsWith('/pwa.html')){window.top.postMessage({type:'NEXO_REQUEST_INSTALL'},'*');return}
    }catch(_){}
    try{window.top.location.href=PWA}catch(_){window.open(PWA,'_blank','noopener')}
  });
}
function apply(){ensureResponsive();addInstall()}
apply();
MOBILE.addEventListener?.('change',apply);
new MutationObserver(()=>apply()).observe(document.documentElement,{childList:true,subtree:true});
new MutationObserver(()=>ensureResponsive()).observe(document.head,{childList:true});
})();