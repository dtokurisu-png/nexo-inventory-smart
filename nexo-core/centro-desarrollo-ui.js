(function(){
'use strict';

const VERSION='20261008-29';
const previousRuntime=window.__nexoDevelopmentCenterRuntime;
if(previousRuntime&&typeof previousRuntime.destroy==='function'){
  try{previousRuntime.destroy()}catch(_){}
}

const runtimeAbort=new AbortController();
const runtime={
  version:VERSION,
  destroy:null
};
window.__nexoDevelopmentCenterRuntime=runtime;
window.__nexoDevelopmentCenterStage0Version=VERSION;

const THEME_KEY='nexoTheme:v1';
const THEME_RUNTIME='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/theme-runtime.js?v=20261001-v3-1';
const ICON_BASE='https://dtokurisu-png.github.io/nexo-inventory-smart/assets/icons/nexo/';
const NEXO_LOGO='https://static.wixstatic.com/media/8b64a8_7bd85ca8e1854afc9ae91eab7457c405~mv2.png';
const TOOL_DEFS=[
  {key:'learning',icon:'desarrollo',title:'Nexo Learning Core',summary:'Aprendizaje, rutas, práctica y progreso personal.',names:['nexo learning core','learning core']},
  {key:'library',icon:'guia',title:'Biblioteca de engranaje',summary:'Recursos, conocimiento y materiales reutilizables de Nexo.',names:['biblioteca de engranaje']},
  {key:'inventory',icon:'productos',title:'Inventario Smart',summary:'Productos, materiales e inventario operativo del espacio de trabajo.',names:['inventario smart']},
  {key:'technical',icon:'ficha-tecnica',title:'Fichas Técnicas Dinámicas',summary:'Biblioteca y colecciones de fichas técnicas conectadas con Inventario Smart.',names:['fichas tecnicas dinamicas','dynamic technical sheets']},
  {key:'schedules',icon:'recordatorio',title:'Horarios',summary:'Jornadas y horarios semanales con carga desde imagen, análisis GPT y publicación.',names:['horarios','schedule','schedules']},
  {key:'work',icon:'panel',title:'Centro de Trabajo',summary:'Tareas, horarios, personal y operación colaborativa del espacio de trabajo.',names:['centro de trabajo','work center']},
  {key:'recipes',icon:'platos',title:'Recetarios Dinámicos',summary:'Organización y consulta de recetas y preparaciones operativas.',names:['recetarios dinamicos','menus dinamicos','menu dinamico','dynamic recipe books']}
];
let scheduled=false,observer=null;
let quickMenuOutsideHandler=null;

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
/* DEVELOPMENT CENTER · Canonical visual contract
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

/* Canonical owned Development Center shell. */
#PAGES_CONTAINER{
  display:none!important
}
#nxo-dev-app{
  position:relative!important;
  z-index:1!important;
  min-height:calc(100vh - 64px)!important;
  width:100%!important;
  padding:34px 24px 56px!important;
  box-sizing:border-box!important;
  color:var(--nxo-text-primary)!important;
  font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important
}
html[data-nxo-theme="day"] #nxo-dev-app{
  background:
    radial-gradient(circle at 3% 5%,rgba(47,79,147,.18),transparent 30%),
    radial-gradient(circle at 97% 9%,rgba(231,144,105,.20),transparent 29%),
    radial-gradient(circle at 79% 96%,rgba(36,107,54,.07),transparent 25%),
    linear-gradient(135deg,#f5f2ea 0%,var(--nxo-background) 50%,var(--nxo-background-alt) 100%)!important
}
html[data-nxo-theme="night"] #nxo-dev-app{
  background:
    radial-gradient(circle at 6% 8%,color-mix(in srgb,var(--nxo-accent) 14%,transparent),transparent 30%),
    radial-gradient(circle at 94% 92%,color-mix(in srgb,var(--nxo-accent) 10%,transparent),transparent 28%),
    linear-gradient(var(--nxo-background),var(--nxo-background))!important
}
.nxo-dev-owned-shell{
  width:min(1120px,100%);
  margin:0 auto
}
.nxo-dev-owned-hero{
  margin:0 0 22px
}
.nxo-dev-owned-eyebrow{
  margin:0 0 5px;
  font-size:11px;
  line-height:1.2;
  font-weight:800;
  letter-spacing:.11em;
  text-transform:uppercase;
  color:var(--nxo-accent)
}
.nxo-dev-owned-hero h1{
  margin:0 0 8px;
  font-size:clamp(28px,4vw,44px);
  line-height:1.05;
  color:var(--nxo-text-primary)
}
.nxo-dev-owned-hero p{
  max-width:760px;
  margin:0;
  font-size:14px;
  line-height:1.6;
  color:var(--nxo-text-secondary)
}
.nxo-dev-owned-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:14px;
  align-items:start
}
#nxo-dev-app [data-nxo-dev-card="1"]{
  min-height:168px;
  padding:16px!important
}
#nxo-dev-app .nxo-dev-owned-title{
  margin:0;
  font-size:18px;
  line-height:1.2
}
#nxo-dev-app .nxo-dev-owned-copy{
  margin:10px 0 14px!important;
  font-size:12px!important;
  line-height:1.55!important
}
#nxo-dev-app .nxo-dev-owned-action{
  margin-top:auto
}
@media(max-width:760px){
  #nxo-dev-app{padding:24px 14px 42px!important}
  .nxo-dev-owned-grid{grid-template-columns:1fr}
}

/* Text color contract for editor-native content. */
html[data-nxo-theme] #PAGES_CONTAINER [data-testid="richTextElement"],
html[data-nxo-theme] #PAGES_CONTAINER [data-testid="richTextElement"] *,
html[data-nxo-theme] #PAGES_CONTAINER .wixui-rich-text,
html[data-nxo-theme] #PAGES_CONTAINER .wixui-rich-text *,
html[data-nxo-theme] #PAGES_CONTAINER .wixui-text,
html[data-nxo-theme] #PAGES_CONTAINER h1,
html[data-nxo-theme] #PAGES_CONTAINER h2,
html[data-nxo-theme] #PAGES_CONTAINER h3,
html[data-nxo-theme] #PAGES_CONTAINER h4,
html[data-nxo-theme] #PAGES_CONTAINER h5,
html[data-nxo-theme] #PAGES_CONTAINER h6,
html[data-nxo-theme] #PAGES_CONTAINER strong{
  color:var(--nxo-text-primary)!important
}
html[data-nxo-theme] #PAGES_CONTAINER p,
html[data-nxo-theme] #PAGES_CONTAINER small{
  color:var(--nxo-text-secondary)!important
}

/* Tool cards use the same semantic glass contract as Mi Espacio. */
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"]{
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
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"]::before{
  content:"";position:absolute;inset:0 auto auto 0;width:100%;height:2px;
  background:linear-gradient(90deg,var(--nxo-accent),var(--nxo-interaction),var(--nxo-positive));
  opacity:.66;pointer-events:none
}
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"]:hover,
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"]:focus-within{
  transform:translateY(-3px)!important;
  border-color:var(--nxo-interaction)!important;
  background:var(--nxo-surface-glass-hover)!important;
  box-shadow:0 18px 38px var(--nxo-shadow),0 0 0 2px var(--nxo-focus-ring)!important
}
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"] h1,
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"] h2,
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"] h3,
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"] h4,
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"] strong{color:var(--nxo-text-primary)!important}
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"] p,
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"] small{color:var(--nxo-text-muted)!important}

/* Real CTA controls inside tool cards. The runtime marks the actual Wix surface. */
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) .nxo-dev-action,
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) .nxo-dev-action-surface{
  color:var(--nxo-header-text)!important;
  background:var(--nxo-header-background)!important;
  border-color:var(--nxo-header-border)!important;
  border-style:solid!important;
  border-width:1px!important;
  border-radius:10px!important;
  box-shadow:none!important;
  transition:background .16s ease,border-color .16s ease,color .16s ease,box-shadow .16s ease,transform .16s ease!important
}
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) .nxo-dev-action *,
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) .nxo-dev-action-surface *{
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
/* Stage 1 preparation · compact marketplace geometry */
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"]{
  width:75%!important;
  max-width:75%!important;
  box-sizing:border-box!important;
  margin-right:auto!important;
  padding:12px 14px!important
}
html[data-nxo-theme] [data-nxo-dev-card="1"] .nxo-dev-title-row{
  display:flex!important;
  align-items:center!important;
  justify-content:flex-start!important;
  gap:10px!important;
  width:100%!important;
  margin:0 0 8px!important;
  padding:0!important
}
html[data-nxo-theme] [data-nxo-dev-card="1"] .nxo-dev-title-row [data-nxo-dev-icon-slot="1"]{
  flex:0 0 46px!important;
  width:46px!important;
  height:46px!important;
  min-width:46px!important;
  min-height:46px!important;
  margin:0!important
}
html[data-nxo-theme] [data-nxo-dev-card="1"] .nxo-dev-title-row .nxo-dev-product-icon{
  width:46px!important;
  height:46px!important;
  min-width:46px!important;
  min-height:46px!important;
  max-width:46px!important;
  max-height:46px!important;
  margin:0!important
}
html[data-nxo-theme] [data-nxo-dev-card="1"] .nxo-dev-title-row [data-nxo-dev-tool-title]{
  flex:1 1 auto!important;
  min-width:0!important;
  margin:0!important;
  padding:0!important
}
@media(max-width:760px){
  html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"]{
    width:100%!important;
    max-width:100%!important;
    padding:11px 12px!important
  }
  html[data-nxo-theme] [data-nxo-dev-card="1"] .nxo-dev-title-row [data-nxo-dev-icon-slot="1"],
  html[data-nxo-theme] [data-nxo-dev-card="1"] .nxo-dev-title-row .nxo-dev-product-icon{
    flex-basis:42px!important;
    width:42px!important;
    height:42px!important;
    min-width:42px!important;
    min-height:42px!important;
    max-width:42px!important;
    max-height:42px!important
  }
}

/* Stage 1 preparation · compact marketplace cards */
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"]{
  min-height:0!important;
  padding-top:14px!important;
  padding-bottom:14px!important
}
html[data-nxo-theme] [data-nxo-dev-card="1"] [data-nxo-dev-description="1"],
html[data-nxo-theme] [data-nxo-dev-card="1"] [data-nxo-dev-tag="1"]{
  display:none!important
}
html[data-nxo-theme] [data-nxo-dev-card="1"] [data-nxo-dev-tool-title]{
  margin-top:4px!important;
  margin-bottom:8px!important
}
html[data-nxo-theme] [data-nxo-dev-card="1"] .nxo-dev-action{
  margin-top:8px!important
}

/* Marketplace preview rail */
#nxo-dev-preview{
  position:fixed!important;
  top:64px!important;
  right:0!important;
  bottom:0!important;
  left:auto!important;
  z-index:2147483600!important;
  display:block!important;
  visibility:visible!important;
  width:min(360px,88vw)!important;
  box-sizing:border-box!important;
  padding:18px!important;
  color:var(--nxo-text-primary)!important;
  background:var(--nxo-surface-raised)!important;
  border-left:1px solid var(--nxo-border)!important;
  box-shadow:-18px 0 44px var(--nxo-shadow)!important;
  -webkit-backdrop-filter:blur(18px) saturate(118%)!important;
  backdrop-filter:blur(18px) saturate(118%)!important;
  transform:translate3d(102%,0,0)!important;
  opacity:.99!important;
  pointer-events:none!important;
  transition:transform .24s ease!important;
  font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important
}
#nxo-dev-preview.open{
  transform:translate3d(0,0,0)!important;
  pointer-events:auto!important
}
#nxo-dev-preview-handle{
  position:fixed!important;
  right:0!important;
  top:50%!important;
  z-index:2147483599!important;
  width:28px!important;
  height:72px!important;
  display:grid!important;
  place-items:center!important;
  transform:translateY(-50%)!important;
  border:1px solid var(--nxo-header-border)!important;
  border-right:0!important;
  border-radius:12px 0 0 12px!important;
  color:var(--nxo-header-text)!important;
  background:var(--nxo-header-background)!important;
  box-shadow:-8px 0 24px var(--nxo-shadow)!important;
  cursor:pointer!important;
  font:900 20px/1 Inter,system-ui,sans-serif!important;
  transition:background .16s ease,color .16s ease,transform .16s ease!important
}
#nxo-dev-preview-handle:hover,
#nxo-dev-preview-handle:focus-visible{
  outline:none!important;
  color:var(--nxo-interaction-contrast)!important;
  background:var(--nxo-interaction)!important
}
#nxo-dev-preview.open + #nxo-dev-preview-handle{
  transform:translateY(-50%) translateX(100%)!important
}
.nxo-dev-preview-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-bottom:18px
}
.nxo-dev-preview-eyebrow{
  color:var(--nxo-text-muted);
  font-size:9px;
  font-weight:850;
  letter-spacing:.08em;
  text-transform:uppercase
}
.nxo-dev-preview-close{
  appearance:none;
  width:34px;height:34px;
  display:grid;place-items:center;
  border:1px solid var(--nxo-border);
  border-radius:10px;
  color:var(--nxo-button-secondary-text);
  background:var(--nxo-button-secondary-bg);
  cursor:pointer
}
.nxo-dev-preview-close:hover,.nxo-dev-preview-close:focus-visible{
  outline:none;
  color:var(--nxo-interaction-contrast);
  background:var(--nxo-interaction);
  border-color:var(--nxo-interaction)
}
.nxo-dev-preview-identity{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:16px
}
.nxo-dev-preview-icon{
  width:54px;height:54px;flex:0 0 54px;
  object-fit:contain;
  filter:drop-shadow(0 6px 10px var(--nxo-shadow))
}
.nxo-dev-preview-title{
  margin:0;
  color:var(--nxo-text-primary);
  font-size:18px;
  line-height:1.2
}
.nxo-dev-preview-copy{
  margin:0;
  color:var(--nxo-text-secondary);
  font-size:13px;
  line-height:1.6
}
[data-nxo-dev-card="1"].nxo-dev-preview-source{
  border-color:var(--nxo-interaction)!important;
  box-shadow:0 18px 38px var(--nxo-shadow),0 0 0 2px var(--nxo-focus-ring)!important
}
@media(max-width:760px){
  #nxo-dev-preview{top:58px!important;width:min(340px,92vw)!important;padding:16px!important}
  #nxo-dev-preview-handle{height:62px!important;width:26px!important}
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

/* White silhouette halo for official icons placed on Nexo blue surfaces. */
html[data-nxo-theme="day"] #nxo-dev-header .nxo-dev-quick-button img,
html[data-nxo-theme="day"] .nxo-dev-action img,
html[data-nxo-theme="day"] .nxo-dev-action-surface img{
  filter:
    drop-shadow(1px 0 0 rgba(255,255,255,.96))
    drop-shadow(-1px 0 0 rgba(255,255,255,.96))
    drop-shadow(0 1px 0 rgba(255,255,255,.96))
    drop-shadow(0 -1px 0 rgba(255,255,255,.96))
    drop-shadow(0 0 4px rgba(255,255,255,.78))!important
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
  quickMenuOutsideHandler=event=>{
    if(!header.contains(event.target)){
      menu.classList.remove('open');
      quickButton.setAttribute('aria-expanded','false')
    }
  };
  document.addEventListener('click',quickMenuOutsideHandler,{signal:runtimeAbort.signal});
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
  const established=el?.closest?.('[data-nxo-dev-card="1"]');
  if(established)return established;
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

function arrangeCardTitleRow(card,titleEl){
  if(!card||!titleEl)return;
  const slot=card.querySelector('[data-nxo-dev-icon-slot="1"]');
  if(!slot)return;

  const rows=[...card.querySelectorAll('.nxo-dev-title-row')];
  let row=titleEl.closest('.nxo-dev-title-row')||rows[0]||null;

  if(!row){
    row=document.createElement('div');
    row.className='nxo-dev-title-row';
    titleEl.parentElement?.insertBefore(row,titleEl)
  }

  // Collapse any stale duplicate rows left by a previous Wix render.
  rows.forEach(extra=>{
    if(extra===row)return;
    while(extra.firstChild)row.appendChild(extra.firstChild);
    extra.remove()
  });

  if(slot.parentElement!==row)row.insertBefore(slot,row.firstChild||null);
  if(titleEl.parentElement!==row)row.appendChild(titleEl);

  // Canonical order is always icon -> title.
  if(row.firstElementChild!==slot)row.insertBefore(slot,row.firstElementChild||null)
}

function hideCardMetadata(card,titleEl){
  if(!card||!titleEl)return;
  const titleKey=norm(titleEl.textContent);
  const actionWords=new Set([
    'abrir herramienta','open tool','ver caracteristicas','view features',
    'aun no disponible','not available yet','proximamente','coming soon'
  ]);
  const tagWords=[
    /^herramienta\b/,
    /^tool\b/,
    /^operativa\b/,
    /^operational\b/,
    /^gratis$/,
    /^free$/,
    /^personal$/,
    /^workspace$/,
    /^aprendizaje$/,
    /^learning core$/,
    /^learning$/,
    /^knowledge$/,
    /^operations?$/,
    /^operaciones$/
  ];

  const nodes=[...card.querySelectorAll('p,small,span,div')];
  nodes.forEach(el=>{
    if(el===titleEl||el.contains(titleEl)||titleEl.contains(el))return;
    if(el.closest('button,a,[role="button"]'))return;
    if(el.closest('[data-nxo-dev-icon-slot="1"]'))return;

    const text=String(el.textContent||'').replace(/\s+/g,' ').trim();
    const key=norm(text);
    if(!key||key===titleKey)return;
    if(actionWords.has(key))return;

    const childText=[...el.children].map(ch=>String(ch.textContent||'').trim()).filter(Boolean).join(' ');
    if(el.children.length&&norm(childText)!==key)return;

    if(tagWords.some(re=>re.test(key))){
      el.dataset.nxoDevTag='1';
      return
    }

    if(text.length>=32){
      el.dataset.nxoDevDescription='1'
    }
  })
}

function setActionCopy(action){
  if(!action)return;
  const key=norm(action.textContent);
  const featureKeys=new Set([
    'ver caracteristicas',
    'view features'
  ]);
  const openKeys=new Set([
    'abrir herramienta',
    'open tool',
    'abrir',
    'open'
  ]);

  if(featureKeys.has(key)){
    action.dataset.nxoDevFeatureCta='1';
    return
  }
  if(!openKeys.has(key))return;

  const walker=document.createTreeWalker(action,NodeFilter.SHOW_TEXT);
  const textNodes=[];
  while(walker.nextNode())textNodes.push(walker.currentNode);
  const target=textNodes.find(n=>String(n.nodeValue||'').trim())||null;
  if(target)target.nodeValue='Ver características';
  else action.textContent='Ver características';

  action.dataset.nxoDevFeatureCta='1'
}

let previewCloseTimer=null;
let previewPinned=false;

function toolForCard(card){
  if(!card)return null;
  return TOOL_DEFS.find(tool=>tool.key===card.dataset.nxoDevTool)||null
}
function ensurePreviewPanel(){
  let panel=document.getElementById('nxo-dev-preview');
  let handle=document.getElementById('nxo-dev-preview-handle');

  if(!panel){
    panel=document.createElement('aside');
    panel.id='nxo-dev-preview';
    panel.setAttribute('aria-hidden','true');
    panel.innerHTML=
      '<div class="nxo-dev-preview-head">'+
        '<div class="nxo-dev-preview-eyebrow">Resumen de la herramienta</div>'+
        '<button type="button" class="nxo-dev-preview-close" aria-label="Cerrar">×</button>'+
      '</div>'+
      '<div class="nxo-dev-preview-identity">'+
        '<img class="nxo-dev-preview-icon" alt="">'+
        '<h3 class="nxo-dev-preview-title">Selecciona una herramienta</h3>'+
      '</div>'+
      '<p class="nxo-dev-preview-copy">Pasa el cursor sobre una herramienta para ver un resumen rápido.</p>';
    document.body.appendChild(panel);

    panel.querySelector('.nxo-dev-preview-close')?.addEventListener('click',()=>{
      previewPinned=false;
      closePreview(true)
    });
    panel.addEventListener('pointerenter',()=>clearTimeout(previewCloseTimer));
    panel.addEventListener('pointerleave',()=>{
      if(!previewPinned)schedulePreviewClose()
    })
  }

  if(!handle){
    handle=document.createElement('button');
    handle.id='nxo-dev-preview-handle';
    handle.type='button';
    handle.setAttribute('aria-label','Abrir resumen de herramienta');
    handle.textContent='‹';
    document.body.appendChild(handle);
    handle.addEventListener('click',()=>{
      const current=TOOL_DEFS.find(tool=>tool.key===panel.dataset.toolKey)||null;
      if(panel.classList.contains('open')){
        previewPinned=false;
        closePreview(true);
        return
      }
      if(current){
        previewPinned=true;
        openPreview(current,document.querySelector('[data-nxo-dev-tool="'+CSS.escape(current.key)+'"]'),{pinned:true})
      }else{
        panel.classList.add('open');
        panel.setAttribute('aria-hidden','false')
      }
    })
  }

  return panel
}

function openPreview(tool,card,{pinned=false}={}){
  if(!tool)return;
  clearTimeout(previewCloseTimer);
  previewPinned=pinned===true;

  const panel=ensurePreviewPanel();
  panel.querySelector('.nxo-dev-preview-icon').src=iconUrl(tool.icon);
  panel.querySelector('.nxo-dev-preview-title').textContent=tool.title;
  panel.querySelector('.nxo-dev-preview-copy').textContent=tool.summary;
  panel.dataset.toolKey=tool.key;
  panel.classList.add('open');
  panel.setAttribute('aria-hidden','false');

  document.querySelectorAll('[data-nxo-dev-card="1"].nxo-dev-preview-source')
    .forEach(el=>el.classList.remove('nxo-dev-preview-source'));
  card?.classList.add('nxo-dev-preview-source')
}
function closePreview(force=false){
  if(previewPinned&&!force)return;
  const panel=document.getElementById('nxo-dev-preview');
  if(panel){
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden','true')
  }
  document.querySelectorAll('[data-nxo-dev-card="1"].nxo-dev-preview-source')
    .forEach(el=>el.classList.remove('nxo-dev-preview-source'))
}
function schedulePreviewClose(){
  clearTimeout(previewCloseTimer);
  previewCloseTimer=setTimeout(()=>closePreview(false),150)
}
function bindCardPreview(card,tool){
  if(!card||!tool)return;
  card.dataset.nxoDevTool=tool.key
}

function bindPreviewDelegation(){
  if(window.__nexoDevPreviewOverHandler){
    document.removeEventListener('pointerover',window.__nexoDevPreviewOverHandler,true)
  }
  if(window.__nexoDevPreviewOutHandler){
    document.removeEventListener('pointerout',window.__nexoDevPreviewOutHandler,true)
  }

  window.__nexoDevPreviewOverHandler=function(event){
    const card=event.target?.closest?.('[data-nxo-dev-card="1"]');
    if(!card)return;
    if(event.relatedTarget&&card.contains(event.relatedTarget))return;
    const tool=toolForCard(card);
    if(!tool)return;
    previewPinned=false;
    openPreview(tool,card,{pinned:false})
  };

  window.__nexoDevPreviewOutHandler=function(event){
    const card=event.target?.closest?.('[data-nxo-dev-card="1"]');
    if(!card)return;
    if(event.relatedTarget&&card.contains(event.relatedTarget))return;
    const next=event.relatedTarget;
    if(next?.closest?.('#nxo-dev-preview,#nxo-dev-preview-handle'))return;
    if(!previewPinned)schedulePreviewClose()
  };

  document.addEventListener('pointerover',window.__nexoDevPreviewOverHandler,true);
  document.addEventListener('pointerout',window.__nexoDevPreviewOutHandler,true)
}

function bindFeatureInterception(){
  if(window.__nexoDevFeatureClickHandler){
    document.removeEventListener('click',window.__nexoDevFeatureClickHandler,true)
  }
  if(window.__nexoDevFeatureKeyHandler){
    document.removeEventListener('keydown',window.__nexoDevFeatureKeyHandler)
  }

  window.__nexoDevFeatureClickHandler=function(event){
    const card=event.target?.closest?.('[data-nxo-dev-card="1"]');
    if(!card)return;
    if(event.target?.closest?.('#nxo-dev-header,#nxo-dev-preview'))return;

    const tool=toolForCard(card);
    if(!tool)return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openPreview(tool,card,{pinned:true})
  };

  window.__nexoDevFeatureKeyHandler=function(event){
    if(event.key==='Escape'){
      previewPinned=false;
      closePreview(true)
    }
  };

  document.addEventListener('click',window.__nexoDevFeatureClickHandler,true);
  document.addEventListener('keydown',window.__nexoDevFeatureKeyHandler)
}

function applyCardActions(card,titleEl){
  [...card.querySelectorAll('button,a,[role="button"],[data-testid="buttonElement"],[data-testid="linkElement"]')].forEach(action=>{
    if(action.closest('#nxo-dev-header'))return;
    if(action===card||action.contains(titleEl))return;
    if(action.closest('[data-nxo-dev-icon-slot="1"]'))return;
    setActionCopy(action);
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
    setActionCopy(action);
    markActionSurface(action)
  })
}

function applyCards(){
  findToolTitles().forEach(title=>{
    const tool=TOOL_DEFS.find(t=>t.key===title.dataset.nxoDevToolTitle)||toolForText(title.textContent);
    const card=closestCard(title);
    if(!tool||!card)return;
    installProductIcon(card,title,tool);
    arrangeCardTitleRow(card,title);
    hideCardMetadata(card,title);
    applyCardActions(card,title);
    bindCardPreview(card,tool)
  });
  applyAllPageActions()
}

function ensureDevelopmentApp(){
  let app=document.getElementById('nxo-dev-app');
  if(app)return app;

  app=document.createElement('main');
  app.id='nxo-dev-app';
  app.innerHTML=
    '<div class="nxo-dev-owned-shell">'+
      '<section class="nxo-dev-owned-hero">'+
        '<div class="nxo-dev-owned-eyebrow">Herramientas de desarrollo</div>'+
        '<h1>Centro de desarrollo</h1>'+
        '<p>Herramientas operativas, de aprendizaje y desarrollo conectadas al ecosistema Nexo.</p>'+
      '</section>'+
      '<section class="nxo-dev-owned-grid" id="nxo-dev-owned-grid"></section>'+
    '</div>';

  const grid=app.querySelector('#nxo-dev-owned-grid');

  TOOL_DEFS.forEach(tool=>{
    const card=document.createElement('article');
    card.dataset.nxoDevCard='1';
    card.dataset.nxoDevTool=tool.key;
    card.innerHTML=
      '<div class="nxo-dev-title-row">'+
        '<span class="nxo-dev-product-icon" data-nxo-dev-icon-slot="1"><img src="'+iconUrl(tool.icon)+'" alt=""></span>'+
        '<h2 class="nxo-dev-owned-title">'+tool.title+'</h2>'+
      '</div>'+
      '<p class="nxo-dev-owned-copy">'+tool.summary+'</p>'+
      '<button type="button" class="nxo-dev-action nxo-dev-action-surface nxo-dev-owned-action">Ver características</button>';
    grid.appendChild(card)
  });

  const header=document.getElementById('nxo-dev-header');
  if(header&&header.parentElement){
    header.insertAdjacentElement('afterend',app)
  }else{
    document.body.prepend(app)
  }

  return app
}

function refresh(){
  ensureDevelopmentApp();
  syncQuickTheme()
}
function schedule(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(()=>{scheduled=false;refresh()})
}

function destroy(){
  try{observer?.disconnect()}catch(_){}
  observer=null;
  scheduled=false;
  clearTimeout(previewCloseTimer);

  try{runtimeAbort.abort()}catch(_){}

  if(window.__nexoDevPreviewOverHandler){
    document.removeEventListener('pointerover',window.__nexoDevPreviewOverHandler,true);
    window.__nexoDevPreviewOverHandler=null
  }
  if(window.__nexoDevPreviewOutHandler){
    document.removeEventListener('pointerout',window.__nexoDevPreviewOutHandler,true);
    window.__nexoDevPreviewOutHandler=null
  }
  if(window.__nexoDevFeatureClickHandler){
    document.removeEventListener('click',window.__nexoDevFeatureClickHandler,true);
    window.__nexoDevFeatureClickHandler=null
  }
  if(window.__nexoDevFeatureKeyHandler){
    document.removeEventListener('keydown',window.__nexoDevFeatureKeyHandler);
    window.__nexoDevFeatureKeyHandler=null
  }

  [
    'nxo-dev-center-css',
    'nxo-dev-header',
    'nxo-dev-preview',
    'nxo-dev-preview-handle',
    'nxo-dev-app'
  ].forEach(id=>document.getElementById(id)?.remove());

  if(window.__nexoDevelopmentCenterRuntime===runtime){
    delete window.__nexoDevelopmentCenterRuntime
  }
  if(window.__nexoDevelopmentCenterStage0Version===VERSION){
    window.__nexoDevelopmentCenterStage0Version=''
  }
}

runtime.destroy=destroy;

async function start(){
  if(window.__nexoDevelopmentCenterRuntime!==runtime)return;
  ensureStyle();
  await ensureThemeRuntime();
  if(window.__nexoDevelopmentCenterRuntime!==runtime)return;
  await window.NEXO_THEME_RUNTIME?.ready;
  if(window.__nexoDevelopmentCenterRuntime!==runtime)return;

  ensureHeader();
  ensureDevelopmentApp();
  ensurePreviewPanel();
  bindPreviewDelegation();
  bindFeatureInterception();
  refresh();

  window.addEventListener('nexo-theme-change',()=>{syncQuickTheme();schedule()},{signal:runtimeAbort.signal});
  window.addEventListener('nexo-theme-ready',()=>{syncQuickTheme();schedule()},{signal:runtimeAbort.signal});

  observer=new MutationObserver(schedule);
  const target=document.getElementById('nxo-dev-app')||document.body;
  observer.observe(target,{subtree:true,childList:true,characterData:true})
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',start,{once:true,signal:runtimeAbort.signal})
}else{
  start()
}
})();