(function(){
'use strict';
if(window.__nexoCaminoHeaderAdapter)return;
window.__nexoCaminoHeaderAdapter=true;

const PATH='/my-site-1/blank-6';
const p=decodeURIComponent(location.pathname).replace(/\/+$/,'');
if(p!==PATH)return;

const THEME_RUNTIME='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/theme-runtime.js?v=20261001-v3-1';
const HEADER_RUNTIME='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/global-header-runtime.js?v=20261018-15';
const freeSite=/\.(wixstudio|wixsite)\.com$/i.test(location.hostname);
const apiBase=freeSite?'/'+location.pathname.split('/').filter(Boolean)[0]:'';
const API=apiBase+'/_functions/';
const PROFILE_LABELS={WRITER:'Editorial',TEACHER:'Académico',CREATOR:'Desarrollo de contenido'};
const PROFILE_TYPES=['WRITER','TEACHER','CREATOR'];
const NEXO_UI_SESSION_BRIDGE_KEY='nexoUiSession:mi-espacio';
const NEXO_RETURN_AFTER_AUTH_KEY='nexoReturnAfterAuth:v1';
const CAMINO_BRANCH_REVISION='36f0f2054b5e4bd1dcaf532a43823abfd08942cc';
const CAMINO_BRANCH_ID='main';
let projectId='nova-vision';
let activeProjectLabel='';
let profileType='WRITER';
let profileLabel='Editorial';
let activeSurface='canvas';

function storedTheme(){try{return localStorage.getItem('nexoTheme:v1')==='night'?'night':'day'}catch(_){return'night'}}
function storedLanguage(){try{return String(localStorage.getItem('nexoLanguage:v1')||'es').toLowerCase().startsWith('en')?'en':'es'}catch(_){return'es'}}
function projectName(id){const known={'nova-vision':'Nova Visión','tu-sombra-es-tu-luz':'Tu sombra es tu luz','proyecto-huerfano-reflejo':'Proyecto Huérfano / Reflejo','co-eco':'CO·ECO'};return known[id]||String(id||'Proyecto').split('-').map(x=>x?x[0].toUpperCase()+x.slice(1):'').join(' ')}

function loadScript(id,src){
  return new Promise((resolve,reject)=>{
    if(id&&document.getElementById(id)){
      const s=document.getElementById(id);
      if((id==='nexo-global-header-runtime-script'&&window.NEXO_GLOBAL_HEADER)||(id==='nexo-theme-runtime'&&window.NEXO_THEME_RUNTIME)){resolve();return}
      s.addEventListener('load',resolve,{once:true});s.addEventListener('error',reject,{once:true});return
    }
    const s=document.createElement('script');if(id)s.id=id;s.src=src;s.defer=true;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)
  })
}
async function ensureRuntimes(){
  if(!window.NEXO_THEME_RUNTIME)await loadScript('nexo-theme-runtime',THEME_RUNTIME);
  try{await window.NEXO_THEME_RUNTIME?.ready}catch(_){}
  if(!window.NEXO_GLOBAL_HEADER)await loadScript('nexo-global-header-runtime-script',HEADER_RUNTIME)
}
function sessionBridge(){
  try{
    const raw=sessionStorage.getItem(NEXO_UI_SESSION_BRIDGE_KEY);
    if(!raw)return null;
    const row=JSON.parse(raw);
    if(!row?.token)return null;
    const exp=row.expiresAt?new Date(row.expiresAt).getTime():0;
    if(exp&&exp<=Date.now()){sessionStorage.removeItem(NEXO_UI_SESSION_BRIDGE_KEY);return null}
    return row
  }catch(_){return null}
}
function requireNexoSession(){
  try{sessionStorage.setItem(NEXO_RETURN_AFTER_AUTH_KEY,location.href)}catch(_){}
  const target=(freeSite?'/'+location.pathname.split('/').filter(Boolean)[0]:'')+'/blank-8';
  location.assign(target);
}
function branchUrl(endpoint){
  const sep=endpoint.includes('?')?'&':'?';
  return API+endpoint+sep+'siteRevision='+encodeURIComponent(CAMINO_BRANCH_REVISION)+'&branchId='+encodeURIComponent(CAMINO_BRANCH_ID)
}
async function api(endpoint,opt={}){
  const session=sessionBridge();
  const o={method:opt.method||'GET',headers:{Accept:'application/json'},credentials:'same-origin',cache:'no-store'};
  if(session?.token)o.headers.Authorization='Bearer '+session.token;
  if(opt.body!==undefined){o.headers['Content-Type']='application/json';o.body=JSON.stringify(opt.body)}
  const r=await fetch(branchUrl(endpoint),o);const raw=await r.text();let d={};
  try{d=raw?JSON.parse(raw):{}}catch(_){}
  const code=d?.error||'';
  if(code==='AUTH_REQUIRED'||code==='SESSION_EXPIRED'){
    try{sessionStorage.removeItem(NEXO_UI_SESSION_BRIDGE_KEY)}catch(_){}
    if(opt.requireAuth!==false)requireNexoSession();
    throw Error('AUTH_REDIRECT');
  }
  if(!r.ok||d.ok===false)throw Error(code||('HTTP '+r.status));
  return d
}
window.NEXO_CAMINO_AUTH={
  hasSession:()=>!!sessionBridge(),
  getToken:()=>sessionBridge()?.token||'',
  require:requireNexoSession,
  request:api,
  revision:CAMINO_BRANCH_REVISION,
  branchId:CAMINO_BRANCH_ID
};
function position(){
  const banner=document.getElementById('WIX_ADS'),rect=banner?.getBoundingClientRect();
  const top=rect&&rect.width>0&&rect.height>0?Math.max(0,Math.ceil(rect.bottom)):0;
  document.documentElement.style.setProperty('--nexo-global-header-top',top+'px');
  document.documentElement.style.setProperty('--ce-header-offset',top+'px');
  document.documentElement.style.setProperty('--ce-header-h',(window.NEXO_GLOBAL_HEADER?.height||68)+'px')
}
function accountAction(action){
  const u=new URL((freeSite?'/'+location.pathname.split('/').filter(Boolean)[0]:'')+'/blank-8',location.origin);
  if(action==='settings')u.searchParams.set('nxoProfile','settings');
  else u.searchParams.set('nxoAccountAction',action);
  u.searchParams.set('nxoTheme',window.NEXO_THEME_RUNTIME?.getTheme?.()||storedTheme());
  u.searchParams.set('nxoLang',storedLanguage());
  location.assign(u.href)
}
function requestSurface(surface){
  activeSurface=surface||'canvas';
  window.dispatchEvent(new CustomEvent('camino:surface-request',{detail:{surface:activeSurface}}));
  mount()
}
async function saveProfile(next){
  if(!PROFILE_TYPES.includes(next)||next===profileType)return;
  if(!sessionBridge()){requireNexoSession();return}
  await api('caminoLore',{method:'POST',body:{action:'canon.saveprofile',projectId,profileType:next,profileLabel:PROFILE_LABELS[next]}});
  profileType=next;profileLabel=PROFILE_LABELS[next];
  window.dispatchEvent(new CustomEvent('camino:profile-changed',{detail:{projectId,profileType,label:profileLabel}}));
  mount()
}
function navSeed(){
  return {
    personal:{
      name:'Mi espacio',
      tools:[
        {toolKey:'mi-espacio',name:'Abrir Mi espacio',routePath:(freeSite?'/'+location.pathname.split('/').filter(Boolean)[0]:'')+'/blank-8',scope:'personal'}
      ]
    },
    workspaces:[]
  }
}
function mount(){
  if(!window.NEXO_GLOBAL_HEADER)return;
  const theme=window.NEXO_THEME_RUNTIME?.getTheme?.()||storedTheme();
  const language=storedLanguage();
  const navigation=navSeed();
  window.NEXO_GLOBAL_HEADER.mount(document.body,{
    variant:'camino',
    brand:{mark:'C',title:'Camino Editorial',subtitle:'Nexo Group'},
    productNavigation:[
      {key:'base',label:'Fuentes'},
      {key:'canon',label:'Canon'},
      {key:'agents',label:'Agentes'}
    ],
    productActive:activeSurface,
    contextControls:[
      {key:'project',label:'Proyecto',value:activeProjectLabel||projectName(projectId)},
      {key:'profile',label:'Perfil',value:profileLabel,options:PROFILE_TYPES.map(key=>({value:key,label:PROFILE_LABELS[key],active:key===profileType}))}
    ],
    theme,language,active:'',
    contextLabel:'Camino Editorial',
    navigation,
    profile:{displayName:'Mi Espacio',email:'',locale:language,photoImage:null},
    roleLabel:'Nexo Group',
    onHome:()=>{requestSurface('canvas');return false},
    onProductNav:key=>{if(['base','canon','agents'].includes(key))requestSurface(key);return false},
    onContextAction:(key,value)=>{if(key==='profile')saveProfile(value).catch(e=>alert('No se pudo cambiar el perfil: '+e.message));return false},
    onPersonal:()=>{location.assign((freeSite?'/'+location.pathname.split('/').filter(Boolean)[0]:'')+'/blank-8');return false},
    onDevelopment:()=>{location.assign((freeSite?'/'+location.pathname.split('/').filter(Boolean)[0]:'')||'/');return false},
    onTheme:()=>{window.NEXO_THEME_RUNTIME?.toggleTheme?.({persist:true,notify:true});requestAnimationFrame(mount)},
    onLanguage:()=>{const next=storedLanguage()==='en'?'es':'en';try{localStorage.setItem('nexoLanguage:v1',next)}catch(_){};document.documentElement.lang=next;mount()},
    onProfileSettings:()=>accountAction('settings'),
    onSwitchAccount:()=>accountAction('switch'),
    onLogout:()=>accountAction('logout')
  });
  position()
}
async function bootstrap(){
  await ensureRuntimes();
  try{
    const h=await api('caminoHealth',{requireAuth:false});projectId=String(h.projectId||h.data?.projectId||projectId)
  }catch(_){}
  if(sessionBridge()){
    try{
      const p=await api('caminoLore?canonEngine=profiles&projectId='+encodeURIComponent(projectId),{requireAuth:false});
      const row=p.data?.profile||null;
      if(PROFILE_TYPES.includes(row?.profileType))profileType=row.profileType;
      profileLabel=PROFILE_LABELS[profileType]||row?.profileLabel||'Editorial'
    }catch(_){}
  }
  mount();position();
  window.addEventListener('resize',position);
  setInterval(position,1000);
  window.addEventListener('camino:surface-changed',e=>{activeSurface=e.detail?.surface||'canvas';mount()});
  window.addEventListener('camino:active-project-changed',e=>{
    const d=e.detail||{};
    if(d.projectId)projectId=String(d.projectId);
    activeProjectLabel=String(d.title||'').trim();
    if(PROFILE_TYPES.includes(d.profileType)){profileType=d.profileType;profileLabel=PROFILE_LABELS[profileType]||profileLabel}
    mount()
  });
}
bootstrap().catch(error=>console.error('[Camino shared header]',error));
})();