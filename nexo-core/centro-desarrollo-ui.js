(function(){
'use strict';
if(window.__nexoDevelopmentCenterStage0)return;
window.__nexoDevelopmentCenterStage0=true;

const THEME_KEY='nexoTheme:v1';
const ICON_BASE='https://dtokurisu-png.github.io/nexo-inventory-smart/assets/icons/nexo/';
const TOOL_ICONS={
  learning:'https://static.wixstatic.com/media/8b64a8_000c4b28e51a4cbb9b6ead5df43c77d2~mv2.png',
  library:'https://static.wixstatic.com/media/8b64a8_63b78c3f3c1c49a8a63d7ac60ccfe80f~mv2.png',
  inventory:'https://static.wixstatic.com/media/8b64a8_547e0719f4a4416692df3ca8f62708e2~mv2.png',
  recipes:'https://static.wixstatic.com/media/8b64a8_748210fdcc814399a2d02bc1695b857b~mv2.png'
};
const SYMBOL_MAP={
  '◈':'learning',
  '◫':'library',
  '▦':'inventory',
  '▤':'recipes',
  '☰':'recipes'
};

function norm(v){
  return String(v||'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/\s+/g,' ').trim().toLowerCase();
}
function storedTheme(){
  try{return localStorage.getItem(THEME_KEY)==='night'?'night':'day'}catch(_){return'day'}
}
function iconUrl(name){return ICON_BASE+encodeURIComponent(name)+'.png'}

function ensureStyle(){
  if(document.getElementById('nxo-dev-center-css'))return;
  const style=document.createElement('style');
  style.id='nxo-dev-center-css';
  style.textContent=`
html[data-nxo-dev-theme="day"]{
  --nxo-dev-bg:#f5f2ea;
  --nxo-dev-bg2:#eef4ff;
  --nxo-dev-surface:#ffffff;
  --nxo-dev-surface2:#f8fbff;
  --nxo-dev-border:#c5d2e8;
  --nxo-dev-text:#111827;
  --nxo-dev-muted:#5b6780;
  --nxo-dev-blue:#2f4f93;
  --nxo-dev-green:#246b36;
  --nxo-dev-orange:#e79069;
  --nxo-dev-accent:#2f4f93;
  --nxo-dev-shadow:0 16px 38px rgba(23,39,85,.12)
}
html[data-nxo-dev-theme="night"]{
  --nxo-dev-bg:#080b10;
  --nxo-dev-bg2:#0d121a;
  --nxo-dev-surface:rgba(18,25,35,.86);
  --nxo-dev-surface2:rgba(24,33,46,.82);
  --nxo-dev-border:rgba(184,197,216,.24);
  --nxo-dev-text:#f2f5f8;
  --nxo-dev-muted:#a8b2c3;
  --nxo-dev-blue:#69a7ff;
  --nxo-dev-green:#55c985;
  --nxo-dev-orange:#f2b35c;
  --nxo-dev-accent:#e1bd69;
  --nxo-dev-shadow:0 22px 58px rgba(0,0,0,.30)
}
html[data-nxo-dev-theme] body,
html[data-nxo-dev-theme] #SITE_CONTAINER,
html[data-nxo-dev-theme] #masterPage,
html[data-nxo-dev-theme] #PAGES_CONTAINER{
  background:
    radial-gradient(circle at 8% 0%,color-mix(in srgb,var(--nxo-dev-blue) 12%,transparent),transparent 30%),
    radial-gradient(circle at 92% 8%,color-mix(in srgb,var(--nxo-dev-accent) 10%,transparent),transparent 28%),
    linear-gradient(180deg,var(--nxo-dev-bg),var(--nxo-dev-bg2))!important;
  color:var(--nxo-dev-text)!important
}
html[data-nxo-dev-theme] #PAGES_CONTAINER [data-testid="section-container"],
html[data-nxo-dev-theme] #PAGES_CONTAINER .wixui-section{
  background-color:transparent!important
}
html[data-nxo-dev-theme] #PAGES_CONTAINER [data-testid="richTextElement"],
html[data-nxo-dev-theme] #PAGES_CONTAINER [data-testid="richTextElement"] *,
html[data-nxo-dev-theme] #PAGES_CONTAINER .wixui-rich-text,
html[data-nxo-dev-theme] #PAGES_CONTAINER .wixui-rich-text *,
html[data-nxo-dev-theme] #PAGES_CONTAINER .wixui-text{
  color:var(--nxo-dev-text)!important
}
html[data-nxo-dev-theme] [data-nxo-dev-muted="1"],
html[data-nxo-dev-theme] [data-nxo-dev-card="1"] p{
  color:var(--nxo-dev-muted)!important
}
html[data-nxo-dev-theme] [data-nxo-dev-card="1"]{
  border:1px solid var(--nxo-dev-border)!important;
  border-radius:18px!important;
  background:var(--nxo-dev-surface)!important;
  box-shadow:var(--nxo-dev-shadow)!important;
  transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease,background .16s ease!important
}
html[data-nxo-dev-theme="night"] [data-nxo-dev-card="1"]{
  -webkit-backdrop-filter:blur(16px) saturate(125%)!important;
  backdrop-filter:blur(16px) saturate(125%)!important
}
html[data-nxo-dev-theme="day"] [data-nxo-dev-card="1"]:hover{
  border-color:var(--nxo-dev-orange)!important;
  box-shadow:0 18px 48px rgba(23,39,85,.16)!important;
  transform:translateY(-2px)
}
html[data-nxo-dev-theme="night"] [data-nxo-dev-card="1"]:hover{
  border-color:rgba(225,189,105,.42)!important;
  box-shadow:0 20px 50px rgba(0,0,0,.34)!important;
  transform:translateY(-2px)
}
#nxo-dev-theme-toggle{
  position:fixed;
  z-index:2147483200;
  top:max(14px,env(safe-area-inset-top));
  right:max(14px,env(safe-area-inset-right));
  width:42px;height:42px;
  display:grid;place-items:center;
  padding:0;margin:0;
  border:1px solid var(--nxo-dev-border);
  border-radius:12px;
  background:var(--nxo-dev-surface);
  color:var(--nxo-dev-accent);
  box-shadow:0 10px 28px rgba(0,0,0,.18);
  cursor:pointer;
  -webkit-backdrop-filter:blur(14px);
  backdrop-filter:blur(14px)
}
#nxo-dev-theme-toggle:hover,#nxo-dev-theme-toggle:focus-visible{
  outline:none;
  border-color:var(--nxo-dev-accent);
  transform:translateY(-1px)
}
#nxo-dev-theme-toggle img{
  width:21px;height:21px;display:block;object-fit:contain
}
.nxo-dev-replaced-icon{
  display:block!important;
  width:100%!important;
  height:100%!important;
  max-width:72px!important;
  max-height:72px!important;
  min-width:34px!important;
  min-height:34px!important;
  object-fit:contain!important;
  object-position:center!important;
  margin:auto!important;
  filter:drop-shadow(0 6px 10px rgba(0,0,0,.16))
}
[data-nxo-dev-icon-slot="1"]{
  display:grid!important;
  place-items:center!important;
  line-height:0!important;
  color:transparent!important;
  overflow:visible!important
}
html[data-nxo-dev-theme="day"] [data-nxo-dev-card="1"] h1,
html[data-nxo-dev-theme="day"] [data-nxo-dev-card="1"] h2,
html[data-nxo-dev-theme="day"] [data-nxo-dev-card="1"] h3,
html[data-nxo-dev-theme="day"] [data-nxo-dev-card="1"] h4,
html[data-nxo-dev-theme="day"] [data-nxo-dev-card="1"] strong{
  color:#111827!important
}
html[data-nxo-dev-theme="night"] [data-nxo-dev-card="1"] h1,
html[data-nxo-dev-theme="night"] [data-nxo-dev-card="1"] h2,
html[data-nxo-dev-theme="night"] [data-nxo-dev-card="1"] h3,
html[data-nxo-dev-theme="night"] [data-nxo-dev-card="1"] h4,
html[data-nxo-dev-theme="night"] [data-nxo-dev-card="1"] strong{
  color:#f2f5f8!important
}
@media(max-width:700px){
  #nxo-dev-theme-toggle{top:10px;right:10px;width:38px;height:38px;border-radius:11px}
  #nxo-dev-theme-toggle img{width:19px;height:19px}
  .nxo-dev-replaced-icon{max-width:58px!important;max-height:58px!important}
}
`;
  document.head.appendChild(style)
}

function applyTheme(theme,persist){
  const t=theme==='night'?'night':'day';
  document.documentElement.dataset.nxoDevTheme=t;
  document.documentElement.dataset.nxoTheme=t;
  if(document.body)document.body.dataset.nxoTheme=t;
  if(persist!==false)try{localStorage.setItem(THEME_KEY,t)}catch(_){}
  const button=document.getElementById('nxo-dev-theme-toggle');
  if(button){
    const night=t==='night';
    const img=button.querySelector('img');
    if(img)img.src=iconUrl(night?'modo-oscuro':'modo-claro');
    button.setAttribute('aria-label',night?'Cambiar a modo claro':'Cambiar a modo oscuro');
    button.setAttribute('title',night?'Modo claro':'Modo oscuro');
    button.setAttribute('aria-pressed',night?'true':'false')
  }
}

function ensureThemeToggle(){
  let button=document.getElementById('nxo-dev-theme-toggle');
  if(button)return button;
  button=document.createElement('button');
  button.id='nxo-dev-theme-toggle';
  button.type='button';
  button.innerHTML='<img alt="" aria-hidden="true">';
  button.addEventListener('click',function(){
    const current=document.documentElement.dataset.nxoDevTheme==='night'?'night':'day';
    applyTheme(current==='night'?'day':'night',true)
  });
  document.body.appendChild(button);
  return button
}

function renameRecipeBooks(root){
  const scope=root||document.body;
  if(!scope)return;
  const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(function(node){
    const key=norm(node.nodeValue);
    if(key==='menus dinamicos'||key==='menu dinamico'){
      node.nodeValue='Recetarios Dinámicos'
    }
  })
}

function toolKeyFromText(text){
  const key=norm(text);
  if(key==='nexo learning core'||key==='learning core')return'learning';
  if(key==='biblioteca de engranaje')return'library';
  if(key==='inventario smart')return'inventory';
  if(key==='recetarios dinamicos'||key==='menus dinamicos'||key==='menu dinamico')return'recipes';
  return''
}

function closestCard(el){
  let node=el;
  const vw=Math.max(document.documentElement.clientWidth||0,window.innerWidth||0);
  const vh=Math.max(document.documentElement.clientHeight||0,window.innerHeight||0);
  for(let i=0;i<9&&node;i++,node=node.parentElement){
    if(!node.getBoundingClientRect)continue;
    const r=node.getBoundingClientRect();
    if(r.width<150||r.height<82)continue;
    if(r.width>vw*.96||r.height>vh*.88)continue;
    const txt=norm(node.textContent);
    if(/learning core|biblioteca de engranaje|inventario smart|recetarios dinamicos|menus dinamicos/.test(txt)){
      return node
    }
  }
  return el.parentElement
}

function markCards(){
  const selectors='h1,h2,h3,h4,h5,h6,p,span,a,button,div';
  [...document.querySelectorAll(selectors)].forEach(function(el){
    if(el.children.length>0)return;
    const key=toolKeyFromText(el.textContent);
    if(!key)return;
    const card=closestCard(el);
    if(card){
      card.dataset.nxoDevCard='1';
      card.dataset.nxoDevTool=key
    }
  })
}

function replaceSymbolSlot(el,key){
  if(!el||!key)return false;
  const parent=el.nodeType===3?el.parentElement:el;
  if(!parent)return false;
  const r=parent.getBoundingClientRect();
  parent.textContent='';
  parent.dataset.nxoDevIconSlot='1';
  if(r.width>0)parent.style.width=Math.max(38,Math.min(78,r.width))+'px';
  if(r.height>0)parent.style.height=Math.max(38,Math.min(78,r.height))+'px';
  const img=document.createElement('img');
  img.className='nxo-dev-replaced-icon';
  img.src=TOOL_ICONS[key];
  img.alt='';
  img.setAttribute('aria-hidden','true');
  parent.appendChild(img);
  return true
}

function replaceGenericIcons(){
  document.querySelectorAll('.nexoDevToolIcon,[data-nexo-dev-icon="1"]').forEach(function(el){el.remove()});

  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(function(node){
    const raw=String(node.nodeValue||'').trim();
    const key=SYMBOL_MAP[raw];
    if(key)replaceSymbolSlot(node,key)
  });

  [...document.querySelectorAll('[data-nxo-dev-card="1"]')].forEach(function(card){
    const key=card.dataset.nxoDevTool;
    if(!key||card.querySelector('.nxo-dev-replaced-icon'))return;
    const symbolNode=[...card.querySelectorAll('*')].find(function(el){
      return !!SYMBOL_MAP[String(el.textContent||'').trim()]&&el.children.length===0
    });
    if(symbolNode){
      replaceSymbolSlot(symbolNode,SYMBOL_MAP[String(symbolNode.textContent||'').trim()]);
      return
    }
    const likelySlot=[...card.querySelectorAll('span,div')].find(function(el){
      if(el.children.length)return false;
      const r=el.getBoundingClientRect();
      return r.width>=28&&r.width<=100&&r.height>=28&&r.height<=100&&norm(el.textContent)===''
    });
    if(likelySlot)replaceSymbolSlot(likelySlot,key)
  })
}

function cleanupOldRuntime(){
  const old=document.getElementById('nexoDevelopmentThemeToggle');
  if(old)old.remove();
  const oldStyle=document.getElementById('nexoDevelopmentThemeStyle');
  if(oldStyle)oldStyle.remove()
}

let scheduled=false;
function refresh(){
  cleanupOldRuntime();
  renameRecipeBooks(document.body);
  markCards();
  replaceGenericIcons();
  applyTheme(document.documentElement.dataset.nxoDevTheme||storedTheme(),false)
}
function schedule(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(function(){scheduled=false;refresh()})
}

function start(){
  if(!document.body)return;
  ensureStyle();
  ensureThemeToggle();
  applyTheme(storedTheme(),false);
  refresh();
  const observer=new MutationObserver(schedule);
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  window.addEventListener('storage',function(event){
    if(event.key===THEME_KEY&&(event.newValue==='day'||event.newValue==='night')){
      applyTheme(event.newValue,false)
    }
  })
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',start,{once:true})
}else{
  start()
}
})();