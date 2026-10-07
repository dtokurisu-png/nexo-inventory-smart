(function(){
'use strict';
if(window.__nexoDevelopmentCenterStage0V2)return;
window.__nexoDevelopmentCenterStage0V2=true;

const THEME_KEY='nexoTheme:v1';
const THEME_RUNTIME='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/theme-runtime.js?v=20261001-v3-1';
const ICON_BASE='https://dtokurisu-png.github.io/nexo-inventory-smart/assets/icons/nexo/';
const NEXO_LOGO='https://static.wixstatic.com/media/8b64a8_7bd85ca8e1854afc9ae91eab7457c405~mv2.png';
const TOOL_DEFS=[
  {key:'learning',names:['nexo learning core','learning core'],image:'https://static.wixstatic.com/media/8b64a8_000c4b28e51a4cbb9b6ead5df43c77d2~mv2.png'},
  {key:'library',names:['biblioteca de engranaje'],image:'https://static.wixstatic.com/media/8b64a8_63b78c3f3c1c49a8a63d7ac60ccfe80f~mv2.png'},
  {key:'inventory',names:['inventario smart'],image:'https://static.wixstatic.com/media/8b64a8_547e0719f4a4416692df3ca8f62708e2~mv2.png'},
  {key:'recipes',names:['recetarios dinamicos','menus dinamicos','menu dinamico'],image:'https://static.wixstatic.com/media/8b64a8_748210fdcc814399a2d02bc1695b857b~mv2.png'}
];
const TOOL_URLS=new Set(TOOL_DEFS.map(x=>x.image));
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
    linear-gradient(135deg,var(--nxo-background),var(--nxo-background-alt))!important
}
html[data-nxo-theme] #PAGES_CONTAINER [data-testid="section-container"],
html[data-nxo-theme] #PAGES_CONTAINER .wixui-section{
  background-color:transparent!important
}
html[data-nxo-theme] #PAGES_CONTAINER [data-testid="richTextElement"],
html[data-nxo-theme] #PAGES_CONTAINER [data-testid="richTextElement"] *,
html[data-nxo-theme] #PAGES_CONTAINER .wixui-rich-text,
html[data-nxo-theme] #PAGES_CONTAINER .wixui-rich-text *,
html[data-nxo-theme] #PAGES_CONTAINER .wixui-text{
  color:var(--nxo-text-primary)!important
}
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

/* Canonical generic action logic: semantic button tokens -> interaction hover. */
html[data-nxo-theme] #PAGES_CONTAINER .wixui-button,
html[data-nxo-theme] #PAGES_CONTAINER button,
html[data-nxo-theme] #PAGES_CONTAINER [role="button"]{
  color:var(--nxo-button-secondary-text)!important;
  background:var(--nxo-button-secondary-bg)!important;
  border-color:var(--nxo-button-secondary-border)!important;
  transition:background .16s ease,border-color .16s ease,color .16s ease,box-shadow .16s ease,transform .16s ease!important
}
html[data-nxo-theme="day"] #PAGES_CONTAINER .wixui-button:hover,
html[data-nxo-theme="day"] #PAGES_CONTAINER .wixui-button:focus-visible,
html[data-nxo-theme="day"] #PAGES_CONTAINER button:hover,
html[data-nxo-theme="day"] #PAGES_CONTAINER button:focus-visible,
html[data-nxo-theme="day"] #PAGES_CONTAINER [role="button"]:hover,
html[data-nxo-theme="day"] #PAGES_CONTAINER [role="button"]:focus-visible{
  color:var(--nxo-interaction-contrast)!important;
  background:var(--nxo-interaction)!important;
  border-color:var(--nxo-border-strong)!important;
  box-shadow:0 0 0 3px var(--nxo-focus-ring)!important
}
html[data-nxo-theme="night"] #PAGES_CONTAINER .wixui-button:hover,
html[data-nxo-theme="night"] #PAGES_CONTAINER .wixui-button:focus-visible,
html[data-nxo-theme="night"] #PAGES_CONTAINER button:hover,
html[data-nxo-theme="night"] #PAGES_CONTAINER button:focus-visible,
html[data-nxo-theme="night"] #PAGES_CONTAINER [role="button"]:hover,
html[data-nxo-theme="night"] #PAGES_CONTAINER [role="button"]:focus-visible{
  color:var(--nxo-text-primary)!important;
  background:var(--nxo-accent-soft)!important;
  border-color:var(--nxo-interaction)!important;
  box-shadow:0 0 0 3px var(--nxo-focus-ring)!important
}

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
  return [...document.querySelectorAll('#PAGES_CONTAINER h1,#PAGES_CONTAINER h2,#PAGES_CONTAINER h3,#PAGES_CONTAINER h4,#PAGES_CONTAINER h5,#PAGES_CONTAINER h6,#PAGES_CONTAINER p,#PAGES_CONTAINER span,#PAGES_CONTAINER a,#PAGES_CONTAINER button,#PAGES_CONTAINER div')]
    .filter(el=>el.children.length===0&&toolForText(el.textContent))
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
  const r=el.getBoundingClientRect();
  if(r.width<20||r.height<20||r.width>125||r.height>125)return Infinity;
  if(r.left<titleRect.left-180||r.left>titleRect.left+100)return Infinity;
  if(r.top>titleRect.bottom+70||r.bottom<titleRect.top-100)return Infinity;
  const cx=r.left+r.width/2,cy=r.top+r.height/2;
  const tx=Math.max(cardRect.left+26,titleRect.left-42),ty=titleRect.top+Math.min(titleRect.height,38)/2;
  let score=Math.hypot(cx-tx,cy-ty);
  if(el.matches('img,svg'))score-=40;
  if(el.querySelector?.('img,svg'))score-=30;
  if(/icon|image|media|graphic/i.test(String(el.className||'')+' '+String(el.getAttribute?.('data-testid')||'')))score-=20;
  return score
}

function installProductIcon(card,titleEl,tool){
  if(!card||!titleEl||!tool)return;
  card.dataset.nxoDevCard='1';
  card.dataset.nxoDevTool=tool.key;

  // Remove every product artwork previously appended to the wrong location.
  [...card.querySelectorAll('img')].forEach(img=>{
    if(TOOL_URLS.has(img.src)||img.classList.contains('nxo-dev-product-icon')){
      const parent=img.parentElement;
      img.remove();
      if(parent?.dataset?.nxoDevIconSlot==='1')parent.removeAttribute('data-nxo-dev-icon-slot')
    }
  });

  const titleRect=titleEl.getBoundingClientRect();
  const cardRect=card.getBoundingClientRect();
  const descendants=[...card.querySelectorAll('img,svg,span,div')].filter(el=>!el.contains(titleEl)&&el!==titleEl);
  let slot=descendants
    .map(el=>({el,score:visualCandidateScore(el,titleRect,cardRect)}))
    .filter(x=>Number.isFinite(x.score))
    .sort((a,b)=>a.score-b.score)[0]?.el||null;

  if(!slot){
    slot=document.createElement('span');
    const parent=titleEl.parentElement||card;
    parent.insertBefore(slot,titleEl)
  }

  // If the best candidate is the graphic itself, use its parent as the original slot.
  if(slot.matches('img,svg')&&slot.parentElement&&slot.parentElement!==card){
    const pr=slot.parentElement.getBoundingClientRect();
    if(pr.width<=130&&pr.height<=130)slot=slot.parentElement
  }

  const r=slot.getBoundingClientRect();
  slot.innerHTML='';
  slot.textContent='';
  slot.style.backgroundImage='none';
  slot.dataset.nxoDevIconSlot='1';
  if(r.width>0)slot.style.width=Math.max(38,Math.min(82,r.width))+'px';
  if(r.height>0)slot.style.height=Math.max(38,Math.min(82,r.height))+'px';

  const img=document.createElement('img');
  img.className='nxo-dev-product-icon';
  img.src=tool.image;
  img.alt='';
  img.setAttribute('aria-hidden','true');
  slot.appendChild(img)
}

function applyCards(){
  findToolTitles().forEach(title=>{
    const tool=toolForText(title.textContent);
    const card=closestCard(title);
    if(tool&&card)installProductIcon(card,title,tool)
  })
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