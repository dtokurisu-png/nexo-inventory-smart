(function(){
'use strict';
const ADAPTER_VERSION='20261018-connected-active-10';
if(window.__nexoCaminoHeaderAdapter&&window.__nexoCaminoHeaderAdapterVersion===ADAPTER_VERSION)return;
try{window.__nexoCaminoHeaderAdapterRuntime?.destroy?.()}catch(_){}
const adapterAbort=new AbortController();
let positionTimer=0;
const adapterRuntime={
  version:ADAPTER_VERSION,
  destroy(){
    try{adapterAbort.abort()}catch(_){}
    if(positionTimer){clearInterval(positionTimer);positionTimer=0}
    window.__nexoCaminoHeaderAdapter=false;
    window.__nexoCaminoHeaderAdapterVersion='';
    if(window.__nexoCaminoHeaderAdapterRuntime===adapterRuntime)window.__nexoCaminoHeaderAdapterRuntime=null
  }
};
window.__nexoCaminoHeaderAdapter=true;
window.__nexoCaminoHeaderAdapterVersion=ADAPTER_VERSION;
window.__nexoCaminoHeaderAdapterRuntime=adapterRuntime;

const PATH='/my-site-1/blank-6';
const p=decodeURIComponent(location.pathname).replace(/\/+$/,'');
if(p!==PATH)return;

const THEME_RUNTIME='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/theme-runtime.js?v=20261001-v3-1';
const HEADER_RUNTIME='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/global-header-runtime.js?v=20261018-27-stable';
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
let headerNavigation={personal:{name:'Mi espacio',tools:[]},workspaces:[]};
const HEADER_TOOL_CATALOG=[
  ['learning-core','Nexo Learning Core'],
  ['gear-library','Biblioteca de engranaje'],
  ['inventory-smart','Inventario Smart'],
  ['dynamic-specs','Fichas Técnicas Dinámicas'],
  ['work-center','Centro de Trabajo'],
  ['schedules','Horarios'],
  ['task-lists','Listas de tareas'],
  ['multichannel-notifications','Notificaciones multicanal'],
  ['numa-assistant','Numa'],
  ['maria-editorial','María'],
  ['camino-editorial-agents','Agentes de Camino Editorial']
];


function storedTheme(){try{return localStorage.getItem('nexoTheme:v1')==='night'?'night':'day'}catch(_){return'night'}}
function storedLanguage(){try{return String(localStorage.getItem('nexoLanguage:v1')||'es').toLowerCase().startsWith('en')?'en':'es'}catch(_){return'es'}}
function projectName(id){const known={'nova-vision':'Nova Visión','tu-sombra-es-tu-luz':'Tu sombra es tu luz','proyecto-huerfano-reflejo':'Proyecto Huérfano / Reflejo','co-eco':'CO·ECO'};return known[id]||String(id||'Proyecto').split('-').map(x=>x?x[0].toUpperCase()+x.slice(1):'').join(' ')}

function loadScript(id,src){
  return new Promise((resolve,reject)=>{
    if(id&&document.getElementById(id)){
      const existing=document.getElementById(id);
      if(id==='nexo-theme-runtime'&&window.NEXO_THEME_RUNTIME){resolve();return}
      existing.addEventListener('load',resolve,{once:true});
      existing.addEventListener('error',reject,{once:true});
      return
    }
    const script=document.createElement('script');
    if(id)script.id=id;
    script.src=src;
    script.defer=true;
    script.onload=resolve;
    script.onerror=reject;
    document.head.appendChild(script)
  })
}
async function ensureRuntimes(){
  if(!window.NEXO_THEME_RUNTIME)await loadScript('nexo-theme-runtime',THEME_RUNTIME);
  try{await window.NEXO_THEME_RUNTIME?.ready}catch(_){}

  const expected='20261018-27-stable';
  if(window.NEXO_GLOBAL_HEADER?.version!==expected){
    try{window.__nexoNativeHeaderCleanup?.()}catch(_){}
    try{window.NEXO_GLOBAL_HEADER?.unmount?.()}catch(_){}
    document.getElementById('nexo-global-header-runtime-script')?.remove();
    try{delete window.NEXO_GLOBAL_HEADER}catch(_){window.NEXO_GLOBAL_HEADER=null}
    await loadScript('nexo-global-header-runtime-script',HEADER_RUNTIME);
    if(window.NEXO_GLOBAL_HEADER?.version!==expected)throw new Error('GLOBAL_HEADER_VERSION_MISMATCH')
  }
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
  document.documentElement.style.setProperty('--ce-header-h','0px')
}

function developmentFunctionUrl(functionName){
  const name=String(functionName||'').replace(/^\/+|\/+$/g,'');
  return apiBase+'/_functions/'+name
}
async function developmentInstallOptions(toolKey){
  const response=await fetch(developmentFunctionUrl('nexoDevelopmentInstall'),{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    credentials:'same-origin',
    cache:'no-store',
    body:JSON.stringify({action:'options',toolKey})
  });
  const payload=await response.json().catch(()=>null);
  if(!response.ok||!payload?.ok||!payload?.data)throw new Error(payload?.error||'INSTALL_OPTIONS_FAILED');
  return payload.data
}
async function hydrateHeaderNavigation(){
  const results=await Promise.allSettled(HEADER_TOOL_CATALOG.map(async ([toolKey,label])=>{
    const options=await developmentInstallOptions(toolKey);
    return {toolKey,label,options}
  }));
  const workspaces=new Map();
  const personalTools=[];
  for(const result of results){
    if(result.status!=='fulfilled')continue;
    const {toolKey,label,options}=result.value;
    const routePath=String(options?.routePath||'').trim();
    const destinations=Array.isArray(options?.destinations)?options.destinations:[];
    for(const destination of destinations){
      const type=String(destination?.type||'').toLowerCase();
      if(type==='workspace'){
        const id=String(destination?.id||'').trim();
        if(!id)continue;
        if(!workspaces.has(id))workspaces.set(id,{
          workspaceId:id,
          name:String(destination?.name||'Workspace'),
          tools:[]
        });
        if(destination?.canOpen===true&&routePath){
          const ws=workspaces.get(id);
          if(!ws.tools.some(t=>t.toolKey===toolKey))ws.tools.push({
            toolKey,
            name:label,
            nameEs:label,
            routePath,
            status:'ACTIVE'
          })
        }
      }else if(type==='personal'&&destination?.canOpen===true&&routePath){
        if(!personalTools.some(t=>t.toolKey===toolKey))personalTools.push({
          toolKey,
          name:label,
          nameEs:label,
          routePath,
          status:'ACTIVE'
        })
      }
    }
  }
  headerNavigation={
    personal:{name:'Mi espacio',tools:personalTools},
    workspaces:[...workspaces.values()].sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'es',{sensitivity:'base'}))
  }
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
function mount(){
  if(!window.NEXO_GLOBAL_HEADER){position();return}
  const theme=window.NEXO_THEME_RUNTIME?.getTheme?.()||storedTheme();
  const language=storedLanguage();
  window.NEXO_GLOBAL_HEADER.mount(document.body,{
    variant:'camino',
    theme,
    language,
    active:'',
    navigation:headerNavigation,
    contextLabel:'Camino Editorial',
    onWorkspace:()=>true,
    onTool:()=>true
  });
  position()
}
async function bootstrap(){
  await ensureRuntimes();
  try{await hydrateHeaderNavigation()}catch(_){}
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
  window.addEventListener('resize',position,{signal:adapterAbort.signal});
  positionTimer=setInterval(position,1000);
  window.addEventListener('camino:surface-changed',e=>{activeSurface=e.detail?.surface||'canvas';mount()},{signal:adapterAbort.signal});
  window.addEventListener('camino:active-project-changed',e=>{
    const d=e.detail||{};
    if(d.projectId)projectId=String(d.projectId);
    activeProjectLabel=String(d.title||'').trim();
    if(PROFILE_TYPES.includes(d.profileType)){profileType=d.profileType;profileLabel=PROFILE_LABELS[profileType]||profileLabel}
    mount()
  },{signal:adapterAbort.signal});
}
bootstrap().catch(error=>console.error('[Camino shared header]',error));
})();