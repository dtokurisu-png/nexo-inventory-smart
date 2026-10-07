(function(){
'use strict';
if(window.__nexoDevelopmentCenterStage0V4)return;
window.__nexoDevelopmentCenterStage0V4=true;
window.__nexoDevelopmentCenterStage0Version='20261007-8';

const THEME_KEY='nexoTheme:v1';
const THEME_RUNTIME='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/theme-runtime.js?v=20261001-v3-1';
const ICON_BASE='https://dtokurisu-png.github.io/nexo-inventory-smart/assets/icons/nexo/';
const NEXO_LOGO='https://static.wixstatic.com/media/8b64a8_7bd85ca8e1854afc9ae91eab7457c405~mv2.png';
const TOOL_DEFS=[
  {key:'learning',icon:'desarrollo',names:['nexo learning core','learning core']},
  {key:'library',icon:'guia',names:['biblioteca de engranaje']},
  {key:'inventory',icon:'productos',names:['inventario smart']},
  {key:'technical',icon:'ficha-tecnica',names:['fichas tecnicas dinamicas','dynamic technical sheets']},
  {key:'work',icon:'panel',names:['centro de trabajo','work center']},
  {key:'recipes',icon:'platos',names:['recetarios dinamicos','menus dinamicos','menu dinamico','dynamic recipe books']}
];
let scheduled=false,observer=null;

function norm(v){
  return String(v||'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/\s+/g,' ').trim().toLowerCase()
}
function iconUrl(name){return ICON_BASE+encodeURIComponent(name)+'.png'}
function toolForText(value){
  const key=norm(value);
  return TOOL_DEFS.find(tool=>tool.names.includes(key))||null
}
function theme(){
  return window.NEXO_THEME_RUNTIME?.getTheme?.()||
    (document.documentElement.dataset.nxoTheme==='night'?'night':'day')
}
function goBack(){
  try{
    const u=new URL(location.href);
    const back=u.searchParams.get('nxoBack');
    if(back){location.assign(back);return}
  }catch(_){}
  if(history.length>1){history.back();return}
  location.assign('/my-site-1/blank-8')
}
function goMySpace(){location.assign('/my-site-1/blank-8')}

function ensureThemeRuntime(){
  if(window.NEXO_THEME_RUNTIME)return Promise.resolve(window.NEXO_THEME_RUNTIME.ready);
  return new Promise((resolve,reject)=>{
    let script=document.getElementById('nxo-theme-runtime');
    if(!script){
      script=document.createElement('script');
      script.id='nxo-theme-runtime';
      script.src=THEME_RUNTIME;
      script.defer=true;
      script.onload=()=>resolve(window.NEXO_THEME_RUNTIME?.ready);
      script.onerror=reject;
      document.head.appendChild(script)
    }else{
      script.addEventListener('load',()=>resolve(window.NEXO_THEME_RUNTIME?.ready),{once:true});
      script.addEventListener('error',reject,{once:true})
    }
  })
}

function ensureStyle(){
  if(document.getElementById('nxo-dev-center-css'))return;
  const style=document.createElement('style');
  style.id='nxo-dev-center-css';
  style.textContent=`
/* DEVELOPMENT CENTER · Stage 0 visual contract
   Values come only from Nexo theme-runtime semantic variables. */
#nxo-dev-header{
  position:sticky;top:0;z-index:2147483200;
  min-height:64px;padding:0 22px;
  display:flex;align-items:center;gap:22px;
  color:var(--nxo-header-text);
  background:var(--nxo-header-background);
  border-bottom:1px solid var(--nxo-header-border);
  box-shadow:0 10px 28px var(--nxo-shadow);
  -webkit-backdrop-filter:blur(18px) saturate(120%);
  backdrop-filter:blur(18px) saturate(120%);
  font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
}
.nxo-dev-brand{
  display:flex;align-items:center;gap:10px;min-width:190px;
  color:var(--nxo-header-text);text-decoration:none;cursor:pointer
}
.nxo-dev-mark{
  width:38px;height:38px;flex:0 0 38px;
  display:grid;place-items:center;border-radius:11px;
  background:var(--nxo-accent);
  border:1px solid color-mix(in srgb,var(--nxo-header-text) 24%,transparent);
  box-shadow:0 8px 22px var(--nxo-shadow),inset 0 1px 0 color-mix(in srgb,var(--nxo-header-text) 16%,transparent);
  overflow:hidden
}
.nxo-dev-mark img{display:block;width:31px;height:31px;object-fit:contain}
.nxo-dev-brand-copy{display:grid;min-width:0}
.nxo-dev-brand-copy strong{font-size:13px;line-height:1.1;color:var(--nxo-header-text)}
.nxo-dev-brand-copy small{
  margin-top:3px;color:var(--nxo-header-muted);font-size:10px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px
}
.nxo-dev-nav{
  align-self:stretch;display:flex;align-items:stretch;gap:18px;flex:1;min-width:0
}
.nxo-dev-nav-button{
  position:relative;appearance:none;border:0;background:transparent;
  color:var(--nxo-header-muted);padding:0 2px;
  font:760 12px/1 Inter,system-ui,sans-serif;cursor:pointer;white-space:nowrap
}
.nxo-dev-nav-button::after{
  content:"";position:absolute;left:0;right:0;bottom:0;height:3px;
  border-radius:3px 3px 0 0;background:transparent
}
.nxo-dev-nav-button:hover,.nxo-dev-nav-button:focus-visible{
  color:var(--nxo-header-text);outline:none
}
.nxo-dev-nav-button:hover::after,.nxo-dev-nav-button:focus-visible::after{
  background:var(--nxo-interaction)
}
.nxo-dev-nav-button.active{color:var(--nxo-header-active);font-weight:900}
.nxo-dev-nav-button.active::after{background:var(--nxo-header-active)}
.nxo-dev-utils{position:relative;display:flex;align-items:center;gap:8px;margin-left:auto}
.nxo-dev-quick-wrap{position:relative;display:flex;align-items:center}
.nxo-dev-quick-button{
  appearance:none;width:38px;height:38px;padding:0;display:grid;place-items:center;
  border:1px solid color-mix(in srgb,var(--nxo-header-text) 12%,transparent);
  border-radius:11px;background:color-mix(in srgb,var(--nxo-header-text) 7%,transparent);
  color:var(--nxo-header-text);cursor:pointer
}
.nxo-dev-quick-button img{display:block;width:18px;height:18px;object-fit:contain}
.nxo-dev-quick-button:hover,.nxo-dev-quick-button:focus-visible,.nxo-dev-quick-button[aria-expanded="true"]{
  outline:none;background:var(--nxo-interaction);border-color:var(--nxo-interaction);color:var(--nxo-interaction-contrast)
}
.nxo-dev-quick-menu{
  display:none;position:absolute;right:0;top:calc(100% + 8px);z-index:30;
  width:230px;overflow:hidden;border:1px solid var(--nxo-border);
  border-radius:14px;background:var(--nxo-surface-raised);
  color:var(--nxo-text-primary);box-shadow:var(--nxo-modal-shadow)
}
.nxo-dev-quick-menu.open{display:block}
.nxo-dev-quick-title{
  padding:10px 12px 7px;color:var(--nxo-text-muted);
  font-size:9px;font-weight:850;letter-spacing:.08em;text-transform:uppercase
}
.nxo-dev-quick-row{
  appearance:none;width:100%;min-height:42px;padding:0 12px;
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  border:0;border-top:1px solid var(--nxo-border);
  background:transparent;color:var(--nxo-text-primary);
  font:760 11px/1 Inter,system-ui,sans-serif;cursor:pointer
}
.nxo-dev-quick-label{display:flex;align-items:center;gap:8px}
.nxo-dev-quick-label img{width:17px;height:17px;display:block;object-fit:contain}
.nxo-dev-quick-row strong{
  min-width:42px;padding:3px 7px;border:1px solid var(--nxo-border);
  border-radius:999px;color:var(--nxo-text-secondary);
  background:var(--nxo-accent-soft);font-size:9px;text-align:center
}
html[data-nxo-theme="day"] .nxo-dev-quick-row:hover,
html[data-nxo-theme="day"] .nxo-dev-quick-row:focus-visible{
  outline:none;color:var(--nxo-text-primary);background:var(--nxo-interaction)
}
html[data-nxo-theme="night"] .nxo-dev-quick-row:hover,
html[data-nxo-theme="night"] .nxo-dev-quick-row:focus-visible{
  outline:none;color:var(--nxo-accent-contrast);background:var(--nxo-interaction)
}
html[data-nxo-theme="night"] .nxo-dev-quick-row:hover strong,
html[data-nxo-theme="night"] .nxo-dev-quick-row:focus-visible strong{
  color:var(--nxo-accent-contrast);
  border-color:color-mix(in srgb,var(--nxo-accent-contrast) 28%,transparent);
  background:color-mix(in srgb,var(--nxo-accent-contrast) 8%,transparent)
}

/* Global page canvas consumes canonical theme tokens. */
html[data-nxo-theme] body,
html[data-nxo-theme] #SITE_CONTAINER,
html[data-nxo-theme] #masterPage,
html[data-nxo-theme] #PAGES_CONTAINER{
  color:var(--nxo-text-primary)!important;
  background:
    radial-gradient(circle at 7% 3%,color-mix(in srgb,var(--nxo-accent) 12%,transparent),transparent 29%),
    radial-gradient(circle at 91% 8%,color-mix(in srgb,var(--nxo-interaction) 12%,transparent),transparent 28%),
    radial-gradient(circle at 76% 88%,color-mix(in srgb,var(--nxo-positive) 7%,transparent),transparent 26%),
    linear-gradient(135deg,var(--nxo-background),var(--nxo-background-alt))!important
}
/* Wix editor backgrounds are presentation leftovers; the canonical canvas owns them. */
html[data-nxo-theme] #PAGES_CONTAINER>div,
html[data-nxo-theme] #PAGES_CONTAINER main,
html[data-nxo-theme] #PAGES_CONTAINER section,
html[data-nxo-theme] #PAGES_CONTAINER .wixui-section,
html[data-nxo-theme] #PAGES_CONTAINER [data-testid="section-container"],
html[data-nxo-theme] #PAGES_CONTAINER [data-testid="section-bg"],
html[data-nxo-theme] #PAGES_CONTAINER [data-testid="container-bg"],
html[data-nxo-theme] #PAGES_CONTAINER [data-testid="background-media"]{
  background-color:transparent!important;
  background-image:none!important
}
html[data-nxo-theme] #PAGES_CONTAINER [data-testid="richTextElement"],
html[data-nxo-theme] #PAGES_CONTAINER [data-testid="richTextElement"] *,
html[data-nxo-theme] #PAGES_CONTAINER .wixui-rich-text,
html[data-nxo-theme] #PAGES_CONTAINER .wixui-rich-text *,
html[data-nxo-theme] #PAGES_CONTAINER .wixui-text{
  color:var(--nxo-text-primary)!important
}

/* Tool cards use the same semantic glass contract as Mi Espacio. */
html[data-nxo-theme] [data-nxo-dev-card="1"]{
  position:relative!important;overflow:hidden!important;
  color:var(--nxo-text-primary)!important;
  border:1px solid var(--nxo-border)!important;
  border-radius:18px!important;
  background:var(--nxo-surface-glass)!important;
  -webkit-backdrop-filter:blur(16px) saturate(118%)!important;
  backdrop-filter:blur(16px) saturate(118%)!important;
  box-shadow:0 14px 34px var(--nxo-shadow),inset 0 1px 0 color-mix(in srgb,var(--nxo-text-primary) 5%,transparent)!important;
  transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease,background .16s ease!important
}
html[data-nxo-theme] [data-nxo-dev-card="1"]::before{
  content:"";position:absolute;inset:0 auto auto 0;width:100%;height:2px;
  background:linear-gradient(90deg,var(--nxo-accent),var(--nxo-interaction),var(--nxo-positive));
  opacity:.66;pointer-events:none
}
html[data-nxo-theme] [data-nxo-dev-card="1"]:hover,
html[data-nxo-theme] [data-nxo-dev-card="1"]:focus-within{
  transform:translateY(-3px)!important;
  border-color:var(--nxo-interaction)!important;
  background:var(--nxo-surface-glass-hover)!important;
  box-shadow:0 18px 38px var(--nxo-shadow),0 0 0 2px var(--nxo-focus-ring)!important
}
html[data-nxo-theme] [data-nxo-dev-card="1"] h1,
html[data-nxo-theme] [data-nxo-dev-card="1"] h2,
html[data-nxo-theme] [data-nxo-dev-card="1"] h3,
html[data-nxo-theme] [data-nxo-dev-card="1"] h4,
html[data-nxo-theme] [data-nxo-dev-card="1"] strong{color:var(--nxo-text-primary)!important}
html[data-nxo-theme] [data-nxo-dev-card="1"] p,
html[data-nxo-theme] [data-nxo-dev-card="1"] small{color:var(--nxo-text-muted)!important}

/* Real CTA controls inside tool cards. The runtime marks the actual Wix surface. */
html[data-nxo-theme] .nxo-dev-action,
html[data-nxo-theme] .nxo-dev-action-surface{
  color:var(--nxo-button-secondary-text)!important;
  background:var(--nxo-button-secondary-bg)!important;
  border-color:var(--nxo-button-secondary-border)!important;
  border-style:solid!important;
  border-width:1px!important;
  border-radius:10px!important;
  box-shadow:none!important;
  transition:background .16s ease,border-color .16s ease,color .16s ease,box-shadow .16s ease,transform .16s ease!important
}
html[data-nxo-theme] .nxo-dev-action *,
html[data-nxo-theme] .nxo-dev-action-surface *{
  color:inherit!important
}
html[data-nxo-theme="day"] .nxo-dev-action:hover,
html[data-nxo-theme="day"] .nxo-dev-action:focus-visible,
html[data-nxo-theme="day"] .nxo-dev-action:hover .nxo-dev-action-surface,
html[data-nxo-theme="day"] .nxo-dev-action:focus-visible .nxo-dev-action-surface{
  color:var(--nxo-interaction-contrast)!important;
  background:var(--nxo-interaction)!important;
  border-color:var(--nxo-border-strong)!important;
  box-shadow:0 10px 20px var(--nxo-shadow),0 0 0 3px var(--nxo-focus-ring)!important;
  outline:none!important
}
html[data-nxo-theme="night"] .nxo-dev-action:hover,
html[data-nxo-theme="night"] .nxo-dev-action:focus-visible,
html[data-nxo-theme="night"] .nxo-dev-action:hover .nxo-dev-action-surface,
html[data-nxo-theme="night"] .nxo-dev-action:focus-visible .nxo-dev-action-surface{
  color:var(--nxo-interaction-contrast)!important;
  background:var(--nxo-interaction)!important;
  border-color:var(--nxo-interaction)!important;
  box-shadow:0 0 0 3px var(--nxo-focus-ring)!important;
  outline:none!important
}
html[data-nxo-theme] .nxo-dev-action:active{transform:translateY(0) scale(.99)!important}
/* Product icon replacement occupies the original icon slot. */
[data-nxo-dev-icon-slot="1"]{
  display:grid!important;place-items:center!important;
  background:transparent!important;color:transparent!important;
  line-height:0!important;overflow:visible!important
}
.nxo-dev-product-icon{
  display:block!important;width:100%!important;height:100%!important;
  max-width:72px!important;max-height:72px!important;min-width:34px!important;min-height:34px!important;
  object-fit:contain!important;object-position:center!important;margin:auto!important;
  filter:drop-shadow(0 6px 10px var(--nxo-shadow))
}
@media(max-width:760px){
  #nxo-dev-header{min-height:58px;padding:0 12px;gap:10px}
  .nxo-dev-brand{min-width:0}.nxo-dev-brand-copy small{display:none}
  .nxo-dev-nav{gap:10px;overflow:auto;scrollbar-width:none}
  .nxo-dev-nav::-webkit-scrollbar{display:none}
  .nxo-dev-nav-button{font-size:11px}
  .nxo-dev-mark{width:36px;height:36px;flex-basis:36px}
  .nxo-dev-mark img{width:29px;height:29px}
  .nxo-dev-product-icon{max-width:58px!important;max-height:58px!important}
}
`;
  document.head.appendChild(style)
}

function syncQuickTheme(){
  const current=theme();
  const image=document.querySelector('#nxo-dev-theme-row img');
  const value=document.querySelector('#nxo-dev-theme-row strong');
  if(image)image.src=iconUrl(current==='night'?'modo-oscuro':'modo-claro');
  if(value)value.textContent=current==='night'?'Oscuro':'Claro'
}

function ensureHeader(){
  let header=document.getElementById('nxo-dev-header');
  if(header)return header;

  // Remove the obsolete floating control from stage 0 v1.
  document.getElementById('nxo-dev-theme-toggle')?.remove();
  document.getElementById('nexoDevelopmentThemeToggle')?.remove();

  header=document.createElement('header');
  header.id='nxo-dev-header';
  header.innerHTML=
    '<button type="button" class="nxo-dev-brand" id="nxo-dev-brand-home" aria-label="Nexo Group · Mi espacio">'+
      '<span class="nxo-dev-mark"><img src="'+NEXO_LOGO+'" alt="Nexo Group"></span>'+
      '<span class="nxo-dev-brand-copy"><strong>Nexo Group</strong><small>Centro de desarrollo</small></span>'+
    '</button>'+
    '<nav class="nxo-dev-nav" aria-label="Navegación principal">'+
      '<button type="button" class="nxo-dev-nav-button" id="nxo-dev-back">← Volver</button>'+
      '<button type="button" class="nxo-dev-nav-button active" aria-current="page">Centro de desarrollo</button>'+
    '</nav>'+
    '<div class="nxo-dev-utils">'+
      '<div class="nxo-dev-quick-wrap">'+
        '<button type="button" class="nxo-dev-quick-button" id="nxo-dev-quick-button" aria-label="Ajustes rápidos" aria-expanded="false">'+
          '<img src="'+iconUrl('ajustes-rapidos')+'" alt="">'+
        '</button>'+
        '<div class="nxo-dev-quick-menu" id="nxo-dev-quick-menu">'+
          '<div class="nxo-dev-quick-title">Ajustes rápidos</div>'+
          '<button type="button" class="nxo-dev-quick-row" id="nxo-dev-theme-row">'+
            '<span class="nxo-dev-quick-label"><img alt=""><span>Apariencia</span></span><strong>Claro</strong>'+
          '</button>'+
        '</div>'+
      '</div>'+
    '</div>';

  document.body.prepend(header);

  const quickButton=header.querySelector('#nxo-dev-quick-button');
  const menu=header.querySelector('#nxo-dev-quick-menu');
  quickButton.addEventListener('click',event=>{
    event.stopPropagation();
    const open=menu.classList.toggle('open');
    quickButton.setAttribute('aria-expanded',open?'true':'false')
  });
  header.querySelector('#nxo-dev-theme-row').addEventListener('click',event=>{
    event.stopPropagation();
    if(window.NEXO_THEME_RUNTIME){
      window.NEXO_THEME_RUNTIME.toggleTheme({persist:true,notify:true})
    }
    menu.classList.remove('open');
    quickButton.setAttribute('aria-expanded','false');
    syncQuickTheme()
  });
  header.querySelector('#nxo-dev-back').addEventListener('click',goBack);
  header.querySelector('#nxo-dev-brand-home').addEventListener('click',goMySpace);
  document.addEventListener('click',event=>{
    if(!header.contains(event.target)){
      menu.classList.remove('open');
      quickButton.setAttribute('aria-expanded','false')
    }
  });
  syncQuickTheme();
  return header
}

function renameRecipeBooks(root){
  const scope=root||document.body;
  if(!scope)return;
  const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(node=>{
    const key=norm(node.nodeValue);
    if(key==='menus dinamicos'||key==='menu dinamico')node.nodeValue='Recetarios Dinámicos'
  })
}

function findToolTitles(){
  const root=document.getElementById('PAGES_CONTAINER')||document.body;
  if(!root)return[];
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const found=[],seen=new Set();
  while(walker.nextNode()){
    const node=walker.currentNode;
    const tool=toolForText(node.nodeValue);
    if(!tool)continue;
    let el=node.parentElement;
    while(el&&el!==root&&norm(el.textContent)!==norm(node.nodeValue))el=el.parentElement;
    el=el&&el!==root?el:node.parentElement;
    if(el&&!seen.has(el)){
      el.dataset.nxoDevToolTitle=tool.key;
      found.push(el);seen.add(el)
    }
  }
  return found
}

function closestCard(el){
  let node=el;
  const vw=Math.max(document.documentElement.clientWidth||0,window.innerWidth||0);
  const vh=Math.max(document.documentElement.clientHeight||0,window.innerHeight||0);
  for(let i=0;i<10&&node;i++,node=node.parentElement){
    if(!node.getBoundingClientRect)continue;
    const r=node.getBoundingClientRect();
    if(r.width<150||r.height<82)continue;
    if(r.width>vw*.95||r.height>vh*.82)continue;
    const text=norm(node.textContent);
    if(TOOL_DEFS.some(tool=>tool.names.some(name=>text.includes(name))))return node
  }
  return el.parentElement
}

function visualCandidateScore(el,titleRect,cardRect){
  if(!el||!el.getBoundingClientRect)return Infinity;
  if(el.closest('#nxo-dev-header'))return Infinity;
  const r=el.getBoundingClientRect();
  if(r.width<20||r.height<20||r.width>125||r.height>125)return Infinity;
  if(r.left<titleRect.left-190||r.left>titleRect.left+80)return Infinity;
  if(r.top>titleRect.bottom+75||r.bottom<titleRect.top-110)return Infinity;
  const cx=r.left+r.width/2,cy=r.top+r.height/2;
  const tx=Math.max(cardRect.left+24,titleRect.left-44);
  const ty=titleRect.top+Math.min(titleRect.height,38)/2;
  let score=Math.hypot(cx-tx,cy-ty);
  if(el.matches('img,svg'))score-=55;
  if(el.querySelector?.('img,svg'))score-=42;
  const text=String(el.textContent||'').trim();
  if(text&&text.length<=4&&!/[A-Za-z0-9]/.test(text))score-=34;
  if(/icon|image|media|graphic|symbol/i.test(String(el.className||'')+' '+String(el.getAttribute?.('data-testid')||'')))score-=24;
  return score
}

function isOfficialProductImage(img,tool){
  if(!img||!tool)return false;
  const expected=iconUrl(tool.icon);
  return img.classList.contains('nxo-dev-product-icon')&&
    (img.getAttribute('src')===expected||img.src===expected)
}

function genericVisualCandidates(card,titleEl){
  const titleRect=titleEl.getBoundingClientRect();
  const cardRect=card.getBoundingClientRect();
  return [...card.querySelectorAll('img,svg,span,div')]
    .filter(el=>{
      if(el.closest('#nxo-dev-header'))return false;
      if(el.classList?.contains('nxo-dev-product-icon'))return false;
      if(el.closest('[data-nxo-dev-icon-slot="1"]'))return false;
      if(el===titleEl||el.contains(titleEl))return false;
      const r=el.getBoundingClientRect();
      if(r.width<18||r.height<18||r.width>130||r.height>130)return false;
      if(r.right>titleRect.left+90)return false;
      if(r.top>titleRect.bottom+90||r.bottom<titleRect.top-120)return false;
      const text=String(el.textContent||'').trim();
      const hasGraphic=el.matches('img,svg')||!!el.querySelector?.('img,svg');
      const isSymbol=!!text&&text.length<=4&&!/[A-Za-z0-9]/.test(text);
      const named=/icon|image|media|graphic|symbol/i.test(String(el.className||'')+' '+String(el.getAttribute?.('data-testid')||''));
      return hasGraphic||isSymbol||named
    })
    .sort((a,b)=>visualCandidateScore(a,titleRect,cardRect)-visualCandidateScore(b,titleRect,cardRect))
}

function suppressExtraGenericIcons(card,titleEl,officialSlot){
  genericVisualCandidates(card,titleEl).forEach(el=>{
    if(el===officialSlot||officialSlot?.contains(el)||el.contains(officialSlot))return;
    // Never hide interactive controls; only visual-only legacy icon nodes.
    if(el.matches('button,a,[role="button"]')||el.closest('button,a,[role="button"]'))return;
    el.dataset.nxoDevLegacyIcon='1';
    el.style.setProperty('display','none','important')
  })
}

function installProductIcon(card,titleEl,tool){
  if(!card||!titleEl||!tool)return;
  card.dataset.nxoDevCard='1';
  card.dataset.nxoDevTool=tool.key;

  let slot=card.querySelector('[data-nxo-dev-icon-slot="1"]');
  let official=slot?.querySelector('.nxo-dev-product-icon')||null;

  // Stable path: keep the official icon once installed. Never delete/rebuild it.
  if(slot&&official){
    if(!isOfficialProductImage(official,tool))official.src=iconUrl(tool.icon);
    suppressExtraGenericIcons(card,titleEl,slot);
    return
  }

  const candidates=genericVisualCandidates(card,titleEl);
  slot=candidates[0]||null;

  if(slot?.matches('img,svg')&&slot.parentElement&&slot.parentElement!==card){
    const pr=slot.parentElement.getBoundingClientRect();
    if(pr.width<=135&&pr.height<=135)slot=slot.parentElement
  }

  if(!slot){
    slot=document.createElement('span');
    const parent=titleEl.parentElement||card;
    parent.insertBefore(slot,titleEl)
  }

  const r=slot.getBoundingClientRect();
  slot.dataset.nxoDevIconSlot='1';
  slot.removeAttribute('data-nxo-dev-legacy-icon');
  slot.style.removeProperty('display');
  slot.innerHTML='';
  slot.textContent='';
  slot.style.backgroundImage='none';
  if(r.width>0)slot.style.width=Math.max(38,Math.min(82,r.width))+'px';
  if(r.height>0)slot.style.height=Math.max(38,Math.min(82,r.height))+'px';

  official=document.createElement('img');
  official.className='nxo-dev-product-icon';
  official.src=iconUrl(tool.icon);
  official.alt='';
  official.setAttribute('aria-hidden','true');
  slot.appendChild(official);

  suppressExtraGenericIcons(card,titleEl,slot)
}

function sameRect(a,b,tolerance=5){
  return Math.abs(a.left-b.left)<=tolerance&&Math.abs(a.top-b.top)<=tolerance&&
    Math.abs(a.width-b.width)<=tolerance&&Math.abs(a.height-b.height)<=tolerance
}

function markActionSurface(action){
  if(!action||action.classList.contains('nxo-dev-action'))return;
  const r=action.getBoundingClientRect();
  if(r.width<40||r.height<22||r.height>68)return;
  if(r.width>Math.max(320,window.innerWidth*.46))return;

  action.classList.add('nxo-dev-action');

  const descendants=[...action.querySelectorAll('div,span')];
  const visual=descendants.find(el=>{
    const er=el.getBoundingClientRect();
    if(!sameRect(r,er,8))return false;
    const cs=getComputedStyle(el);
    return cs.backgroundColor!=='rgba(0, 0, 0, 0)'||
      cs.backgroundImage!=='none'||
      parseFloat(cs.borderTopWidth||'0')>0||
      parseFloat(cs.borderRadius||'0')>0
  });
  if(visual)visual.classList.add('nxo-dev-action-surface')
}

function applyCardActions(card,titleEl){
  [...card.querySelectorAll('button,a,[role="button"],[data-testid="buttonElement"],[data-testid="linkElement"]')].forEach(action=>{
    if(action.closest('#nxo-dev-header'))return;
    if(action===card||action.contains(titleEl))return;
    if(action.closest('[data-nxo-dev-icon-slot="1"]'))return;
    markActionSurface(action)
  })
}

function applyAllPageActions(){
  const root=document.getElementById('PAGES_CONTAINER')||document.body;
  if(!root)return;
  const selectors=[
    'button',
    'a[data-testid="linkElement"]',
    '[data-testid="buttonElement"]',
    '[role="button"]',
    '[class*="StylableButton"]'
  ].join(',');
  [...root.querySelectorAll(selectors)].forEach(action=>{
    if(action.closest('#nxo-dev-header'))return;
    const text=norm(action.textContent);
    if(!text)return;
    markActionSurface(action)
  })
}

function applyCards(){
  findToolTitles().forEach(title=>{
    const tool=TOOL_DEFS.find(t=>t.key===title.dataset.nxoDevToolTitle)||toolForText(title.textContent);
    const card=closestCard(title);
    if(!tool||!card)return;
    installProductIcon(card,title,tool);
    applyCardActions(card,title)
  });
  applyAllPageActions()
}

function refresh(){
  renameRecipeBooks(document.getElementById('PAGES_CONTAINER')||document.body);
  applyCards();
  syncQuickTheme()
}
function schedule(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(()=>{scheduled=false;refresh()})
}

async function start(){
  ensureStyle();
  await ensureThemeRuntime();
  await window.NEXO_THEME_RUNTIME?.ready;
  ensureHeader();
  refresh();
  window.addEventListener('nexo-theme-change',()=>{syncQuickTheme();schedule()});
  window.addEventListener('nexo-theme-ready',()=>{syncQuickTheme();schedule()});
  observer=new MutationObserver(schedule);
  const target=document.getElementById('PAGES_CONTAINER')||document.body;
  observer.observe(target,{subtree:true,childList:true,characterData:true})
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',start,{once:true})
}else{
  start()
}
})();