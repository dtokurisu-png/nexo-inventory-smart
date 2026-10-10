(function(){
'use strict';

const VERSION='20261009-49';
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
  {key:'learning',cmsKey:'learning-core',icon:'desarrollo',title:'Nexo Learning Core',summary:'Aprendizaje, rutas, práctica y progreso personal.',names:['nexo learning core','learning core']},
  {key:'library',cmsKey:'gear-library',icon:'guia',title:'Biblioteca de engranaje',summary:'Recursos, conocimiento y materiales reutilizables de Nexo.',names:['biblioteca de engranaje']},
  {key:'inventory',cmsKey:'inventory-smart',icon:'productos',title:'Inventario Smart',summary:'Productos, materiales e inventario operativo del espacio de trabajo.',names:['inventario smart']},
  {key:'technical',cmsKey:'dynamic-specs',icon:'ficha-tecnica',title:'Fichas Técnicas Dinámicas',summary:'Biblioteca y colecciones de fichas técnicas conectadas con Inventario Smart.',names:['fichas tecnicas dinamicas','dynamic technical sheets']},
  {key:'schedules',cmsKey:'schedules',icon:'recordatorio',title:'Horarios',summary:'Jornadas y horarios semanales con carga desde imagen, análisis GPT y publicación.',names:['horarios','schedule','schedules']},
  {key:'work',cmsKey:'work-center',icon:'panel',title:'Centro de Trabajo',summary:'Tareas, horarios, personal y operación colaborativa del espacio de trabajo.',status:'planned',names:['centro de trabajo','work center']},
  {key:'recipes',cmsKey:'dynamic-specs',icon:'platos',title:'Recetarios Dinámicos',summary:'Organización y consulta de recetas y preparaciones operativas dentro del motor canónico de Fichas Técnicas Dinámicas.',names:['recetarios dinamicos','menus dinamicos','menu dinamico','dynamic recipe books']},
  {key:'tasks',cmsKey:'task-lists',icon:'checklist',title:'Listas de tareas',summary:'Proyecto próximo para crear y reutilizar listas de tareas, checklists y prep lists en uso personal o Workspace.',status:'planned',names:['listas de tareas','checklist','prep list','prep lists']},
  {key:'multichannel-notifications',cmsKey:'multichannel-notifications',icon:'notificaciones',title:'Notificaciones multicanal',summary:'Proyecto próximo para centralizar avisos y entregarlos por varios canales desde una sola lógica de notificación.',status:'planned',names:['notificaciones multicanal','multichannel notifications']},
  {key:'numa',cmsKey:'numa-assistant',icon:'ayuda',title:'Numa',summary:'Asistente opcional de Mi Espacio y Workspace, preparado para capacidades locales y servicios de IA medidos por uso.',status:'planned',names:['numa','asistente numa']},
  {key:'maria',cmsKey:'maria-editorial',icon:'guia',title:'María',summary:'Asistente futuro de lectura, transcripción y apoyo editorial para Camino Editorial.',status:'planned',names:['maria','maría','asistente maria','asistente maría']},
  {key:'camino-agents',cmsKey:'camino-editorial-agents',icon:'comentarios',title:'Agentes de Camino Editorial',summary:'Contenedor futuro para agentes editoriales que se definirán y comercializarán uno por uno.',status:'planned',names:['agentes de camino editorial','agentes editoriales','camino editorial agents']}
];
let scheduled=false,observer=null;
let quickMenuOutsideHandler=null;

function norm(v){
  return String(v||'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/\s+/g,' ').trim().toLowerCase()
}
function iconUrl(name){return ICON_BASE+encodeURIComponent(name)+'.png'}
function escapeHtml(value){
  return String(value??'')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;')
}
function statusLabel(value){
  const status=String(value||'').trim().toUpperCase();
  if(status==='ACTIVE')return 'Disponible';
  if(status==='BUILDING')return 'En desarrollo';
  if(status==='PLANNED')return 'Próximamente';
  if(status==='LEGACY')return 'Integración heredada';
  return status||'Información'
}
function scopeLabel(value){
  const scope=String(value||'').trim().toLowerCase();
  if(scope==='personal')return 'Personal';
  if(scope==='workspace')return 'Workspace';
  return value||''
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
html[data-nxo-theme="night"] #nxo-dev-header .nxo-dev-mark{
  background:#0A0D12;
  border-color:rgba(255,255,255,.10);
  box-shadow:0 8px 22px var(--nxo-shadow),inset 0 1px 0 rgba(255,255,255,.06)
}
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

/* Canonical owned Development Center shell.
   Geometry restored from the previously approved Development Center layout. */
#PAGES_CONTAINER{
  display:none!important
}
#nxo-dev-app{
  position:relative!important;
  z-index:1!important;
  min-height:calc(100vh - 64px)!important;
  width:100%!important;
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
#nxo-dev-app .nxo-dev-owned-shell[hidden]{display:none!important}
.nxo-dev-owned-shell{
  width:min(1120px,100%);
  height:calc(100vh - 64px);
  height:calc(100dvh - 64px);
  margin:auto;
  padding:42px 20px 60px;
  box-sizing:border-box;
  display:flex;
  flex-direction:column;
  overflow:hidden
}
.nxo-dev-owned-hero{
  flex:0 0 auto;
  margin-bottom:28px
}
.nxo-dev-owned-catalog-frame{
  position:relative;
  flex:1 1 auto;
  min-height:0
}
@media(min-width:900px){
  .nxo-dev-owned-shell{
    overflow:visible
  }
  .nxo-dev-owned-catalog-frame{
    width:calc(100vw - 414px);
    max-width:none;
    left:calc(50% - 50vw + 24px);
    margin-right:auto
  }
  .nxo-dev-owned-grid{
    column-gap:8px;
    row-gap:16px
  }
}
.nxo-dev-owned-catalog-scroll{
  width:100%;
  height:100%;
  min-height:0;
  overflow-y:auto;
  overflow-x:hidden;
  overscroll-behavior:contain;
  scrollbar-width:none;
  -ms-overflow-style:none
}
.nxo-dev-owned-catalog-scroll::-webkit-scrollbar{
  width:0!important;
  height:0!important;
  display:none!important
}
.nxo-dev-scroll-arrow{
  position:absolute;
  right:3px;
  z-index:6;
  width:28px;
  height:28px;
  display:grid;
  place-items:center;
  padding:0;
  border:0;
  background:transparent;
  color:var(--nxo-accent);
  font:900 18px/1 Arial,sans-serif;
  cursor:pointer;
  opacity:.92;
  text-shadow:0 0 7px color-mix(in srgb,var(--nxo-accent) 78%,transparent);
  filter:drop-shadow(0 0 5px color-mix(in srgb,var(--nxo-accent) 52%,transparent));
  transition:opacity .15s ease,filter .15s ease,transform .15s ease
}
.nxo-dev-scroll-arrow:hover:not(:disabled),
.nxo-dev-scroll-arrow:focus-visible:not(:disabled){
  opacity:1;
  transform:scale(1.12);
  outline:none;
  filter:drop-shadow(0 0 9px color-mix(in srgb,var(--nxo-accent) 88%,transparent))
}
.nxo-dev-scroll-arrow:disabled{
  opacity:.16;
  cursor:default;
  filter:none;
  text-shadow:none;
  transform:none
}
.nxo-dev-scroll-arrow.up{top:1px}
.nxo-dev-scroll-arrow.down{bottom:1px}
.nxo-dev-owned-eyebrow{
  font-size:11px;
  font-weight:800;
  letter-spacing:.12em;
  text-transform:uppercase;
  color:var(--nxo-accent)
}
.nxo-dev-owned-hero h1{
  font-size:clamp(30px,5vw,48px);
  margin:6px 0 10px;
  letter-spacing:-.03em;
  color:var(--nxo-text-primary)
}
.nxo-dev-owned-hero p{
  max-width:760px;
  color:var(--nxo-text-secondary);
  font-size:14px;
  line-height:1.65;
  margin:0
}
.nxo-dev-owned-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:16px
}
.nxo-dev-owned-slot{
  width:100%;
  min-width:0;
  background:transparent
}

/* Exact compact marketplace geometry restored from the approved runtime. */
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"]{
  width:75%!important;
  max-width:75%!important;
  box-sizing:border-box!important;
  margin-right:auto!important;
  min-height:0!important;
  padding:14px 14px!important;
  display:flex!important;
  flex-direction:column!important
}
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] .nxo-dev-title-row{
  display:flex!important;
  align-items:center!important;
  justify-content:flex-start!important;
  gap:10px!important;
  width:100%!important;
  margin:0 0 8px!important;
  padding:0!important
}
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] .nxo-dev-title-row [data-nxo-dev-icon-slot="1"]{
  flex:0 0 46px!important;
  width:46px!important;
  height:46px!important;
  min-width:46px!important;
  min-height:46px!important;
  margin:0!important;
  display:block!important
}
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] .nxo-dev-title-row .nxo-dev-product-icon{
  display:block!important;
  width:46px!important;
  height:46px!important;
  min-width:46px!important;
  min-height:46px!important;
  max-width:46px!important;
  max-height:46px!important;
  margin:0!important;
  object-fit:contain!important
}
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] .nxo-dev-title-row [data-nxo-dev-tool-title]{
  flex:1 1 auto!important;
  min-width:0!important;
  margin:4px 0 8px!important;
  padding:0!important;
  font-size:20px!important;
  line-height:1.2!important;
  color:var(--nxo-text-primary)!important
}
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] [data-nxo-dev-description="1"],
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] [data-nxo-dev-tag="1"]{
  display:none!important
}
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] .nxo-dev-action{
  margin-top:8px!important;
  align-self:flex-start!important;
  padding:9px 13px!important;
  font-weight:700!important;
  font-size:11px!important;
  line-height:1.2!important
}
@media(max-width:760px){
  .nxo-dev-owned-shell{
    height:calc(100vh - 58px);
    height:calc(100dvh - 58px);
    padding:28px 14px 44px
  }
  .nxo-dev-owned-grid{grid-template-columns:1fr}
  html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"]{
    width:100%!important;
    max-width:100%!important;
    padding:11px 12px!important
  }
  html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] .nxo-dev-title-row [data-nxo-dev-icon-slot="1"],
  html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] .nxo-dev-title-row .nxo-dev-product-icon{
    flex-basis:42px!important;
    width:42px!important;
    height:42px!important;
    min-width:42px!important;
    min-height:42px!important;
    max-width:42px!important;
    max-height:42px!important
  }
}

/* Stage 2 · individual tool detail view. */
#nxo-dev-tool-detail[hidden]{display:none!important}
#nxo-dev-tool-detail{
  width:min(1120px,100%);
  height:calc(100vh - 64px);
  height:calc(100dvh - 64px);
  margin:0 auto;
  padding:28px 20px 38px;
  box-sizing:border-box;
  color:var(--nxo-text-primary)
}
.nxo-dev-detail-scroll{
  height:100%;
  overflow-y:auto;
  overflow-x:hidden;
  scrollbar-width:none;
  -ms-overflow-style:none;
  padding:2px 4px 28px
}
.nxo-dev-detail-scroll::-webkit-scrollbar{display:none;width:0;height:0}
.nxo-dev-detail-back{
  appearance:none;
  width:38px;height:38px;padding:0;
  display:grid;place-items:center;
  border:1px solid color-mix(in srgb,var(--nxo-text-primary) 12%,var(--nxo-border));
  border-radius:11px;
  background:var(--nxo-surface-glass);
  color:var(--nxo-text-primary);
  cursor:pointer;
  box-shadow:0 7px 18px var(--nxo-shadow)
}
.nxo-dev-detail-back img{
  display:block;width:18px;height:18px;object-fit:contain
}
.nxo-dev-detail-back:hover,.nxo-dev-detail-back:focus-visible{
  outline:none;
  background:var(--nxo-interaction);
  border-color:var(--nxo-interaction);
  color:var(--nxo-interaction-contrast);
  transform:translateY(-1px)
}
.nxo-dev-detail-hero{
  display:flex;
  align-items:center;
  gap:16px;
  margin:24px 0 20px
}
.nxo-dev-detail-icon-wrap{
  width:70px;height:70px;flex:0 0 70px;
  display:grid;place-items:center;
  border:1px solid var(--nxo-border);
  border-radius:20px;
  background:var(--nxo-surface-glass);
  box-shadow:0 12px 28px var(--nxo-shadow)
}
.nxo-dev-detail-icon{width:52px;height:52px;display:block;object-fit:contain}
.nxo-dev-detail-heading{min-width:0}
.nxo-dev-detail-eyebrow{
  margin-bottom:5px;
  font-size:10px;
  font-weight:850;
  letter-spacing:.11em;
  text-transform:uppercase;
  color:var(--nxo-accent)
}
.nxo-dev-detail-title{
  margin:0;
  font-size:clamp(26px,4vw,40px);
  line-height:1.08;
  letter-spacing:-.025em;
  color:var(--nxo-text-primary)
}
.nxo-dev-detail-meta{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}
.nxo-dev-detail-chip{
  display:inline-flex;align-items:center;min-height:25px;
  padding:4px 9px;border:1px solid var(--nxo-border);border-radius:999px;
  background:var(--nxo-surface-glass);color:var(--nxo-text-secondary);
  font-size:10px;font-weight:760
}
.nxo-dev-detail-chip.status{
  color:var(--nxo-accent);
  border-color:color-mix(in srgb,var(--nxo-accent) 34%,var(--nxo-border))
}
.nxo-dev-detail-description{
  max-width:880px;margin:0 0 22px;color:var(--nxo-text-secondary);
  font-size:14px;line-height:1.7
}
.nxo-dev-detail-grid{
  display:grid;
  grid-template-columns:minmax(0,1.35fr) minmax(260px,.65fr);
  gap:14px;align-items:start
}
.nxo-dev-detail-card{
  border:1px solid var(--nxo-border);border-radius:18px;
  background:var(--nxo-surface-glass);box-shadow:0 12px 32px var(--nxo-shadow);
  padding:17px
}
.nxo-dev-detail-card + .nxo-dev-detail-card{margin-top:14px}
.nxo-dev-detail-card h3{margin:0 0 11px;color:var(--nxo-text-primary);font-size:13px;line-height:1.2}
.nxo-dev-detail-list{margin:0;padding:0;list-style:none;display:grid;gap:8px}
.nxo-dev-detail-list li{
  position:relative;padding-left:16px;color:var(--nxo-text-secondary);
  font-size:12px;line-height:1.5
}
.nxo-dev-detail-list li::before{
  content:'';position:absolute;left:1px;top:.58em;width:6px;height:6px;
  border-radius:50%;background:var(--nxo-accent);
  box-shadow:0 0 8px color-mix(in srgb,var(--nxo-accent) 46%,transparent)
}
.nxo-dev-detail-empty{color:var(--nxo-text-muted);font-size:12px;line-height:1.5}
.nxo-dev-reviews{margin-top:14px}
.nxo-dev-reviews-summary{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px}
.nxo-dev-reviews-score{font-size:24px;font-weight:900;color:var(--nxo-text-primary)}
.nxo-dev-stars{letter-spacing:2px;color:var(--nxo-accent);font-size:16px}
.nxo-dev-review-list{display:grid;gap:9px}
.nxo-dev-review-item{padding:12px;border:1px solid var(--nxo-border);border-radius:14px;background:var(--nxo-surface-glass)}
.nxo-dev-review-item-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:6px}
.nxo-dev-review-item strong{font-size:11px;color:var(--nxo-text-primary)}
.nxo-dev-review-item p{margin:0;color:var(--nxo-text-secondary);font-size:12px;line-height:1.5;white-space:pre-wrap}
.nxo-dev-review-form{display:grid;gap:10px;margin-top:14px;padding-top:14px;border-top:1px solid var(--nxo-border)}
.nxo-dev-review-picker{display:flex;gap:5px}
.nxo-dev-review-star{appearance:none;border:0;background:transparent;color:var(--nxo-text-muted);font-size:25px;line-height:1;cursor:pointer;padding:2px}
.nxo-dev-review-star.selected{color:var(--nxo-accent)}
.nxo-dev-review-text{width:100%;min-height:88px;resize:vertical;box-sizing:border-box;border:1px solid var(--nxo-border);border-radius:12px;background:var(--nxo-surface-glass);color:var(--nxo-text-primary);padding:10px;font:500 12px/1.5 Inter,system-ui,sans-serif}
.nxo-dev-review-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.nxo-dev-review-save,.nxo-dev-review-remove{appearance:none;border:1px solid var(--nxo-border);border-radius:11px;padding:9px 12px;background:var(--nxo-surface-glass);color:var(--nxo-text-primary);font:760 11px/1 Inter,system-ui,sans-serif;cursor:pointer}
.nxo-dev-review-save{background:var(--nxo-accent);color:var(--nxo-accent-contrast);border-color:var(--nxo-accent)}
.nxo-dev-review-note{font-size:10px;color:var(--nxo-text-muted)}
.nxo-dev-detail-loading,.nxo-dev-detail-error{
  margin-top:28px;padding:18px;border:1px solid var(--nxo-border);
  border-radius:16px;background:var(--nxo-surface-glass);
  color:var(--nxo-text-secondary);font-size:13px
}
.nxo-dev-detail-error{color:var(--nxo-danger)}
.nxo-dev-install-card{
  margin:0 0 18px;
  padding:16px;
  border:1px solid var(--nxo-border);
  border-radius:18px;
  background:var(--nxo-surface-glass);
  box-shadow:0 12px 30px var(--nxo-shadow)
}
.nxo-dev-install-head{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:16px;
  margin-bottom:12px
}
.nxo-dev-install-head h3{
  margin:0 0 4px;
  font-size:14px;
  color:var(--nxo-text-primary)
}
.nxo-dev-install-head p{
  margin:0;
  color:var(--nxo-text-muted);
  font-size:11px;
  line-height:1.45
}
.nxo-dev-install-state{
  min-height:24px;
  display:inline-flex;
  align-items:center;
  padding:4px 9px;
  border:1px solid var(--nxo-border);
  border-radius:999px;
  color:var(--nxo-text-secondary);
  background:var(--nxo-accent-soft);
  font-size:9px;
  font-weight:800;
  white-space:nowrap
}
.nxo-dev-install-destinations{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(210px,1fr));
  gap:8px;
  margin:12px 0
}
.nxo-dev-install-destination{
  appearance:none;
  min-height:58px;
  padding:10px 12px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  text-align:left;
  border:1px solid var(--nxo-border);
  border-radius:13px;
  background:var(--nxo-surface-raised);
  color:var(--nxo-text-primary);
  cursor:pointer;
  transition:border-color .15s ease,box-shadow .15s ease,transform .15s ease
}
.nxo-dev-install-destination:hover:not(:disabled),
.nxo-dev-install-destination:focus-visible:not(:disabled){
  outline:none;
  transform:translateY(-1px);
  border-color:var(--nxo-interaction);
  box-shadow:0 0 0 2px var(--nxo-focus-ring)
}
.nxo-dev-install-destination.selected{
  border-color:var(--nxo-accent);
  box-shadow:0 0 0 2px var(--nxo-focus-ring)
}
.nxo-dev-install-destination:disabled{
  cursor:not-allowed;
  opacity:.46
}
.nxo-dev-install-destination strong{
  display:block;
  font-size:11px;
  line-height:1.25
}
.nxo-dev-install-destination small{
  display:block;
  margin-top:3px;
  color:var(--nxo-text-muted);
  font-size:9px;
  line-height:1.3
}
.nxo-dev-install-badge{
  flex:0 0 auto;
  font-size:8px;
  font-weight:850;
  text-transform:uppercase;
  letter-spacing:.05em;
  color:var(--nxo-accent)
}
.nxo-dev-install-actions{
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  gap:8px;
  margin-top:12px
}
.nxo-dev-install-primary,
.nxo-dev-install-open{
  appearance:none;
  min-height:36px;
  padding:0 14px;
  border:1px solid var(--nxo-header-border);
  border-radius:10px;
  background:var(--nxo-header-background);
  color:var(--nxo-header-text);
  font:800 11px/1 Inter,system-ui,sans-serif;
  cursor:pointer
}
.nxo-dev-install-primary:hover:not(:disabled),
.nxo-dev-install-primary:focus-visible:not(:disabled),
.nxo-dev-install-open:hover,
.nxo-dev-install-open:focus-visible{
  outline:none;
  background:var(--nxo-interaction);
  border-color:var(--nxo-interaction);
  color:var(--nxo-interaction-contrast)
}
.nxo-dev-install-primary:disabled{
  cursor:wait;
  opacity:.58
}
.nxo-dev-install-message{
  color:var(--nxo-text-secondary);
  font-size:10px;
  line-height:1.45
}
.nxo-dev-install-message.success{color:var(--nxo-positive)}
.nxo-dev-install-message.error{color:var(--nxo-danger)}
.nxo-dev-install-unavailable{
  color:var(--nxo-text-muted);
  font-size:11px;
  line-height:1.5
}

@media(max-width:760px){
  #nxo-dev-tool-detail{
    height:calc(100vh - 58px);
    height:calc(100dvh - 58px);
    padding:20px 14px 30px
  }
  .nxo-dev-detail-hero{align-items:flex-start;gap:12px}
  .nxo-dev-detail-icon-wrap{width:58px;height:58px;flex-basis:58px;border-radius:16px}
  .nxo-dev-detail-icon{width:44px;height:44px}
  .nxo-dev-detail-grid{grid-template-columns:1fr}
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
html[data-nxo-theme] .nxo-dev-action[disabled]{
  cursor:not-allowed!important;
  opacity:.62!important;
  transform:none!important
}
html[data-nxo-theme] .nxo-dev-action[disabled]:hover,
html[data-nxo-theme] .nxo-dev-action[disabled]:focus-visible{
  color:var(--nxo-header-text)!important;
  background:var(--nxo-header-background)!important;
  border-color:var(--nxo-header-border)!important;
  box-shadow:none!important
}
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
  header.querySelector('#nxo-dev-back').addEventListener('click',()=>{
    if(toolDetailIsOpen()){closeToolDetail();return}
    goBack()
  });
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
function bindPreviewDelegation(){
  if(window.__nexoDevPreviewOverHandler){
    document.removeEventListener('pointerover',window.__nexoDevPreviewOverHandler,true)
  }
  if(window.__nexoDevPreviewOutHandler){
    document.removeEventListener('pointerout',window.__nexoDevPreviewOutHandler,true)
  }

  window.__nexoDevPreviewOverHandler=function(event){
    // Hover preview is a mouse-only interaction. Touch/pen pointerover fires
    // before the browser knows whether the gesture is a tap or a scroll.
    if(event.pointerType&&event.pointerType!=='mouse')return;
    const card=event.target?.closest?.('[data-nxo-dev-card="1"]');
    if(!card)return;
    if(event.relatedTarget&&card.contains(event.relatedTarget))return;
    const tool=toolForCard(card);
    if(!tool)return;
    previewPinned=false;
    openPreview(tool,card,{pinned:false})
  };

  window.__nexoDevPreviewOutHandler=function(event){
    if(event.pointerType&&event.pointerType!=='mouse')return;
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
  if(window.__nexoDevDetailPopstateHandler){
    window.removeEventListener('popstate',window.__nexoDevDetailPopstateHandler)
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

    const action=event.target?.closest?.('.nxo-dev-action');
    if(action&&!action.disabled){
      openToolDetail(tool,action);
      return
    }

    openPreview(tool,card,{pinned:true})
  };

  window.__nexoDevFeatureKeyHandler=function(event){
    if(event.key==='Escape'){
      if(toolDetailIsOpen()){
        closeToolDetail();
        return
      }
      previewPinned=false;
      closePreview(true)
    }
  };

  window.__nexoDevDetailPopstateHandler=function(){
    if(toolDetailIsOpen()){
      closeToolDetail({fromHistory:true})
    }
  };

  document.addEventListener('click',window.__nexoDevFeatureClickHandler,true);
  document.addEventListener('keydown',window.__nexoDevFeatureKeyHandler);
  window.addEventListener('popstate',window.__nexoDevDetailPopstateHandler)
}

let detailRequestId=0;
let lastDetailTrigger=null;
let installState=null;
let installBusy=false;
let detailHistoryArmed=false;

function armToolDetailHistory(){
  if(detailHistoryArmed)return;
  const current=history.state&&typeof history.state==='object'?history.state:{};
  history.pushState({...current,nxoDevDetail:true},'',location.href);
  detailHistoryArmed=true
}

function ensureToolDetailView(){
  const app=ensureDevelopmentApp();
  let view=document.getElementById('nxo-dev-tool-detail');
  if(view)return view;

  view=document.createElement('section');
  view.id='nxo-dev-tool-detail';
  view.hidden=true;
  view.innerHTML=
    '<div class="nxo-dev-detail-scroll">'+
      '<button type="button" class="nxo-dev-detail-back" id="nxo-dev-detail-back" aria-label="Volver al catálogo" title="Volver">'+
        '<img src="'+iconUrl('volver')+'" alt="">'+
      '</button>'+
      '<div id="nxo-dev-detail-content"></div>'+
    '</div>';
  app.appendChild(view);

  view.querySelector('#nxo-dev-detail-back')?.addEventListener('click',closeToolDetail,{signal:runtimeAbort.signal});
  return view
}

function detailList(title,items){
  const values=Array.isArray(items)?items.filter(Boolean):[];
  if(!values.length)return'';
  return '<section class="nxo-dev-detail-card">'+
    '<h3>'+escapeHtml(title)+'</h3>'+
    '<ul class="nxo-dev-detail-list">'+values.map(item=>'<li>'+escapeHtml(item)+'</li>').join('')+'</ul>'+
  '</section>'
}
function detailSafeUrl(value){
  const raw=String(value||'').trim();
  if(!raw)return'';
  try{
    const url=new URL(raw);
    return ['http:','https:'].includes(url.protocol)?url.href:''
  }catch(_){return''}
}
function detailLinks(title,items){
  const values=(Array.isArray(items)?items:[]).map(item=>({
    label:String(item?.label||'').trim(),
    url:detailSafeUrl(item?.url)
  })).filter(item=>item.label&&item.url);
  if(!values.length)return'';
  return '<section class="nxo-dev-detail-card">'+
    '<h3>'+escapeHtml(title)+'</h3>'+
    '<ul class="nxo-dev-detail-list">'+values.map(item=>
      '<li><a href="'+escapeHtml(item.url)+'" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline;text-underline-offset:2px">'+escapeHtml(item.label)+'</a></li>'
    ).join('')+'</ul>'+
  '</section>'
}
function detailOfferPrice(offer){
  const type=String(offer?.offerType||'').toUpperCase();
  const currency=String(offer?.currency||'USD').toUpperCase();
  const money=minor=>{
    const value=Number(minor);
    if(!Number.isInteger(value)||value<0)return'';
    try{return new Intl.NumberFormat('es-US',{style:'currency',currency}).format(value/100)}
    catch(_){return (value/100).toFixed(2)+' '+currency}
  };
  if(type==='FREE')return'Gratis';
  if(type==='FIXED_PRICE'){
    const amount=money(offer?.baseAmountMinor);
    return amount?amount+' · pago único':''
  }
  if(type==='SUBSCRIPTION'){
    const amount=money(offer?.baseAmountMinor);
    const interval=String(offer?.billingInterval||'').toUpperCase();
    const count=Number(offer?.billingIntervalCount||1);
    const names={DAY:'día',WEEK:'semana',MONTH:'mes',YEAR:'año'};
    if(!amount||!names[interval])return'';
    return amount+' / '+(count>1?count+' '+names[interval]+'s':names[interval])
  }
  if(type==='USAGE'){
    const amount=money(offer?.unitAmountMinor);
    const unit=String(offer?.usageUnit||'').trim();
    return amount&&unit?amount+' / '+unit:''
  }
  return''
}
function detailPlanPrice(plan){
  const currency=String(plan?.currency||'USD').toUpperCase();
  const amount=Number(plan?.amountMinor);
  if(!Number.isInteger(amount)||amount<0)return'';
  let money='';
  try{money=new Intl.NumberFormat('es-US',{style:'currency',currency}).format(amount/100)}
  catch(_){money=(amount/100).toFixed(2)+' '+currency}
  const interval=String(plan?.billingInterval||'').toUpperCase();
  const count=Number(plan?.billingIntervalCount||1);
  const names={DAY:'día',WEEK:'semana',MONTH:'mes',YEAR:'año'};
  if(!names[interval])return money;
  return money+' / '+(count>1?count+' '+names[interval]+'s':names[interval])
}
function detailPackagePrice(pkg){
  const model=String(pkg?.pricingModel||'').toUpperCase();
  if(model==='FREE')return'Gratis';
  const currency=String(pkg?.currency||'USD').toUpperCase();
  const amount=Number(pkg?.amountMinor);
  if(!Number.isInteger(amount)||amount<0)return'';
  let money='';
  try{money=new Intl.NumberFormat('es-US',{style:'currency',currency}).format(amount/100)}
  catch(_){money=(amount/100).toFixed(2)+' '+currency}
  if(model!=='SUBSCRIPTION')return money;
  const interval=String(pkg?.billingInterval||'').toUpperCase();
  const count=Number(pkg?.billingIntervalCount||1);
  const names={DAY:'día',WEEK:'semana',MONTH:'mes',YEAR:'año'};
  if(!names[interval])return money;
  return money+' / '+(count>1?count+' '+names[interval]+'s':names[interval])
}
function detailCommercial(commercial){
  const offers=Array.isArray(commercial?.offers)?commercial.offers:[];
  const plans=Array.isArray(commercial?.plans)?commercial.plans:[];
  const packages=Array.isArray(commercial?.packages)?commercial.packages:[];
  if(!offers.length&&!plans.length&&!packages.length)return'';

  const offersHtml=offers.length
    ? '<section class="nxo-dev-detail-card">'+
        '<h3>Formas de acceso</h3>'+
        '<div style="display:grid;gap:9px">'+
          offers.map(offer=>{
            const price=detailOfferPrice(offer);
            const label=String(offer?.publicLabelEs||'').trim()||({
              FREE:'Gratis',FIXED_PRICE:'Compra única',SUBSCRIPTION:'Suscripción',USAGE:'Uso medido'
            }[String(offer?.offerType||'').toUpperCase()]||'Oferta');
            return '<div style="padding:10px 0;border-bottom:1px solid var(--nxo-border)">'+
              '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center">'+
                '<strong style="font-size:12px">'+escapeHtml(label)+'</strong>'+
                (price?'<strong style="font-size:12px;color:var(--nxo-accent)">'+escapeHtml(price)+'</strong>':'')+
              '</div>'+
              (offer?.publicDescriptionEs?'<p style="margin:6px 0 0;color:var(--nxo-text-secondary);font-size:11px;line-height:1.45">'+escapeHtml(offer.publicDescriptionEs)+'</p>':'')+
            '</div>'
          }).join('')+
        '</div>'+
      '</section>'
    : '';

  const plansHtml=plans.length
    ? '<section class="nxo-dev-detail-card">'+
        '<h3>Incluido en planes</h3>'+
        '<div style="display:grid;gap:9px">'+
          plans.map(plan=>{
            const price=detailPlanPrice(plan);
            return '<div style="padding:10px 0;border-bottom:1px solid var(--nxo-border)">'+
              '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center">'+
                '<strong style="font-size:12px">'+escapeHtml(plan?.nameEs||plan?.planKey||'Plan Nexo')+'</strong>'+
                (price?'<strong style="font-size:12px;color:var(--nxo-accent)">'+escapeHtml(price)+'</strong>':'')+
              '</div>'+
              (plan?.descriptionEs?'<p style="margin:6px 0 0;color:var(--nxo-text-secondary);font-size:11px;line-height:1.45">'+escapeHtml(plan.descriptionEs)+'</p>':'')+
            '</div>'
          }).join('')+
        '</div>'+
      '</section>'
    : '';

  const packagesHtml=packages.length
    ? '<section class="nxo-dev-detail-card">'+
        '<h3>Disponible en paquetes</h3>'+
        '<div style="display:grid;gap:9px">'+
          packages.map(pkg=>{
            const price=detailPackagePrice(pkg);
            const type=String(pkg?.packageType||'').toUpperCase();
            const typeLabel=type==='FLEXIBLE'?'Flexible':type==='CURATED'?'Curado':'Fijo';
            const capacity=type==='FLEXIBLE'&&Number(pkg?.capacityUnits)>0
              ? ' · '+String(pkg.capacityUnits)+' '+escapeHtml(pkg?.allocationUnit||'unidades')
              : '';
            return '<div style="padding:10px 0;border-bottom:1px solid var(--nxo-border)">'+
              '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center">'+
                '<strong style="font-size:12px">'+escapeHtml(pkg?.nameEs||pkg?.packageKey||'Paquete Nexo')+'</strong>'+
                (price?'<strong style="font-size:12px;color:var(--nxo-accent)">'+escapeHtml(price)+'</strong>':'')+
              '</div>'+
              '<p style="margin:6px 0 0;color:var(--nxo-text-muted);font-size:10px">'+escapeHtml(typeLabel+capacity)+'</p>'+
              (pkg?.descriptionEs?'<p style="margin:6px 0 0;color:var(--nxo-text-secondary);font-size:11px;line-height:1.45">'+escapeHtml(pkg.descriptionEs)+'</p>':'')+
            '</div>'
          }).join('')+
        '</div>'+
      '</section>'
    : '';

  return offersHtml+plansHtml+packagesHtml
}

function detailRelated(items){
  const values=(Array.isArray(items)?items:[]).filter(item=>item?.nameEs);
  if(!values.length)return'';
  return '<section class="nxo-dev-detail-card">'+
    '<h3>Productos relacionados</h3>'+
    '<ul class="nxo-dev-detail-list">'+values.map(item=>
      '<li>'+escapeHtml(item.nameEs)+' · '+escapeHtml(statusLabel(item.status))+'</li>'
    ).join('')+'</ul>'+
  '</section>'
}
function detailMedia(items){
  const values=(Array.isArray(items)?items:[]).map(item=>({
    type:String(item?.type||'').toLowerCase(),
    url:detailSafeUrl(item?.url),
    title:String(item?.title||'').trim(),
    alt:String(item?.alt||'').trim()
  })).filter(item=>item.url&&['image','video'].includes(item.type));
  if(!values.length)return'';
  return '<section class="nxo-dev-detail-card" style="margin-bottom:14px">'+
    '<h3>Multimedia</h3>'+
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px">'+
      values.map(item=>{
        const label=item.title||item.alt||'Multimedia del producto';
        if(item.type==='video'){
          return '<figure style="margin:0;display:grid;gap:7px">'+
            '<video controls preload="metadata" src="'+escapeHtml(item.url)+'" style="display:block;width:100%;max-height:320px;border-radius:12px;background:var(--nxo-surface)"></video>'+
            (label?'<figcaption style="font-size:11px;color:var(--nxo-text-muted)">'+escapeHtml(label)+'</figcaption>':'')+
          '</figure>'
        }
        return '<figure style="margin:0;display:grid;gap:7px">'+
          '<img src="'+escapeHtml(item.url)+'" alt="'+escapeHtml(item.alt||item.title)+'" loading="lazy" decoding="async" style="display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;border:1px solid var(--nxo-border);background:var(--nxo-surface)">'+
          (label?'<figcaption style="font-size:11px;color:var(--nxo-text-muted)">'+escapeHtml(label)+'</figcaption>':'')+
        '</figure>'
      }).join('')+
    '</div>'+
  '</section>'
}

function developmentFunctionUrl(functionName){
  const name=String(functionName||'').replace(/^\/+|\/+$/g,'');
  const freeSite=/\.(wixstudio|wixsite)\.com$/i.test(location.hostname);
  const firstSegment=location.pathname.split('/').filter(Boolean)[0]||'';
  const basePath=freeSite&&firstSegment?'/'+firstSegment:'';
  return basePath+'/_functions/'+name
}

async function fetchToolDetail(tool){
  const response=await fetch(developmentFunctionUrl('nexoDevelopmentToolDetail'),{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({toolKey:tool.cmsKey||tool.key}),
    credentials:'same-origin'
  });
  const payload=await response.json().catch(()=>null);
  if(!response.ok||!payload?.ok||!payload?.data){
    throw new Error(payload?.error||'No se pudo cargar la ficha.')
  }
  return payload.data
}

function developmentBaseUrl(){
  const pathname=location.pathname.replace(/\/+$/,'');
  return location.origin+pathname.replace(/\/blank-[^/]+$/,'')
}
function requestedWorkspaceId(){
  try{
    const q=new URLSearchParams(location.search);
    return q.get('nxoTargetWorkspace')||q.get('nxoWorkspace')||''
  }catch(_){return''}
}
async function developmentReviewsApi(action,toolKey,input={}){
  const response=await fetch(developmentFunctionUrl('nexoDevelopmentReviews'),{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    credentials:'same-origin',
    body:JSON.stringify({action,toolKey,input})
  });
  const data=await response.json().catch(()=>null);
  if(!response.ok||!data?.ok){
    const error=new Error(data?.error||'No se pudo completar la reseña.');
    error.code=data?.error||'REVIEW_FAILED';
    throw error
  }
  return data.data
}

async function developmentInstallApi(action,payload={}){
  const response=await fetch(developmentFunctionUrl('nexoDevelopmentInstall'),{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    credentials:'same-origin',
    body:JSON.stringify({action,...payload})
  });
  const data=await response.json().catch(()=>null);
  if(!response.ok||!data?.ok){
    const error=new Error(data?.error||'No se pudo completar la instalación.');
    error.code=data?.error||'INSTALL_FAILED';
    throw error
  }
  return data.data
}
function destinationKey(destination){
  return String(destination?.type||'')+':'+String(destination?.id||'')
}
function preferredDestination(options){
  const destinations=Array.isArray(options?.destinations)?options.destinations:[];
  const requested=requestedWorkspaceId();
  return destinations.find(x=>x.type==='workspace'&&x.id===requested)||
    destinations.find(x=>x.installed)||
    destinations.find(x=>x.canInstall)||
    destinations[0]||
    null
}
function developmentToolOpenUrl(routePath,destination){
  const path=String(routePath||'').trim();
  if(!path)return'';
  try{
    const base=developmentBaseUrl();
    const target=new URL(base+(path.startsWith('/')?path:'/'+path));
    const back=new URL(base+'/blank-8');
    const workspaceId=destination?.type==='workspace'?String(destination.id||''):'';

    if(workspaceId){
      target.searchParams.set('nxoWorkspace',workspaceId);
      back.searchParams.set('nxoWorkspace',workspaceId)
    }
    target.searchParams.set('nxoBack',back.href);
    target.searchParams.set('nxoBackLabel',String(destination?.name||'Mi Espacio'));
    target.searchParams.set('nxoTheme',theme());
    target.searchParams.set('nxoLang','es');
    return target.href
  }catch(_){return path}
}
function renderInstallZone(tool,options,selectedKey='',message='',messageType=''){
  const zone=document.getElementById('nxo-dev-install-zone');
  if(!zone)return;

  if(!options?.installable){
    zone.innerHTML=
      '<section class="nxo-dev-install-card">'+
        '<div class="nxo-dev-install-head"><div><h3>Instalación</h3><p>Esta herramienta todavía no está disponible para instalar.</p></div>'+
        '<span class="nxo-dev-install-state">No disponible</span></div>'+
      '</section>';
    return
  }

  const destinations=Array.isArray(options.destinations)?options.destinations:[];
  if(!destinations.length){
    zone.innerHTML=
      '<section class="nxo-dev-install-card">'+
        '<div class="nxo-dev-install-head"><div><h3>Instalación</h3><p>No hay destinos disponibles para esta herramienta.</p></div></div>'+
      '</section>';
    return
  }

  let selected=destinations.find(x=>destinationKey(x)===selectedKey)||preferredDestination(options);
  if(!selected)selected=destinations[0];
  installState={tool,options,selectedKey:destinationKey(selected)};

  const accessLabel=destination=>{
    if(destination?.entitled)return 'Acceso activo';
    if(destination?.freeAvailable)return 'Gratis disponible';
    if(destination?.reason==='NO_TOOLS_CONFIGURE_PERMISSION')return 'Sin permiso';
    if(destination?.reason==='ENTITLEMENT_REQUIRED')return 'Acceso requerido';
    return ''
  };
  const destinationHtml=destinations.map(destination=>{
    const key=destinationKey(destination);
    const isSelected=key===installState.selectedKey;
    const unavailable=!destination.canOpen&&!destination.canInstall;
    const access=accessLabel(destination);
    const subtitle=destination.installed
      ? (destination.entitled?'Instalada · acceso activo':'Instalada · '+(access||'acceso pendiente'))
      : destination.entitled
        ? 'Acceso disponible'
        : destination.freeAvailable
          ? 'Oferta gratuita disponible'
          : destination.reason==='NO_TOOLS_CONFIGURE_PERMISSION'
            ? 'Sin permiso para configurar herramientas'
            : destination.reason==='ENTITLEMENT_REQUIRED'
              ? 'Necesitas una forma de acceso'
              : destination.type==='workspace'?'Workspace':'Espacio personal';
    return '<button type="button" class="nxo-dev-install-destination'+(isSelected?' selected':'')+'" data-install-destination="'+escapeHtml(key)+'" '+(unavailable?'disabled':'')+'>'+
      '<span><strong>'+escapeHtml(destination.name)+'</strong><small>'+escapeHtml(subtitle)+'</small></span>'+
      (destination.installed?'<span class="nxo-dev-install-badge">Instalada</span>':(destination.entitled?'<span class="nxo-dev-install-badge">Con acceso</span>':''))+
    '</button>'
  }).join('');

  let action='';
  if(selected.canOpen){
    action='<button type="button" class="nxo-dev-install-open" id="nxo-dev-install-open">Abrir herramienta</button>'
  }else if(selected.canInstall){
    const freeActivation=selected.installed&&selected.freeAvailable&&!selected.entitled;
    action='<button type="button" class="nxo-dev-install-primary" id="nxo-dev-install-primary" '+(installBusy?'disabled':'')+'>'+
      (installBusy?'Activando…':(freeActivation?'Activar acceso gratis':'Instalar aquí'))+
    '</button>'
  }

  const stateLabel=selected.canOpen
    ? 'Acceso activo'
    : selected.freeAvailable
      ? 'Gratis disponible'
      : selected.entitled
        ? 'Acceso activo'
        : selected.reason==='ENTITLEMENT_REQUIRED'
          ? 'Acceso requerido'
          : selected.installed?'Instalada':'Pendiente';

  zone.innerHTML=
    '<section class="nxo-dev-install-card">'+
      '<div class="nxo-dev-install-head">'+
        '<div><h3>Instalación y acceso</h3><p>Elige el destino. El derecho de acceso y la instalación se validan por separado.</p></div>'+
        '<span class="nxo-dev-install-state">'+escapeHtml(stateLabel)+'</span>'+
      '</div>'+
      '<div class="nxo-dev-install-destinations">'+destinationHtml+'</div>'+
      '<div class="nxo-dev-install-actions">'+
        action+
        (message?'<span class="nxo-dev-install-message '+escapeHtml(messageType)+'">'+escapeHtml(message)+'</span>':'')+
      '</div>'+
    '</section>';

  zone.querySelectorAll('[data-install-destination]').forEach(button=>{
    button.addEventListener('click',()=>{
      if(installBusy)return;
      renderInstallZone(tool,options,button.dataset.installDestination||'',message,messageType)
    },{signal:runtimeAbort.signal})
  });

  zone.querySelector('#nxo-dev-install-primary')?.addEventListener('click',async()=>{
    if(installBusy||!installState)return;
    const destination=destinations.find(x=>destinationKey(x)===installState.selectedKey);
    if(!destination||!destination.canInstall||destination.canOpen)return;

    installBusy=true;
    renderInstallZone(tool,options,installState.selectedKey,'','');
    try{
      await developmentInstallApi('install',{
        input:{
          toolKey:tool.cmsKey||tool.key,
          targetType:destination.type,
          targetId:destination.id,
          workspaceId:destination.type==='workspace'?destination.id:''
        }
      });
      const refreshed=await developmentInstallApi('options',{toolKey:tool.cmsKey||tool.key});
      installBusy=false;
      renderInstallZone(tool,refreshed,destinationKey(destination),'Herramienta instalada correctamente.','success')
    }catch(error){
      installBusy=false;
      const errorMessage=error?.code==='AUTH_REQUIRED'
        ? 'Inicia sesión para instalar esta herramienta.'
        : error?.code==='ENTITLEMENT_REQUIRED'
          ? 'Necesitas una forma de acceso válida antes de instalar esta herramienta.'
          : (error?.message||'No se pudo instalar.');
      renderInstallZone(tool,options,destinationKey(destination),errorMessage,'error')
    }
  },{signal:runtimeAbort.signal});

  zone.querySelector('#nxo-dev-install-open')?.addEventListener('click',()=>{
    const destination=destinations.find(x=>destinationKey(x)===installState?.selectedKey);
    const url=developmentToolOpenUrl(options.routePath,destination);
    if(url)location.assign(url)
  },{signal:runtimeAbort.signal})
}
async function loadInstallOptions(tool,requestId){
  const zone=document.getElementById('nxo-dev-install-zone');
  if(!zone)return;

  zone.innerHTML=
    '<section class="nxo-dev-install-card">'+
      '<div class="nxo-dev-install-head"><div><h3>Instalación</h3><p>Comprobando destinos disponibles…</p></div>'+
      '<span class="nxo-dev-install-state">Cargando</span></div>'+
    '</section>';

  try{
    const options=await developmentInstallApi('options',{toolKey:tool.cmsKey||tool.key});
    if(requestId!==detailRequestId||!toolDetailIsOpen())return;
    installBusy=false;
    renderInstallZone(tool,options)
  }catch(error){
    if(requestId!==detailRequestId||!toolDetailIsOpen())return;
    installBusy=false;
    zone.innerHTML=
      '<section class="nxo-dev-install-card">'+
        '<div class="nxo-dev-install-head"><div><h3>Instalación</h3><p>'+
          escapeHtml(error?.code==='AUTH_REQUIRED'?'Inicia sesión para consultar los destinos de instalación.':(error?.message||'No se pudieron cargar los destinos.'))+
        '</p></div><span class="nxo-dev-install-state">Pendiente</span></div>'+
      '</section>'
  }
}

function reviewStars(value){
  const rating=Math.max(0,Math.min(5,Number(value)||0));
  return '★★★★★'.split('').map((star,index)=>index<Math.round(rating)?star:'☆').join('')
}
function renderReviewsZone(tool,data){
  const zone=document.getElementById('nxo-dev-reviews-zone');
  if(!zone)return;
  const summary=data?.summary||{average:0,count:0};
  const reviews=Array.isArray(data?.reviews)?data.reviews:[];
  const mine=data?.myReview||null;
  const currentRating=Number(mine?.rating||0);
  const listHtml=reviews.length?reviews.map(review=>
    '<article class="nxo-dev-review-item">'+
      '<div class="nxo-dev-review-item-head"><strong>'+escapeHtml(review.authorName||'Usuario Nexo')+'</strong><span class="nxo-dev-stars">'+escapeHtml(reviewStars(review.rating))+'</span></div>'+
      (review.body?'<p>'+escapeHtml(review.body)+'</p>':'')+
    '</article>'
  ).join(''):'<div class="nxo-dev-detail-empty">Todavía no hay reseñas publicadas.</div>';
  const form=data?.canReview
    ? '<div class="nxo-dev-review-form">'+
        '<strong style="font-size:12px">'+(mine?'Tu valoración':'Valora este producto')+'</strong>'+
        '<div class="nxo-dev-review-picker" data-review-rating="'+currentRating+'">'+
          [1,2,3,4,5].map(value=>'<button type="button" class="nxo-dev-review-star'+(value<=currentRating?' selected':'')+'" data-review-star="'+value+'" aria-label="'+value+' estrellas">★</button>').join('')+
        '</div>'+
        '<textarea class="nxo-dev-review-text" id="nxo-dev-review-text" maxlength="1200" placeholder="Escribe una reseña opcional…">'+escapeHtml(mine?.body||'')+'</textarea>'+
        '<div class="nxo-dev-review-actions">'+
          '<button type="button" class="nxo-dev-review-save" id="nxo-dev-review-save">'+(mine?'Actualizar reseña':'Publicar reseña')+'</button>'+
          (mine?'<button type="button" class="nxo-dev-review-remove" id="nxo-dev-review-remove">Eliminar mi reseña</button>':'')+
          '<span class="nxo-dev-review-note" id="nxo-dev-review-note"></span>'+
        '</div>'+
      '</div>'
    : '<div class="nxo-dev-review-note" style="margin-top:12px">'+(data?.authenticated?'Este producto todavía no admite reseñas.':'Inicia sesión para valorar este producto.')+'</div>';

  zone.innerHTML=
    '<section class="nxo-dev-detail-card nxo-dev-reviews">'+
      '<h3>Reseñas y valoración</h3>'+
      '<div class="nxo-dev-reviews-summary">'+
        '<span class="nxo-dev-reviews-score">'+(summary.count?escapeHtml(Number(summary.average).toFixed(1)):'—')+'</span>'+
        '<span class="nxo-dev-stars">'+escapeHtml(reviewStars(summary.average))+'</span>'+
        '<span class="nxo-dev-review-note">'+escapeHtml(summary.count+' reseña'+(summary.count===1?'':'s'))+'</span>'+
      '</div>'+
      '<div class="nxo-dev-review-list">'+listHtml+'</div>'+
      form+
    '</section>';

  let selectedRating=currentRating;
  zone.querySelectorAll('[data-review-star]').forEach(button=>{
    button.addEventListener('click',()=>{
      selectedRating=Number(button.dataset.reviewStar||0);
      zone.querySelectorAll('[data-review-star]').forEach(star=>star.classList.toggle('selected',Number(star.dataset.reviewStar)<=selectedRating))
    },{signal:runtimeAbort.signal})
  });
  zone.querySelector('#nxo-dev-review-save')?.addEventListener('click',async()=>{
    const note=zone.querySelector('#nxo-dev-review-note');
    if(!selectedRating){if(note)note.textContent='Selecciona de 1 a 5 estrellas.';return}
    try{
      if(note)note.textContent='Guardando…';
      const refreshed=await developmentReviewsApi('save',tool.cmsKey||tool.key,{
        rating:selectedRating,
        body:zone.querySelector('#nxo-dev-review-text')?.value||''
      });
      renderReviewsZone(tool,refreshed)
    }catch(error){
      if(note)note.textContent=error?.code==='REVIEW_TOO_LONG'?'La reseña supera 1200 caracteres.':(error?.message||'No se pudo guardar.')
    }
  },{signal:runtimeAbort.signal});
  zone.querySelector('#nxo-dev-review-remove')?.addEventListener('click',async()=>{
    const note=zone.querySelector('#nxo-dev-review-note');
    try{
      if(note)note.textContent='Eliminando…';
      const refreshed=await developmentReviewsApi('remove',tool.cmsKey||tool.key);
      renderReviewsZone(tool,refreshed)
    }catch(error){
      if(note)note.textContent=error?.message||'No se pudo eliminar.'
    }
  },{signal:runtimeAbort.signal})
}
async function loadReviewsZone(tool,requestId){
  const zone=document.getElementById('nxo-dev-reviews-zone');
  if(!zone)return;
  zone.innerHTML='<section class="nxo-dev-detail-card nxo-dev-reviews"><h3>Reseñas y valoración</h3><div class="nxo-dev-detail-empty">Cargando reseñas…</div></section>';
  try{
    const data=await developmentReviewsApi('bootstrap',tool.cmsKey||tool.key);
    if(requestId!==detailRequestId||!toolDetailIsOpen())return;
    renderReviewsZone(tool,data)
  }catch(error){
    if(requestId!==detailRequestId||!toolDetailIsOpen())return;
    zone.innerHTML='<section class="nxo-dev-detail-card nxo-dev-reviews"><h3>Reseñas y valoración</h3><div class="nxo-dev-detail-error">'+escapeHtml(error?.message||'No se pudieron cargar las reseñas.')+'</div></section>'
  }
}

function renderToolDetail(tool,data){
  const content=document.getElementById('nxo-dev-detail-content');
  if(!content)return;

  const scopes=Array.isArray(data?.scopeModes)?data.scopeModes:[];
  const chips=[
    '<span class="nxo-dev-detail-chip status">'+escapeHtml(statusLabel(data?.status))+'</span>',
    ...scopes.map(scope=>'<span class="nxo-dev-detail-chip">'+escapeHtml(scopeLabel(scope))+'</span>')
  ].join('');
  const mediaHtml=detailMedia(data?.media);
  const leftHtml=
    detailList('Capacidades',data?.capabilitiesEs)+
    detailList('Compatibilidad',data?.compatibilityEs)+
    detailList('Público recomendado',data?.audienceEs);
  const rightHtml=
    detailCommercial(data?.commercial)+
    detailList('Requisitos',data?.requirementsEs)+
    detailList('Integraciones',data?.integrationsEs)+
    detailLinks('Documentación',data?.documentation)+
    detailRelated(data?.relatedProducts);

  content.innerHTML=
    '<div class="nxo-dev-detail-hero">'+
      '<div class="nxo-dev-detail-icon-wrap"><img class="nxo-dev-detail-icon" src="'+iconUrl(tool.icon)+'" alt=""></div>'+
      '<div class="nxo-dev-detail-heading">'+
        '<div class="nxo-dev-detail-eyebrow">Ficha de producto</div>'+
        '<h2 class="nxo-dev-detail-title">'+escapeHtml(tool.title||data?.nameEs)+'</h2>'+
        '<div class="nxo-dev-detail-meta">'+chips+'</div>'+
      '</div>'+
    '</div>'+
    '<p class="nxo-dev-detail-description">'+escapeHtml(data?.detailDescriptionEs||data?.descriptionEs||tool.summary)+'</p>'+
    mediaHtml+
    '<div id="nxo-dev-install-zone"></div>'+
    '<div class="nxo-dev-detail-grid">'+
      '<div>'+leftHtml+'</div>'+
      '<aside>'+rightHtml+'</aside>'+
    '</div>'+
    '<div id="nxo-dev-reviews-zone"></div>'
}

async function openToolDetail(tool,trigger){
  if(!tool||tool.status==='planned')return;
  const requestId=++detailRequestId;
  lastDetailTrigger=trigger||document.activeElement;

  previewPinned=false;
  closePreview(true);

  const app=ensureDevelopmentApp();
  const shell=app.querySelector('.nxo-dev-owned-shell');
  const view=ensureToolDetailView();
  const content=view.querySelector('#nxo-dev-detail-content');

  armToolDetailHistory();
  if(shell)shell.hidden=true;
  view.hidden=false;
  content.innerHTML='<div class="nxo-dev-detail-loading">Cargando ficha de herramienta…</div>';
  view.querySelector('.nxo-dev-detail-scroll')?.scrollTo({top:0,behavior:'auto'});

  try{
    const data=await fetchToolDetail(tool);
    if(requestId!==detailRequestId||view.hidden)return;
    renderToolDetail(tool,data);
    loadInstallOptions(tool,requestId);
    loadReviewsZone(tool,requestId)
  }catch(error){
    if(requestId!==detailRequestId||view.hidden)return;
    content.innerHTML='<div class="nxo-dev-detail-error">'+escapeHtml(error?.message||'No se pudo cargar la ficha.')+'</div>'
  }
}

function closeToolDetail({fromHistory=false}={}){
  if(!fromHistory&&detailHistoryArmed&&history.state?.nxoDevDetail===true){
    history.back();
    return
  }

  detailHistoryArmed=false;
  installState=null;
  installBusy=false;
  const app=document.getElementById('nxo-dev-app');
  const view=document.getElementById('nxo-dev-tool-detail');
  const shell=app?.querySelector('.nxo-dev-owned-shell');
  detailRequestId++;

  if(view)view.hidden=true;
  if(shell)shell.hidden=false;
  requestAnimationFrame(()=>{
    syncCatalogScrollControls();
    try{lastDetailTrigger?.focus?.()}catch(_){}
  })
}

function toolDetailIsOpen(){
  const view=document.getElementById('nxo-dev-tool-detail');
  return !!view&&!view.hidden
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
      '<div class="nxo-dev-owned-catalog-frame">'+
        '<div class="nxo-dev-owned-catalog-scroll" id="nxo-dev-owned-catalog-scroll">'+
          '<section class="nxo-dev-owned-grid" id="nxo-dev-owned-grid"></section>'+
        '</div>'+
        '<button type="button" class="nxo-dev-scroll-arrow up" id="nxo-dev-scroll-up" aria-label="Desplazar hacia arriba">▲</button>'+
        '<button type="button" class="nxo-dev-scroll-arrow down" id="nxo-dev-scroll-down" aria-label="Desplazar hacia abajo">▼</button>'+
      '</div>'+
    '</div>';

  const grid=app.querySelector('#nxo-dev-owned-grid');

  TOOL_DEFS.forEach(tool=>{
    const slot=document.createElement('div');
    slot.className='nxo-dev-owned-slot';

    const card=document.createElement('article');
    card.dataset.nxoDevCard='1';
    card.dataset.nxoDevTool=tool.key;
    card.innerHTML=
      '<div class="nxo-dev-title-row">'+
        '<span data-nxo-dev-icon-slot="1"><img class="nxo-dev-product-icon" src="'+iconUrl(tool.icon)+'" alt="" aria-hidden="true"></span>'+
        '<h2 data-nxo-dev-tool-title="'+tool.key+'">'+tool.title+'</h2>'+
      '</div>'+
      '<p data-nxo-dev-description="1">'+tool.summary+'</p>'+
      (tool.status==='planned'
        ? '<button type="button" class="nxo-dev-action nxo-dev-action-surface" disabled aria-disabled="true">Próximamente</button>'
        : '<button type="button" class="nxo-dev-action nxo-dev-action-surface">Ver características</button>');

    slot.appendChild(card);
    grid.appendChild(slot)
  });

  const header=document.getElementById('nxo-dev-header');
  if(header&&header.parentElement){
    header.insertAdjacentElement('afterend',app)
  }else{
    document.body.prepend(app)
  }

  return app
}

function syncCatalogScrollControls(){
  const scroller=document.getElementById('nxo-dev-owned-catalog-scroll');
  const up=document.getElementById('nxo-dev-scroll-up');
  const down=document.getElementById('nxo-dev-scroll-down');
  if(!scroller||!up||!down)return;

  const max=Math.max(0,scroller.scrollHeight-scroller.clientHeight);
  const atTop=scroller.scrollTop<=2;
  const atBottom=scroller.scrollTop>=max-2;

  up.disabled=atTop||max<=2;
  down.disabled=atBottom||max<=2
}

function bindCatalogScrollControls(){
  const scroller=document.getElementById('nxo-dev-owned-catalog-scroll');
  const up=document.getElementById('nxo-dev-scroll-up');
  const down=document.getElementById('nxo-dev-scroll-down');
  if(!scroller||!up||!down||scroller.dataset.nxoScrollBound==='1')return;

  scroller.dataset.nxoScrollBound='1';

  const move=direction=>{
    const amount=Math.max(160,Math.round(scroller.clientHeight*.72));
    scroller.scrollBy({top:direction*amount,behavior:'smooth'})
  };

  up.addEventListener('click',()=>move(-1),{signal:runtimeAbort.signal});
  down.addEventListener('click',()=>move(1),{signal:runtimeAbort.signal});
  scroller.addEventListener('scroll',syncCatalogScrollControls,{passive:true,signal:runtimeAbort.signal});
  window.addEventListener('resize',syncCatalogScrollControls,{passive:true,signal:runtimeAbort.signal});

  requestAnimationFrame(syncCatalogScrollControls)
}

function refresh(){
  ensureDevelopmentApp();
  bindCatalogScrollControls();
  syncCatalogScrollControls();
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
  detailRequestId++;
  lastDetailTrigger=null;
  installState=null;
  installBusy=false;

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